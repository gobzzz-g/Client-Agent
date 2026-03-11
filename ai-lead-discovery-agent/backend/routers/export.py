"""
Export Router — export leads to CSV, Excel, or JSON.
"""

import csv
import io
import json
from typing import Optional, List

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
from openpyxl import Workbook

from database import get_db
from models import Lead

router = APIRouter(prefix="/export", tags=["Export"])


def _get_leads(db: Session, industry: Optional[str] = None) -> List[Lead]:
    q = db.query(Lead)
    if industry:
        q = q.filter(Lead.industry.ilike(f"%{industry}%"))
    return q.order_by(Lead.score.desc()).all()


def _lead_row(lead: Lead) -> dict:
    return {
        "ID": lead.id,
        "Company": lead.company_name,
        "Website": lead.website,
        "Industry": lead.industry,
        "Location": lead.location,
        "Score": lead.score,
        "Opportunity": lead.opportunity,
        "Status": lead.status,
        "Emails": ", ".join(lead.contact_info.get("emails", []) if lead.contact_info else []),
        "AI Explanation": lead.ai_explanation,
        "Created At": lead.created_at.isoformat() if lead.created_at else "",
    }


@router.get("/csv")
def export_csv(industry: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """Export all leads as a CSV file."""
    leads = _get_leads(db, industry)
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=list(_lead_row(leads[0]).keys()) if leads else [])
    writer.writeheader()
    for lead in leads:
        writer.writerow(_lead_row(lead))
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads.csv"},
    )


@router.get("/excel")
def export_excel(industry: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """Export all leads as an Excel (.xlsx) file."""
    leads = _get_leads(db, industry)
    wb = Workbook()
    ws = wb.active
    ws.title = "Leads"

    if leads:
        headers = list(_lead_row(leads[0]).keys())
        ws.append(headers)
        for lead in leads:
            ws.append(list(_lead_row(lead).values()))

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return StreamingResponse(
        iter([output.read()]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=leads.xlsx"},
    )


@router.get("/json")
def export_json(industry: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """Export all leads as a JSON file."""
    leads = _get_leads(db, industry)
    data = [lead.to_dict() for lead in leads]
    return JSONResponse(
        content=data,
        headers={"Content-Disposition": "attachment; filename=leads.json"},
    )

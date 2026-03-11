"""
Leads API Router — CRUD operations for leads with filtering, sorting, and search.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, asc, desc

from database import get_db
from models import Lead
from schemas import LeadResponse, AnalyticsResponse

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.get("", response_model=List[LeadResponse])
def get_leads(
    search: Optional[str] = Query(None, description="Search company name or opportunity"),
    industry: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None, ge=0, le=100),
    max_score: Optional[float] = Query(None, ge=0, le=100),
    sort_by: str = Query("score", enum=["score", "company_name", "created_at"]),
    sort_order: str = Query("desc", enum=["asc", "desc"]),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """Get all leads with optional filtering, sorting, and pagination."""
    query = db.query(Lead)

    # Search filter
    if search:
        query = query.filter(
            or_(
                Lead.company_name.ilike(f"%{search}%"),
                Lead.opportunity.ilike(f"%{search}%"),
                Lead.industry.ilike(f"%{search}%"),
            )
        )

    # Field filters
    if industry:
        query = query.filter(Lead.industry.ilike(f"%{industry}%"))
    if status:
        query = query.filter(Lead.status == status)
    if min_score is not None:
        query = query.filter(Lead.score >= min_score)
    if max_score is not None:
        query = query.filter(Lead.score <= max_score)

    # Sorting
    sort_col = getattr(Lead, sort_by, Lead.score)
    query = query.order_by(desc(sort_col) if sort_order == "desc" else asc(sort_col))

    return query.offset(skip).limit(limit).all()


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    """Return aggregate analytics for the dashboard."""
    leads = db.query(Lead).all()

    if not leads:
        return AnalyticsResponse(
            total_leads=0, high_quality_leads=0, avg_score=0.0,
            industry_breakdown={}, score_distribution={}, top_opportunities=[]
        )

    scores = [l.score for l in leads]
    industry_breakdown = {}
    for lead in leads:
        ind = lead.industry or "Unknown"
        industry_breakdown[ind] = industry_breakdown.get(ind, 0) + 1

    score_dist = {"0-25": 0, "26-50": 0, "51-75": 0, "76-100": 0}
    for s in scores:
        if s <= 25:
            score_dist["0-25"] += 1
        elif s <= 50:
            score_dist["26-50"] += 1
        elif s <= 75:
            score_dist["51-75"] += 1
        else:
            score_dist["76-100"] += 1

    opportunities = list({l.opportunity for l in leads if l.opportunity})[:5]

    return AnalyticsResponse(
        total_leads=len(leads),
        high_quality_leads=sum(1 for s in scores if s >= 70),
        avg_score=round(sum(scores) / len(scores), 1),
        industry_breakdown=industry_breakdown,
        score_distribution=score_dist,
        top_opportunities=opportunities,
    )


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """Get a single lead by ID."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.patch("/{lead_id}/status")
def update_lead_status(lead_id: int, status: str, db: Session = Depends(get_db)):
    """Update a lead's status (new | qualified | contacted | closed)."""
    valid_statuses = ["new", "qualified", "contacted", "closed"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")

    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead.status = status
    db.commit()
    return {"message": f"Status updated to {status}"}


@router.delete("/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    """Delete a lead permanently."""
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(lead)
    db.commit()
    return {"message": "Lead deleted successfully"}

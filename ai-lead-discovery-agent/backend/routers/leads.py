"""
Leads API Router — CRUD operations for leads with filtering, sorting, and search.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, asc, desc, func, case

from database import get_db
from models import Lead
from schemas import LeadResponse, AnalyticsResponse

router = APIRouter(prefix="/leads", tags=["Leads"])


@router.get("", response_model=List[LeadResponse])
def get_leads(
    search: Optional[str] = Query(None, description="Search company name or opportunity"),
    industry: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    lead_type: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None, ge=0, le=100),
    max_score: Optional[float] = Query(None, ge=0, le=100),
    sort_by: str = Query("created_at", enum=["score", "company_name", "created_at"]),
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
    if lead_type:
        query = query.filter(Lead.lead_type == lead_type)
    if min_score is not None:
        query = query.filter(Lead.score >= min_score)
    if max_score is not None:
        query = query.filter(Lead.score <= max_score)

    # Sorting
    # Priority: client leads first, then selected sort column.
    sort_col = getattr(Lead, sort_by, Lead.created_at)
    client_priority = case((Lead.lead_type == "client", 0), else_=1)
    query = query.order_by(
        asc(client_priority),
        desc(sort_col) if sort_order == "desc" else asc(sort_col),
    )

    return query.offset(skip).limit(limit).all()


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    """Return aggregate analytics for the dashboard."""
    # Optimized: Use database aggregation instead of loading all leads into memory
    total_leads = db.query(func.count(Lead.id)).scalar() or 0
    
    if total_leads == 0:
        return AnalyticsResponse(
            total_leads=0, high_quality_leads=0, avg_score=0.0,
            industry_breakdown={}, score_distribution={}, opportunity_distribution={}, top_opportunities=[]
        )
    
    # High quality leads count (score >= 70)
    high_quality = db.query(func.count(Lead.id)).filter(Lead.score >= 70).scalar() or 0
    
    # Average score
    avg_score = db.query(func.avg(Lead.score)).scalar() or 0.0
    
    # Industry breakdown
    industry_data = db.query(
        Lead.industry, 
        func.count(Lead.id)
    ).group_by(Lead.industry).all()
    industry_breakdown = {ind or "Unknown": count for ind, count in industry_data}
    
    # Score distribution
    score_dist_data = db.query(
        case(
            (Lead.score <= 25, "0-25"),
            (Lead.score <= 50, "26-50"),
            (Lead.score <= 75, "51-75"),
            else_="76-100"
        ).label("range"),
        func.count(Lead.id)
    ).group_by("range").all()
    
    score_dist = {"0-25": 0, "26-50": 0, "51-75": 0, "76-100": 0}
    for range_name, count in score_dist_data:
        score_dist[range_name] = count
    
    # Opportunity distribution
    opportunity_data = db.query(
        Lead.opportunity,
        func.count(Lead.id)
    ).filter(Lead.opportunity.isnot(None)).group_by(Lead.opportunity).all()
    opportunity_distribution = {name or "Unknown": count for name, count in opportunity_data}

    # Top opportunities (sorted by count)
    top_opportunities = [name for name, _ in sorted(opportunity_distribution.items(), key=lambda item: item[1], reverse=True)[:5]]
    
    return AnalyticsResponse(
        total_leads=total_leads,
        high_quality_leads=high_quality,
        avg_score=round(avg_score, 1),
        industry_breakdown=industry_breakdown,
        score_distribution=score_dist,
        opportunity_distribution=opportunity_distribution,
        top_opportunities=top_opportunities,
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

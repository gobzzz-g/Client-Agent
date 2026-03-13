"""
Discovery Router — orchestrates full lead discovery pipeline.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from schemas import DiscoveryRequest, DiscoveryResponse, LeadResponse
from services.discovery_engine import run_discovery_pipeline

router = APIRouter(prefix="/discover", tags=["Discovery"])


@router.post("", response_model=DiscoveryResponse)
async def discover_leads(request: DiscoveryRequest, db: Session = Depends(get_db)):
    """
    Full lead discovery pipeline:
    1. Search the web for matching businesses
    2. Scrape each website for company data
    3. Run AI analysis on the content
    4. Score each lead 0-100
    5. Save new leads to the database
    Returns discovered leads.
    """
    discovered = await run_discovery_pipeline(request=request, db=db)

    return DiscoveryResponse(
        message=f"Discovery complete. Found {len(discovered)} leads.",
        leads_discovered=len(discovered),
        leads=discovered,
    )

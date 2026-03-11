"""
Discovery Router — orchestrates the full lead discovery pipeline:
Search → Scrape → AI Analyze → Score → Save to DB
"""

import asyncio
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from database import get_db
from models import Lead
from schemas import DiscoveryRequest, DiscoveryResponse, LeadResponse
from services.search_service import search_leads
from services.scraper_service import scrape_website
from services.ai_analyzer import analyze_lead
from services.scoring_engine import calculate_score

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
    # Step 1: Search for business websites
    search_results = await search_leads(
        industry=request.industry,
        location=request.location,
        service=request.service,
        max_results=request.max_results,
    )

    discovered = []

    for result in search_results:
        website = result["website"]

        # Skip if lead already exists
        existing = db.query(Lead).filter(Lead.website == website).first()
        if existing:
            discovered.append(existing)
            continue

        try:
            # Step 2: Scrape the website
            scraped = await scrape_website(website)

            company_name = scraped.get("company_name") or result.get("title", "Unknown Company")
            description = scraped.get("description") or result.get("snippet", "")
            tech_signals = scraped.get("tech_signals", [])
            contact_info = scraped.get("contact_info", {})
            raw_text = scraped.get("raw_text", "")

            # Step 3: AI Analysis
            ai_analysis = await analyze_lead(
                company_name=company_name,
                website=website,
                description=description,
                tech_signals=tech_signals,
                raw_text=raw_text,
                service_query=request.service,
                industry=request.industry,
            )

            # Step 4: Score the lead
            score = calculate_score(
                company_name=company_name,
                description=description,
                tech_signals=tech_signals,
                contact_info=contact_info,
                ai_analysis=ai_analysis,
            )

            # Step 5: Save to database
            lead = Lead(
                company_name=company_name,
                website=website,
                contact_info=contact_info,
                description=description,
                tech_signals=tech_signals,
                industry=request.industry,
                location=request.location,
                service_query=request.service,
                score=score,
                opportunity=ai_analysis.get("opportunity", ""),
                ai_explanation=ai_analysis.get("explanation", ""),
                status="new",
            )
            db.add(lead)
            db.commit()
            db.refresh(lead)
            discovered.append(lead)

        except Exception as e:
            print(f"❌ Error processing {website}: {e}")
            continue

    return DiscoveryResponse(
        message=f"Discovery complete. Found {len(discovered)} leads.",
        leads_discovered=len(discovered),
        leads=discovered,
    )

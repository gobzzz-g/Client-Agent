"""
Discovery engine service.

Orchestrates:
Search -> Scrape -> AI analysis -> Classification -> Opportunity detection -> Scoring -> Persist
"""

import asyncio
from typing import List

from sqlalchemy.orm import Session

from models import Lead
from schemas import DiscoveryRequest
from services.search_service import search_leads
from services.scraper_service import scrape_website
from services.ai_analyzer import analyze_lead
from services.lead_classifier import classify_lead_type
from services.opportunity_detector import detect_opportunity
from services.scoring_engine import calculate_score


async def run_discovery_pipeline(request: DiscoveryRequest, db: Session) -> List[Lead]:
    """Run full discovery pipeline with bounded parallelism."""
    search_results = await search_leads(
        industry=request.industry,
        location=request.location,
        service=request.service,
        max_results=request.max_results,
        api_key=request.serper_api_key
    )

    semaphore = asyncio.Semaphore(10)

    async def process_result(result: dict) -> Lead | None:
        website = result.get("website", "")
        if not website:
            return None

        existing = db.query(Lead).filter(Lead.website == website).first()
        if existing:
            return existing

        async with semaphore:
            try:
                scraped = await scrape_website(website)

                company_name = scraped.get("company_name") or result.get("title", "Unknown Company")
                description = scraped.get("description") or result.get("snippet", "")
                tech_signals = scraped.get("tech_signals", [])
                contact_info = scraped.get("contact_info", {})
                raw_text = scraped.get("raw_text", "")

                ai_analysis = await analyze_lead(
                    company_name=company_name,
                    website=website,
                    description=description,
                    tech_signals=tech_signals,
                    raw_text=raw_text,
                    service_query=request.service,
                    industry=request.industry,                    api_key=request.gemini_api_key                )

                lead_type = classify_lead_type(
                    company_name=company_name,
                    website_text=raw_text,
                    industry=request.industry,
                    service_query=request.service,
                    ai_analysis=ai_analysis,
                )

                opportunity_data = detect_opportunity(
                    service_query=request.service,
                    tech_signals=tech_signals,
                    ai_analysis=ai_analysis,
                )

                score = calculate_score(
                    company_name=company_name,
                    description=description,
                    tech_signals=tech_signals,
                    contact_info=contact_info,
                    ai_analysis=ai_analysis,
                )

                lead = Lead(
                    company_name=company_name,
                    website=website,
                    contact_info=contact_info,
                    description=description,
                    tech_signals=tech_signals,
                    industry=ai_analysis.get("industry") or request.industry,
                    location=request.location,
                    service_query=request.service,
                    lead_type=lead_type,
                    score=score,
                    opportunity=opportunity_data["opportunity"],
                    ai_explanation=opportunity_data["reason"],
                    status="new",
                )
                db.add(lead)
                db.commit()
                db.refresh(lead)
                return lead
            except Exception as exc:
                print(f"❌ Error processing {website}: {exc}")
                db.rollback()
                return None

    tasks = [process_result(result) for result in search_results]
    processed = await asyncio.gather(*tasks)

    return [lead for lead in processed if lead is not None]

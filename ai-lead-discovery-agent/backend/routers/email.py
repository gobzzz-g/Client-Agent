"""
Email Router — generate personalized outreach emails for leads using Gemini AI.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Lead
from schemas import EmailGenerateRequest, EmailResponse
from services.email_generator import generate_outreach_email

router = APIRouter(prefix="/email", tags=["Email"])


@router.post("/generate", response_model=EmailResponse)
async def generate_email(request: EmailGenerateRequest, db: Session = Depends(get_db)):
    """Generate a personalized outreach email for a given lead."""
    lead = db.query(Lead).filter(Lead.id == request.lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    email = await generate_outreach_email(
        company_name=lead.company_name,
        opportunity=lead.opportunity,
        ai_explanation=lead.ai_explanation,
        sender_name=request.sender_name,
        sender_company=request.sender_company,
        product_description=request.product_description or lead.service_query,
    )

    # Save generated email back to the lead
    lead.outreach_email = f"Subject: {email['subject']}\n\n{email['body']}"
    db.commit()

    return EmailResponse(
        lead_id=request.lead_id,
        subject=email["subject"],
        body=email["body"],
    )

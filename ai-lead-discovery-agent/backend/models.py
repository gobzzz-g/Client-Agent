"""
SQLAlchemy ORM models for the AI Lead Discovery Agent.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON
from database import Base


class Lead(Base):
    """Represents a discovered business lead."""

    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    website = Column(String(500), nullable=False, unique=True)
    contact_info = Column(JSON, default={})       # emails, phones, social links
    description = Column(Text, default="")         # brief company description
    tech_signals = Column(JSON, default=[])        # detected technology signals
    industry = Column(String(100), default="")
    location = Column(String(100), default="")
    service_query = Column(String(255), default="")
    lead_type = Column(String(50), default="client")  # client | competitor | partner
    score = Column(Float, default=0.0)             # 0-100 lead score
    opportunity = Column(String(255), default="")  # one-line opportunity
    ai_explanation = Column(Text, default="")      # full AI analysis
    outreach_email = Column(Text, default="")      # generated sales email
    status = Column(String(50), default="new")     # new | qualified | contacted | closed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "company_name": self.company_name,
            "website": self.website,
            "contact_info": self.contact_info,
            "description": self.description,
            "tech_signals": self.tech_signals,
            "industry": self.industry,
            "location": self.location,
            "service_query": self.service_query,
            "lead_type": self.lead_type,
            "score": self.score,
            "opportunity": self.opportunity,
            "ai_explanation": self.ai_explanation,
            "outreach_email": self.outreach_email,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

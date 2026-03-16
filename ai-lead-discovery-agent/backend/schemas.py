"""
Pydantic schemas for request/response validation.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ─── Requests ─────────────────────────────────────────────────────────────────

class DiscoveryRequest(BaseModel):
    industry: str
    location: str
    service: str
    max_results: int = Field(default=100, ge=1, le=1000)
    serper_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None


class EmailGenerateRequest(BaseModel):
    lead_id: int
    sender_name: str = "Alex"
    sender_company: str = "Your Company"
    product_description: str = ""
    gemini_api_key: Optional[str] = None


# ─── Responses ────────────────────────────────────────────────────────────────

class ContactInfo(BaseModel):
    emails: List[str] = []
    phones: List[str] = []
    social: Dict[str, str] = {}
    contact_pages: List[str] = []


class LeadBase(BaseModel):
    company_name: str
    website: str
    contact_info: Dict[str, Any] = {}
    description: str = ""
    tech_signals: List[str] = []
    industry: str = ""
    location: str = ""
    service_query: str = ""
    lead_type: str = "client"
    score: float = 0.0
    opportunity: str = ""
    ai_explanation: str = ""
    outreach_email: str = ""
    status: str = "new"


class LeadCreate(LeadBase):
    pass


class LeadResponse(LeadBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DiscoveryResponse(BaseModel):
    message: str
    leads_discovered: int
    leads: List[LeadResponse]


class EmailResponse(BaseModel):
    lead_id: int
    subject: str
    body: str


class AnalyticsResponse(BaseModel):
    total_leads: int
    high_quality_leads: int
    avg_score: float
    industry_breakdown: Dict[str, int]
    score_distribution: Dict[str, int]
    opportunity_distribution: Dict[str, int]
    top_opportunities: List[str]

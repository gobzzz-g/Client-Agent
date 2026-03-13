"""
Lead classification service.

Classifies each discovered company as:
- client
- competitor
- partner
"""

from typing import Dict, Any


def classify_lead_type(
    company_name: str,
    website_text: str,
    industry: str,
    service_query: str,
    ai_analysis: Dict[str, Any],
) -> str:
    """Classify lead type using AI output first, then deterministic fallback rules."""
    ai_type = (ai_analysis.get("lead_type") or "").strip().lower()
    if ai_type in {"client", "competitor", "partner"}:
        return ai_type

    service_lower = service_query.lower()
    text = f"{company_name} {industry} {website_text[:2000]}".lower()

    competitor_markers = ["agency", "consulting", "solutions", "automation", "ai services"]
    partner_markers = ["marketing agency", "seo agency", "design studio", "development agency"]

    if any(marker in text for marker in competitor_markers) and any(
        keyword in service_lower for keyword in ["ai", "automation", "crm", "chatbot", "marketing"]
    ):
        return "competitor"

    if any(marker in text for marker in partner_markers):
        return "partner"

    return "client"

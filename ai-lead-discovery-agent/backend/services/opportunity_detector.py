"""
Opportunity detection service.

Converts technology/automation gaps into explicit sales opportunities.
"""

from typing import Dict, Any, List


def detect_opportunity(
    service_query: str,
    tech_signals: List[str],
    ai_analysis: Dict[str, Any],
) -> Dict[str, Any]:
    """Return opportunity, reason and lead_score with deterministic fallback logic."""
    ai_opportunity = (ai_analysis.get("opportunity") or "").strip()
    ai_reason = (ai_analysis.get("reason") or ai_analysis.get("explanation") or "").strip()
    ai_score = ai_analysis.get("lead_score")

    if ai_opportunity:
        try:
            normalized_score = int(float(ai_score)) if ai_score is not None else 0
        except Exception:
            normalized_score = 0
        normalized_score = max(0, min(100, normalized_score))
        return {
            "opportunity": ai_opportunity,
            "reason": ai_reason,
            "lead_score": normalized_score,
        }

    signals_lower = [signal.lower() for signal in tech_signals]

    if "no live chat detected" in signals_lower:
        return {
            "opportunity": "AI chatbot automation",
            "reason": "Website appears to have no live chat. Automated conversational support can reduce response time and improve lead conversion.",
            "lead_score": 80,
        }

    if "no crm detected" in signals_lower:
        return {
            "opportunity": "CRM system implementation",
            "reason": "No CRM signal was detected. Lead tracking and follow-up automation likely remain manual and fragmented.",
            "lead_score": 75,
        }

    if "no booking/reservation system" in signals_lower:
        return {
            "opportunity": "Booking workflow automation",
            "reason": "No booking/reservation capability detected. Automated scheduling can remove manual bottlenecks and missed opportunities.",
            "lead_score": 72,
        }

    return {
        "opportunity": service_query,
        "reason": "Business appears to have partial tooling but can still benefit from targeted optimization and automation.",
        "lead_score": 60,
    }

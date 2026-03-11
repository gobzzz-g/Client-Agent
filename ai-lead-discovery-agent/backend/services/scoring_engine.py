"""
Lead Scoring Engine — produces a 0–100 lead quality score.

Combines rule-based signals with AI-provided score adjustments.
"""

from typing import Dict, Any, List


def calculate_score(
    company_name: str,
    description: str,
    tech_signals: List[str],
    contact_info: Dict[str, Any],
    ai_analysis: Dict[str, Any],
) -> float:
    """
    Calculate a 0–100 lead quality score based on multiple signals.

    Scoring breakdown:
      - Base score:            50 points
      - Missing automation:   +5 per gap (max +15)
      - Has contact info:     +10
      - Has social presence:  +5
      - Description quality:  +5
      - AI score boost:       up to +30 (from ai_analysis)
      - Has competitor tools: -10 (already using competing product)
    """
    score = 50.0  # start neutral

    signals_lower = [s.lower() for s in tech_signals]

    # ── Automation gap signals ─────────────────────────────────────────────────
    if "no live chat detected" in signals_lower:
        score += 5
    if "no crm detected" in signals_lower:
        score += 5
    if "no booking/reservation system" in signals_lower:
        score += 5

    # ── Existing competitor tools (negative signal) ────────────────────────────
    competing = ["intercom", "zendesk", "freshdesk", "crisp chat", "tawk.to chat"]
    if any(c in signals_lower for c in competing):
        score -= 10  # already has support tool, harder sell

    # ── Contact info quality ───────────────────────────────────────────────────
    emails = contact_info.get("emails", [])
    phones = contact_info.get("phones", [])
    social = contact_info.get("social", {})

    if emails:
        score += 10
    if phones:
        score += 3
    if social:
        score += min(len(social) * 2, 5)  # up to +5 for social presence

    # ── Description quality (has meaningful content) ───────────────────────────
    if len(description) > 100:
        score += 5

    # ── AI boost ──────────────────────────────────────────────────────────────
    score_boost = ai_analysis.get("score_boost", 0)
    score += score_boost

    # ── Fit level modifier ─────────────────────────────────────────────────────
    fit_level = ai_analysis.get("fit_level", "medium")
    if fit_level == "high":
        score += 5
    elif fit_level == "low":
        score -= 5

    # ── Clamp between 0 and 100 ────────────────────────────────────────────────
    return round(max(0.0, min(100.0, score)), 1)


def get_score_label(score: float) -> str:
    """Return a human-readable label for a lead score."""
    if score >= 80:
        return "🔥 Hot Lead"
    elif score >= 60:
        return "✅ Good Lead"
    elif score >= 40:
        return "🟡 Warm Lead"
    else:
        return "❄️ Cold Lead"

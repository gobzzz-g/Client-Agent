"""
AI Lead Analyzer — uses Google Gemini to analyze scraped website content.

Provides structured website intelligence:
- industry
- business_type
- services
- technology_stack
- automation_gap
- lead_type (client | competitor | partner)
- opportunity / reason / lead_score
"""

import os
import json
from typing import Dict, Any, List
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


async def analyze_lead(
    company_name: str,
    website: str,
    description: str,
    tech_signals: list,
    raw_text: str,
    service_query: str,
    industry: str,
    api_key: str = None
) -> Dict[str, Any]:
    """
    Analyze a scraped lead using Gemini AI.
    Returns a structured intelligence object plus backward-compatible fields.
    """
    key_to_use = api_key or GEMINI_API_KEY
    if key_to_use:
        genai.configure(api_key=key_to_use)

    if not key_to_use:
        print(f"⚠️  No GEMINI_API_KEY — using rule-based analysis for {company_name}.")
        return _rule_based_analysis(company_name, tech_signals, service_query, industry)

    try:
        return await _gemini_analyze(company_name, website, description, tech_signals, raw_text, service_query, industry)
    except Exception as e:
        print(f"❌ Gemini API error for {company_name}: {e} — using rule-based fallback.")
        return _rule_based_analysis(company_name, tech_signals, service_query, industry)


async def _gemini_analyze(
    company_name: str, website: str, description: str,
    tech_signals: list, raw_text: str, service_query: str, industry: str
) -> Dict[str, Any]:
    """Call Gemini API for AI-powered lead analysis."""
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""You are an expert B2B sales analyst and website intelligence engine.
Analyze this company and classify how suitable they are for outbound sales.

COMPANY: {company_name}
WEBSITE: {website}
INDUSTRY: {industry}
DESCRIPTION: {description[:500]}
TECHNOLOGY SIGNALS: {', '.join(tech_signals) if tech_signals else 'None detected'}
WEBSITE CONTENT SAMPLE: {raw_text[:1000]}
SERVICE BEING SOLD: {service_query}

Rules for lead_type:
- client: likely buyer for the offered service
- competitor: offers same/similar service as the offered service
- partner: adjacent service provider that can refer/collaborate

Respond with a JSON object containing ONLY these fields:
{{
    "company_name": "normalized company name",
    "industry": "detected industry",
    "business_type": "short business type",
    "services": ["service1", "service2"],
    "technology_stack": ["tech1", "tech2"],
    "automation_gap": ["gap1", "gap2"],
    "lead_type": "client|competitor|partner",
    "opportunity": "One-line opportunity statement (e.g., 'AI chatbot for customer support')",
    "reason": "2-3 sentence reason for the opportunity",
    "lead_score": <number between 0 and 100>,
    "score_boost": <number between -20 and +30 representing AI-based score adjustment>,
  "recommended_actions": ["action1", "action2", "action3"],
  "pain_points": ["pain1", "pain2"],
  "fit_level": "high|medium|low"
}}

Return ONLY valid JSON, no markdown, no extra text."""

    response = model.generate_content(prompt)
    text = response.text.strip()

    # Clean up potential markdown code blocks
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    parsed = json.loads(text)
    return _normalize_ai_result(parsed, company_name, industry)


def _normalize_ai_result(data: Dict[str, Any], company_name: str, industry: str) -> Dict[str, Any]:
    services = data.get("services") if isinstance(data.get("services"), list) else []
    technology_stack = data.get("technology_stack") if isinstance(data.get("technology_stack"), list) else []
    automation_gap = data.get("automation_gap") if isinstance(data.get("automation_gap"), list) else []
    lead_type = (data.get("lead_type") or "client").lower().strip()
    if lead_type not in {"client", "competitor", "partner"}:
        lead_type = "client"

    reason = data.get("reason") or data.get("explanation") or ""
    lead_score = data.get("lead_score", 0)
    try:
        lead_score = max(0, min(100, int(float(lead_score))))
    except Exception:
        lead_score = 0

    score_boost = data.get("score_boost", 0)
    try:
        score_boost = int(float(score_boost))
    except Exception:
        score_boost = 0
    score_boost = max(-20, min(30, score_boost))

    return {
        "company_name": data.get("company_name") or company_name,
        "industry": data.get("industry") or industry,
        "business_type": data.get("business_type") or "",
        "services": services,
        "technology_stack": technology_stack,
        "automation_gap": automation_gap,
        "lead_type": lead_type,
        "opportunity": data.get("opportunity") or "",
        "reason": reason,
        "lead_score": lead_score,
        "score_boost": score_boost,
        "recommended_actions": data.get("recommended_actions") or [],
        "pain_points": data.get("pain_points") or [],
        "fit_level": data.get("fit_level") or "medium",
        "explanation": reason,
    }


def _rule_based_analysis(company_name: str, tech_signals: List[str], service_query: str, industry: str) -> Dict[str, Any]:
    """Fallback rule-based analysis when AI is not available."""
    signals_lower = [s.lower() for s in tech_signals]

    has_chat = any("chat" in s for s in signals_lower)
    has_crm = any("crm" in s for s in signals_lower)
    has_booking = any("booking" in s for s in signals_lower)
    missing_count = sum([not has_chat, not has_crm, not has_booking])

    if missing_count >= 2:
        opportunity = f"Multiple automation gaps — ideal candidate for {service_query}"
        explanation = (f"{company_name} is missing key automation tools including "
                       f"{'live chat, ' if not has_chat else ''}"
                       f"{'CRM system, ' if not has_crm else ''}"
                       f"{'booking system ' if not has_booking else ''}making them an excellent prospect.")
        score_boost = 20
        fit_level = "high"
    elif missing_count == 1:
        opportunity = f"Partial automation — good candidate for {service_query}"
        explanation = f"{company_name} has some tools but is missing key automation that {service_query} could address."
        score_boost = 10
        fit_level = "medium"
    else:
        opportunity = f"Already has tools — {service_query} could add value"
        explanation = f"{company_name} has existing tools but could benefit from enhanced automation."
        score_boost = 0
        fit_level = "low"

    lead_type = "client"
    service_lower = service_query.lower()
    company_lower = company_name.lower()
    if any(k in company_lower for k in ["agency", "consulting", "solutions", "studio"]) and any(
        k in service_lower for k in ["ai", "automation", "crm", "marketing"]
    ):
        lead_type = "competitor"

    return {
        "company_name": company_name,
        "industry": industry,
        "business_type": "",
        "services": [],
        "technology_stack": tech_signals,
        "automation_gap": [
            "No live chat detected" if not has_chat else "",
            "No CRM detected" if not has_crm else "",
            "No booking/reservation system" if not has_booking else "",
        ],
        "lead_type": lead_type,
        "opportunity": opportunity,
        "reason": explanation,
        "explanation": explanation,
        "lead_score": min(100, max(0, 50 + score_boost)),
        "score_boost": score_boost,
        "recommended_actions": [
            "Schedule a discovery call",
            "Send personalized email",
            "Connect on LinkedIn",
        ],
        "pain_points": [
            "Manual processes slowing growth",
            "Missing automation tools",
        ],
        "fit_level": fit_level,
    }

"""
AI Lead Analyzer — uses Google Gemini to analyze scraped website content.

Provides opportunity identification, business signal analysis, and
outreach recommendations. Falls back to rule-based analysis if no API key.
"""

import os
import json
from typing import Dict, Any
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
) -> Dict[str, Any]:
    """
    Analyze a scraped lead using Gemini AI.
    Returns: opportunity, explanation, score_adjustment, recommended_actions.
    """
    if not GEMINI_API_KEY:
        print(f"⚠️  No GEMINI_API_KEY — using rule-based analysis for {company_name}.")
        return _rule_based_analysis(company_name, tech_signals, service_query)

    try:
        return await _gemini_analyze(company_name, website, description, tech_signals, raw_text, service_query, industry)
    except Exception as e:
        print(f"❌ Gemini API error for {company_name}: {e} — using rule-based fallback.")
        return _rule_based_analysis(company_name, tech_signals, service_query)


async def _gemini_analyze(
    company_name: str, website: str, description: str,
    tech_signals: list, raw_text: str, service_query: str, industry: str
) -> Dict[str, Any]:
    """Call Gemini API for AI-powered lead analysis."""
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""You are an expert B2B sales analyst. Analyze this potential business lead and determine if this company needs the service offered.

COMPANY: {company_name}
WEBSITE: {website}
INDUSTRY: {industry}
DESCRIPTION: {description[:500]}
TECHNOLOGY SIGNALS: {', '.join(tech_signals) if tech_signals else 'None detected'}
WEBSITE CONTENT SAMPLE: {raw_text[:1000]}
SERVICE BEING SOLD: {service_query}

Respond with a JSON object containing ONLY these fields:
{{
  "opportunity": "One-line opportunity statement (e.g., 'AI chatbot for customer support')",
  "explanation": "2-3 sentence explanation of why this company is a good lead and what specific pain points exist",
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

    return json.loads(text)


def _rule_based_analysis(company_name: str, tech_signals: list, service_query: str) -> Dict[str, Any]:
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

    return {
        "opportunity": opportunity,
        "explanation": explanation,
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

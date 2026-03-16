"""
Email Generator Service — uses Gemini to write personalized sales outreach emails.
"""

import os
import json
import google.generativeai as genai
from typing import Dict
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


async def generate_outreach_email(
    company_name: str,
    opportunity: str,
    ai_explanation: str,
    sender_name: str,
    sender_company: str,
    product_description: str,
    api_key: str = None
) -> Dict[str, str]:
    """
    Generate a personalized B2B sales outreach email using Gemini AI.
    Returns dict with 'subject' and 'body'.
    """
    key_to_use = api_key or GEMINI_API_KEY
    if key_to_use:
        genai.configure(api_key=key_to_use)

    if not key_to_use:
        print("❌ No Gemini API Key provided. Using template.")
        return _template_email(company_name, opportunity, sender_name, sender_company, product_description)

    try:
        return await _gemini_email(company_name, opportunity, ai_explanation, sender_name, sender_company, product_description)
    except Exception as e:
        print(f"❌ Gemini email error: {e} — using template fallback.")
        return _template_email(company_name, opportunity, sender_name, sender_company, product_description)


async def _gemini_email(
    company_name: str, opportunity: str, ai_explanation: str,
    sender_name: str, sender_company: str, product_description: str
) -> Dict[str, str]:
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""Write a professional, personalized B2B sales outreach email.

PROSPECT COMPANY: {company_name}
IDENTIFIED OPPORTUNITY: {opportunity}
CONTEXT: {ai_explanation}
YOUR NAME: {sender_name}
YOUR COMPANY: {sender_company}
PRODUCT/SERVICE: {product_description or opportunity}

Requirements:
- Subject line should be specific and compelling
- Email should be 3-4 short paragraphs
- Reference a specific pain point you identified
- Include a clear, soft CTA (e.g., 15-minute call)
- Professional but conversational tone
- Do NOT use generic phrases like "I hope this finds you well"

Respond with JSON only:
{{
  "subject": "Your email subject here",
  "body": "Full email body here with line breaks as \\n"
}}"""

    response = model.generate_content(prompt)
    text = response.text.strip()

    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]

    return json.loads(text)


def _template_email(
    company_name: str, opportunity: str,
    sender_name: str, sender_company: str, product_description: str
) -> Dict[str, str]:
    """Template-based email for when AI is not available."""
    subject = f"Quick idea for {company_name} — {opportunity}"
    body = f"""Hi {company_name} team,

I came across {company_name} and noticed an opportunity that I thought was worth sharing.

{opportunity}. Many businesses in your space are seeing significant improvements in efficiency and customer satisfaction by addressing this — and I believe {company_name} could too.

At {sender_company}, we specialize in {product_description or 'helping businesses automate and scale their operations'}. We've helped similar companies reduce manual work by 60% and improve response times dramatically.

Would you be open to a quick 15-minute call this week to explore if there's a fit? I'm happy to share some specific examples from companies in your industry.

Best regards,
{sender_name}
{sender_company}"""
    return {"subject": subject, "body": body}

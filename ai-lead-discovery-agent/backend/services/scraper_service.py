"""
Website Scraper Service — uses Playwright + BeautifulSoup to extract company info.

For production: install Playwright browsers with `playwright install chromium`
Falls back to httpx (no JS rendering) if Playwright is not available.
"""

import re
import asyncio
from typing import Dict, Any, List
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup


# Common tech platforms and signals to detect
TECH_SIGNALS = {
    "shopify": "Shopify E-commerce",
    "woocommerce": "WooCommerce Store",
    "wordpress": "WordPress Website",
    "squarespace": "Squarespace Website",
    "wix": "Wix Website",
    "intercom": "Intercom Support",
    "zendesk": "Zendesk Support",
    "hubspot": "HubSpot CRM",
    "salesforce": "Salesforce CRM",
    "stripe": "Stripe Payments",
    "paypal": "PayPal Payments",
    "mailchimp": "Mailchimp Email",
    "crisp": "Crisp Chat",
    "tawk": "Tawk.to Chat",
    "freshdesk": "Freshdesk Support",
    "chatbot": "Existing Chatbot",
    "google-analytics": "Google Analytics",
    "facebook-pixel": "Facebook Pixel",
}

MISSING_AUTOMATION_SIGNALS = [
    "no chat widget found",
    "no booking system",
    "no CRM detected",
    "no email capture",
    "no online ordering",
]


async def scrape_website(url: str) -> Dict[str, Any]:
    """
    Scrape a website and extract company information.
    Tries Playwright first, falls back to httpx for static content.
    """
    try:
        return await _scrape_with_playwright(url)
    except Exception as e:
        print(f"⚠️  Playwright scrape failed for {url}: {e} — trying httpx fallback.")
        try:
            return await _scrape_with_httpx(url)
        except Exception as e2:
            print(f"❌ httpx scrape also failed for {url}: {e2}")
            return _empty_result(url)


async def _scrape_with_playwright(url: str) -> Dict[str, Any]:
    """Use Playwright headless Chromium to render JS-heavy pages."""
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        await page.set_extra_http_headers({
            "User-Agent": "Mozilla/5.0 (compatible; LeadDiscoveryBot/1.0)"
        })

        try:
            await page.goto(url, timeout=20000, wait_until="domcontentloaded")
            await asyncio.sleep(2)  # wait for JS to settle
            html = await page.content()
        finally:
            await browser.close()

    return _parse_html(url, html)


async def _scrape_with_httpx(url: str) -> Dict[str, Any]:
    """Lightweight fallback using httpx for static HTML pages."""
    headers = {"User-Agent": "Mozilla/5.0 (compatible; LeadDiscoveryBot/1.0)"}
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        response = await client.get(url, headers=headers)
        return _parse_html(url, response.text)


def _parse_html(url: str, html: str) -> Dict[str, Any]:
    """Parse HTML and extract all relevant business signals."""
    soup = BeautifulSoup(html, "lxml")

    # ── Company name ───────────────────────────────────────────────────────────
    company_name = (
        _get_meta(soup, "og:site_name")
        or _get_meta(soup, "og:title")
        or (soup.title.string.strip() if soup.title else "")
        or urlparse(url).netloc.replace("www.", "")
    )

    # ── Description ────────────────────────────────────────────────────────────
    description = (
        _get_meta(soup, "og:description")
        or _get_meta(soup, "description")
        or _get_meta(soup, "twitter:description")
        or ""
    )
    if not description:
        first_p = soup.find("p")
        description = first_p.get_text(strip=True)[:500] if first_p else ""

    # ── Contact info ────────────────────────────────────────────────────────────
    text = soup.get_text(separator=" ")
    emails = list(set(re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)))
    phones = list(set(re.findall(r"[\+]?\d[\d\s\-\(\)]{7,15}\d", text)))[:5]

    social = {}
    contact_pages = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "facebook.com" in href:
            social["facebook"] = href
        elif "instagram.com" in href:
            social["instagram"] = href
        elif "twitter.com" in href or "x.com" in href:
            social["twitter"] = href
        elif "linkedin.com" in href:
            social["linkedin"] = href

        href_lower = href.lower()
        if any(keyword in href_lower for keyword in ["/contact", "contact-us", "get-in-touch"]):
            if href not in contact_pages:
                contact_pages.append(href)

    # ── Tech signals ────────────────────────────────────────────────────────────
    html_lower = html.lower()
    detected_tech = [label for key, label in TECH_SIGNALS.items() if key in html_lower]

    # Check for missing automation
    missing = []
    if not any("chat" in t.lower() for t in detected_tech):
        missing.append("No live chat detected")
    if not any("crm" in t.lower() for t in detected_tech):
        missing.append("No CRM detected")
    if not any("booking" in html_lower or "reservation" in html_lower for _ in [1]):
        missing.append("No booking/reservation system")

    return {
        "company_name": company_name[:255],
        "description": description[:1000],
        "contact_info": {
            "emails": emails[:5],
            "phones": phones[:3],
            "social": social,
            "contact_pages": contact_pages[:5],
        },
        "tech_signals": detected_tech + missing,
        "raw_text": text[:3000],  # used by AI analyzer
    }


def _get_meta(soup: BeautifulSoup, name: str) -> str:
    """Extract content from <meta name="x"> or <meta property="x">."""
    tag = soup.find("meta", {"name": name}) or soup.find("meta", {"property": name})
    return tag["content"].strip() if tag and tag.get("content") else ""


def _empty_result(url: str) -> Dict[str, Any]:
    return {
        "company_name": urlparse(url).netloc.replace("www.", ""),
        "description": "",
        "contact_info": {"emails": [], "phones": [], "social": {}, "contact_pages": []},
        "tech_signals": [],
        "raw_text": "",
    }

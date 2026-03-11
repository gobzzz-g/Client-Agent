"""
Lead Discovery Service — searches the web for business websites using Serper.dev.

Serper.dev provides a Google Search JSON API (free tier: 2500 queries/month).
Sign up at https://serper.dev to get your API key.
"""

import os
import httpx
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

SERPER_API_KEY = os.getenv("SERPER_API_KEY", "")
SERPER_URL = "https://google.serper.dev/search"


async def search_leads(industry: str, location: str, service: str, max_results: int = 10) -> List[Dict[str, Any]]:
    """
    Search for business websites related to the given industry, location, and service.

    Returns a list of dicts with keys: title, website, snippet.
    Falls back to mock data if no API key is configured.
    """
    if not SERPER_API_KEY:
        print("⚠️  No SERPER_API_KEY found — returning mock search results.")
        return _mock_search_results(industry, location, service)

    query = f"{industry} businesses in {location} that need {service}"

    headers = {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "q": query,
        "num": max_results,
        "gl": "us",
        "hl": "en",
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(SERPER_URL, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()

            results = []
            for item in data.get("organic", [])[:max_results]:
                link = item.get("link", "")
                if link and is_valid_business_url(link):
                    results.append({
                        "title": item.get("title", ""),
                        "website": link,
                        "snippet": item.get("snippet", ""),
                    })
            return results

    except Exception as e:
        print(f"❌ Serper API error: {e} — falling back to mock data.")
        return _mock_search_results(industry, location, service)


def is_valid_business_url(url: str) -> bool:
    """Filter out non-business URLs like social media, directories, etc."""
    excluded = ["facebook.com", "instagram.com", "twitter.com", "linkedin.com",
                "yelp.com", "tripadvisor.com", "yellowpages.com", "wikipedia.org",
                "youtube.com", "google.com", "amazon.com"]
    return not any(ex in url for ex in excluded)


def _mock_search_results(industry: str, location: str, service: str) -> List[Dict[str, Any]]:
    """Return realistic mock data when no API key is provided."""
    return [
        {"title": f"FreshBites — {industry} in {location}", "website": "https://freshbites-demo.com", "snippet": f"Popular {industry} serving great food with online ordering."},
        {"title": f"Urban Dine — Modern {industry}", "website": "https://urbandine-demo.com", "snippet": f"Contemporary {industry} with dine-in and takeaway options."},
        {"title": f"SpiceGarden Restaurant", "website": "https://spicegarden-demo.com", "snippet": "Award-winning cuisine with catering services."},
        {"title": f"The Burger House", "website": "https://burgerhouse-demo.com", "snippet": "Fast food chain with multiple locations and delivery."},
        {"title": f"Bella Italia", "website": "https://bellaitalia-demo.com", "snippet": "Authentic Italian dining experience with family recipes."},
        {"title": f"DragonWok Express", "website": "https://dragonwok-demo.com", "snippet": "Quick Chinese cuisine with online ordering available."},
        {"title": f"GreenLeaf Cafe", "website": "https://greenleaf-demo.com", "snippet": "Health-focused cafe with organic menu options."},
        {"title": f"Saffron Palace", "website": "https://saffronpalace-demo.com", "snippet": "Fine dining restaurant with banquet facilities."},
        {"title": f"TacoFiesta", "website": "https://tacofiesta-demo.com", "snippet": "Mexican street food with vibrant atmosphere."},
        {"title": f"SeaBreeze Seafood", "website": "https://seabreeze-demo.com", "snippet": "Fresh seafood restaurant with coastal vibes."},
    ]

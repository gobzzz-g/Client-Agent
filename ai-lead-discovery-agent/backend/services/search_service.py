"""
Lead Discovery Service — searches the web for business websites using Serper.dev.

Implements:
- Multi-query generation
- Parallel Serper requests
- Multi-page fetching
- URL deduplication
"""

import os
import asyncio
from urllib.parse import urlparse
from typing import List, Dict, Any
import httpx
from dotenv import load_dotenv

load_dotenv()

SERPER_API_KEY = os.getenv("SERPER_API_KEY", "")
SERPER_URL = "https://google.serper.dev/search"


def _safe_int(value: str, fallback: int) -> int:
    try:
        return int(value)
    except Exception:
        return fallback


MAX_DISCOVERY_RESULTS = _safe_int(os.getenv("MAX_DISCOVERY_RESULTS", "1000"), 1000)
SERPER_PAGE_SIZE = _safe_int(os.getenv("SERPER_PAGE_SIZE", "100"), 100)
SERPER_MAX_PARALLEL_REQUESTS = _safe_int(os.getenv("SERPER_MAX_PARALLEL_REQUESTS", "8"), 8)


def _build_search_queries(industry: str, location: str, service: str) -> List[str]:
    base = industry.strip()
    loc = location.strip()
    svc = service.strip()

    queries = [
        f"{base} in {loc}",
        f"best {base} in {loc}",
        f"{base} near {loc}",
        f"{base} {loc}",
        f"{base} companies in {loc}",
        f"{base} businesses in {loc}",
        f"{base} {loc} contact",
        f"{base} {loc} official website",
        f"{base} {loc} booking",
        f"{base} {loc} catering",
        f"{base} {loc} that need {svc}",
        f"{base} using manual process {loc}",
        f"{base} without chatbot {loc}",
        f"{base} without CRM {loc}",
    ]

    deduped = []
    seen = set()
    for query in queries:
        normalized = " ".join(query.lower().split())
        if normalized not in seen:
            seen.add(normalized)
            deduped.append(query)
    return deduped


def _normalize_url(url: str) -> str:
    parsed = urlparse(url)
    host = parsed.netloc.lower().replace("www.", "")
    path = parsed.path.rstrip("/")
    return f"{host}{path}"


async def _fetch_serper_page(
    client: httpx.AsyncClient,
    headers: Dict[str, str],
    query: str,
    num: int,
    page: int,
) -> List[Dict[str, Any]]:
    payload = {
        "q": query,
        "num": num,
        "page": page,
        "gl": "us",
        "hl": "en",
    }
    response = await client.post(SERPER_URL, json=payload, headers=headers)
    response.raise_for_status()
    data = response.json()

    results: List[Dict[str, Any]] = []
    for item in data.get("organic", []):
        link = item.get("link", "")
        if link and is_valid_business_url(link):
            results.append(
                {
                    "title": item.get("title", ""),
                    "website": link,
                    "snippet": item.get("snippet", ""),
                    "source_query": query,
                    "source_page": page,
                }
            )
    return results


async def search_leads(industry: str, location: str, service: str, max_results: int = 10, api_key: str = None) -> List[Dict[str, Any]]:
    """
    Discover business websites using multi-query + multi-page Serper search.

    - Accepts up to 1000 target results
    - Runs query/page requests in parallel
    - Deduplicates websites globally
    """
    target_results = max(1, min(max_results, MAX_DISCOVERY_RESULTS))

    key_to_use = api_key or SERPER_API_KEY

    if not key_to_use:
        print("⚠️  No SERPER_API_KEY found — returning mock search results.")
        return _mock_search_results(industry, location, service)[:target_results]

    headers = {
        "X-API-KEY": key_to_use,
        "Content-Type": "application/json",
    }

    queries = _build_search_queries(industry, location, service)
    per_query_target = max(1, min(SERPER_PAGE_SIZE, target_results))
    pages_per_query = max(1, (target_results + per_query_target - 1) // per_query_target)

    semaphore = asyncio.Semaphore(SERPER_MAX_PARALLEL_REQUESTS)

    async def guarded_fetch(client: httpx.AsyncClient, query: str, page: int) -> List[Dict[str, Any]]:
        async with semaphore:
            try:
                return await _fetch_serper_page(client, headers, query, per_query_target, page)
            except Exception as exc:
                print(f"⚠️  Serper fetch failed for query='{query}' page={page}: {exc}")
                return []

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            tasks = []
            for query in queries:
                for page in range(1, pages_per_query + 1):
                    tasks.append(guarded_fetch(client, query, page))

            all_batches = await asyncio.gather(*tasks)

        all_results = [item for batch in all_batches for item in batch]
        deduped_results: List[Dict[str, Any]] = []
        seen_urls = set()

        for item in all_results:
            normalized = _normalize_url(item["website"])
            if normalized in seen_urls:
                continue
            seen_urls.add(normalized)
            deduped_results.append(item)
            if len(deduped_results) >= target_results:
                break

        return deduped_results

    except Exception as e:
        print(f"❌ Serper API error: {e} — falling back to mock data.")
        return _mock_search_results(industry, location, service)[:target_results]


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

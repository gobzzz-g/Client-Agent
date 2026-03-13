"""
Main FastAPI Application Entry Point.

Run with: uvicorn main:app --reload --host 0.0.0.0 --port 8000
API docs: http://localhost:8000/docs
"""

import os
import json
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import inspect, text

from database import engine, Base, SessionLocal
from routers import leads, discovery, export, email
from seed_data import seed_sample_leads
from schemas import DiscoveryRequest
from services.discovery_engine import run_discovery_pipeline


AUTO_DISCOVERY_ENABLED = os.getenv("AUTO_DISCOVERY_ENABLED", "false").lower() == "true"
try:
    AUTO_DISCOVERY_INTERVAL_HOURS = int(os.getenv("AUTO_DISCOVERY_INTERVAL_HOURS", "12"))
except ValueError:
    AUTO_DISCOVERY_INTERVAL_HOURS = 12
AUTO_DISCOVERY_DEFAULT_QUERIES = json.dumps(
    [
        {"industry": "restaurants", "location": "Coimbatore", "service": "AI chatbot automation", "max_results": 100},
    ]
)
try:
    AUTO_DISCOVERY_QUERIES = json.loads(os.getenv("AUTO_DISCOVERY_QUERIES", AUTO_DISCOVERY_DEFAULT_QUERIES))
except json.JSONDecodeError:
    AUTO_DISCOVERY_QUERIES = json.loads(AUTO_DISCOVERY_DEFAULT_QUERIES)


def ensure_schema_compatibility() -> None:
    """Apply lightweight additive schema updates for existing SQLite databases."""
    inspector = inspect(engine)
    if "leads" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("leads")}
    with engine.begin() as conn:
        if "lead_type" not in columns:
            conn.execute(text("ALTER TABLE leads ADD COLUMN lead_type VARCHAR(50) DEFAULT 'client'"))


async def run_automated_discovery_once() -> None:
    """Run one full automated discovery cycle over configured query sets."""
    db = SessionLocal()
    try:
        for query in AUTO_DISCOVERY_QUERIES:
            request = DiscoveryRequest(
                industry=query.get("industry", ""),
                location=query.get("location", ""),
                service=query.get("service", ""),
                max_results=int(query.get("max_results", 100)),
            )
            if not request.industry or not request.location or not request.service:
                continue
            await run_discovery_pipeline(request=request, db=db)
    except Exception as exc:
        print(f"❌ Automated discovery cycle failed: {exc}")
    finally:
        db.close()


async def automated_discovery_loop() -> None:
    """Run discovery at fixed interval (default: every 12 hours)."""
    while True:
        await run_automated_discovery_once()
        await asyncio.sleep(max(1, AUTO_DISCOVERY_INTERVAL_HOURS) * 3600)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables and seed sample data if empty."""
    Base.metadata.create_all(bind=engine)
    ensure_schema_compatibility()
    seed_sample_leads()

    background_task = None
    if AUTO_DISCOVERY_ENABLED:
        background_task = asyncio.create_task(automated_discovery_loop())
        print(f"✅ Automated discovery enabled (every {AUTO_DISCOVERY_INTERVAL_HOURS}h)")

    try:
        yield
    finally:
        if background_task:
            background_task.cancel()
            try:
                await background_task
            except asyncio.CancelledError:
                pass


app = FastAPI(
    title="AI Lead Discovery Agent API",
    description="Discover, analyze, and score business leads using AI.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(leads.router)
app.include_router(discovery.router)
app.include_router(export.router)
app.include_router(email.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "AI Lead Discovery Agent API is running 🚀"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "version": "1.0.0"}

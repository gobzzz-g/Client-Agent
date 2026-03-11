"""
Main FastAPI Application Entry Point.

Run with: uvicorn main:app --reload --host 0.0.0.0 --port 8000
API docs: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import engine, Base
from routers import leads, discovery, export, email
from seed_data import seed_sample_leads


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables and seed sample data if empty."""
    Base.metadata.create_all(bind=engine)
    seed_sample_leads()
    yield


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

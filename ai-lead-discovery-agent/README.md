# AI Sales Lead Discovery Agent 🚀

A production-ready full-stack AI SaaS application that automatically discovers business leads from the internet, analyzes company websites using Gemini AI, scores leads based on opportunity signals, and presents them in a premium SaaS dashboard.

---

## ✨ Features

- **Lead Discovery** — Search web for businesses by industry + location + service
- **AI Website Scraper** — Playwright + BeautifulSoup to extract company data
- **Gemini AI Analyzer** — Identifies opportunities and business signals
- **Lead Scoring (0–100)** — Rule-based + AI scoring engine
- **Premium Dashboard** — Charts, analytics, search/filter/sort
- **AI Email Generator** — Personalized outreach emails per lead
- **Export** — CSV, Excel, JSON download
- **Dark/Light Mode** — Smooth theme toggle

---

## 🛠 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | Next.js 14, TailwindCSS, Recharts   |
| Backend   | Python FastAPI, SQLAlchemy          |
| AI        | Google Gemini 1.5 Flash             |
| Scraping  | Playwright, BeautifulSoup, httpx    |
| Database  | SQLite (default) / PostgreSQL       |
| Search    | Serper.dev (Google Search API)      |

---

## 🚀 Quick Start

### 1. Clone and configure

```bash
git clone <repo>
cd ai-lead-discovery-agent
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers (for web scraping)
playwright install chromium

# Configure environment
cp .env.example .env
# Edit .env and add your API keys:
#   GEMINI_API_KEY=your_key_here
#   SERPER_API_KEY=your_key_here

# Run backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

Open: http://localhost:3000

---

## 🔑 API Keys Required

| Service       | URL                             | Free Tier           |
|---------------|---------------------------------|---------------------|
| Gemini AI     | https://aistudio.google.com     | Free tier available |
| Serper.dev    | https://serper.dev              | 2500 searches/month |

> **Note:** The app works without API keys using realistic mock data for demos.

---

## 📁 Project Structure

```
ai-lead-discovery-agent/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── database.py              # SQLAlchemy setup
│   ├── models.py                # Lead ORM model
│   ├── schemas.py               # Pydantic schemas
│   ├── seed_data.py             # Sample data seeder
│   ├── requirements.txt
│   ├── .env.example
│   ├── routers/
│   │   ├── leads.py             # CRUD + analytics
│   │   ├── discovery.py         # Full pipeline
│   │   ├── export.py            # CSV/Excel/JSON
│   │   └── email.py             # Email generation
│   └── services/
│       ├── search_service.py    # Serper.dev search
│       ├── scraper_service.py   # Playwright scraper
│       ├── ai_analyzer.py       # Gemini analysis
│       ├── scoring_engine.py    # Lead scorer
│       └── email_generator.py   # Email writer
└── frontend/
    ├── app/
    │   ├── page.tsx             # Dashboard
    │   ├── discovery/page.tsx   # Lead discovery
    │   ├── leads/page.tsx       # Lead database
    │   ├── leads/[id]/page.tsx  # Lead detail
    │   ├── analysis/page.tsx    # AI analysis
    │   └── settings/page.tsx    # Settings
    ├── components/
    │   ├── layout/Sidebar.tsx
    │   ├── layout/Topbar.tsx
    │   └── providers/ThemeProvider.tsx
    └── lib/
        ├── api.ts               # Axios API client
        └── utils.ts             # Helpers
```

---

## 📊 API Endpoints

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | `/discover`           | Run full discovery pipeline    |
| GET    | `/leads`              | List leads (filter/sort/page)  |
| GET    | `/leads/{id}`         | Get single lead                |
| GET    | `/leads/analytics`    | Dashboard analytics            |
| PATCH  | `/leads/{id}/status`  | Update lead status             |
| DELETE | `/leads/{id}`         | Delete lead                    |
| POST   | `/email/generate`     | Generate outreach email        |
| GET    | `/export/csv`         | Export as CSV                  |
| GET    | `/export/excel`       | Export as Excel                |
| GET    | `/export/json`        | Export as JSON                 |

---

## 💡 Example Usage

1. Go to **Lead Discovery**
2. Enter: Industry = `Restaurants`, Location = `Mumbai, India`, Service = `AI chatbot`
3. Click **Discover Leads**
4. AI searches, scrapes, and scores leads automatically
5. Click any lead to see AI analysis + generate email
6. Export to CSV/Excel for your CRM

---

## 🧑‍💻 Development

The system includes 10 pre-seeded sample restaurant leads so you can explore the dashboard immediately without any API keys.

To reset the database: `rm backend/leads.db` and restart the server.

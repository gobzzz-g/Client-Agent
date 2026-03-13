# AI Lead Discovery Agent — Complete Setup Guide 🚀

This guide will walk you through setting up the complete AI Lead Discovery Platform from scratch.

---

## Prerequisites

✅ **Python 3.8+** installed ([Download](https://www.python.org/downloads/))  
✅ **Node.js 18+** and npm installed ([Download](https://nodejs.org/))  
✅ **Git** installed (optional, for version control)

---

## Step 1: Project Structure

After cloning or downloading the project, your structure should look like:

```
ai-lead-discovery-agent/
├── backend/           # Python FastAPI backend
├── frontend/          # Next.js React frontend
└── README.md
```

---

## Step 2: Backend Setup (Python + FastAPI)

### 2.1 Navigate to Backend Directory

```bash
cd ai-lead-discovery-agent/backend
```

### 2.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- FastAPI — Modern Python web framework
- Uvicorn — ASGI server
- SQLAlchemy — Database ORM
- Pydantic — Data validation
- Playwright — Browser automation for scraping
- BeautifulSoup4 — HTML parsing
- Google Generative AI — Gemini API client
- httpx — Async HTTP client
- openpyxl — Excel export
- python-dotenv — Environment variables

### 2.3 Install Playwright Browsers

Playwright needs to download browser binaries for headless scraping:

```bash
playwright install chromium
```

This downloads ~300MB of Chromium browser for automated web scraping.

### 2.4 Configure API Keys

Create your `.env` file:

```bash
# On Windows
copy .env.example .env

# On Mac/Linux
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# ─── Gemini AI ───────────────────────────────────────────────────────────────
GEMINI_API_KEY=your_actual_gemini_key_here

# ─── Serper.dev (Google Search API) ──────────────────────────────────────────
SERPER_API_KEY=your_actual_serper_key_here

# ─── Database ─────────────────────────────────────────────────────────────────
DATABASE_URL=sqlite:///./leads.db

# ─── App ──────────────────────────────────────────────────────────────────────
APP_NAME=AI Lead Discovery Agent
APP_VERSION=1.0.0
DEBUG=true
```

#### Getting API Keys:

**Gemini API (Free)**
1. Visit: https://aistudio.google.com
2. Sign in with Google account
3. Click "Get API Key"
4. Copy your key
5. Paste into `.env` as `GEMINI_API_KEY=AIza...`

**Serper.dev API (2500 free searches/month)**
1. Visit: https://serper.dev
2. Sign up with email
3. Go to Dashboard
4. Copy your API key
5. Paste into `.env` as `SERPER_API_KEY=...`

> **Note:** The system works without API keys using mock data for demos!

### 2.5 Start the Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

You should see:

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ **Backend is now running on:** http://localhost:8000  
✅ **API Documentation:** http://localhost:8000/docs

---

## Step 3: Frontend Setup (Next.js + React)

Open a **NEW terminal window** (keep backend running).

### 3.1 Navigate to Frontend Directory

```bash
cd ai-lead-discovery-agent/frontend
```

### 3.2 Install Node Dependencies

```bash
npm install
```

This installs:
- Next.js 14 — React framework
- React 18 — UI library
- TailwindCSS — Utility-first CSS
- Framer Motion — Animations
- Recharts — Dashboard charts
- Axios — HTTP client
- Lucide React — Icon library

### 3.3 Start the Frontend Development Server

```bash
npm run dev
```

You should see:

```
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

✅ **Frontend is now running on:** http://localhost:3000

---

## Step 4: Access the Application

Open your browser and go to:

🌐 **http://localhost:3000**

You should see the AI Lead Discovery dashboard with:
- 📊 **Dashboard** — Analytics and charts
- 🔍 **Lead Discovery** — Real-time search interface
- 📇 **Lead Database** — Searchable lead table
- 🤖 **AI Analysis** — Detailed lead insights
- ⚙️ **Settings** — Configuration panel

---

## Step 5: Test the System

### Option A: Quick Demo (No API Keys Required)

The system comes pre-loaded with **10 sample leads** so you can test immediately:

1. Visit the **Dashboard** — See analytics and charts
2. Go to **Lead Database** — Browse, search, and sort leads
3. Click any lead to see **AI Analysis**
4. Try **Export** buttons to download CSV/Excel/JSON

### Option B: Real-Time Discovery (API Keys Required)

1. Go to **Lead Discovery** page
2. Fill in the form:
   - **Industry:** Restaurants
   - **Location:** Mumbai, India
   - **Service:** AI chatbot automation
3. Click **"Discover Business Leads"**
4. Watch the AI pipeline:
   - ✅ Searching Google for businesses
   - ✅ Scraping company websites
   - ✅ Running AI analysis
   - ✅ Scoring leads 0-100
   - ✅ Saving to database
5. New leads appear in the **Lead Database**

---

## Step 6: Understanding the Pipeline

When you click "Discover Leads", here's what happens:

### Stage 1: Web Search (Serper API)
- Queries Google with: `"restaurants in Mumbai that need AI chatbot"`
- Returns business websites from search results
- Filters out social media and directory sites

### Stage 2: Website Scraping (Playwright + BeautifulSoup)
- Visits each business website
- Extracts:
  - Company name
  - Description
  - Contact emails and phones
  - Technology signals (CRM, chat widgets, payment systems)
  - Social media links
- Detects automation gaps (missing live chat, booking, etc.)

### Stage 3: AI Analysis (Google Gemini)
- Sends website content to Gemini AI
- Prompt asks:
  - "Does this company need our product?"
  - "What opportunity exists?"
  - "Why is this a good lead?"
- Returns JSON with opportunity analysis

### Stage 4: Lead Scoring (0-100)
- Base score: 50
- Adds points for:
  - Missing automation tools (+5 each)
  - Contact info available (+10)
  - Social media presence (+5)
  - AI-detected high fit (+30 max)
- Subtracts for:
  - Already using competitor tools (-10)

### Stage 5: Database Storage
- Stores lead in SQLite database
- Prevents duplicates (checks website URL)
- Updates dashboard analytics

---

## Step 7: Export and Email Features

### Export Leads

From the **Lead Database** page, click export buttons:

- **CSV** — Import to Excel or Google Sheets
- **Excel** — Formatted .xlsx spreadsheet
- **JSON** — Developer-friendly format

All exports include:
- Company name, website, score
- Contact information
- AI analysis and opportunity
- Status and timestamps

### Generate Outreach Email

1. Go to any lead's detail page
2. Click **"Generate Email"**
3. AI writes a personalized B2B sales email:
   - Custom subject line
   - References specific pain points
   - Professional tone
   - Soft call-to-action
4. Copy and send via your email client

---

## Step 8: Customization

### Change Search Parameters

Edit discovery form placeholders in:
```
frontend/app/discovery/page.tsx
```

### Modify Scoring Logic

Adjust scoring weights in:
```
backend/services/scoring_engine.py
```

### Customize AI Prompts

Edit Gemini prompts in:
```
backend/services/ai_analyzer.py
backend/services/email_generator.py
```

### Add New Filters

Extend lead filters in:
```
backend/routers/leads.py
```

---

## Troubleshooting

### Backend won't start

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`  
**Solution:** Run `pip install -r requirements.txt` in backend folder

**Problem:** `Playwright not installed`  
**Solution:** Run `playwright install chromium`

**Problem:** 503 errors during discovery  
**Solution:** Check that Gemini and Serper API keys are valid in `.env`

### Frontend won't start

**Problem:** `Cannot find module 'next'`  
**Solution:** Run `npm install` in frontend folder

**Problem:** Build errors with TailwindCSS  
**Solution:** Clear cache: `rm -rf .next node_modules package-lock.json` then `npm install`

### Discovery returns mock data

**Problem:** Serper/Gemini return mock results  
**Solution:** Check `.env` file has valid API keys (not placeholder text)

### Database errors

**Problem:** `sqlite3.OperationalError`  
**Solution:** Delete `leads.db` and restart backend (will recreate with sample data)

---

## Production Deployment

### Backend (Railway, Render, AWS)

1. Change `DATABASE_URL` to PostgreSQL connection string
2. Set environment variables in hosting platform
3. Deploy with:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Frontend (Vercel, Netlify)

1. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   ```
2. Deploy with:
   ```bash
   npm run build
   npm run start
   ```

---

## Architecture Diagram

```
┌─────────────────┐
│   User Browser  │
│   (Next.js UI)  │
└────────┬────────┘
         │ HTTP Requests
         ↓
┌─────────────────┐     ┌──────────────┐
│  FastAPI Server │────→│ SQLite/PG DB │
│   (Python)      │     └──────────────┘
└────────┬────────┘
         │
         ├──→ Serper API (Google Search)
         ├──→ Playwright (Web Scraping)
         └──→ Gemini API (AI Analysis)
```

---

## Support & Resources

- 📖 **API Docs:** http://localhost:8000/docs
- 🔑 **Gemini Keys:** https://aistudio.google.com
- 🔍 **Serper Keys:** https://serper.dev
- 🎨 **Tailwind Docs:** https://tailwindcss.com
- ⚡ **FastAPI Docs:** https://fastapi.tiangolo.com

---

## Summary

Your AI Lead Discovery Agent is now fully operational! 🎉

**Backend:** http://localhost:8000  
**Frontend:** http://localhost:3000  
**API Docs:** http://localhost:8000/docs

The system can:
✅ Search the web for real businesses  
✅ Scrape company websites automatically  
✅ Analyze leads with AI  
✅ Score leads 0-100  
✅ Generate personalized sales emails  
✅ Export to CSV/Excel/JSON  
✅ Track and manage lead pipeline  

Happy lead hunting! 🚀

# User Guide — AI Lead Discovery Agent 📘

A complete guide to using the AI Lead Discovery Platform to find, analyze, and manage business leads.

---

## What is AI Lead Discovery Agent?

AI Lead Discovery Agent is an intelligent sales tool that automatically:
- 🔍 **Searches** the web for businesses that match your criteria
- 🤖 **Scrapes** company websites to extract information
- 🧠 **Analyzes** leads using artificial intelligence
- 📊 **Scores** each lead from 0-100 based on quality
- ✉️ **Generates** personalized sales emails
- 📈 **Tracks** your lead pipeline

Think of it as a virtual sales assistant that works 24/7 to find your ideal customers.

---

## Getting Started

### Accessing the Platform

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You'll see the main dashboard with 5 sections:
   - 📊 **Dashboard** — Overview and analytics
   - 🔍 **Lead Discovery** — Find new leads
   - 📇 **Lead Database** — Browse all leads
   - 🤖 **AI Analysis** — View detailed insights
   - ⚙️ **Settings** — Configure API keys

---

## 📊 Dashboard Page

### What You See

The dashboard shows key metrics at a glance:

**Stats Cards:**
- **Total Leads** — How many businesses you've discovered
- **High Quality Leads** — Leads with scores above 70
- **Average Score** — Overall lead quality
- **Top Opportunities** — Most common business needs

**Charts:**
- **Industry Breakdown** — Pie chart showing leads by industry
- **Score Distribution** — Bar chart showing quality ranges

**Recent Leads Table:**
- Latest 5 discovered leads
- Click any lead to view full details

### How to Use

✅ Check dashboard daily to monitor your lead pipeline  
✅ Focus on "High Quality Leads" first  
✅ Use charts to identify which industries respond best  
✅ Click any lead to view full analysis

---

## 🔍 Lead Discovery Page

This is where the magic happens! Search for new business leads automatically.

### Step-by-Step Guide

**1. Fill in the Search Form**

Three required fields:

- **Industry** — Type of business to search for
  - Examples: Restaurants, Hotels, Dental Clinics, Law Firms, Real Estate, E-commerce

- **Location** — Geographic area
  - Examples: Mumbai India, New York USA, London UK, Tokyo Japan

- **Service** — What you're selling
  - Examples: AI chatbot automation, CRM software, Website redesign, Digital marketing

**Tips:**
- Click the example buttons below each field for quick ideas
- Be specific (e.g., "Italian Restaurants" instead of just "Food")
- Include city and country for better results

**2. Click "Discover Business Leads"**

The AI pipeline starts working:

```
✅ Searching the web for matching businesses...
✅ Scraping company websites...
✅ Running AI analysis on each lead...
✅ Scoring leads based on signals...
✅ Saving to database...
```

This takes **10-30 seconds** depending on how many leads you requested.

**3. Review Results**

You'll see a list of discovered leads with:
- Company name
- Website link
- Lead score (0-100)
- Opportunity summary
- Status badge

**4. Take Action**

- Click **"View Details"** to see full AI analysis
- Click **website link** to visit the company
- Leads are automatically saved to your database

### Example Searches

**Example 1: Restaurant Chatbot Sales**
- Industry: `Restaurants`
- Location: `Mumbai, India`
- Service: `AI chatbot for reservations`

**Example 2: Real Estate CRM**
- Industry: `Real Estate Agencies`
- Location: `Miami, Florida`
- Service: `CRM software for agents`

**Example 3: Hotel Management**
- Industry: `Hotels`
- Location: `Bali, Indonesia`
- Service: `Property management system`

---

## 📇 Lead Database Page

View, search, filter, and export all your discovered leads.

### Search and Filter

**Search Box:**
Type any keyword to search across:
- Company names
- Opportunities
- Industries

**Filters:**
- **Status Dropdown** — Filter by lead status:
  - New (just discovered)
  - Qualified (good fit)
  - Contacted (reached out)
  - Closed (won or lost)
  
- **Min Score** — Only show leads above a certain score
  - Example: Enter `70` to see only high-quality leads

**Sorting:**
Click column headers to sort:
- **Company** — Alphabetical order
- **Score** — Highest to lowest quality
- **Added** — Newest to oldest

### Lead Table Columns

| Column | Description |
|--------|-------------|
| **Company** | Business name |
| **Website** | Click to visit their site |
| **Score** | Quality rating (0-100) |
| **Opportunity** | One-line summary of why they're a good lead |
| **Status** | Current pipeline stage |
| **Added** | When this lead was discovered |
| **Actions** | View details or delete |

### Score Colors

- 🔥 **Red (76-100)** — Hot Lead — Contact immediately!
- ✅ **Green (60-75)** — Good Lead — High potential
- 🟡 **Yellow (40-59)** — Warm Lead — Moderate fit
- ❄️ **Gray (0-39)** — Cold Lead — Low priority

### Export Options

Download your leads in different formats:

**CSV (Excel Compatible)**
```
Click: [CSV] button
Opens in: Excel, Google Sheets, Numbers
Best for: Importing to your CRM
```

**Excel (.xlsx)**
```
Click: [Excel] button
Opens in: Microsoft Excel
Best for: Formatted spreadsheets
```

**JSON (Developer Format)**
```
Click: [JSON] button
Opens in: Text editor, code
Best for: Custom integrations
```

All exports include:
- Full contact information
- AI analysis
- Lead scores
- Technology signals
- Timestamps

---

## 🤖 AI Analysis Page

View detailed artificial intelligence insights for any lead.

### What You'll See

**Company Overview:**
- Company name and website
- Industry and location
- Overall lead score

**Contact Information:**
- Email addresses (if found)
- Phone numbers (if found)
- Social media links

**Technology Signals:**
Detected on their website:
- ✅ What tools they're already using
  - "WordPress Website"
  - "Shopify E-commerce"
  - "Google Analytics"
- ❌ What they're missing (opportunities!)
  - "No live chat detected"
  - "No CRM detected"
  - "No booking system"

**AI Opportunity Analysis:**
Gemini AI explains:
- **Why** this company needs your product
- **What** specific pain points exist
- **How** they could benefit
- **Recommended** next steps

**Lead Score Breakdown:**
Shows how the score was calculated:
- Base score: 50 points
- Missing automation: +15
- Has contact info: +10
- AI fit boost: +20
- Final score: 95 🔥

### Generate Sales Email

1. Click **"Generate Outreach Email"** button
2. AI writes a personalized email automatically
3. References specific pain points
4. Includes soft call-to-action
5. Copy and send via your email client

**Example Generated Email:**

```
Subject: Quick idea for Urban Bistro — Automated reservation system

Hi Urban Bistro team,

I came across your restaurant and noticed an opportunity worth sharing.

You receive high reservation volume but currently rely on manual phone 
bookings. This creates bottlenecks during peak hours and leads to missed 
opportunities when staff are busy.

At TechSolutions, we've built an AI chatbot specifically for restaurants 
that handles reservations 24/7 — no staff required. Our clients see 60% 
reduction in phone volume and 3x faster bookings.

Would you be open to a quick 15-minute call this week?

Best regards,
Sarah Chen
TechSolutions Inc
```

---

## ⚙️ Settings Page

Configure your API keys and preferences.

### API Keys Section

**Gemini API Key (AI Analysis)**
- Used for: AI analysis and email generation
- Get free key at: https://aistudio.google.com
- How to add:
  1. Sign in with Google account
  2. Click "Get API Key"
  3. Copy key (starts with `AIza...`)
  4. Paste in backend `.env` file

**Serper.dev API Key (Search)**
- Used for: Web search to find businesses
- Get free key at: https://serper.dev
- Free tier: 2,500 searches per month
- How to add:
  1. Sign up with email
  2. Go to dashboard
  3. Copy API key
  4. Paste in backend `.env` file

### Email Settings

**Your Information:**
- **Sender Name** — Your name (appears in generated emails)
- **Sender Company** — Your company name
- **Product Description** — Brief description of what you sell

These personalize AI-generated emails.

### Dark/Light Mode

Click the moon/sun icon in the top bar to toggle themes.

---

## 💡 Tips and Best Practices

### Effective Lead Discovery

✅ **Be Specific**
- Instead of "Restaurants" → "Italian Restaurants in downtown"
- Instead of "Software" → "CRM software for real estate agents"

✅ **Use Local Searches**
- Include city names: "Mumbai", "New York", "London"
- Add country if ambiguous: "Milan, Italy" vs "Milan, Michigan"

✅ **Start Small**
- Discover 5-10 leads first to test quality
- Adjust your search terms based on results
- Scale up once you find good patterns

### Lead Qualification

**High-Quality Indicators:**
- ✅ Score above 70
- ✅ Contact email found
- ✅ Missing key automation tools
- ✅ Active on social media
- ✅ Professional website

**Red Flags:**
- ❌ Score below 40
- ❌ Already using competitor tools
- ❌ No contact information
- ❌ Outdated or broken website

### Pipeline Management

**Recommended Workflow:**

1. **Discovery** — Find 10-20 new leads daily
2. **Review** — Check scores and opportunities
3. **Qualify** — Mark promising leads as "Qualified"
4. **Reach Out** — Generate and send emails
5. **Track** — Update status as you contact them
6. **Follow Up** — Export weekly reports

**Status Definitions:**
- **New** — Just discovered, not reviewed yet
- **Qualified** — Reviewed and looks promising
- **Contacted** — Outreach email sent
- **Closed** — Deal won or lost

### Email Best Practices

**When Generating Emails:**
- ✅ Review and customize before sending
- ✅ Add specific details about their business
- ✅ Include your actual contact information
- ✅ Keep it short (3-4 paragraphs max)
- ✅ Have a clear next step (call booking link)

**Avoid:**
- ❌ Sending generic AI emails without edits
- ❌ Being too salesy or aggressive
- ❌ Mentioning competitors by name
- ❌ Making unrealistic promises

---

## 📊 Understanding Lead Scores

### Scoring System (0-100)

**Excellent (76-100) 🔥**
- Multiple automation gaps
- Has contact information
- AI detected perfect fit
- Professional web presence
- Action: Contact immediately!

**Good (60-75) ✅**
- Some missing tools
- Partial contact info
- Good business fit
- Active online presence
- Action: Prioritize this week

**Fair (40-59) 🟡**
- Few opportunities
- Limited contact info
- Moderate fit
- Basic website
- Action: Follow up if time permits

**Poor (0-39) ❄️**
- Already has competitor tools
- No clear opportunity
- Difficult to contact
- Low business fit
- Action: Skip or revisit later

### What Affects Scores

**Positive Signals (+points):**
- Missing live chat (+5)
- Missing CRM (+5)
- Missing booking system (+5)
- Has email address (+10)
- Has phone number (+3)
- Active social media (+5)
- AI-detected high fit (+30 max)

**Negative Signals (-points):**
- Using competitor tools (-10)
- Poor website quality (-5)
- AI-detected low fit (-5)

---

## 🔧 Troubleshooting

### "No results found"

**Possible causes:**
- Search terms too specific
- Location has no matching businesses
- API keys not configured (using mock data)

**Solutions:**
- Try broader search terms
- Check spelling of location
- Verify API keys in Settings

### "Discovery taking too long"

**Normal timing:**
- 5 leads: 10-20 seconds
- 10 leads: 20-40 seconds
- 20 leads: 40-80 seconds

**If slower:**
- Could be slow websites (some take 10s+ to load)
- Playwright scraping JavaScript-heavy sites
- Network connection issues

### "Scores seem inaccurate"

**Remember:**
- Scoring is automated and learns from signals
- Review AI explanation for reasoning
- Adjust weights in backend if needed
- Focus on explanations, not just numbers

### "Export not working"

**Check:**
- Pop-up blocker enabled?
- Browser download settings?
- Sufficient disk space?

**Try:**
- Right-click export button → Save Link As
- Try different format (CSV vs Excel)
- Check browser console for errors

---

## 🚀 Advanced Features

### Bulk Operations

**Export Filtered Leads:**
1. Apply filters (industry, score, etc.)
2. Click export button
3. Only filtered leads are exported

**Delete Multiple Leads:**
- Currently: Delete one at a time
- Future: Bulk selection and deletion

### Search Operators

**Partial Matching:**
- Searches are case-insensitive
- "hotel" finds "Hotels", "HOTEL", "Boutique Hotel"

**Multiple Keywords:**
- "restaurant bar" finds either term
- Combine filters for precise results

### Pipeline Views

**Create Custom Views:**
1. Apply filters for specific criteria
2. Bookmark the URL
3. Return to that exact view anytime

**Example URLs:**
```
High-quality restaurants:
/leads?industry=Restaurants&min_score=70

Recently contacted:
/leads?status=contacted&sort_by=updated_at

Cold leads to revisit:
/leads?max_score=40&sort_by=score
```

---

## 📈 Metrics and Reporting

### Key Metrics to Track

**Volume Metrics:**
- Total leads discovered
- Leads per week/month
- Discovery rate (leads per search)

**Quality Metrics:**
- Average lead score
- % high-quality leads (>70)
- Contact info found rate

**Conversion Metrics:**
- Contacted rate
- Response rate
- Closed deal rate

### Creating Reports

**Weekly Report:**
1. Go to Lead Database
2. Filter by date range (last 7 days)
3. Export to Excel
4. Share with team

**Industry Analysis:**
1. Check Dashboard's industry breakdown
2. Note which industries have highest scores
3. Focus future discovery on best performers

---

## 🎯 Use Cases

### Sales Development Representatives (SDRs)

- Discover 50-100 leads weekly
- Qualify leads by score
- Generate personalized emails at scale
- Track outreach in Lead Database

### Business Development Managers

- Identify market opportunities
- Analyze competitor gaps
- Export leads for team assignment
- Monitor pipeline metrics

### Marketing Teams

- Build targeted prospect lists
- Understand industry pain points
- Create personalized campaigns
- Measure lead generation ROI

### Freelancers & Consultants

- Find clients needing your services
- Research companies before outreach
- Generate professional proposals
- Manage client pipeline

---

## ❓ FAQ

**Q: Do I need programming knowledge?**  
A: No! The interface is designed for non-technical users.

**Q: How accurate is the AI analysis?**  
A: Very accurate for obvious signals (missing tools, contact info). AI insights are suggestions — always verify manually.

**Q: Can I edit lead information?**  
A: Currently view-only. Future updates will add editing.

**Q: Is my data private?**  
A: Yes. All data is stored locally on your computer. No external sharing.

**Q: Can I integrate with my CRM?**  
A: Export to CSV/Excel and import to any CRM (Salesforce, HubSpot, etc.)

**Q: How often should I discover new leads?**  
A: Depends on your sales capacity. Start with 10-20 per week and scale up.

**Q: What if a lead's website is down?**  
A: The scraper will timeout and skip that lead. You'll see an error in backend logs.

**Q: Can I search multiple locations at once?**  
A: Not yet. Run separate searches for each location.

**Q: Do I need both API keys?**  
A: No! The system works with mock data for demos. API keys enable real discovery.

---

## 📚 Glossary

**Lead** — A potential business customer identified by the system

**Scraping** — Automated extraction of data from websites

**AI Analysis** — Artificial intelligence evaluation of lead quality

**Lead Score** — 0-100 rating indicating quality and fit

**Opportunity** — Business need or pain point identified

**Tech Signals** — Technologies detected on website (or missing)

**Pipeline** — Your sales workflow from discovery to close

**Status** — Current stage of lead (new, qualified, contacted, closed)

---

## 🎓 Learning Resources

**Getting Started (5 min):**
1. Watch discovery demo on Dashboard
2. Try one practice search
3. Review generated AI analysis
4. Export a sample CSV

**Intermediate (30 min):**
1. Configure real API keys
2. Run 3-5 discovery searches
3. Generate outreach emails
4. Set up your pipeline workflow

**Advanced (1 hour):**
1. Analyze score distribution patterns
2. Optimize search queries for your industry
3. Build custom reporting workflow
4. Integrate exports with your CRM

---

## 📞 Support

**Found a bug?**  
Check the terminal/console for error messages and report via GitHub issues.

**Need help?**  
Consult the SETUP_GUIDE.md and API_DOCUMENTATION.md files.

**Feature requests?**  
Submit suggestions via GitHub discussions.

---

**Happy lead hunting! 🎯**

---

*Last Updated: March 2026*  
*Version: 1.0.0*

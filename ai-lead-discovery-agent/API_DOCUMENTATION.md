# API Documentation — AI Lead Discovery Agent

Complete REST API reference for the FastAPI backend.

**Base URL:** `http://localhost:8000`  
**Interactive Docs:** http://localhost:8000/docs  
**OpenAPI Schema:** http://localhost:8000/openapi.json

---

## Authentication

Currently no authentication required (add JWT/OAuth for production).

---

## Lead Discovery

### POST /discover

**Description:** Run the complete lead discovery pipeline — search, scrape, analyze, score, and save leads.

**Request Body:**
```json
{
  "industry": "Restaurants",
  "location": "Mumbai, India",
  "service": "AI chatbot automation",
  "max_results": 10
}
```

**Parameters:**
- `industry` (string, required) — Industry or business type to search for
- `location` (string, required) — Geographic location
- `service` (string, required) — Product/service you're selling
- `max_results` (integer, optional) — Number of results to discover (default: 10, max: 20)

**Response 200:**
```json
{
  "message": "Discovery complete. Found 8 leads.",
  "leads_discovered": 8,
  "leads": [
    {
      "id": 15,
      "company_name": "Spice Garden Restaurant",
      "website": "https://spicegarden.example.com",
      "contact_info": {
        "emails": ["info@spicegarden.com", "reservations@spicegarden.com"],
        "phones": ["+91-22-1234-5678"],
        "social": {
          "facebook": "https://facebook.com/spicegarden",
          "instagram": "https://instagram.com/spicegarden_mumbai"
        }
      },
      "description": "Award-winning Indian cuisine with modern ambiance and catering services.",
      "tech_signals": [
        "WordPress Website",
        "Facebook Pixel",
        "Google Analytics",
        "No live chat detected",
        "No CRM detected",
        "No booking/reservation system"
      ],
      "industry": "Restaurants",
      "location": "Mumbai, India",
      "service_query": "AI chatbot automation",
      "score": 78.5,
      "opportunity": "AI chatbot for reservation management and customer support",
      "ai_explanation": "This restaurant lacks automated customer support and online booking. High volume of customer inquiries suggests strong ROI potential for chatbot integration. Manual phone bookings create bottlenecks.",
      "outreach_email": "",
      "status": "new",
      "created_at": "2026-01-15T10:30:00",
      "updated_at": "2026-01-15T10:30:00"
    }
  ]
}
```

**Response 422:** Validation error (missing required fields)

**Example:**
```bash
curl -X POST "http://localhost:8000/discover" \
  -H "Content-Type: application/json" \
  -d '{
    "industry": "Hotels",
    "location": "New York",
    "service": "Guest management CRM",
    "max_results": 5
  }'
```

---

## Leads Management

### GET /leads

**Description:** Get all leads with filtering, sorting, and pagination.

**Query Parameters:**
- `search` (string, optional) — Search in company name, opportunity, or industry
- `industry` (string, optional) — Filter by industry
- `status` (string, optional) — Filter by status: `new`, `qualified`, `contacted`, `closed`
- `min_score` (float, optional) — Minimum lead score (0-100)
- `max_score` (float, optional) — Maximum lead score (0-100)
- `sort_by` (string, optional) — Sort field: `score`, `company_name`, `created_at` (default: `score`)
- `sort_order` (string, optional) — Sort direction: `asc`, `desc` (default: `desc`)
- `skip` (integer, optional) — Number of records to skip for pagination (default: 0)
- `limit` (integer, optional) — Number of records to return (default: 50, max: 200)

**Response 200:**
```json
[
  {
    "id": 1,
    "company_name": "Urban Bistro",
    "website": "https://urbanbistro.com",
    "score": 85.0,
    "opportunity": "CRM for customer retention",
    "status": "new",
    ...
  }
]
```

**Example:**
```bash
# Get high-quality leads from Restaurant industry
curl "http://localhost:8000/leads?industry=Restaurants&min_score=70&sort_by=score&sort_order=desc"

# Search for specific companies
curl "http://localhost:8000/leads?search=bistro"

# Get contacted leads only
curl "http://localhost:8000/leads?status=contacted"
```

---

### GET /leads/{lead_id}

**Description:** Get a single lead by ID.

**Path Parameters:**
- `lead_id` (integer, required) — Lead ID

**Response 200:**
```json
{
  "id": 1,
  "company_name": "Urban Bistro",
  "website": "https://urbanbistro.com",
  ...
}
```

**Response 404:** Lead not found

**Example:**
```bash
curl "http://localhost:8000/leads/15"
```

---

### PATCH /leads/{lead_id}/status

**Description:** Update lead status.

**Path Parameters:**
- `lead_id` (integer, required) — Lead ID

**Query Parameters:**
- `status` (string, required) — New status: `new`, `qualified`, `contacted`, `closed`

**Response 200:**
```json
{
  "id": 15,
  "status": "contacted",
  ...
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:8000/leads/15/status?status=qualified"
```

---

### DELETE /leads/{lead_id}

**Description:** Delete a lead permanently.

**Path Parameters:**
- `lead_id` (integer, required) — Lead ID

**Response 204:** Successfully deleted

**Response 404:** Lead not found

**Example:**
```bash
curl -X DELETE "http://localhost:8000/leads/15"
```

---

## Analytics

### GET /leads/analytics

**Description:** Get dashboard analytics and aggregate statistics.

**Response 200:**
```json
{
  "total_leads": 45,
  "high_quality_leads": 18,
  "avg_score": 67.3,
  "industry_breakdown": {
    "Restaurants": 15,
    "Hotels": 10,
    "Retail": 8,
    "Healthcare": 7,
    "Real Estate": 5
  },
  "score_distribution": {
    "0-25": 3,
    "26-50": 12,
    "51-75": 20,
    "76-100": 10
  },
  "top_opportunities": [
    "AI chatbot for customer support",
    "CRM for lead management",
    "Automated booking system",
    "Email marketing automation",
    "Customer feedback tools"
  ]
}
```

**Example:**
```bash
curl "http://localhost:8000/leads/analytics"
```

---

## Email Generation

### POST /email/generate

**Description:** Generate a personalized B2B sales outreach email using AI.

**Request Body:**
```json
{
  "lead_id": 15,
  "sender_name": "Sarah Chen",
  "sender_company": "AutomateAI Solutions",
  "product_description": "AI-powered chatbot that handles reservations, customer inquiries, and support 24/7"
}
```

**Parameters:**
- `lead_id` (integer, required) — ID of the lead to generate email for
- `sender_name` (string, optional) — Your name (default: "Alex")
- `sender_company` (string, optional) — Your company name (default: "Your Company")
- `product_description` (string, optional) — Description of your product/service

**Response 200:**
```json
{
  "lead_id": 15,
  "subject": "Quick idea for Spice Garden — Automated reservation system",
  "body": "Hi Spice Garden team,\n\nI came across your restaurant online and noticed an opportunity that could significantly streamline your operations.\n\nYour business receives high reservation volume, but currently relies on manual phone bookings. Based on similar restaurants we've worked with, this creates unnecessary bottlenecks during peak hours and leads to missed opportunities when staff are busy.\n\nAt AutomateAI Solutions, we've built an AI-powered chatbot specifically for restaurants that handles reservations, menu inquiries, and customer support 24/7 — no staff required. Our clients see 60% reduction in phone call volume and 3x faster booking times.\n\nWould you be open to a quick 15-minute call this week? I can show you how it works with a live demo tailored to Spice Garden.\n\nBest regards,\nSarah Chen\nAutomateAI Solutions"
}
```

**Response 404:** Lead not found

**Example:**
```bash
curl -X POST "http://localhost:8000/email/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": 15,
    "sender_name": "John Doe",
    "sender_company": "TechSolutions Inc",
    "product_description": "Cloud-based CRM platform"
  }'
```

---

## Export

### GET /export/csv

**Description:** Export all leads as a CSV file.

**Query Parameters:**
- `industry` (string, optional) — Filter by industry before export

**Response 200:**
- Content-Type: `text/csv`
- Headers: `Content-Disposition: attachment; filename=leads.csv`

**Example:**
```bash
# Download all leads
curl "http://localhost:8000/export/csv" -o leads.csv

# Download only Restaurant leads
curl "http://localhost:8000/export/csv?industry=Restaurants" -o restaurant_leads.csv
```

---

### GET /export/excel

**Description:** Export all leads as an Excel (.xlsx) file.

**Query Parameters:**
- `industry` (string, optional) — Filter by industry before export

**Response 200:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Headers: `Content-Disposition: attachment; filename=leads.xlsx`

**Example:**
```bash
curl "http://localhost:8000/export/excel" -o leads.xlsx
```

---

### GET /export/json

**Description:** Export all leads as a JSON file.

**Query Parameters:**
- `industry` (string, optional) — Filter by industry before export

**Response 200:**
```json
[
  {
    "id": 1,
    "company_name": "Urban Bistro",
    ...
  }
]
```

**Example:**
```bash
curl "http://localhost:8000/export/json" -o leads.json
```

---

## Health Check

### GET /

**Description:** API health check endpoint.

**Response 200:**
```json
{
  "status": "ok",
  "message": "AI Lead Discovery Agent API is running 🚀"
}
```

**Example:**
```bash
curl "http://localhost:8000/"
```

---

## Error Responses

All endpoints return standardized error responses:

**400 Bad Request:**
```json
{
  "detail": "Invalid request parameters"
}
```

**404 Not Found:**
```json
{
  "detail": "Lead not found"
}
```

**422 Unprocessable Entity:**
```json
{
  "detail": [
    {
      "loc": ["body", "industry"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limits

No rate limits currently enforced (add Redis/token bucket for production).

**Recommended for Production:**
- Discovery endpoint: 10 requests/hour
- Email generation: 50 requests/day
- Other endpoints: 100 requests/minute

---

## Webhooks (Future)

Planned webhook support for:
- New lead discovered
- Lead status changed
- High-quality lead found (score > 80)

---

## Data Models

### Lead Object

```typescript
{
  id: number;                          // Auto-incrementing primary key
  company_name: string;                // Business name
  website: string;                     // Company website URL (unique)
  contact_info: {                      // Extracted contact information
    emails: string[];
    phones: string[];
    social: Record<string, string>;    // Facebook, Instagram, LinkedIn, etc.
  };
  description: string;                 // Company description/tagline
  tech_signals: string[];              // Detected technologies and gaps
  industry: string;                    // Business industry/vertical
  location: string;                    // Geographic location
  service_query: string;               // Service/product being pitched
  score: number;                       // Lead quality score (0-100)
  opportunity: string;                 // One-line opportunity summary
  ai_explanation: string;              // Full AI analysis
  outreach_email: string;              // Generated email template
  status: 'new' | 'qualified' | 'contacted' | 'closed';
  created_at: string;                  // ISO 8601 timestamp
  updated_at: string;                  // ISO 8601 timestamp
}
```

### Analytics Object

```typescript
{
  total_leads: number;
  high_quality_leads: number;          // Score >= 70
  avg_score: number;
  industry_breakdown: Record<string, number>;
  score_distribution: Record<string, number>;
  top_opportunities: string[];
}
```

---

## Interactive API Testing

Visit http://localhost:8000/docs for interactive Swagger UI where you can:
- Test all endpoints
- See request/response schemas
- Generate code examples
- Authenticate (when implemented)

---

## SDK Examples

### Python

```python
import requests

# Discover leads
response = requests.post('http://localhost:8000/discover', json={
    'industry': 'Hotels',
    'location': 'Tokyo',
    'service': 'Cloud PMS',
    'max_results': 5
})
leads = response.json()['leads']

# Get analytics
analytics = requests.get('http://localhost:8000/leads/analytics').json()
print(f"Total leads: {analytics['total_leads']}")

# Generate email
email = requests.post('http://localhost:8000/email/generate', json={
    'lead_id': 1,
    'sender_name': 'Alice',
    'sender_company': 'HotelTech'
}).json()
print(email['subject'])
```

### JavaScript/TypeScript

```typescript
// Using fetch
const response = await fetch('http://localhost:8000/discover', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    industry: 'Hotels',
    location: 'Tokyo',
    service: 'Cloud PMS',
    max_results: 5
  })
});
const { leads } = await response.json();

// Get leads with filtering
const filtered = await fetch(
  'http://localhost:8000/leads?min_score=70&sort_by=score'
).then(r => r.json());
```

---

## Support

- 📖 **Full Documentation:** http://localhost:8000/docs
- 🔧 **Issues:** Report bugs via GitHub issues
- 💬 **Questions:** Open a discussion

---

**Last Updated:** March 2026  
**API Version:** 1.0.0

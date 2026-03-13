"""
Seed sample lead data for development and demo purposes.
Only seeds if the database is empty.
"""

from datetime import datetime, timedelta
from database import SessionLocal
from models import Lead


SAMPLE_LEADS = [
    {
        "company_name": "FreshBites Restaurant",
        "website": "https://freshbites-demo.com",
        "contact_info": {"emails": ["contact@freshbites.com"], "phones": ["+91 98765 43210"], "social": {"instagram": "https://instagram.com/freshbites"}},
        "description": "Popular restaurant chain with 5 locations. Offers dine-in, takeaway, and online ordering via a basic website.",
        "tech_signals": ["WordPress Website", "Stripe Payments", "No live chat detected", "No CRM detected"],
        "industry": "Restaurants",
        "location": "Mumbai, India",
        "service_query": "AI chatbot automation",
        "score": 92.0,
        "opportunity": "AI customer support chatbot — no chat system detected",
        "ai_explanation": "FreshBites has active online ordering but zero automation in customer support. Customers likely call or message manually for reservations and queries. An AI chatbot could handle 80% of queries instantly, reducing staff load and improving customer experience significantly.",
        "outreach_email": "",
        "status": "new",
    },
    {
        "company_name": "Urban Dine",
        "website": "https://urbandine-demo.com",
        "contact_info": {"emails": ["hello@urbandine.com"], "phones": [], "social": {"instagram": "https://instagram.com/urbandine", "facebook": "https://facebook.com/urbandine"}},
        "description": "Contemporary dining experience with a seasonal menu. Growing chain with recent franchise announcements.",
        "tech_signals": ["Squarespace Website", "No live chat detected", "No CRM detected", "No booking/reservation system"],
        "industry": "Restaurants",
        "location": "Delhi, India",
        "service_query": "AI chatbot automation",
        "score": 85.0,
        "opportunity": "Automated reservation system + AI chat support",
        "ai_explanation": "Urban Dine is expanding rapidly with no booking automation. They rely on phone calls for reservations, which creates friction and misses after-hours opportunities. An automated reservation + chatbot system would directly support their franchise growth.",
        "outreach_email": "",
        "status": "qualified",
    },
    {
        "company_name": "SpiceGarden",
        "website": "https://spicegarden-demo.com",
        "contact_info": {"emails": ["info@spicegarden.in", "catering@spicegarden.in"], "phones": ["+91 80 1234 5678"], "social": {}},
        "description": "Award-winning multicuisine restaurant with events and catering. Has a loyalty program but no digital automation.",
        "tech_signals": ["WordPress Website", "No live chat detected", "No CRM detected"],
        "industry": "Restaurants",
        "location": "Bangalore, India",
        "service_query": "AI chatbot automation",
        "score": 78.0,
        "opportunity": "AI loyalty program assistant + catering inquiry bot",
        "ai_explanation": "SpiceGarden has a loyalty program and catering service that generates complex customer inquiries. Currently all handled manually. An AI assistant could qualify catering leads, answer loyalty queries, and reduce the team's workload by 50%.",
        "outreach_email": "",
        "status": "new",
    },
    {
        "company_name": "The Burger House",
        "website": "https://burgerhouse-demo.com",
        "contact_info": {"emails": ["support@burgerhouse.com"], "phones": ["+91 22 9876 5432"], "social": {"instagram": "https://instagram.com/burgerhouse"}},
        "description": "Fast food chain with 15 locations and delivery via their own app. Growing presence with active social media.",
        "tech_signals": ["Custom Web App", "Stripe Payments", "Google Analytics", "No CRM detected", "No live chat detected"],
        "industry": "Restaurants",
        "location": "Mumbai, India",
        "service_query": "AI chatbot automation",
        "score": 71.0,
        "opportunity": "AI-powered delivery support chatbot",
        "ai_explanation": "Burger House has a custom ordering app but no in-app support. Delivery complaints and order issues are handled via phone which scales poorly. An AI support chatbot integrated into their app could resolve 70% of issues automatically.",
        "outreach_email": "",
        "status": "contacted",
    },
    {
        "company_name": "Bella Italia",
        "website": "https://bellaitalia-demo.com",
        "contact_info": {"emails": ["reservations@bellaitalia.com"], "phones": ["+91 44 2345 6789"], "social": {"facebook": "https://facebook.com/bellaitalia"}},
        "description": "Authentic Italian dining with 3 branches in Chennai. Known for weekend dining events.",
        "tech_signals": ["WordPress Website", "No live chat detected", "No booking/reservation system", "No CRM detected"],
        "industry": "Restaurants",
        "location": "Chennai, India",
        "service_query": "AI chatbot automation",
        "score": 88.0,
        "opportunity": "Event booking automation + AI reservation assistant",
        "ai_explanation": "Bella Italia runs popular dining events with no online booking system — reservations are taken via phone or email manually. An AI booking assistant with event management would eliminate this bottleneck and grow their event revenue significantly.",
        "outreach_email": "",
        "status": "new",
    },
    {
        "company_name": "DragonWok Express",
        "website": "https://dragonwok-demo.com",
        "contact_info": {"emails": [], "phones": ["+91 80 5555 1234"], "social": {}},
        "description": "Quick service Chinese cuisine with 8 outlets and delivery. Website lacks contact information.",
        "tech_signals": ["Wix Website", "No live chat detected", "No CRM detected"],
        "industry": "Restaurants",
        "location": "Hyderabad, India",
        "service_query": "AI chatbot automation",
        "score": 65.0,
        "opportunity": "Customer support chatbot for delivery tracking",
        "ai_explanation": "DragonWok Express has a high volume of delivery orders but no digital customer support. Their Wix website is basic and contact info is hard to find. A chatbot to handle order tracking and complaints would significantly improve customer experience.",
        "outreach_email": "",
        "status": "new",
    },
    {
        "company_name": "GreenLeaf Cafe",
        "website": "https://greenleaf-demo.com",
        "contact_info": {"emails": ["hello@greenleaf.cafe"], "phones": ["+91 98000 12345"], "social": {"instagram": "https://instagram.com/greenleaf.cafe", "linkedin": "https://linkedin.com/company/greenleaf"}},
        "description": "Health-focused cafe chain with corporate catering. Active LinkedIn presence suggests B2B opportunities.",
        "tech_signals": ["Shopify E-commerce", "Mailchimp Email", "Google Analytics", "No live chat detected"],
        "industry": "Restaurants",
        "location": "Pune, India",
        "service_query": "AI chatbot automation",
        "score": 74.0,
        "opportunity": "Corporate catering lead qualification bot",
        "ai_explanation": "GreenLeaf has corporate catering services and uses Mailchimp for marketing. They are missing an AI qualifier for their B2B catering leads. A chatbot to qualify corporate accounts and schedule tastings would accelerate their B2B growth.",
        "outreach_email": "",
        "status": "new",
    },
    {
        "company_name": "Saffron Palace",
        "website": "https://saffronpalace-demo.com",
        "contact_info": {"emails": ["banquet@saffronpalace.com", "info@saffronpalace.com"], "phones": ["+91 11 4567 8901"], "social": {"facebook": "https://facebook.com/saffronpalace"}},
        "description": "Fine dining restaurant with banquet hall capacity for 500 guests. Major wedding and corporate events venue.",
        "tech_signals": ["WordPress Website", "No live chat detected", "No booking/reservation system", "No CRM detected"],
        "industry": "Restaurants",
        "location": "New Delhi, India",
        "service_query": "AI chatbot automation",
        "score": 90.0,
        "opportunity": "AI event inquiry bot + automated banquet booking",
        "ai_explanation": "Saffron Palace handles high-value banquet bookings manually via email and phone. This creates slow response times for wedding and corporate clients. An AI event inquiry bot and automated booking system would dramatically increase conversion rates for their high-ticket banquet business.",
        "outreach_email": "",
        "status": "new",
    },
    {
        "company_name": "TacoFiesta",
        "website": "https://tacofiesta-demo.com",
        "contact_info": {"emails": ["hello@tacofiesta.in"], "phones": [], "social": {"instagram": "https://instagram.com/tacofiesta"}},
        "description": "Fast-growing Mexican street food chain. Recently opened 3 new outlets and hiring aggressively.",
        "tech_signals": ["Squarespace Website", "No live chat detected", "No CRM detected"],
        "industry": "Restaurants",
        "location": "Goa, India",
        "service_query": "AI chatbot automation",
        "score": 80.0,
        "opportunity": "Growth-stage automation — chatbot + order management",
        "ai_explanation": "TacoFiesta is in rapid growth mode with 3 new outlets opened recently and active hiring. This is the perfect moment to implement automation before scaling complexity becomes unmanageable. An AI system now would grow with them.",
        "outreach_email": "",
        "status": "qualified",
    },
    {
        "company_name": "SeaBreeze Seafood",
        "website": "https://seabreeze-demo.com",
        "contact_info": {"emails": ["dine@seabreezeseafood.com"], "phones": ["+91 484 123 4567"], "social": {"instagram": "https://instagram.com/seabreezeseafood", "facebook": "https://facebook.com/seabreeze"}},
        "description": "Premium coastal seafood restaurant. Only accepts advance reservations. Strong TripAdvisor presence.",
        "tech_signals": ["WordPress Website", "No live chat detected", "No booking/reservation system"],
        "industry": "Restaurants",
        "location": "Kochi, India",
        "service_query": "AI chatbot automation",
        "score": 82.0,
        "opportunity": "Automated advance reservation bot + waitlist management",
        "ai_explanation": "SeaBreeze only accepts advance reservations but manages them via phone. With high demand (strong TripAdvisor reviews), missed calls mean missed revenue. An automated reservation bot with waitlist management would capture every booking opportunity.",
        "outreach_email": "",
        "status": "new",
    },
]


def seed_sample_leads():
    """Database ready - no sample data. Use Discovery page to find REAL businesses!"""
    print("\n" + "="*70)
    print("✅ DATABASE READY - NO DEMO DATA")
    print("="*70)
    print("🔍 Go to: http://localhost:3000/discovery")
    print("🚀 Start discovering REAL businesses now!")
    print("="*70 + "\n")
    # NO SAMPLE DATA - DISABLED COMPLETELY
    return

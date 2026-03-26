// ============================================================
//  CustBuds — Prospecting Agent Backend
//  server.js
//
//  Data-flow:
//    1. Frontend CreateCompanyModal submits { companyName, city, companySize, type }
//       via POST /api/agent/prospect
//    2. We look up the company in mockPublicData to simulate enrichment
//       (replaces a real scraping / Apollo / Clearbit call)
//    3. We pass BOTH the user input AND the enriched data to the LLM
//    4. The LLM returns strict JSON: { fitScore, scoreReasoning, email1, email2 }
//    5. We forward that JSON straight back to the client
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: "*" })); // allow the CRA dev server on :3000
app.use(express.json());

// ── OpenAI client (reads OPENAI_API_KEY from .env) ────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ============================================================
//  SIMULATED DATA SOURCE
//  In production this would be replaced by:
//    - A real-time web scraper (Puppeteer/Playwright)
//    - Apollo.io / Clearbit enrichment API
//    - A PostgreSQL / MongoDB companies collection
//
//  Keys are lower-cased company name fragments for fuzzy matching.
// ============================================================
const mockPublicData = {
  // ───── Profile 1 ─────────────────────────────────────────
  zomato: {
    recent_news: "Raised $300M Series J; expanding into quick-commerce grocery in 15 new cities.",
    tech_stack: ["React", "Go", "Kafka", "PostgreSQL", "AWS"],
    key_contact: { name: "Rahul Mehta", title: "VP Engineering" },
    pain_points: [
      "Scaling B2B restaurant-partner onboarding",
      "Real-time logistics tracking at scale",
      "Sales rep productivity for enterprise accounts",
    ],
    industry: "FoodTech / Delivery",
    headcount_range: "5,000–10,000",
  },

  // ───── Profile 2 ─────────────────────────────────────────
  razorpay: {
    recent_news: "Launched Razorpay X for neobanking; onboarded 500+ enterprise clients in Q1.",
    tech_stack: ["Next.js", "Node.js", "MySQL", "Redis", "GCP"],
    key_contact: { name: "Priya Sharma", title: "Head of Growth" },
    pain_points: [
      "Enterprise sales cycle visibility",
      "Cross-sell automation across product lines",
      "Churn prediction for SMB customers",
    ],
    industry: "FinTech / Payments",
    headcount_range: "2,000–5,000",
  },

  // ───── Profile 3 ─────────────────────────────────────────
  swiggy: {
    recent_news: "IPO filed; expanding Instamart to 50 cities and hiring aggressively in tech.",
    tech_stack: ["Kotlin", "Python", "Spark", "Cassandra", "Azure"],
    key_contact: { name: "Arjun Nair", title: "CTO" },
    pain_points: [
      "Pipeline management for enterprise restaurant chains",
      "Revenue retention for high-value merchants",
      "Automated competitive pricing intelligence",
    ],
    industry: "FoodTech / Delivery",
    headcount_range: "10,000+",
  },

  // ───── Profile 4 ─────────────────────────────────────────
  freshworks: {
    recent_news: "Acquired a conversational AI startup; pushing AI-native CRM suite.",
    tech_stack: ["Ruby on Rails", "React", "MySQL", "Redis", "AWS"],
    key_contact: { name: "Kavya Reddy", title: "Director of Sales" },
    pain_points: [
      "Competitive differentiation vs Salesforce / HubSpot",
      "Partner channel pipeline visibility",
      "Upsell sequencing for existing accounts",
    ],
    industry: "SaaS / CRM",
    headcount_range: "5,000–10,000",
  },

  // ───── Profile 5 ─────────────────────────────────────────
  khatabook: {
    recent_news: "Series D of $100M; building GST-integrated B2B payments for SMBs.",
    tech_stack: ["Flutter", "Node.js", "Firebase", "BigQuery"],
    key_contact: { name: "Siddharth Joshi", title: "Founder & CEO" },
    pain_points: [
      "Sales rep efficiency for high-volume SMB outreach",
      "Lead scoring at scale with limited data",
      "ARR retention improvement",
    ],
    industry: "FinTech / SaaS",
    headcount_range: "200–500",
  },

  // ───── Default fallback ───────────────────────────────────
  default: {
    recent_news: "Recently achieved a significant product milestone and is actively expanding.",
    tech_stack: ["React", "Node.js", "PostgreSQL"],
    key_contact: { name: "The Decision Maker", title: "VP of Sales" },
    pain_points: [
      "Manual prospecting taking up rep time",
      "No visibility into pipeline health",
      "High-effort follow-up sequences",
    ],
    industry: "Technology",
    headcount_range: "Unknown",
  },
};

/**
 * Fuzzy-match a companyName against the mockPublicData keys.
 * Returns the matched profile or the "default" profile.
 */
function lookupCompany(companyName) {
  const normalised = (companyName || "").toLowerCase().trim();
  const match = Object.keys(mockPublicData).find(
    (key) => key !== "default" && normalised.includes(key)
  );
  return mockPublicData[match || "default"];
}

// ============================================================
//  POST /api/agent/prospect
//  Body: { companyName, city, companySize, type }
// ============================================================
app.post("/api/agent/prospect", async (req, res) => {
  const { companyName, city, companySize, type } = req.body;

  if (!companyName) {
    return res.status(400).json({ error: "companyName is required." });
  }

  // ── Step 1: Enrich with mock data ─────────────────────────
  const enriched = lookupCompany(companyName);

  // ── Step 2: Build the LLM prompt ─────────────────────────
  const systemPrompt = `You are a world-class B2B Sales Prospecting Agent for CustBuds CRM.
You receive a prospect company profile and must:
1. Score its fit with CustBuds (AI-native CRM for high-growth Indian tech companies) from 0-100.
2. Write two personalised outreach emails referencing the company's ACTUAL recent news and pain points.

Always return ONLY valid JSON. No markdown, no prose outside the JSON object.

JSON schema:
{
  "fitScore": <integer 0-100>,
  "scoreReasoning": "<one concise sentence explaining the score>",
  "email1": "<short cold email, 3-4 sentences, subject line first on its own line starting with 'Subject: '>",
  "email2": "<follow-up email 5-7 days later, 2-3 sentences, subject line first on its own line starting with 'Subject: '>"
}`;

  const userPrompt = `Prospect company: ${companyName}
City: ${city || "Unknown"}
Company size: ${companySize || "Unknown"}
Type: ${type || "Unknown"}

--- Enriched Intelligence (from our data source) ---
Industry: ${enriched.industry}
Headcount range: ${enriched.headcount_range}
Recent news: ${enriched.recent_news}
Tech stack: ${enriched.tech_stack.join(", ")}
Key contact: ${enriched.key_contact.name} (${enriched.key_contact.title})
Known pain points:
${enriched.pain_points.map((p, i) => `  ${i + 1}. ${p}`).join("\n")}

Based on everything above, produce the JSON response now.`;

  // ── Step 3: Call the LLM ──────────────────────────────────
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fast & cheap; swap to gpt-4o for higher quality
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" }, // Guaranteed JSON output
      temperature: 0.7,
    });

    // ── Step 4: Parse & return ────────────────────────────
    const raw = completion.choices[0].message.content;
    const agentResult = JSON.parse(raw);

    // Attach the enriched profile so the frontend can display it too
    agentResult.enrichedProfile = enriched;

    console.log(`✅ Prospecting result for "${companyName}":`, agentResult);
    return res.json(agentResult);
  } catch (err) {
    console.error("❌ OpenAI error:", err.message);
    return res.status(500).json({
      error: "Agent failed to generate a result.",
      detail: err.message,
    });
  }
});

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Start server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 CustBuds Prospecting Agent running on http://localhost:${PORT}`);
});

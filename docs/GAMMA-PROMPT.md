# Gamma Deck Generation Prompt — Ooddle Portfolio Pitch

> Paste the prompt below into [Gamma](https://gamma.app) → "Generate" → "Presentation" → choose 12–15 cards. Use a clean modern theme (e.g. "Daktilo", "Oasis", or "Atlas"). Aspect ratio: 16:9.

---

## ✦ The Prompt to Paste into Gamma

```
Create a 12-card pitch deck for "Ooddle" — an AI-powered personal wellness platform built as an AI portfolio project.

Tone: Confident, modern, founder-style. Like Stripe Press meets Notion. Use plenty of whitespace, large headlines, and minimal copy per slide. Include relevant icons and gradients (teal/emerald primary, with accent colors for the 5 wellness pillars: amber, emerald, blue, purple, rose). Use the Outfit and Inter font families if available.

DECK STRUCTURE — generate exactly these 12 slides:

1. **TITLE** — "Ooddle: Your Personal Health Operating System" with subtitle "AI-Powered. Multi-Agent. 5 Pillars. Built by Abhishek Ranjan." Add a small "Live at ooddle.vercel.app" link.

2. **THE PROBLEM** — Headline: "The wellness industry is fragmented." Three stat callouts: "5-8 apps used by the average adult", "64% report decision fatigue", "18-32% 30-day retention across category". Cite McKinsey Health Institute 2024.

3. **THE OPPORTUNITY** — Headline: "$1.8T wellness market. No integrated solution." Highlight that 76% of adults want one platform (Rock Health 2025).

4. **THE SOLUTION** — Headline: "Ooddle unifies wellness into 5 pillars + 5 daily actions + 1 AI coach." Show a diagram of the 5 pillars: 🔥 Metabolic, 💪 Movement, 🧠 Cognition, 🌙 Recovery, 💊 Supplements.

5. **HOW IT WORKS** — 4-step flow:
   1. Onboard (goals, fitness, diet, sleep pattern)
   2. Receive 5 personalized micro-actions per day
   3. Chat with Ooddle AI for guidance
   4. Track progress across all 5 pillars

6. **THE AI ARCHITECTURE** — Headline: "Multi-Agent Routing." Show a flow diagram: User Message → Intent Classifier → routes to one of 5 Pillar Sub-Agents (each with specialized system prompts) → Streaming Response. Highlight that this is the same pattern used by enterprise AI assistants.

7. **AI DIFFERENTIATORS** — Four cards:
   - Multi-agent routing (not one chatbot)
   - Goal-aware personalization (user profile injected into every prompt)
   - Token streaming (instant UX)
   - Graceful fallback (mock responses if API down)

8. **PRODUCT SCREENSHOTS** — Show three mockup cards: Dashboard with 5 micro-actions, Chat interface with pillar tags, Progress page with weekly bar chart and pillar breakdown. (Use placeholder images from the live site at ooddle.vercel.app.)

9. **TECH STACK** — Two columns:
   - **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Framer Motion, Tailwind v4
   - **AI Layer:** Groq Llama 3.3 70B (free tier), pluggable to Claude/OpenAI, streaming SSE, multi-agent system prompts

10. **BUSINESS MODEL** — Three revenue streams in a clean table: Freemium subscription ($20-40/mo), Marketplace commission (15-20%), Expert listing fees (monthly).

11. **WHAT I BUILT (PORTFOLIO HIGHLIGHTS)** — Bullet list:
    - Designed and shipped a full Next.js 16 app with 7 routes
    - Implemented multi-agent AI architecture with intent routing
    - Built streaming chat with token-level UI updates
    - Goal-aware personalization engine for daily actions
    - Designed and themed a 5-pillar visual system
    - Live deployment on Vercel

12. **CALL TO ACTION** — "See it live: ooddle.vercel.app | Code: github.com/badhipster/Ooddle | Reach out: arjha97@gmail.com"

DESIGN NOTES:
- Use the brand color #10B981 (emerald) for primary accents
- Each pillar has its own color: Metabolic (amber #F59E0B), Movement (emerald #10B981), Cognition (blue #3B82F6), Recovery (purple #8B5CF6), Supplements (rose #F43F5E)
- Use rounded corners, soft shadows, generous padding
- Avoid stock photos. Prefer abstract gradients, icons, or product screenshots
- Headlines: bold, 40-60pt. Body: 14-18pt. Limit to 30 words per slide.
```

---

## Tips for Better Results

1. **Add screenshots after generation** — After Gamma generates the deck, manually upload screenshots from the live app at https://ooddle.vercel.app to Slide 8 (the "Product Screenshots" slide).

2. **Tweak the AI Architecture diagram** — Gamma may simplify the multi-agent diagram. If it does, recreate it manually using their shape tools to show: User → Router → 5 sub-agents.

3. **Export options** — After polishing, export as PDF for static portfolios or share the live Gamma link in your application.

4. **Variations to try**:
   - Swap "AI portfolio project" for "early-stage startup" if pitching to investors
   - Add a "Roadmap" slide between 11 and 12 if showing phase planning
   - Add a "Competition" slide (vs. Calm, Headspace, MyFitnessPal, Whoop)

## Where the Live Demo Sits

- **Live URL:** https://ooddle.vercel.app
- **GitHub:** https://github.com/badhipster/Ooddle
- **Concept Note:** [docs/CONCEPT-NOTE.md](./CONCEPT-NOTE.md)
- **AI Architecture:** [docs/AI-ARCHITECTURE.md](./AI-ARCHITECTURE.md)

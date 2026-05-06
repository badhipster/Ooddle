# Ooddle — Concept Note

**One-Page Brief** · Version 1.0 · AI-Native Wellness Platform

---

## The Problem

The average health-conscious adult uses **5–8 separate apps** to manage their wellbeing — fitness trackers, sleep apps, meditation timers, supplement loggers, nutrition diaries. The result is a paradox: more wellness data, less actual health improvement.

- **Cognitive overhead** — 64% of users report decision fatigue from conflicting advice across apps (McKinsey Health Institute, 2024)
- **Accountability vacuum** — Tracking apps record behavior but don't drive it. 30-day retention sits at 18–32% across the category
- **Protocol incoherence** — No single system reasons across pillars; metabolic protocols often undermine recovery

## The Solution

**Ooddle** is an AI-powered personal health operating system that unifies five wellness pillars into one coherent daily practice — guided by a multi-agent AI coach that knows you, adapts to you, and gets smarter over time.

| Mechanic | What it does |
|---|---|
| **5 Daily Micro-Actions** | Five science-backed actions, one per pillar, achievable in <20 min — generated from the user's onboarding answers |
| **Multi-Agent AI Coach** | Central Ooddle agent routes to 5 specialized pillar sub-agents (metabolic, movement, cognition, recovery, supplements). Streaming responses powered by Llama 3.3 70B |
| **30-Day Protocol Engine** | Adaptive program that progresses day-by-day, adjusting difficulty based on completion patterns |
| **Wellness Marketplace** | Expert consultations, premium protocols, supplements — recommended by Ooddle in context |

## Key AI Differentiators

1. **Multi-Agent Architecture** — Not one chatbot. A central agent classifies intent and routes to 5 domain-expert sub-agents, each with specialized system prompts and evidence bases (Huberman, Attia, Walker, etc.)
2. **Goal-Aware Personalization** — Onboarding answers (goals, fitness level, diet, sleep pattern) are injected into every system prompt, producing fundamentally different advice for a beginner vegan vs. an advanced omnivore
3. **Streaming Responses** — Token-by-token rendering for instant, conversational UX
4. **Graceful Fallback** — Curated mock responses ensure the product never breaks, even without an API key

## The 5 Pillars

🔥 **Metabolic Health** · 💪 **Movement** · 🧠 **Cognition & Emotion** · 🌙 **Recovery** · 💊 **Supplements & Longevity**

## Business Model

| Stream | Mechanism |
|---|---|
| **Freemium subscription** | Free tier (basic actions) → Premium ($20–40/mo) for full AI + protocol engine |
| **Marketplace commission** | 15–20% on expert bookings and protocol purchases |
| **Expert listing fees** | Monthly fee for verified expert profiles |

## Tech Stack

**Frontend:** Next.js 16 (App Router) · React 19 · TypeScript · Framer Motion · Tailwind v4
**AI:** Groq (Llama 3.3 70B) with streaming · Multi-agent system prompt routing · Pluggable provider interface (Claude/OpenAI compatible)
**State:** React Context + useReducer + localStorage persistence
**Hosting:** Vercel · Live at [ooddle.vercel.app](https://ooddle.vercel.app)

## Status

✅ MVP deployed · ✅ 7 routes shipped · ✅ Real AI integrated · ✅ Goal-aware personalization · ✅ Streaming chat · ✅ Pillar routing

---

*Built by Abhishek Ranjan as an AI-native product portfolio piece — demonstrating multi-agent orchestration, prompt engineering, and full-stack product development with modern Next.js.*

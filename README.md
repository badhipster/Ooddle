# Ooddle — AI-Powered Personal Health Operating System

> A multi-agent AI wellness coach that unifies 5 health pillars into one daily practice.
> Built as an AI-native portfolio project with Next.js 16, Llama 3.3 70B, and a streaming multi-agent architecture.

**🌐 Live demo:** [ooddle.vercel.app](https://ooddle.vercel.app)
**📂 Code:** [github.com/badhipster/Ooddle](https://github.com/badhipster/Ooddle)

---

## ✨ What It Is

The average wellness user juggles 5–8 disconnected apps. Ooddle replaces that with a single, AI-guided daily practice across **5 pillars**:

🔥 **Metabolic Health** · 💪 **Movement** · 🧠 **Cognition & Emotion** · 🌙 **Recovery** · 💊 **Supplements & Longevity**

The user gets:
- **5 personalized micro-actions per day** — selected from a goal-tagged library based on onboarding answers
- **A multi-agent AI coach** — central agent routes to specialized pillar sub-agents
- **Streaming chat** — token-by-token responses for instant, conversational UX
- **Pillar-tagged messages** — every AI response is labeled with the pillar it covers
- **Progress tracking** — streaks, weekly bar chart, per-pillar completion rates

## 🧠 AI Architecture

This is the portfolio centerpiece. Full details in [`docs/AI-ARCHITECTURE.md`](./docs/AI-ARCHITECTURE.md).

```
User message → Intent Classifier → Pillar Sub-Agent → Llama 3.3 70B (streaming) → Token-by-token UI
                                       │
                                       └─ Personalized with user profile
                                          (goals, fitness, diet, sleep)
```

**Highlights:**
- **Multi-agent routing** — 5 specialized system prompts (one per pillar), each with a domain-specific evidence base (Huberman, Walker, Attia, Means)
- **Goal-aware prompts** — onboarding answers (goals, fitness level, diet, sleep pattern) are injected into every system prompt
- **Streaming** — `ReadableStream` over the `/api/chat` route. First line is a JSON metadata header carrying the routed pillar
- **Provider-agnostic** — swap Groq for Anthropic Claude or OpenAI by replacing one function
- **Graceful fallback** — curated mock responses kick in if `GROQ_API_KEY` is missing, so the product never breaks

## 🛠 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js 16** (App Router), React 19, TypeScript | Modern App Router, RSC, edge-ready |
| Animations | **Framer Motion** | Onboarding transitions, pillar reveals, streaming cursor |
| Styling | **Tailwind v4** + custom CSS tokens | 5-pillar color system, dark-mode-ready |
| AI | **Groq** Llama 3.3 70B (free tier) | Fast inference, free, swappable |
| State | **React Context + useReducer + localStorage** | No backend = no infra cost; portfolio-friendly |
| Hosting | **Vercel** | Zero-config deploy, edge functions for `/api/chat` |

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/badhipster/Ooddle.git
cd Ooddle
npm install
```

### 2. Get a free Groq API key (optional)

1. Sign up at [console.groq.com](https://console.groq.com/keys) — **free, no credit card required**
2. Create an API key
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Paste your key:
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

> **Note:** Without a key, the app gracefully falls back to curated mock responses — useful for demos and local dev.

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
npx vercel
```

Add `GROQ_API_KEY` in Vercel Project Settings → Environment Variables.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts      ← Multi-agent routing + Groq streaming
│   ├── chat/page.tsx           ← Streaming chat UI with pillar tags
│   ├── dashboard/page.tsx      ← 5 daily micro-actions + streak
│   ├── onboarding/page.tsx     ← 6-step wizard (goals, fitness, diet, sleep)
│   ├── progress/page.tsx       ← Weekly bar chart + pillar breakdown
│   ├── profile/page.tsx        ← User health profile
│   ├── login/page.tsx          ← Email/password (client-only auth)
│   └── signup/page.tsx
└── lib/
    ├── ai.ts                   ← Client streaming consumer
    ├── ai-shared.ts            ← Intent classifier (shared client+server)
    ├── constants.ts            ← Pillars, goals, micro-action library
    └── store.tsx               ← Context + reducer + localStorage

docs/
├── CONCEPT-NOTE.md             ← One-page investor/portfolio brief
├── AI-ARCHITECTURE.md          ← Multi-agent design deep-dive
└── GAMMA-PROMPT.md             ← Prompt to generate the pitch deck
```

## ✅ Portfolio Highlights

- **Multi-agent AI architecture** — not a single chatbot; 5 routed sub-agents
- **Goal-aware personalization** — onboarding answers shape both daily actions and AI prompts
- **Streaming UX** — token-by-token rendering with a pulsing cursor
- **Provider-pluggable** — Groq today, Claude/OpenAI tomorrow with a one-function swap
- **Graceful fallback** — never breaks, even without an API key
- **End-to-end product** — landing → signup → onboarding → dashboard → chat → progress
- **Type-safe** — strict TypeScript across client and server
- **Modern stack** — Next.js 16, React 19, Tailwind v4

## 📚 Documentation

- **[Concept Note](./docs/CONCEPT-NOTE.md)** — One-page brief (investor/portfolio-facing)
- **[AI Architecture](./docs/AI-ARCHITECTURE.md)** — Multi-agent design deep-dive
- **[Gamma Pitch Deck Prompt](./docs/GAMMA-PROMPT.md)** — Ready-to-paste prompt for [Gamma](https://gamma.app)

## 🗺 Roadmap

- [ ] **pgvector RAG** — embed past conversations for true long-term memory
- [ ] **Tool use** — let pillar sub-agents query the user's progress data
- [ ] **30-day adaptive protocol engine** — day-by-day program with difficulty adaptation
- [ ] **Marketplace** — expert bookings, supplement protocols, premium programs
- [ ] **Native mobile** — React Native (Expo) build
- [ ] **Analytics** — PostHog event tracking and conversion funnels

## 🙋 About the Author

Built by **Abhishek Ranjan** as an AI-native product portfolio piece.
Reach out: [arjha97@gmail.com](mailto:arjha97@gmail.com)

## 📄 License

This is a portfolio project. All rights reserved.

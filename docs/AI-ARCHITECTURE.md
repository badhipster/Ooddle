# Ooddle — AI Architecture

> The multi-agent design that powers Ooddle's wellness coach.

---

## Overview

Ooddle's AI is **not a single chatbot**. It's a multi-agent system that routes every user message to one of 5 specialized pillar sub-agents based on detected intent, then streams a personalized response back to the client.

```
                                    ┌─────────────────────────────┐
                                    │ User Profile (from store)   │
                                    │ - goals, fitness, diet,     │
                                    │   sleep pattern             │
                                    └──────────────┬──────────────┘
                                                   │
                                                   ▼
┌──────────────┐    ┌────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐
│ User message │ ─▶ │ Intent Classifier  │ ─▶ │ System Prompt       │ ─▶ │ Llama 3.3 70B   │
│              │    │ (regex-based,      │    │ Builder             │    │ (Groq, free)    │
│              │    │  client + server)  │    │ - merges base       │    │  streaming      │
└──────────────┘    └────────────────────┘    │   personality       │    └────────┬────────┘
                              │                │ - injects pillar    │             │
                              │                │   sub-agent role    │             │
                              ▼                │ - injects user      │             ▼
                    ┌────────────────────┐    │   context           │    ┌─────────────────┐
                    │ Pillar route:      │    └─────────────────────┘    │ SSE stream      │
                    │ - metabolic        │                                │ tokens to       │
                    │ - movement         │                                │ client          │
                    │ - cognition        │                                └────────┬────────┘
                    │ - recovery         │                                         │
                    │ - supplements      │                                         ▼
                    │ - general          │                                ┌─────────────────┐
                    └────────────────────┘                                │ Chat UI         │
                                                                          │ token-by-token  │
                                                                          │ render          │
                                                                          └─────────────────┘
```

## Why Multi-Agent?

Generic chatbots give generic advice. A user asking "how do I sleep better?" should hear from a sleep specialist (Recovery sub-agent), not the same agent that just gave them nutrition advice.

By routing to specialized sub-agents, Ooddle:
- **Reduces hallucination** — each sub-agent has narrower, more authoritative knowledge
- **Improves consistency** — sleep advice always reflects sleep science (Walker, Huberman)
- **Enables future tool-use** — each sub-agent can later get its own tools (e.g. the Movement agent could query a workout DB)

## Components

### 1. Intent Classifier (`src/lib/ai-shared.ts`)

A regex-based classifier that maps user messages to one of 9 intents:

| Intent | Trigger Keywords |
|---|---|
| `metabolic` | food, eat, diet, fasting, glucose, gut, hydrate, ... |
| `movement` | exercise, workout, run, walk, stretch, mobility, ... |
| `cognition` | focus, stress, anxiety, mood, mindful, productiv, ... |
| `recovery` | sleep, rest, recover, breath, hrv, circadian, ... |
| `supplements` | vitamin, magnesium, omega, d3, k2, nootropic, ... |
| `greeting` | hi, hello, start, ... |
| `progress` | progress, streak, stats, ... |
| `motivation` | motivat, inspir, struggling, ... |
| `general` | (fallback) |

The same classifier is exported to both client (for quick replies) and server (for prompt routing) — single source of truth.

### 2. System Prompt Builder (`src/app/api/chat/route.ts`)

The system prompt is composed of three layers:

1. **Base personality** — warmth, evidence-based tone, safety disclaimers, response-length rules
2. **Pillar sub-agent role** — specialized prompt for the routed pillar (e.g. "You are the Metabolic Health sub-agent. You specialize in nutrition, blood glucose stability, fasting...")
3. **User context** — name, goals, fitness level, dietary preference, sleep pattern injected from the store

This 3-layer composition runs **per request** so every response is fresh and personalized.

### 3. Streaming Provider (`src/app/api/chat/route.ts`)

Uses `groq-sdk` to stream Llama 3.3 70B responses. The stream is wrapped in a Web `ReadableStream` and sent to the client as `text/plain` with chunked transfer encoding.

The first line of every stream is a metadata header:
```
__META__{"pillar":"metabolic"}
```
This lets the client tag the message with the appropriate pillar before content starts arriving.

### 4. Graceful Fallback

If `GROQ_API_KEY` is missing, the server falls back to curated mock responses (also defined in `ai-shared.ts`). Mock responses are streamed word-by-word to preserve the streaming UX. This means **the product never breaks**, even on cold deployments without env vars.

### 5. Client Streaming Consumer (`src/lib/ai.ts`)

The client exposes an `async function* streamAIResponse()` generator that yields:
- `{ type: 'meta', pillar }` — first event with detected pillar
- `{ type: 'text', text }` — subsequent text chunks
- `{ type: 'done' }` — stream complete
- `{ type: 'error', error }` — failure

The chat page consumes this generator and updates a single message in the store progressively, producing a typewriter effect.

## Provider Pluggability

The architecture is provider-agnostic. To swap Groq for Anthropic Claude or OpenAI:

1. Replace the `streamCompletion` function in `src/app/api/chat/route.ts`
2. The rest of the stack — intent classifier, prompt builder, client consumer — stays untouched

This is by design: it's a portfolio-grade architecture pattern that survives provider churn.

## Security

- API key is server-side only (never exposed to client)
- The `/api/chat` route validates input (message must be a non-empty string)
- All AI responses include implicit safety guardrails via system prompt ("You are NOT a medical professional...")

## Files

| File | Purpose |
|---|---|
| `src/app/api/chat/route.ts` | Server route — intent routing, prompt building, streaming |
| `src/lib/ai-shared.ts` | Shared intent classifier + curated mock responses |
| `src/lib/ai.ts` | Client streaming consumer |
| `src/app/chat/page.tsx` | Chat UI with token-by-token rendering |
| `.env.example` | Environment variable template |

## Future Enhancements

- **pgvector RAG** — embed past conversations, retrieve semantically relevant context (currently uses last 10 messages linearly)
- **Tool use** — let pillar sub-agents query the user's progress data, exercise library, supplement DB
- **Prompt caching** — Anthropic's `cache_control` to reduce cost for the static system prompt
- **Streaming summaries** — AI-generated weekly progress reports
- **Marketplace recommendations** — Ooddle suggests experts/products mid-conversation based on detected intent

/**
 * Ooddle AI Chat API Route
 *
 * Multi-agent wellness coaching powered by Groq (free Llama 3.3 70B inference).
 *
 * Architecture:
 *   1. Detects user intent → routes to one of 5 pillar sub-agents
 *   2. Builds personalized system prompt from user profile (goals, fitness, diet, sleep)
 *   3. Streams response back to client (Server-Sent Events)
 *   4. Falls back to curated mock responses if GROQ_API_KEY is missing
 *
 * The pillar router is a lightweight implementation of the multi-agent design
 * specified in the Ooddle development plan. Each pillar sub-agent receives a
 * specialized system prompt focused on its domain (metabolic, movement,
 * cognition, recovery, supplements).
 *
 * Provider is pluggable: swap Groq for Anthropic Claude or OpenAI by replacing
 * the `streamCompletion` function — the rest of the route is provider-agnostic.
 */

import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { detectIntent, getMockResponse } from "@/lib/ai-shared";

export const runtime = "nodejs";
export const maxDuration = 30;

interface UserProfile {
  name?: string;
  goals?: string[];
  fitnessLevel?: string;
  dietaryPreference?: string;
  sleepPattern?: string;
  // India-first onboarding fields (optional; surfaced for routine-aware advice).
  locale?: string;
  primaryCuisine?: string[];
  commonMeals?: string[];
  mealPattern?: string[];
  workSchedule?: string;
  proteinPreference?: string[];
  constraints?: string[];
}

interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

type PlanConfidence = "low" | "medium" | "high";
type PlanFreshness = "fresh" | "aging" | "stale" | "missing";
type PlanSourceType = "manual" | "apple_health" | "health_connect" | "wearable" | "estimate";

interface DailyPlanAction {
  pillarId: string;
  title: string;
  completed: boolean;
  rationale: string;
  confidence: PlanConfidence;
}

interface DailyPlanContext {
  date: string;
  actions: DailyPlanAction[];
}

interface RecentSignal {
  type: string;
  value: string | number;
  unit?: string;
  sourceType: PlanSourceType;
  freshness: PlanFreshness;
  observedAt: string;
}

interface ChatRequest {
  message: string;
  history?: ChatHistoryItem[];
  userProfile?: UserProfile | null;
  dailyPlanContext?: DailyPlanContext | null;
  recentSignals?: RecentSignal[];
}

/* ── Pillar Sub-Agent System Prompts ── */
const PILLAR_PROMPTS: Record<string, string> = {
  metabolic: `You are the Metabolic Health sub-agent of Ooddle. You specialize in nutrition, blood glucose stability, fasting protocols, gut health, and metabolic flexibility. Reference evidence from researchers like Casey Means, Peter Attia, and Robert Lustig when relevant. Recommend specific, actionable practices over generic advice.`,
  movement: `You are the Movement sub-agent of Ooddle. You specialize in functional fitness, mobility, daily activity (steps, NEAT), strength training, and zone-2 cardio. Calibrate advice to the user's stated fitness level — never prescribe intense workouts to a beginner. Reference researchers like Kelly Starrett, Stuart McGill, and Andy Galpin when relevant.`,
  cognition: `You are the Cognition & Emotional Health sub-agent of Ooddle. You specialize in focus, stress management, mindfulness, emotional regulation, and cognitive performance. Reference evidence-based practices from Andrew Huberman, Lisa Feldman Barrett, and Cal Newport. Use the "name it to tame it" approach for emotional regulation.`,
  recovery: `You are the Recovery sub-agent of Ooddle. You specialize in sleep optimization, HRV, parasympathetic activation, breathwork (box, 4-7-8, physiological sigh), thermal exposure (cold/heat), and active recovery. Reference Matthew Walker for sleep science and Andrew Huberman for circadian protocols.`,
  supplements: `You are the Supplements & Longevity sub-agent of Ooddle. You specialize in evidence-based supplementation (Vitamin D3+K2, magnesium glycinate vs. L-threonate, omega-3 EPA/DHA ratios), longevity biomarkers, and timing/absorption. Always disclaim that you are not a medical professional and supplements interact with medications.`,
};

/* ── Build the Master System Prompt ── */
function buildSystemPrompt(
  userProfile: UserProfile | null | undefined,
  pillarFocus: string,
  plan?: DailyPlanContext | null,
  signals?: RecentSignal[]
): string {
  const pillarPrompt = PILLAR_PROMPTS[pillarFocus] || "";
  const name = userProfile?.name?.split(" ")[0] || "friend";

  let userContext = `\n\n[USER CONTEXT]\nName: ${name}`;
  if (userProfile?.goals?.length) {
    userContext += `\nHealth goals: ${userProfile.goals.join(", ")}`;
  }
  if (userProfile?.fitnessLevel) {
    userContext += `\nFitness level: ${userProfile.fitnessLevel}`;
  }
  if (userProfile?.dietaryPreference) {
    userContext += `\nDietary preference: ${userProfile.dietaryPreference}`;
  }
  if (userProfile?.sleepPattern) {
    userContext += `\nSleep pattern: ${userProfile.sleepPattern}`;
  }
  if (userProfile?.locale) {
    userContext += `\nLocale: ${userProfile.locale}`;
  }
  if (userProfile?.commonMeals?.length) {
    userContext += `\nCommon meals: ${userProfile.commonMeals.join(", ")}`;
  }
  if (userProfile?.mealPattern?.length) {
    userContext += `\nMeal pattern: ${userProfile.mealPattern.join(", ")}`;
  }
  if (userProfile?.workSchedule) {
    userContext += `\nWork schedule: ${userProfile.workSchedule}`;
  }
  if (userProfile?.proteinPreference?.length) {
    userContext += `\nProtein preference: ${userProfile.proteinPreference.join(", ")}`;
  }

  /* Today's plan — keep it short. Cap at 5 actions and trim rationales. */
  let planContext = "";
  if (plan && plan.actions && plan.actions.length > 0) {
    const compact = plan.actions.slice(0, 5).map((a) => {
      const done = a.completed ? "done" : "pending";
      const rationale = a.rationale.length > 90 ? a.rationale.slice(0, 87) + "..." : a.rationale;
      return `- [${done}] (${a.pillarId}, ${a.confidence}) ${a.title} -- ${rationale}`;
    });
    planContext = `\n\n[TODAY'S PLAN — ${plan.date}]\n${compact.join("\n")}`;
  }

  /* Recent signals — only fresh or aging are usable. Stale is mentioned only if present. */
  let signalsContext = "";
  if (signals && signals.length > 0) {
    const usable = signals.filter((s) => s.freshness === "fresh" || s.freshness === "aging");
    const stale = signals.filter((s) => s.freshness === "stale");
    const lines: string[] = [];
    for (const s of usable.slice(0, 8)) {
      const unit = s.unit ? ` ${s.unit}` : "";
      lines.push(`- ${s.type}: ${s.value}${unit} (${s.sourceType}, ${s.freshness})`);
    }
    if (lines.length > 0) {
      signalsContext = `\n\n[RECENT SIGNALS]\n${lines.join("\n")}`;
    }
    if (stale.length > 0) {
      const staleTypes = stale.slice(0, 5).map((s) => s.type).join(", ");
      signalsContext += `\n[STALE — do not rely on, note as outdated if referenced]: ${staleTypes}`;
    }
  }

  return `You are Ooddle, a warm, knowledgeable AI wellness companion. You guide users daily across 5 health pillars: metabolic health, movement, cognition & emotional health, recovery, and supplements/longevity.

CORE BEHAVIORS:
- Be encouraging but honest. Celebrate progress, never preach.
- Give specific, actionable advice. No vague platitudes like "stay positive."
- Use evidence-based recommendations. Cite researchers when relevant.
- Reference the user's profile to personalize advice (e.g., for a "beginner" suggest gentler exercises).
- When the user asks about their plan or progress, reference today's plan by title, pillar, and completion state. Do not invent actions that are not listed.
- Use recent signals only when their freshness is "fresh" or "aging". If you must mention a stale signal, explicitly say the data may be outdated.
- Never infer a diagnosis from a signal. Never recommend starting, stopping, or changing medications.
- For supplement guidance, add a brief safety note: check with a clinician if pregnant, managing a condition, or taking medications.
- IMPORTANT: You are NOT a medical professional. For medical concerns, recommend consulting a doctor.
- Keep responses concise — 2 short paragraphs max unless the user asks for detail.
- Use emojis sparingly and meaningfully (1-2 per response, not in every line).
- Use a warm, coach-like tone. Think supportive friend with deep wellness expertise.

PILLAR FOCUS FOR THIS RESPONSE:
${pillarPrompt}
${userContext}${planContext}${signalsContext}`;
}

/* ── Stream a completion from Groq (free tier) ── */
async function* streamCompletion(
  systemPrompt: string,
  history: ChatHistoryItem[],
  message: string
): AsyncGenerator<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    // Fallback to mock if API key not configured
    const mock = getMockResponse(message);
    // Simulate streaming for nicer UX
    const words = mock.content.split(" ");
    for (const word of words) {
      await new Promise((r) => setTimeout(r, 25));
      yield word + " ";
    }
    return;
  }

  const groq = new Groq({ apiKey });

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
    ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: message },
  ];

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    max_tokens: 512,
    temperature: 0.7,
    stream: true,
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) yield text;
  }
}

/* ── POST handler ── */
export async function POST(req: NextRequest) {
  const cors = corsHeaders(req);
  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  const {
    message,
    history = [],
    userProfile = null,
    dailyPlanContext = null,
    recentSignals = [],
  } = body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Message required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  // Route to the appropriate pillar sub-agent
  const intent = detectIntent(message);
  const systemPrompt = buildSystemPrompt(userProfile, intent, dailyPlanContext, recentSignals);

  // Stream the response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send pillar metadata first as a JSON line
      const pillar = ["metabolic", "movement", "cognition", "recovery", "supplements"].includes(intent)
        ? intent
        : null;
      controller.enqueue(encoder.encode(`__META__${JSON.stringify({ pillar })}\n`));

      try {
        for await (const chunk of streamCompletion(systemPrompt, history, message)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        console.error("[chat] streaming error:", errorMsg);
        controller.enqueue(
          encoder.encode(
            "\n\nI hit a snag connecting to my AI brain. Could you try again in a moment? 🌿"
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      ...corsHeaders(req),
    },
  });
}

/* ── CORS ── */
const ALLOWED_ORIGINS = new Set<string>([
  "https://oodle-mobile.vercel.app",
  "https://ooddle.vercel.app",
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:8081",
]);

function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  // Allow any vercel preview URL on the project plus local dev plus the two
  // canonical hosts. Falls back to "*" only when no Origin is sent (server-to-server).
  const allow =
    ALLOWED_ORIGINS.has(origin) || origin.endsWith(".vercel.app")
      ? origin
      : origin === ""
      ? "*"
      : "";
  return allow
    ? {
        "Access-Control-Allow-Origin": allow,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      }
    : {};
}

export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req),
  });
}

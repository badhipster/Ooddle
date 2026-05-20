/**
 * Ooddle AI — Client-Side Streaming Wrapper
 *
 * Calls /api/chat which streams Llama 3.3 70B responses (via Groq, free tier)
 * or falls back to curated mock content if no API key is configured.
 *
 * Stream format:
 *   1. First line: __META__{"pillar":"metabolic"}\n
 *   2. Remainder: text tokens to render progressively
 *
 * Intent detection and quick-reply helpers live in ai-shared.ts so the
 * server route and the client UI use the exact same logic.
 */

import { detectIntent, getQuickReplies, type Intent } from "./ai-shared";

export type { Intent };
export { detectIntent, getQuickReplies };

export interface AIStreamChunk {
  type: "meta" | "text" | "done" | "error";
  pillar?: string | null;
  text?: string;
  error?: string;
}

interface UserProfile {
  name?: string;
  goals?: string[];
  fitnessLevel?: string;
  dietaryPreference?: string;
  sleepPattern?: string;
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

export interface DailyPlanAction {
  pillarId: string;
  title: string;
  completed: boolean;
  rationale: string;
  confidence: "low" | "medium" | "high";
}

export interface DailyPlanContext {
  date: string;
  actions: DailyPlanAction[];
}

export interface RecentSignal {
  type: string;
  value: string | number;
  unit?: string;
  sourceType: "manual" | "apple_health" | "health_connect" | "wearable" | "estimate";
  freshness: "fresh" | "aging" | "stale" | "missing";
  observedAt: string;
}

export interface ChatExtras {
  dailyPlanContext?: DailyPlanContext | null;
  recentSignals?: RecentSignal[];
}

/**
 * Streams a chat response from the Ooddle AI backend.
 * Yields chunks the consumer can use to update UI progressively.
 */
export async function* streamAIResponse(
  message: string,
  history: ChatHistoryItem[] = [],
  userProfile: UserProfile | null = null,
  extras: ChatExtras = {}
): AsyncGenerator<AIStreamChunk> {
  let response: Response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history,
        userProfile,
        dailyPlanContext: extras.dailyPlanContext ?? null,
        recentSignals: extras.recentSignals ?? [],
      }),
    });
  } catch (err) {
    yield {
      type: "error",
      error: err instanceof Error ? err.message : "Network error",
    };
    return;
  }

  if (!response.ok || !response.body) {
    yield { type: "error", error: `HTTP ${response.status}` };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let metaParsed = false;
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      if (!metaParsed) {
        const metaPrefix = "__META__";
        if (buffer.startsWith(metaPrefix)) {
          const newlineIdx = buffer.indexOf("\n");
          if (newlineIdx === -1) continue;
          try {
            const meta = JSON.parse(buffer.slice(metaPrefix.length, newlineIdx));
            yield { type: "meta", pillar: meta.pillar };
          } catch {
            yield { type: "meta", pillar: null };
          }
          buffer = buffer.slice(newlineIdx + 1);
          metaParsed = true;
        } else {
          metaParsed = true;
        }
      }

      if (buffer.length > 0) {
        yield { type: "text", text: buffer };
        buffer = "";
      }
    }

    const tail = decoder.decode();
    if (tail) yield { type: "text", text: tail };
    yield { type: "done" };
  } catch (err) {
    yield {
      type: "error",
      error: err instanceof Error ? err.message : "Stream error",
    };
  } finally {
    reader.releaseLock();
  }
}

/**
 * Non-streaming wrapper — internally consumes the stream and returns the full reply.
 */
export async function getAIResponse(
  message: string,
  history: ChatHistoryItem[] = [],
  userProfile: UserProfile | null = null,
  extras: ChatExtras = {}
): Promise<{ content: string; pillar?: string | null }> {
  let content = "";
  let pillar: string | null = null;

  for await (const chunk of streamAIResponse(message, history, userProfile, extras)) {
    if (chunk.type === "meta") pillar = chunk.pillar ?? null;
    if (chunk.type === "text" && chunk.text) content += chunk.text;
    if (chunk.type === "error") {
      return {
        content: "Oops, I had a moment there! 😅 Could you try asking me again?",
        pillar: null,
      };
    }
  }

  return { content: content.trim(), pillar };
}

export const OODDLE_PERSONALITY = `You are Ooddle, a warm, knowledgeable wellness guide.`;

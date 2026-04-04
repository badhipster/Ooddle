/**
 * Ooddle AI — Mock AI Layer
 *
 * Simulates the Ooddle wellness guide personality with pillar-specific responses.
 * Architecture is pluggable: swap this for real Claude/OpenAI API calls by
 * replacing the `getAIResponse` function.
 */

import { PillarId } from "./constants";

interface AIResponse {
  content: string;
  pillar?: PillarId;
}

const OODDLE_PERSONALITY = `You are Ooddle, a warm, knowledgeable wellness guide. You speak with enthusiasm but never medical authority. You use emojis sparingly and meaningfully. You encourage without being preachy.`;

/* ── Pillar-specific response banks ── */
const RESPONSES: Record<string, AIResponse[]> = {
  greeting: [
    {
      content: "Hey there! 🌿 I'm Ooddle, your personal wellness companion. I'm here to help you feel amazing across all five pillars of health — metabolic, movement, cognition, recovery, and supplements. What's on your mind today?",
    },
    {
      content: "Welcome back! ✨ How are you feeling today? I noticed you've been consistent with your micro-actions — that's building real momentum. What area should we focus on?",
    },
  ],

  metabolic: [
    {
      content: "Great question about nutrition! 🔥 For metabolic health, timing matters almost as much as what you eat. Try to finish your last meal 3 hours before bed — this gives your body time to shift into repair mode. Your blood sugar will thank you in the morning!",
      pillar: "metabolic",
    },
    {
      content: "Here's a metabolic hack I love: start your morning with 16oz of water before anything else. After 7-8 hours of sleep, your body is dehydrated. Rehydrating first thing boosts your metabolism by up to 30% for the next hour. Simple but powerful! 💧",
      pillar: "metabolic",
    },
    {
      content: "Let's talk about blood sugar stability 🔥 — the foundation of consistent energy. Try pairing carbs with protein or healthy fats. For example, apple + almond butter instead of just an apple. This slows glucose absorption and prevents the crash.",
      pillar: "metabolic",
    },
  ],

  movement: [
    {
      content: "Movement doesn't need to be intense to be effective! 💪 A 10-minute walk after meals can reduce post-meal blood sugar spikes by up to 30%. It also improves digestion and gives your brain a reset. Try it after lunch today?",
      pillar: "movement",
    },
    {
      content: "Here's something most people overlook: your body was designed to move throughout the day, not just for one intense session. Try the \"movement snack\" approach — 2-3 minutes of movement every hour. Squats, stretches, a walk around the block. Small doses, big results! 🏃",
      pillar: "movement",
    },
    {
      content: "Flexibility is the unsung hero of fitness 💪 — it prevents injury, improves posture, and even helps with sleep. Try adding 5 minutes of gentle stretching before bed. Focus on hip flexors and shoulders — they hold the most tension from sitting.",
      pillar: "movement",
    },
  ],

  cognition: [
    {
      content: "For mental clarity, try the \"two-minute rule\" 🧠 — if a task takes less than 2 minutes, do it immediately. This reduces cognitive load from your mental to-do list and frees up actual brainpower for creative and strategic thinking.",
      pillar: "cognition",
    },
    {
      content: "Your brain is wired for focus in 90-minute cycles (ultradian rhythms). Work in 90-minute deep focus blocks, then take a 15-20 minute break. During breaks, avoid screens — look out a window, stretch, or do a brief breathing exercise. Your afternoon productivity will transform! 🧠",
      pillar: "cognition",
    },
    {
      content: "Emotional regulation tip: practice \"name it to tame it\" 🧠 — when you feel a strong emotion, simply label it. \"I'm feeling anxious\" or \"I notice frustration.\" Research shows this activates your prefrontal cortex and actually calms the amygdala. It sounds too simple to work, but neuroscience backs it up!",
      pillar: "cognition",
    },
  ],

  recovery: [
    {
      content: "Sleep quality > sleep quantity 🌙 Your room temperature matters more than you think — the ideal range is 65-68°F (18-20°C). Even a couple degrees can mean the difference between deep sleep and tossing and turning. Worth checking your thermostat tonight!",
      pillar: "recovery",
    },
    {
      content: "One of the most underrated recovery tools: deep nasal breathing. Try box breathing before bed — inhale 4 seconds, hold 4, exhale 4, hold 4. Four rounds. It activates your parasympathetic nervous system and tells your body it's safe to rest. 🌙",
      pillar: "recovery",
    },
    {
      content: "Active recovery is just as important as rest days 🌙 — gentle movement like a 20-minute walk, yoga, or foam rolling increases blood flow to muscles without adding stress. Think of it as helping your body clean up the construction site from yesterday's workout.",
      pillar: "recovery",
    },
  ],

  supplements: [
    {
      content: "When it comes to supplements, quality and timing matter! 💊 Vitamin D3 is best taken with your largest meal (it's fat-soluble). Pair it with K2 to direct the calcium to your bones instead of your arteries. Morning is ideal since D3 can affect sleep if taken too late.",
      pillar: "supplements",
    },
    {
      content: "Magnesium is one of the most common deficiencies — over 50% of people don't get enough. I recommend magnesium glycinate for sleep and relaxation (take at night), or magnesium L-threonate for cognitive benefits (it crosses the blood-brain barrier). Start with 200mg and see how you feel. 💊",
      pillar: "supplements",
    },
    {
      content: "Omega-3s are foundational 💊 — they reduce inflammation, support brain health, and improve cardiovascular function. Look for a supplement with at least 500mg EPA and 250mg DHA per serving. Take with food to improve absorption and reduce any fishy aftertaste.",
      pillar: "supplements",
    },
  ],

  general: [
    {
      content: "That's a great question! The key to sustainable wellness is consistency over intensity. Small daily actions compound over time. Your body doesn't care about one perfect day — it responds to what you do repeatedly. Keep building those micro-habits! 🌟",
    },
    {
      content: "I love your curiosity! Health is deeply personal, and what works for one person may not work for another. That's why I'm here — to help you find YOUR optimal protocol. Let's experiment together and track what makes the biggest difference for you. 📊",
    },
    {
      content: "Remember, wellness isn't about perfection — it's about progress. Even completing 3 out of 5 micro-actions today puts you ahead of yesterday. You're building neural pathways for healthy habits, and each action strengthens them. Keep going! 💚",
    },
  ],

  progress: [
    {
      content: "Looking at your progress, you're building great consistency! 📈 The micro-actions you've completed are creating compound health benefits. Each small action is training your nervous system and creating lasting habits. Want me to highlight which pillar you're strongest in?",
    },
  ],

  motivation: [
    {
      content: "You know what separates people who transform their health from those who don't? It's not willpower — it's systems. And you're here, building your system. That already puts you in the top 10%. Let's keep this momentum going! 🚀",
    },
    {
      content: "Fun fact: it takes about 66 days to form a habit, not 21 as commonly believed. But here's the good news — the hardest part is the first 2 weeks. You're right in the zone where it starts getting easier. Trust the process! 💪",
    },
  ],
};

/* ── Intent Detection ── */
function detectIntent(message: string): string {
  const lower = message.toLowerCase();

  if (lower.match(/\b(hi|hello|hey|start|begin|new)\b/)) return "greeting";
  if (lower.match(/\b(food|eat|diet|nutrition|metabolism|blood sugar|fasting|meal|calorie|glucose|insulin)\b/)) return "metabolic";
  if (lower.match(/\b(exercise|workout|run|walk|stretch|gym|lift|move|fitness|yoga|strength|cardio)\b/)) return "movement";
  if (lower.match(/\b(focus|brain|mental|think|stress|anxiety|mood|emotion|meditat|mindful|cognitive)\b/)) return "cognition";
  if (lower.match(/\b(sleep|rest|recover|relax|nap|tired|fatigue|energy|breath|calm)\b/)) return "recovery";
  if (lower.match(/\b(supplement|vitamin|mineral|omega|magnesium|d3|k2|protein|creatine|pill|capsule)\b/)) return "supplements";
  if (lower.match(/\b(progress|streak|tracking|stats|how am i|doing)\b/)) return "progress";
  if (lower.match(/\b(motivat|inspir|encourage|help me|feeling down|give up|hard|difficult|can't)\b/)) return "motivation";

  return "general";
}

/* ── Random pick ── */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── Main function ── */
export async function getAIResponse(message: string, _context?: string): Promise<AIResponse> {
  // Simulate network delay for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

  const intent = detectIntent(message);
  const responses = RESPONSES[intent] || RESPONSES.general;
  return pickRandom(responses);
}

/* ── Quick replies ── */
export function getQuickReplies(lastResponse?: AIResponse): string[] {
  if (lastResponse?.pillar === "metabolic") {
    return ["Tell me more about fasting", "Best foods for energy?", "How about gut health?"];
  }
  if (lastResponse?.pillar === "movement") {
    return ["Quick desk exercises?", "Morning routine ideas", "How often should I stretch?"];
  }
  if (lastResponse?.pillar === "cognition") {
    return ["Help with focus", "Stress management tips", "Best time for deep work?"];
  }
  if (lastResponse?.pillar === "recovery") {
    return ["Optimize my sleep", "What about cold therapy?", "Best breathing technique?"];
  }
  if (lastResponse?.pillar === "supplements") {
    return ["What should I take daily?", "Best time for vitamins?", "Supplements for sleep?"];
  }
  return ["How can I improve my energy?", "What should I eat today?", "Help me sleep better", "Show my progress"];
}

export { OODDLE_PERSONALITY };

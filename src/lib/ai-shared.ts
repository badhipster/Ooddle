/**
 * Ooddle AI — Shared Utilities (used by both client + server)
 *
 * Intent detection and curated mock fallbacks. The mock layer ensures the
 * product works gracefully even without the GROQ_API_KEY configured —
 * essential for local development and demo environments.
 */

export type Intent =
  | "greeting"
  | "metabolic"
  | "movement"
  | "cognition"
  | "recovery"
  | "supplements"
  | "progress"
  | "motivation"
  | "general";

export interface MockResponse {
  content: string;
  pillar?: string;
}

/* ── Intent Detection ── */
export function detectIntent(message: string): Intent {
  const lower = message.toLowerCase();

  if (lower.match(/\b(hi|hello|hey|start|begin|new)\b/)) return "greeting";
  if (
    lower.match(
      /\b(food|eat|diet|nutrition|metabolism|blood sugar|fasting|meal|calorie|glucose|insulin|gut|carb|protein|fat|sugar|hydrat|water)\b/
    )
  )
    return "metabolic";
  if (
    lower.match(
      /\b(exercise|workout|run|walk|stretch|gym|lift|move|fitness|yoga|strength|cardio|step|posture|mobility)\b/
    )
  )
    return "movement";
  if (
    lower.match(
      /\b(focus|brain|mental|think|stress|anxiety|mood|emotion|meditat|mindful|cognitive|productiv|attention|concentr)\b/
    )
  )
    return "cognition";
  if (
    lower.match(
      /\b(sleep|rest|recover|relax|nap|tired|fatigue|energy|breath|calm|hrv|circadian|insomnia)\b/
    )
  )
    return "recovery";
  if (
    lower.match(
      /\b(supplement|vitamin|mineral|omega|magnesium|d3|k2|protein powder|creatine|capsule|nootropic|adaptogen)\b/
    )
  )
    return "supplements";
  if (lower.match(/\b(progress|streak|tracking|stats|how am i|doing)\b/)) return "progress";
  if (
    lower.match(
      /\b(motivat|inspir|encourage|help me|feeling down|give up|hard|difficult|can't|struggling)\b/
    )
  )
    return "motivation";

  return "general";
}

/* ── Curated Mock Responses (fallback when no API key) ── */
const MOCK_RESPONSES: Record<Intent, MockResponse[]> = {
  greeting: [
    {
      content:
        "Hey there! 🌿 I'm Ooddle, your personal wellness companion. I'm here to help you feel amazing across all five pillars of health — metabolic, movement, cognition, recovery, and supplements. What's on your mind today?",
    },
  ],
  metabolic: [
    {
      content:
        "Great question about nutrition! 🔥 For metabolic health, timing matters almost as much as what you eat. Try to finish your last meal 3 hours before bed — this gives your body time to shift into repair mode. Your blood sugar will thank you in the morning!",
      pillar: "metabolic",
    },
  ],
  movement: [
    {
      content:
        "Movement doesn't need to be intense to be effective! 💪 A 10-minute walk after meals can reduce post-meal blood sugar spikes by up to 30%. It also improves digestion and gives your brain a reset. Try it after lunch today?",
      pillar: "movement",
    },
  ],
  cognition: [
    {
      content:
        "Your brain is wired for focus in 90-minute cycles (ultradian rhythms). 🧠 Work in 90-minute deep focus blocks, then take a 15-20 minute break. During breaks, avoid screens — look out a window, stretch, or breathe. Your afternoon productivity will transform.",
      pillar: "cognition",
    },
  ],
  recovery: [
    {
      content:
        "Sleep quality > sleep quantity 🌙 Your room temperature matters more than you think — the ideal range is 65-68°F (18-20°C). Even a couple degrees can mean the difference between deep sleep and tossing and turning. Worth checking your thermostat tonight!",
      pillar: "recovery",
    },
  ],
  supplements: [
    {
      content:
        "When it comes to supplements, quality and timing matter! 💊 Vitamin D3 is best taken with your largest meal (it's fat-soluble). Pair it with K2 to direct calcium to your bones instead of arteries. Morning is ideal — D3 too late can affect sleep.",
      pillar: "supplements",
    },
  ],
  progress: [
    {
      content:
        "Looking at your progress, you're building great consistency! 📈 Each micro-action you complete is creating compound health benefits. Want me to highlight which pillar you're strongest in?",
    },
  ],
  motivation: [
    {
      content:
        "You know what separates people who transform their health from those who don't? It's not willpower — it's systems. And you're here, building your system. That already puts you in the top 10%. Let's keep this momentum going! 🚀",
    },
  ],
  general: [
    {
      content:
        "That's a great question! The key to sustainable wellness is consistency over intensity. Small daily actions compound over time. Your body doesn't care about one perfect day — it responds to what you do repeatedly. Keep building those micro-habits! 🌟",
    },
  ],
};

export function getMockResponse(message: string): MockResponse {
  const intent = detectIntent(message);
  const responses = MOCK_RESPONSES[intent] || MOCK_RESPONSES.general;
  return responses[Math.floor(Math.random() * responses.length)];
}

/* ── Quick Reply Suggestions (pillar-aware) ── */
export function getQuickReplies(lastPillar?: string | null): string[] {
  if (lastPillar === "metabolic")
    return ["Tell me about fasting", "Best foods for energy?", "Gut health tips?"];
  if (lastPillar === "movement")
    return ["Quick desk exercises?", "Morning routine ideas", "How often to stretch?"];
  if (lastPillar === "cognition")
    return ["Help with focus", "Stress management", "Best time for deep work?"];
  if (lastPillar === "recovery")
    return ["Optimize my sleep", "Cold therapy benefits?", "Best breathing technique?"];
  if (lastPillar === "supplements")
    return ["What should I take daily?", "Best time for vitamins?", "Supplements for sleep?"];
  return [
    "How can I boost my energy?",
    "What should I eat today?",
    "Help me sleep better",
    "Show my progress",
  ];
}

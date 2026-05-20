/**
 * Ooddle Evidence Library — Seed
 *
 * Curated evidence references used to back micro-action recommendations.
 * Each entry has a stable key so micro-action templates can reference it by id.
 *
 * Source classes:
 *   - expert:    well-known practitioner public guidance (Huberman, Walker, Attia, Means)
 *   - guideline: institutional or governmental recommendation
 *   - study:     a peer-reviewed primary source or meta-analysis
 *   - ooddle_rule: an internal heuristic, clearly labeled as such
 *   - starter:    cold-start placeholder used when no real signal exists
 *
 * Wellness language only. No diagnosis, no medication, no disease management.
 */

export type EvidenceSourceType =
  | "expert"
  | "guideline"
  | "study"
  | "ooddle_rule"
  | "starter";

export type ConfidenceLevel = "low" | "medium" | "high";

export type SignalSourceType =
  | "manual"
  | "apple_health"
  | "health_connect"
  | "wearable"
  | "estimate";

export type FreshnessStatus = "fresh" | "aging" | "stale" | "missing";

export type Locale = "IN" | "US" | "GLOBAL";

export interface EvidenceReference {
  id: string;
  label: string;
  sourceType: EvidenceSourceType;
  url?: string;
  summary: string;
}

export interface RecommendationSignal {
  id: string;
  label: string;
  value?: string | number;
  unit?: string;
  sourceType: SignalSourceType;
  freshness: FreshnessStatus;
  observedAt?: string;
}

export interface MicroActionExplanation {
  rationale: string;
  signals: RecommendationSignal[];
  evidence: EvidenceReference[];
  confidence: ConfidenceLevel;
  safetyNote?: string;
}

/* ──────────────────────────────────────────────────────────────────
   Seed evidence catalog. Keys are stable. Add, never rename.
   Twenty-plus entries across five pillars so action explanations
   never read as filler.
   ────────────────────────────────────────────────────────────────── */

export const EVIDENCE_CATALOG: Record<string, EvidenceReference> = {
  /* ── Metabolic ── */
  postmeal_walk_glucose: {
    id: "postmeal_walk_glucose",
    label: "Short walks after meals reduce glucose spikes",
    sourceType: "study",
    url: "https://pubmed.ncbi.nlm.nih.gov/35821741/",
    summary:
      "Meta-analysis: light walking within an hour of eating lowers post-meal blood glucose compared to standing or sitting.",
  },
  protein_first_breakfast: {
    id: "protein_first_breakfast",
    label: "Protein-forward breakfast stabilizes appetite",
    sourceType: "expert",
    url: "https://hubermanlab.com/dr-andy-galpin-optimal-nutrition-supplementation-for-fitness-performance/",
    summary:
      "Huberman and Galpin recommend front-loading protein early in the day to stabilize appetite and support muscle retention.",
  },
  icmr_protein_rda_in: {
    id: "icmr_protein_rda_in",
    label: "ICMR-NIN protein RDA for Indian adults",
    sourceType: "guideline",
    url: "https://www.nin.res.in/RDA_short_Report_2020.html",
    summary:
      "Indian RDA suggests ~0.83 g/kg body weight protein for adults; active or weight-managing adults often need more.",
  },
  meal_timing_late_dinner: {
    id: "meal_timing_late_dinner",
    label: "Late, large dinners worsen overnight metabolism",
    sourceType: "study",
    url: "https://pubmed.ncbi.nlm.nih.gov/32525488/",
    summary:
      "Eating late shifts glucose and lipid handling overnight; finishing dinner earlier supports better recovery sleep.",
  },
  hydration_morning: {
    id: "hydration_morning",
    label: "Morning rehydration after overnight fast",
    sourceType: "ooddle_rule",
    summary:
      "Rehydrating soon after waking supports early-day energy and cognition before caffeine. Wellness habit, not a clinical claim.",
  },
  fasting_window_safety: {
    id: "fasting_window_safety",
    label: "Time-restricted eating is not for everyone",
    sourceType: "guideline",
    url: "https://www.heart.org/en/news/2023/03/20/whats-the-buzz-on-intermittent-fasting",
    summary:
      "Not appropriate for pregnancy, history of disordered eating, certain medications, or specific medical conditions. Educational only.",
  },

  /* ── Movement ── */
  zone2_aerobic_base: {
    id: "zone2_aerobic_base",
    label: "Zone 2 cardio builds aerobic base",
    sourceType: "expert",
    url: "https://peterattiamd.com/category/exercise/",
    summary:
      "Attia popularized regular Zone 2 cardio for mitochondrial health and longer-term cardiorespiratory fitness.",
  },
  resistance_training_longevity: {
    id: "resistance_training_longevity",
    label: "Resistance training and healthspan",
    sourceType: "study",
    url: "https://pubmed.ncbi.nlm.nih.gov/35113443/",
    summary:
      "Regular resistance training is associated with lower all-cause mortality and preserved function with age.",
  },
  daily_step_target: {
    id: "daily_step_target",
    label: "Daily step counts and health outcomes",
    sourceType: "study",
    url: "https://pubmed.ncbi.nlm.nih.gov/36459988/",
    summary:
      "Step counts in the 7,000 to 10,000 range are associated with meaningful reductions in cardiovascular risk markers.",
  },
  desk_break_mobility: {
    id: "desk_break_mobility",
    label: "Breaking up prolonged sitting",
    sourceType: "guideline",
    url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    summary:
      "WHO advises interrupting long sitting periods with light movement to support metabolic and musculoskeletal health.",
  },

  /* ── Cognition ── */
  ultradian_focus_block: {
    id: "ultradian_focus_block",
    label: "Ultradian focus cycles",
    sourceType: "expert",
    url: "https://hubermanlab.com/optimize-your-learning-creativity-with-science-based-tools/",
    summary:
      "Huberman discusses 60 to 90 minute focus blocks aligned to ultradian cycles, followed by short non-screen recovery.",
  },
  gratitude_affect: {
    id: "gratitude_affect",
    label: "Gratitude practice and positive affect",
    sourceType: "study",
    url: "https://pubmed.ncbi.nlm.nih.gov/12585811/",
    summary:
      "Brief gratitude practices are associated with sustained improvements in positive affect and life satisfaction.",
  },
  box_breathing_vagal: {
    id: "box_breathing_vagal",
    label: "Slow paced breathing and parasympathetic tone",
    sourceType: "study",
    url: "https://pubmed.ncbi.nlm.nih.gov/30245619/",
    summary:
      "Slow, paced breathing patterns can shift autonomic balance toward parasympathetic activity in healthy adults.",
  },
  phone_free_morning: {
    id: "phone_free_morning",
    label: "Morning phone avoidance heuristic",
    sourceType: "ooddle_rule",
    summary:
      "Internal heuristic: delaying high-stimulation input helps protect attention quality early in the day. Wellness habit, not a clinical claim.",
  },

  /* ── Recovery ── */
  morning_sunlight_circadian: {
    id: "morning_sunlight_circadian",
    label: "Morning sunlight and circadian anchoring",
    sourceType: "expert",
    url: "https://hubermanlab.com/using-light-sunlight-blue-light-red-light-to-optimize-health/",
    summary:
      "Huberman recommends bright light exposure soon after waking to anchor circadian rhythm and downstream alertness and sleep timing.",
  },
  cool_bedroom_sleep: {
    id: "cool_bedroom_sleep",
    label: "Cool bedroom supports deeper sleep",
    sourceType: "expert",
    url: "https://www.sleepfoundation.org/bedroom-environment/best-temperature-for-sleep",
    summary:
      "Sleep Foundation summarizes work showing 18 to 20°C bedrooms support sleep depth in most adults.",
  },
  no_screens_before_bed: {
    id: "no_screens_before_bed",
    label: "Evening blue light and melatonin",
    sourceType: "study",
    url: "https://pubmed.ncbi.nlm.nih.gov/25535358/",
    summary:
      "Pre-sleep screen exposure can suppress evening melatonin and delay sleep onset in lab settings.",
  },
  cold_face_alerting: {
    id: "cold_face_alerting",
    label: "Brief cold exposure as alerting cue",
    sourceType: "ooddle_rule",
    summary:
      "Internal heuristic: a brief cold face splash can act as a low-cost morning alerting cue. Wellness habit, not a clinical claim.",
  },

  /* ── Supplements ── */
  vit_d3_with_fat: {
    id: "vit_d3_with_fat",
    label: "Vitamin D3 absorption with fat",
    sourceType: "study",
    url: "https://pubmed.ncbi.nlm.nih.gov/25441954/",
    summary:
      "Vitamin D absorption improves when taken with a fat-containing meal compared to fasting.",
  },
  magnesium_glycinate_evening: {
    id: "magnesium_glycinate_evening",
    label: "Magnesium and sleep quality signals",
    sourceType: "study",
    url: "https://pubmed.ncbi.nlm.nih.gov/22364157/",
    summary:
      "Older randomized work suggests evening magnesium supplementation may improve self-reported sleep quality in some adults.",
  },
  omega3_epa_dha: {
    id: "omega3_epa_dha",
    label: "EPA and DHA in cardiometabolic health",
    sourceType: "guideline",
    url: "https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/fats/fish-and-omega-3-fatty-acids",
    summary:
      "American Heart Association supports regular omega-3 intake from fish or supplements for cardiovascular wellness.",
  },
  supplement_safety_general: {
    id: "supplement_safety_general",
    label: "General supplement safety",
    sourceType: "guideline",
    url: "https://ods.od.nih.gov/factsheets/list-all/",
    summary:
      "Supplements may interact with medications or conditions. Educational use only. Check with a clinician if pregnant, managing a condition, or taking medications.",
  },

  /* ── Cross-cutting ── */
  starter_baseline: {
    id: "starter_baseline",
    label: "Starter recommendation",
    sourceType: "starter",
    summary:
      "Selected from a default starter library because Ooddle does not yet have enough of your data to personalize.",
  },
};

export function getEvidence(...keys: string[]): EvidenceReference[] {
  const out: EvidenceReference[] = [];
  for (const key of keys) {
    const e = EVIDENCE_CATALOG[key];
    if (e) out.push(e);
  }
  return out;
}

/* ──────────────────────────────────────────────────────────────────
   Freshness helper. Used by the dashboard and prompt builder to decide
   whether a signal is trustworthy enough to influence recommendations.
   ────────────────────────────────────────────────────────────────── */

const HOUR_MS = 60 * 60 * 1000;

export function computeFreshness(
  observedAt: string | undefined,
  now: number = Date.now()
): FreshnessStatus {
  if (!observedAt) return "missing";
  const t = Date.parse(observedAt);
  if (Number.isNaN(t)) return "missing";
  const ageHours = (now - t) / HOUR_MS;
  if (ageHours < 24) return "fresh";
  if (ageHours < 72) return "aging";
  return "stale";
}

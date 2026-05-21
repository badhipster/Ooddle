"use client";

/**
 * Log a manual health signal. PRD Story 3.1.
 *
 * Validates numeric ranges per type so we never save a 30-hour sleep
 * value. Default freshness is "fresh" because the signal was just
 * observed by the user.
 */

import { useState, useId } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useStore, HealthSignalType } from "@/lib/store";

type Field = {
  id: HealthSignalType;
  label: string;
  emoji: string;
  unit?: string;
  /** Inclusive integer or decimal range. Validation rejects out-of-range. */
  min: number;
  max: number;
  /** Allow decimal values (e.g. sleep duration 7.5h). */
  decimal?: boolean;
  /** For bedtime/wake_time we render a time picker instead of number. */
  isTime?: boolean;
  helper: string;
};

const FIELDS: Field[] = [
  { id: "steps", label: "Steps today", emoji: "👟", unit: "steps", min: 0, max: 100000, helper: "Total step count for today" },
  { id: "sleep_duration", label: "Sleep last night", emoji: "🌙", unit: "hours", min: 0, max: 16, decimal: true, helper: "Hours of sleep last night" },
  { id: "bedtime", label: "Bedtime", emoji: "🛌", isTime: true, min: 0, max: 24, helper: "When you went to bed last night" },
  { id: "wake_time", label: "Wake time", emoji: "🌅", isTime: true, min: 0, max: 24, helper: "When you woke up today" },
  { id: "mood", label: "Mood", emoji: "🙂", min: 1, max: 5, helper: "1 = low, 5 = great" },
  { id: "energy", label: "Energy", emoji: "⚡", min: 1, max: 5, helper: "1 = drained, 5 = sharp" },
  { id: "water_glasses", label: "Water (glasses)", emoji: "💧", unit: "glasses", min: 0, max: 30, helper: "Roughly 250 ml each" },
  { id: "protein_servings", label: "Protein servings", emoji: "🥚", unit: "servings", min: 0, max: 20, helper: "Approximate count of protein-rich servings" },
];

interface LogSignalDialogProps {
  trigger?: React.ReactNode;
}

export function LogSignalDialog({ trigger }: LogSignalDialogProps) {
  const { addHealthSignal } = useStore();
  const [open, setOpen] = useState(false);
  const [fieldId, setFieldId] = useState<HealthSignalType>("steps");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const formId = useId();

  const field = FIELDS.find((f) => f.id === fieldId) ?? FIELDS[0];

  function reset() {
    setValue("");
    setError(null);
  }

  function validate(raw: string, f: Field): { ok: true; value: number | string } | { ok: false; error: string } {
    if (raw.trim() === "") return { ok: false, error: "Please enter a value." };

    if (f.isTime) {
      // HH:MM string. Validate format.
      const match = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
      if (!match) return { ok: false, error: "Use 24-hour time like 22:30." };
      return { ok: true, value: raw };
    }

    const num = Number(raw);
    if (!Number.isFinite(num)) return { ok: false, error: "Please enter a number." };
    if (!f.decimal && !Number.isInteger(num)) return { ok: false, error: "Whole numbers only." };
    if (num < f.min || num > f.max) {
      return { ok: false, error: `Value must be between ${f.min} and ${f.max}.` };
    }
    return { ok: true, value: num };
  }

  function handleSave() {
    const r = validate(value, field);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    addHealthSignal({
      type: field.id,
      value: r.value,
      unit: field.unit,
      sourceType: "manual",
      observedAt: new Date().toISOString(),
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <Dialog.Trigger asChild>
        {trigger ?? (
          <button
            type="button"
            style={{
              padding: "10px 16px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-medium)",
              background: "var(--surface-0)",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            <Plus size={14} aria-hidden="true" />
            Log signal
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 60,
          }}
        />
        <Dialog.Content
          asChild
          aria-describedby={undefined}
        >
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 70,
              width: "min(440px, calc(100vw - 32px))",
              background: "var(--surface-0)",
              borderRadius: "var(--radius-xl)",
              padding: 24,
              boxShadow: "var(--shadow-xl)",
              border: "1px solid var(--border-light)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <Dialog.Title style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>
                Log a signal
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "none",
                    background: "var(--surface-1, rgba(0,0,0,0.04))",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
              Quick manual log. Ooddle will use this in today&apos;s recommendations.
            </p>

            {/* Type picker */}
            <label htmlFor={`${formId}-type`} style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              What are you logging?
            </label>
            <select
              id={`${formId}-type`}
              value={fieldId}
              onChange={(e) => {
                setFieldId(e.target.value as HealthSignalType);
                reset();
              }}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-medium)",
                background: "var(--surface-1)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              {FIELDS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.emoji} {f.label}
                </option>
              ))}
            </select>

            {/* Value input */}
            <label htmlFor={`${formId}-value`} style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              {field.label}
            </label>
            <input
              id={`${formId}-value`}
              type={field.isTime ? "time" : "number"}
              inputMode={field.decimal ? "decimal" : "numeric"}
              step={field.isTime ? undefined : field.decimal ? "0.1" : "1"}
              min={field.isTime ? undefined : field.min}
              max={field.isTime ? undefined : field.max}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder={field.isTime ? "22:30" : `0 to ${field.max}`}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={`${formId}-helper`}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${error ? "rgba(220,38,38,0.6)" : "var(--border-medium)"}`,
                background: "var(--surface-1)",
                fontSize: 14,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            />
            <div
              id={`${formId}-helper`}
              style={{ fontSize: 12, color: error ? "rgba(180, 30, 30, 1)" : "var(--text-tertiary)", marginBottom: 18 }}
            >
              {error ?? field.helper}
              {field.unit && !error ? ` (${field.unit})` : null}
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Dialog.Close asChild>
                <button
                  type="button"
                  style={{
                    padding: "10px 16px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--border-light)",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: "10px 20px",
                  borderRadius: "var(--radius-full)",
                  background: "linear-gradient(135deg, var(--ooddle-primary), var(--ooddle-primary-dark))",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 13,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                Save
              </button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

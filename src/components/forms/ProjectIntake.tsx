"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import Label from "@/components/site/Label";
import { PREFILL_EVENT } from "@/lib/intake";
import { track } from "@/lib/analytics";
import { captureUtm, getSessionId } from "@/lib/utm";

// Keep in sync with `intake` in src/data/services.ts (used to pre-select an option).
const NEEDS = [
  "Website / web app",
  "UI/UX design",
  "Portfolio",
  "College project",
  "Data",
  "AI / ML",
  "Automation",
  "Testing / QA",
  "Resume",
  "LinkedIn",
  "Something else",
];

const TIMELINES = ["ASAP", "This week", "1–2 weeks", "Flexible"];

type Step = 1 | 2 | 3 | 4 | 5;

export default function ProjectIntake() {
  const [step, setStep] = useState<Step>(1);
  const [need, setNeed] = useState("");
  const [details, setDetails] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const started = useRef(false);
  const completedSteps = useRef(new Set<number>());

  useEffect(() => {
    if (!started.current && (need || details)) {
      started.current = true;
      track("form_started");
    }
  }, [need, details]);

  useEffect(() => {
    function onPrefill(e: Event) {
      const n = (e as CustomEvent<{ need?: string }>).detail?.need;
      if (!n || !NEEDS.includes(n)) return;
      setNeed(n);
      setError(null);
      setStep((s) => (s === 5 ? s : 2));
    }
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  function goNext(current: Step, next: Step) {
    if (!completedSteps.current.has(current)) {
      completedSteps.current.add(current);
      track("form_step_completed", { step: String(current) });
    }
    setError(null);
    setStep(next);
  }

  async function handleSubmit() {
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          need,
          details,
          timeline,
          name,
          email,
          contact,
          website, // honeypot, forwarded as-is
          utm: captureUtm(),
          sessionId: getSessionId(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "invalid_email") {
          setError("That email doesn't look right.");
        } else if (data.error === "rate_limited") {
          setError("Too many attempts. Please wait a moment and try again.");
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Something went wrong — try again.");
        }
        setSubmitting(false);
        return;
      }
      track("form_submitted", { need });
      goNext(4 as Step, 5);
    } catch {
      setError("Something went wrong — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="start" className="section">
      <div className="wrap">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Label>Start a project</Label>
          <h2 className="mt-6 font-display text-[clamp(2.3rem,5vw,4rem)] font-bold leading-[1] tracking-[-0.035em]">
            Tell us what you need.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            Four short steps. We read every one and reply with next steps, or an honest &ldquo;this isn&apos;t for us&rdquo;.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-12 max-w-3xl">
        <div className="rounded-[32px] border border-border bg-bg-elevated p-6 shadow-[0_30px_80px_-50px_rgba(22,22,26,0.4)] sm:p-10">
          {step < 5 && (
            <div className="mb-8 flex items-center gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <span
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    s <= step ? "bg-accent" : "bg-border"
                  }`}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <p className="eyebrow mb-5">Step 1 of 4 · What do you need?</p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3" role="group" aria-label="What do you need?">
                  {NEEDS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setNeed(n)}
                      type="button"
                      aria-pressed={need === n}
                      className={`rounded-2xl border px-3 py-3.5 text-left text-[15px] font-medium transition-colors duration-150 ${
                        need === n
                          ? "border-accent bg-accent-soft text-accent-strong"
                          : "border-border text-text-primary hover:border-border-strong"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    disabled={!need}
                    onClick={() => goNext(1, 2)}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-white transition-[background-color,opacity] hover:bg-accent-strong disabled:opacity-30"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <p className="eyebrow mb-5">Step 2 of 4 · Tell us about it</p>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  placeholder="What's the situation? What have you tried? What does 'done' look like?"
                  aria-label="Project details"
                  className="w-full resize-none rounded-2xl border border-border-strong bg-bg px-4 py-3.5 text-[15px] text-text-primary placeholder:text-text-tertiary focus:border-text-primary focus:outline-none"
                />
                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-[15px] font-medium text-text-secondary hover:text-text-primary">
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    type="button"
                    disabled={!details.trim()}
                    onClick={() => goNext(2, 3)}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-white transition-[background-color,opacity] hover:bg-accent-strong disabled:opacity-30"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <p className="eyebrow mb-5">Step 3 of 4 · Timeline</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {TIMELINES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeline(t)}
                      type="button"
                      aria-pressed={timeline === t}
                      className={`rounded-2xl border px-3 py-3.5 text-left text-[15px] font-medium transition-colors duration-150 ${
                        timeline === t
                          ? "border-accent bg-accent-soft text-accent-strong"
                          : "border-border text-text-primary hover:border-border-strong"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-2 text-[15px] font-medium text-text-secondary hover:text-text-primary">
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    type="button"
                    disabled={!timeline}
                    onClick={() => goNext(3, 4)}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-white transition-[background-color,opacity] hover:bg-accent-strong disabled:opacity-30"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <p className="eyebrow mb-5">Step 4 of 4 · How do we reach you?</p>
                <div className="space-y-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    aria-label="Name"
                    autoComplete="name"
                    maxLength={100}
                    className="w-full rounded-2xl border border-border-strong bg-bg px-4 py-3.5 text-[15px] placeholder:text-text-tertiary focus:border-text-primary focus:outline-none"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    autoComplete="email"
                    maxLength={200}
                    className="w-full rounded-2xl border border-border-strong bg-bg px-4 py-3.5 text-[15px] placeholder:text-text-tertiary focus:border-text-primary focus:outline-none"
                  />
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="LinkedIn or WhatsApp (optional)"
                    aria-label="LinkedIn or WhatsApp (optional)"
                    maxLength={200}
                    className="w-full rounded-2xl border border-border-strong bg-bg px-4 py-3.5 text-[15px] placeholder:text-text-tertiary focus:border-text-primary focus:outline-none"
                  />
                  {/* honeypot — hidden from real users */}
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />
                </div>
                {error && <p role="alert" className="mt-3 text-sm font-medium text-red-700">{error}</p>}
                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={() => setStep(3)} className="inline-flex items-center gap-2 text-[15px] font-medium text-text-secondary hover:text-text-primary">
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    type="button"
                    disabled={submitting || !name.trim() || !email.trim()}
                    onClick={handleSubmit}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-white transition-[background-color,opacity] hover:bg-accent-strong disabled:opacity-30"
                  >
                    {submitting ? "Sending…" : "Send"} <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="5"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-signal-soft text-signal">
                  <Check size={22} />
                </div>
                <p className="mt-5 font-display text-2xl font-bold tracking-[-0.01em]">
                  Got it. We&apos;ll take a look and get back to you.
                </p>
                <p className="mt-2 text-[15px] text-text-secondary">
                  Usually within a day or two, depending on the timeline you gave.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

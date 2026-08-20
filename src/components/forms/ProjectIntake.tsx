"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { track } from "@/lib/analytics";
import { captureUtm, getSessionId } from "@/lib/utm";

const NEEDS = [
  "Resume",
  "LinkedIn",
  "Portfolio",
  "Website",
  "College Project",
  "Data",
  "AI/ML",
  "Automation",
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
        setError(data.error === "invalid_email" ? "That email doesn't look right." : "Something went wrong — try again.");
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
    <section id="start" className="border-t border-border-soft bg-bg-elevated/30">
      <div className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
        <SectionHeading eyebrow="Start a project" title="Tell me what you need." align="center" />

        <div className="mt-10 rounded-2xl border border-border bg-bg p-6 sm:p-8">
          {step < 5 && (
            <div className="mb-8 flex items-center gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <span
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    s <= step ? "bg-accent" : "bg-border"
                  }`}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <p className="eyebrow mb-4">01 · What do you need?</p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {NEEDS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setNeed(n)}
                      className={`rounded-xl border px-3 py-3 text-sm transition-colors duration-150 ${
                        need === n
                          ? "border-accent bg-accent-soft text-accent-strong"
                          : "border-border text-text-secondary hover:border-accent/40"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    disabled={!need}
                    onClick={() => goNext(1, 2)}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-[#161006] transition-opacity disabled:opacity-30"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <p className="eyebrow mb-4">02 · Tell me about it</p>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  placeholder="What's the situation? What have you tried? What does 'done' look like?"
                  className="w-full resize-none rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent"
                />
                <div className="mt-8 flex justify-between">
                  <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary">
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    disabled={!details.trim()}
                    onClick={() => goNext(2, 3)}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-[#161006] transition-opacity disabled:opacity-30"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <p className="eyebrow mb-4">03 · Timeline</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {TIMELINES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeline(t)}
                      className={`rounded-xl border px-3 py-3 text-sm transition-colors duration-150 ${
                        timeline === t
                          ? "border-accent bg-accent-soft text-accent-strong"
                          : "border-border text-text-secondary hover:border-accent/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary">
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    disabled={!timeline}
                    onClick={() => goNext(3, 4)}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-[#161006] transition-opacity disabled:opacity-30"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="4" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <p className="eyebrow mb-4">04 · How do I reach you?</p>
                <div className="space-y-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    maxLength={100}
                    className="w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm placeholder:text-text-tertiary focus:border-accent"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    maxLength={200}
                    className="w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm placeholder:text-text-tertiary focus:border-accent"
                  />
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="LinkedIn / WhatsApp (optional)"
                    maxLength={200}
                    className="w-full rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm placeholder:text-text-tertiary focus:border-accent"
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
                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                <div className="mt-8 flex justify-between">
                  <button onClick={() => setStep(3)} className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary">
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    disabled={submitting || !name.trim() || !email.trim()}
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-[#161006] transition-opacity disabled:opacity-30"
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
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
                  <Check size={22} />
                </div>
                <p className="mt-5 font-display text-xl font-medium">
                  Got it. I&apos;ll take a look and get back to you.
                </p>
                <p className="mt-2 text-sm text-text-tertiary">
                  Usually within a day or two, depending on the timeline you gave.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

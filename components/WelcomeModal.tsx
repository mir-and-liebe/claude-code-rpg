"use client";

import { useState, useEffect } from "react";
import { Swords, ArrowRight, Sparkles, Terminal, Bot, Rocket } from "lucide-react";

interface Props {
  hasProgress: boolean;
  onDismiss: () => void;
}

const steps = [
  {
    Icon: Swords,
    title: "Welcome to CC RPG",
    text: "This is your personal mastery dashboard for Claude Code. Every skill you complete here maps to a real Claude Code capability — commands, agents, MCPs, and workflows.",
  },
  {
    Icon: Terminal,
    title: "What is Vibecoding?",
    text: "Vibecoding means building software by directing AI instead of writing every line yourself. You describe what you want, AI writes the code. Your job is to prompt, review, and ship — like a PM who codes.",
  },
  {
    Icon: Bot,
    title: "How It Works",
    text: "Complete skill challenges to earn XP and level up. Each challenge tests your knowledge of Claude Code. Pass the challenge, earn the skill. Skip if you already know it. Review daily to retain what you've learned.",
  },
  {
    Icon: Rocket,
    title: "Start Your Journey",
    text: "Head to the Skill Trees and pick your first challenge. The Recommended Next card on your dashboard always shows what to do next. Use Cmd+K anytime to look up commands, agents, or MCPs.",
  },
];

export function WelcomeModal({ hasProgress, onDismiss }: Props) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (hasProgress) return;
    const seen = localStorage.getItem("cc-rpg-welcome-seen");
    if (!seen) setShow(true);
  }, [hasProgress]);

  if (!show) return null;

  function handleFinish() {
    localStorage.setItem("cc-rpg-welcome-seen", "true");
    setShow(false);
    onDismiss();
  }

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/90 backdrop-blur-md">
      <div className="max-w-md w-full mx-4 card p-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <current.Icon className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="text-2xl mb-3">{current.title}</h2>
        <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
          {current.text}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step ? "bg-gold w-6" : i < step ? "bg-gold/40" : "bg-border"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-2.5 rounded-lg border border-border text-text-muted text-sm hover:text-text cursor-pointer"
            >
              Back
            </button>
          )}
          {step === 0 && (
            <button
              onClick={handleFinish}
              className="px-4 py-2.5 rounded-lg border border-border text-text-muted text-sm hover:text-text cursor-pointer"
            >
              Skip
            </button>
          )}
          <button
            onClick={isLast ? handleFinish : () => setStep((s) => s + 1)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm font-semibold hover:bg-gold/15 cursor-pointer"
          >
            {isLast ? (
              <>
                <Sparkles className="w-4 h-4" />
                Begin
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useProgress } from "@/lib/use-progress";
import { Swords, Cpu, Rocket, Loader2, Save, User, Shield } from "lucide-react";
import type { CharacterClass } from "@/lib/types";

const classes: {
  id: CharacterClass;
  name: string;
  description: string;
  bonusTrees: string;
  Icon: typeof Swords;
}[] = [
  {
    id: "architect",
    name: "Architect",
    description: "+25% XP in Prompt Architect & Agent Craft",
    bonusTrees: "Prompt + Agents",
    Icon: Swords,
  },
  {
    id: "operator",
    name: "Operator",
    description: "+25% XP in CLI Dominance & MCP Mastery",
    bonusTrees: "CLI + MCPs",
    Icon: Cpu,
  },
  {
    id: "shipper",
    name: "Shipper",
    description: "+25% XP in Product Shipper & Code Comprehension",
    bonusTrees: "Product + Code",
    Icon: Rocket,
  },
];

export default function CharacterPage() {
  const { progress, loading, updateCharacter } = useProgress();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState<CharacterClass>("");
  const [saved, setSaved] = useState(false);

  // Initialize from progress once loaded
  if (!loading && progress && !name && !title) {
    setName(progress.character_name);
    setTitle(progress.character_title);
    setSelectedClass((progress.character_class || "") as CharacterClass);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
      </div>
    );
  }

  function handleSave() {
    updateCharacter({
      character_name: name,
      character_title: title,
      character_class: selectedClass,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl">Character</h1>
        <p className="text-sm text-text-muted mt-1">
          Customize your vibecoder identity
        </p>
      </div>

      <div className="card p-6 space-y-5">
        <div>
          <label className="text-[10px] text-text-muted tracking-widest uppercase font-mono mb-1.5 flex items-center gap-1.5">
            <User className="w-3 h-3" />
            Character Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text focus:border-gold/40 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] text-text-muted tracking-widest uppercase font-mono mb-1.5 flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text focus:border-gold/40 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl mb-2">Choose Your Class</h2>
        <p className="text-[13px] text-text-muted mb-5">
          Your class gives +25% XP bonus to two skill trees. Choose based on
          your learning priority.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                selectedClass === cls.id
                  ? "border-gold/30 bg-gold/[0.05]"
                  : "border-border bg-surface hover:border-border-subtle"
              }`}
            >
              <cls.Icon
                className={`w-5 h-5 mb-2 ${
                  selectedClass === cls.id ? "text-gold" : "text-text-muted"
                }`}
              />
              <p className="text-sm font-semibold">{cls.name}</p>
              <p className="text-[11px] text-text-muted mt-1">
                {cls.description}
              </p>
              <p className="text-[10px] text-gold/60 mt-1.5 font-mono">
                {cls.bonusTrees}
              </p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3 rounded-xl bg-gold/10 border border-gold/20 text-gold text-sm font-semibold hover:bg-gold/15 transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        {saved ? "Saved!" : "Save Character"}
      </button>
    </div>
  );
}

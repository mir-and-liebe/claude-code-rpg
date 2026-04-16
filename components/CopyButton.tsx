"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md border border-border hover:border-gold/40 hover:bg-gold/5 transition-all duration-200 cursor-pointer"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-gold" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-text-muted" />
      )}
    </button>
  );
}

"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

export function CopyButton({ address, label = "Copy address", compact = false }: { address: string; label?: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const short = `${address.slice(0, 4)}…${address.slice(-4)}`;
  return (
    <button
      type="button"
      onClick={copy}
      title={`${label}: ${address} · example data`}
      aria-label={copied ? "Address copied" : label}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel/80 px-2 py-1 font-mono text-[11px] font-semibold text-ink-soft transition hover:border-[color:var(--border-strong)] hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand active:scale-[0.98]"
    >
      {copied ? <Check size={13} weight="bold" className="text-up" /> : <Copy size={13} weight="bold" />}
      {!compact && <span>{copied ? "Copied" : short}</span>}
    </button>
  );
}

"use client";

import { Clipboard } from "lucide-react";
import { useState } from "react";

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="inline-flex min-h-10 items-center justify-center gap-2 border border-[var(--line)] px-3 text-sm font-semibold"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
    >
      <Clipboard size={16} />
      {copied ? "Copied" : label}
    </button>
  );
}

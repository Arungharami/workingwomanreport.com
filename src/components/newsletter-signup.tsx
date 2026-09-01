"use client";

import { Mail } from "lucide-react";
import { useState } from "react";

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [message, setMessage] = useState("");

  return (
    <form
      className={compact ? "" : "bg-[var(--foreground)] p-6 text-[var(--background)]"}
      onSubmit={(event) => {
        event.preventDefault();
        setMessage(
          "Signup is in safe development mode until a newsletter provider is configured.",
        );
      }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em]">
        Newsletter
      </h3>
      <p className="mt-3 text-sm leading-6 opacity-80">
        Get the weekly report, video links, and social package highlights.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={compact ? "footer-email" : "email"}>
          Email address
        </label>
        <input
          id={compact ? "footer-email" : "email"}
          type="email"
          required
          placeholder="you@example.com"
          className="min-h-11 min-w-0 flex-1 border border-[var(--line)] bg-[var(--paper)] px-3 text-sm text-[var(--foreground)]"
        />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--accent)] px-4 text-sm font-semibold text-white"
        >
          <Mail size={17} />
          Sign up
        </button>
      </div>
      {message ? (
        <p className="mt-3 text-xs opacity-80" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}

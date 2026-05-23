"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/button";
import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-full border border-sage/40 bg-sage/10 px-6 py-3.5 text-sage-dark",
          className
        )}
      >
        <CheckIcon className="shrink-0" />
        <span className="text-[0.95rem]">
          You&apos;re on the list — welcome. We&apos;ll be in touch softly.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex w-full flex-col gap-3 sm:flex-row sm:items-center",
        className
      )}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="h-12 flex-1 rounded-full border border-line-strong bg-cream px-5 text-ink placeholder:text-mist focus:border-oak focus:outline-none focus-visible:outline-none"
      />
      <ActionButton
        type="submit"
        variant="primary"
        size="md"
        disabled={status === "loading"}
        className="h-12 shrink-0"
      >
        {status === "loading" ? "Joining…" : "Join the list"}
      </ActionButton>
      {status === "error" && (
        <p className="text-sm text-oak-dark sm:hidden">
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}

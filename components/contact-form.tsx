"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/button";
import { CheckIcon } from "@/components/icons";

const fieldClass =
  "h-12 w-full rounded-xl border border-line-strong bg-cream px-4 text-ink placeholder:text-mist focus:border-oak focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-start gap-3 rounded-card border border-sage/40 bg-sage/10 px-6 py-6 text-sage-dark">
        <CheckIcon className="mt-0.5 shrink-0" />
        <div>
          <p className="font-serif text-lg text-ink">Thank you — message sent.</p>
          <p className="mt-1 text-[0.95rem] text-stone">
            We read every note and will get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="sr-only">
            Your name
          </label>
          <input id="name" name="name" required placeholder="Your name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            className={fieldClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="sr-only">
          Subject
        </label>
        <input id="subject" name="subject" placeholder="Subject (optional)" className={fieldClass} />
      </div>
      <div>
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="How can we help?"
          className="w-full rounded-xl border border-line-strong bg-cream px-4 py-3 text-ink placeholder:text-mist focus:border-oak focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-4">
        <ActionButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending…" : "Send message"}
        </ActionButton>
        {status === "error" && (
          <p className="text-sm text-oak-dark">
            Something went wrong — please try again.
          </p>
        )}
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { ActionButton } from "@/components/ui/button";
import { HeartIcon } from "@/components/icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Incorrect password.");
      }
      const from = new URLSearchParams(window.location.search).get("from");
      router.push(from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            <span className="font-serif text-2xl text-ink">{BRAND.name}</span>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1.5 font-script text-xl text-stone">
            Studio admin
            <HeartIcon className="h-3.5 w-3.5 text-heart" />
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-card border border-line bg-shell p-7 shadow-soft"
        >
          <label
            htmlFor="password"
            className="text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-stone"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-line-strong bg-cream px-4 text-ink focus:border-oak focus:outline-none"
          />
          {status === "error" && (
            <p className="mt-3 text-sm text-heart">{message}</p>
          )}
          <ActionButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={status === "loading"}
            className="mt-5 w-full"
          >
            {status === "loading" ? "Signing in…" : "Sign in"}
          </ActionButton>
        </form>

        <p className="mt-6 text-center text-[0.8rem] text-mist">
          Private studio area for {BRAND.name}.
        </p>
      </div>
    </div>
  );
}

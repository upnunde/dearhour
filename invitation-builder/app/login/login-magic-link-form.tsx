"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type FormState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string };

export default function LoginMagicLinkForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setState({ kind: "sending" });

    try {
      const supabase = createSupabaseBrowserClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setState({ kind: "error", message: error.message });
        return;
      }

      setState({ kind: "sent", email: trimmed });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "요청 중 오류가 발생했습니다.",
      });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
        <strong className="font-semibold">{state.email}</strong> 로 로그인 링크를 보냈습니다.
        <br />
        메일함(스팸함 포함)을 확인해 주세요.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="block text-xs text-[#6b7280]" htmlFor="login-email">
        이메일
      </label>
      <input
        id="login-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        disabled={state.kind === "sending"}
        className="block h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-[#111] outline-none focus:border-[#111] disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={state.kind === "sending" || !email.trim()}
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#111] text-sm font-medium text-white hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.kind === "sending" ? "전송 중..." : "이메일로 로그인 링크 받기"}
      </button>
      {state.kind === "error" ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

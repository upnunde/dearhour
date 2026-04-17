"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string };

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<FormState>({ kind: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) return;

    setState({ kind: "submitting" });

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setState({
          kind: "error",
          message:
            error.message === "Invalid login credentials"
              ? "이메일 또는 비밀번호가 일치하지 않습니다."
              : error.message,
        });
        return;
      }

      // 서버가 새 세션 쿠키를 읽도록 full reload.
      window.location.assign("/admin");
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.",
      });
    }
  }

  const disabled = state.kind === "submitting";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <label className="block text-xs text-[#6b7280]" htmlFor="admin-email">
          이메일
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={disabled}
          className="block h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-[#111] outline-none focus:border-[#111] disabled:opacity-60"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs text-[#6b7280]" htmlFor="admin-password">
          비밀번호
        </label>
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={disabled}
          className="block h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-[#111] outline-none focus:border-[#111] disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={disabled || !email.trim() || !password}
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#111] text-sm font-medium text-white hover:bg-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled ? "로그인 중..." : "마스터 로그인"}
      </button>

      {state.kind === "error" ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

"use client";

import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EXPECTED_PIN_HASH, sha256Hex, timingSafeEqual } from "./pin";

interface AccessPortalProps {
  onUnlock: () => void;
  message?: string;
}

export function AccessPortal({ onUnlock, message }: AccessPortalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(message ?? "");
  const [shake, setShake] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (lockoutUntil <= Date.now()) return;

    const tick = () => {
      const remaining = Math.max(0, lockoutUntil - Date.now());
      setRemainingSeconds(Math.ceil(remaining / 1000));
      if (remaining <= 0) {
        setLockoutUntil(0);
        setError("");
      }
    };

    const interval = window.setInterval(tick, 500);
    return () => window.clearInterval(interval);
  }, [lockoutUntil]);

  function showError(text: string, shouldShake = true) {
    setError(text);
    if (shouldShake) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
    }
  }

  async function verifyCode() {
    if (Date.now() < lockoutUntil) return;

    const normalized = code.trim();
    if (!/^\d{4}$/.test(normalized)) {
      showError("ENTER A VALID 4-DIGIT CODE.");
      setCode("");
      return;
    }

    try {
      const hashed = await sha256Hex(normalized);
      if (timingSafeEqual(hashed, EXPECTED_PIN_HASH)) {
        setFailedAttempts(0);
        setError("");
        setCode("");
        onUnlock();
        return;
      }

      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      showError("INCORRECT CODE. ACCESS DENIED.");
      setCode("");

      if (nextAttempts >= 5) {
        setFailedAttempts(0);
        const until = Date.now() + 30_000;
        setLockoutUntil(until);
        setRemainingSeconds(30);
      }
    } catch {
      showError("SECURE LOGIN REQUIRES HTTPS OR LOCALHOST.", false);
    }
  }

  const lockedOut = remainingSeconds > 0;
  const visibleError = lockedOut
    ? `TOO MANY ATTEMPTS. TRY AGAIN IN ${remainingSeconds}s.`
    : error;

  return (
    <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-[linear-gradient(135deg,#0755DB_0%,#043996_100%)] p-4">
      <section className="w-full max-w-[350px] rounded-3xl bg-white p-10 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex items-center justify-center gap-3">
          <div className="sq-brand-blue sq-pill-center h-16 w-16 rounded-full">
            <LockKeyhole className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <Image src="/SapphireQuest.png" width={132} height={58} alt="Sapphire Quest Travel & Tours Ltd" className="h-12 w-auto object-contain" priority />
        </div>

        <h1 className="mb-2 text-2xl font-black text-slate-800">Access Portal</h1>
        <p className="mb-8 text-sm leading-5 text-slate-500">
          Enter the secure 4-digit code to open the Sapphire Quest Invoice System.
        </p>

        <input
          ref={inputRef}
          type="password"
          maxLength={4}
          inputMode="numeric"
          autoComplete="off"
          placeholder="****"
          value={code}
          disabled={lockedOut}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 4))}
          onKeyDown={(event) => {
            if (event.key === "Enter") void verifyCode();
          }}
          aria-label="4-digit access code"
          className={`mb-6 block w-full max-w-full border-0 border-b-[3px] border-slate-200 bg-transparent text-center text-3xl font-black tracking-[0.5em] outline-none transition focus:border-[#0755DB] disabled:opacity-60 ${shake ? "sq-error-shake" : ""}`}
        />

        <button
          type="button"
          onClick={() => void verifyCode()}
          disabled={lockedOut}
          className="sq-brand-blue w-full rounded-xl py-4 text-lg font-bold text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          UNLOCK SYSTEM
        </button>

        <p className={`mt-4 min-h-4 text-xs font-bold text-red-500 ${visibleError ? "opacity-100" : "opacity-0"}`} aria-live="polite">
          {visibleError || "INCORRECT CODE. ACCESS DENIED."}
        </p>
      </section>
    </main>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PillButton } from "./PillButton";

/** variant "pill" (default): input + black pill. variant "rect": 6px-radius input + black rectangle button, equal height. */
export function EmailCaptureForm({ buttonLabel, className = "", variant = "pill" }: { buttonLabel: string; className?: string; variant?: "pill" | "rect" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: send `email` to your email provider / CRM (Mailchimp, ConvertKit, GoHighLevel, etc.) before redirecting.
    router.push("/thank-you");
  }

  const rect = variant === "rect";
  return (
    <form onSubmit={onSubmit} className={`flex w-full flex-col ${rect ? "gap-2 sm:flex-row" : "gap-3 sm:flex-row"} ${className}`}>
      <label htmlFor="email-capture" className="sr-only">Email address</label>
      <input
        id="email-capture"
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={rect ? "field h-[52px] w-full !rounded-md sm:w-[400px]" : "field flex-1"}
      />
      {rect ? (
        <button type="submit" className="h-[52px] w-full rounded-md bg-black px-7 text-[16px] leading-none text-white sm:w-auto">{buttonLabel}</button>
      ) : (
        <PillButton type="submit">{buttonLabel}</PillButton>
      )}
    </form>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PillButton } from "./PillButton";

export function EmailCaptureForm({ buttonLabel, className = "" }: { buttonLabel: string; className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: send `email` to your email provider / CRM (Mailchimp, ConvertKit, GoHighLevel, etc.) before redirecting.
    router.push("/thank-you");
  }

  return (
    <form onSubmit={onSubmit} className={`flex w-full flex-col gap-3 sm:flex-row ${className}`}>
      <label htmlFor="email-capture" className="sr-only">Email address</label>
      <input id="email-capture" type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="field flex-1" />
      <PillButton type="submit">{buttonLabel}</PillButton>
    </form>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { siteConfig } from "@/site.config";
import { EMAIL_RE, submitLead } from "@/lib/subscribe";
import { Honeypot } from "./Honeypot";
import { PillButton } from "./PillButton";

/** variant "pill" (default): input + black pill. variant "rect": 6px-radius input + black rectangle button, equal height. */
export function EmailCaptureForm({ buttonLabel, className = "", variant = "pill", large = false }: { buttonLabel: string; className?: string; variant?: "pill" | "rect"; large?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const id = useId();

  /** Saves the email in MailerLite ("3 Tips Opt-In" group, via /api/subscribe), then goes to /thank-you. */
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const address = email.trim();
    if (!EMAIL_RE.test(address)) return setError("Please enter a valid email address.");
    setError("");
    setLoading(true);
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    if (await submitLead({ email: address, list: "tips", website })) {
      router.push("/thank-you");
    } else {
      setLoading(false);
      setError(`Something went wrong. Please try again, or call us at ${siteConfig.phone}.`);
    }
  }

  const rect = variant === "rect";
  const label = loading ? "Sending..." : buttonLabel;
  return (
    <div className={`relative w-full ${className}`}>
    <form onSubmit={onSubmit} noValidate className={`flex w-full flex-col ${rect ? "gap-[10px] sm:flex-row" : "gap-3 sm:flex-row"}`}>
      <Honeypot />
      <label htmlFor={id} className="sr-only">Email address</label>
      <input
        id={id}
        type="email"
        required
        autoComplete="email"
        aria-invalid={error ? true : undefined}
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={rect ? "field h-[46px] w-full !rounded-md !py-0 !text-[16px] sm:w-[300px] lg:h-[50px] lg:w-[241px]" : large ? "field h-14 w-full !py-0 !text-[16px] sm:flex-1 md:h-[59px] md:!text-[18px]" : "field h-12 w-full !py-0 !text-[16px] sm:flex-1"}
      />
      {rect ? (
        <button type="submit" disabled={loading} className="h-[46px] w-full rounded-md bg-black px-7 text-[16px] leading-none text-white sm:w-auto lg:h-[50px] lg:w-[101px] lg:px-0 disabled:cursor-wait disabled:opacity-60">{label}</button>
      ) : (
        <PillButton type="submit" disabled={loading} className={`${large ? "h-14 !text-[16px] md:h-[59px] md:!px-10 md:!text-[18px]" : ""} disabled:cursor-wait disabled:opacity-60`}>{label}</PillButton>
      )}
    </form>
    {error && <p role="alert" className="mt-3 text-left text-[14px] text-[#B42318]">{error}</p>}
    </div>
  );
}

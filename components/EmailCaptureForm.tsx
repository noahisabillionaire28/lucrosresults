"use client";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { PillButton } from "./PillButton";

/** variant "pill" (default): input + black pill. variant "rect": 6px-radius input + black rectangle button, equal height. */
export function EmailCaptureForm({ buttonLabel, className = "", variant = "pill", large = false }: { buttonLabel: string; className?: string; variant?: "pill" | "rect"; large?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const id = useId();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: send `email` to your email provider / CRM (Mailchimp, ConvertKit, GoHighLevel, etc.) before redirecting.
    router.push("/thank-you");
  }

  const rect = variant === "rect";
  return (
    <form onSubmit={onSubmit} className={`flex w-full flex-col ${rect ? "gap-[10px] sm:flex-row" : "gap-3 sm:flex-row"} ${className}`}>
      <label htmlFor={id} className="sr-only">Email address</label>
      <input
        id={id}
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={rect ? "field h-[46px] w-full !rounded-md !py-0 !text-[16px] sm:w-[300px] lg:h-[50px] lg:w-[241px]" : large ? "field h-14 w-full !py-0 !text-[16px] sm:flex-1 md:h-[59px] md:!text-[18px]" : "field h-12 w-full !py-0 !text-[16px] sm:flex-1"}
      />
      {rect ? (
        <button type="submit" className="h-[46px] w-full rounded-md bg-black px-7 text-[16px] leading-none text-white sm:w-auto lg:h-[50px] lg:w-[101px] lg:px-0">{buttonLabel}</button>
      ) : (
        <PillButton type="submit" className={large ? "h-14 !text-[16px] md:h-[59px] md:!px-10 md:!text-[18px]" : ""}>{buttonLabel}</PillButton>
      )}
    </form>
  );
}

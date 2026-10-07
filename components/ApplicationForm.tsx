"use client";
import { useId, useState, type FormEvent } from "react";
import { EMAIL_RE, submitLead } from "@/lib/subscribe";
import { siteConfig } from "@/site.config";
import { Honeypot } from "./Honeypot";
import { PillButton } from "./PillButton";

/** Application form on /google. Saved in MailerLite ("Leads" group) with name, phone, industry and message fields. */
export function ApplicationForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const id = useId();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    if (!EMAIL_RE.test(get("email"))) return setError("Please enter a valid email address.");
    setError("");
    setLoading(true);
    const spend = get("spend"), help = get("help");
    const message = [spend && `Current monthly marketing spend: ${spend}`, help].filter(Boolean).join("\n\n");
    const ok = await submitLead({ email: get("email"), list: "lead", name: get("name"), phone: get("phone"), industry: get("industry"), message, website: get("website") });
    setLoading(false);
    if (ok) setSent(true);
    else setError(`Something went wrong. Please try again, or call us at ${siteConfig.phone}.`);
  }

  if (sent) return <p className="text-[20px] tracking-[-0.03em] text-black">Thanks. We got your application and will be in touch shortly.</p>;

  const f = (name: string, label: string, type = "text") => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${id}-${name}`} className="text-[15px] text-black">{label}</label>
      <input id={`${id}-${name}`} name={name} type={type} required className="field" />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="relative grid gap-4 md:grid-cols-2">
      <Honeypot />
      {f("name", "Name")}
      {f("phone", "Phone", "tel")}
      {f("email", "Email", "email")}
      {f("industry", "Industry")}
      <div className="md:col-span-2">{f("spend", "Current monthly marketing spend")}</div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label htmlFor={`${id}-help`} className="text-[15px] text-black">What do you need help with?</label>
        <textarea id={`${id}-help`} name="help" rows={5} className="field resize-none" />
      </div>
      <div className="flex flex-col items-start gap-3 md:col-span-2">
        <PillButton type="submit" disabled={loading} className="disabled:cursor-wait disabled:opacity-60">{loading ? "Sending..." : "Submit"}</PillButton>
        {error && <p role="alert" className="text-[14px] text-[#B42318]">{error}</p>}
      </div>
    </form>
  );
}

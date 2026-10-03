"use client";
import { useId, useState, type FormEvent } from "react";
import { PillButton } from "./PillButton";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const id = useId();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: POST new FormData(e.currentTarget) to your backend / CRM / email service (not wired up yet).
    setSent(true);
  }

  if (sent) return <p className="text-[20px] tracking-[-0.03em] text-black">Thanks. We got your message and will reply shortly.</p>;

  const f = (name: string, label: string, type = "text") => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${id}-${name}`} className="text-[15px] text-black">{label}</label>
      <input id={`${id}-${name}`} name={name} type={type} required className="field" />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      {f("name", "Name")}
      {f("phone", "Phone", "tel")}
      <div className="md:col-span-2">{f("email", "Email", "email")}</div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label htmlFor={`${id}-message`} className="text-[15px] text-black">How can we help?</label>
        <textarea id={`${id}-message`} name="message" rows={5} required className="field resize-none" />
      </div>
      <div className="md:col-span-2"><PillButton type="submit">Send Message</PillButton></div>
    </form>
  );
}

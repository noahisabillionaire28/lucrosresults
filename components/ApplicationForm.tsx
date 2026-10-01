"use client";
import { useState, type FormEvent } from "react";
import { PillButton } from "./PillButton";

export function ApplicationForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: POST new FormData(e.currentTarget) to your CRM / email / webhook.
    setSent(true);
  }

  if (sent) return <p className="text-[20px] tracking-[-0.03em] text-black">Thanks — we got your application and will be in touch shortly.</p>;

  const f = (name: string, label: string, type = "text") => (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-[15px] text-black">{label}</label>
      <input id={name} name={name} type={type} required className="field" />
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      {f("name", "Name")}
      {f("phone", "Phone", "tel")}
      {f("email", "Email", "email")}
      {f("industry", "Industry")}
      <div className="md:col-span-2">{f("spend", "Current monthly marketing spend")}</div>
      <div className="flex flex-col gap-2 md:col-span-2">
        <label htmlFor="help" className="text-[15px] text-black">What do you need help with?</label>
        <textarea id="help" name="help" rows={5} className="field resize-none" />
      </div>
      <div className="md:col-span-2"><PillButton type="submit">Submit</PillButton></div>
    </form>
  );
}

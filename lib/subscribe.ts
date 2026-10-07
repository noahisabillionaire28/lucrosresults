/** Browser helper: posts a lead to /api/subscribe. Resolves true on success. */
export type LeadPayload = { email: string; list: "tips" | "lead"; name?: string; phone?: string; industry?: string; message?: string; website?: string };

export async function submitLead(payload: LeadPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json().catch(() => null);
    return res.ok && json?.ok === true;
  } catch {
    return false;
  }
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

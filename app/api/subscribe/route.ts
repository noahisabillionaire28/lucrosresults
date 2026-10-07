import { NextResponse } from "next/server";

/**
 * POST /api/subscribe: saves a lead in MailerLite. Server-side only: the API key (MAILERLITE_API_KEY) never reaches the browser.
 * Body: { email, list: "tips" | "lead", name?, phone?, industry?, message?, website? }  (website = honeypot, must stay empty)
 */
export const dynamic = "force-dynamic";

const API = process.env.MAILERLITE_API_BASE ?? "https://connect.mailerlite.com/api"; // override only for local testing
const GROUP_NAMES = { tips: "3 Tips Opt-In", lead: "Leads" } as const;
type List = keyof typeof GROUP_NAMES;
const CUSTOM_FIELDS = ["industry", "message"] as const; // MailerLite built-ins used as-is: name, phone

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Resolved IDs are cached for the life of the server instance (group names -> IDs; custom fields that exist).
const groupIds = new Map<string, string>();
let fieldsReady: Promise<void> | null = null;

async function ml(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`, "Content-Type": "application/json", Accept: "application/json", ...init?.headers },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, json };
}

/** Looks the group up by name through the API (never a guessed ID). Returns undefined if it does not exist. */
async function groupId(name: string): Promise<string | undefined> {
  const cached = groupIds.get(name);
  if (cached) return cached;
  const find = (data: { id: string; name: string }[] | undefined) => data?.find((g) => g.name.trim().toLowerCase() === name.toLowerCase());
  let hit = find((await ml(`/groups?limit=100&filter[name]=${encodeURIComponent(name)}`)).json?.data);
  if (!hit) hit = find((await ml(`/groups?limit=100`)).json?.data);
  if (hit) groupIds.set(name, String(hit.id));
  return hit ? String(hit.id) : undefined;
}

/** Makes sure the custom fields we send exist in the account (creates the missing ones once). */
function ensureFields() {
  fieldsReady ??= (async () => {
    const existing = new Set<string>(((await ml(`/fields?limit=100`)).json?.data ?? []).map((f: { key: string }) => f.key));
    for (const key of CUSTOM_FIELDS) if (!existing.has(key)) await ml(`/fields`, { method: "POST", body: JSON.stringify({ name: key, type: "text" }) });
  })().catch(() => { fieldsReady = null; });
  return fieldsReady;
}

export async function POST(req: Request) {
  if (!process.env.MAILERLITE_API_KEY) {
    console.error("[subscribe] MAILERLITE_API_KEY is not set");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 }); }

  if (clean(body.website, 200)) return NextResponse.json({ ok: true }); // honeypot filled: pretend success, save nothing

  const email = clean(body.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  const list: List = body.list === "lead" ? "lead" : "tips";

  const name = clean(body.name, 120), phone = clean(body.phone, 40), industry = clean(body.industry, 200), message = clean(body.message, 5000);
  const standard: Record<string, string> = {};
  if (name) standard.name = name;
  if (phone) standard.phone = phone;
  const custom: Record<string, string> = {};
  if (industry) custom.industry = industry;
  if (message) custom.message = message;

  try {
    const [gid] = await Promise.all([groupId(GROUP_NAMES[list]), Object.keys(custom).length ? ensureFields() : null]);
    if (!gid) console.error(`[subscribe] MailerLite group "${GROUP_NAMES[list]}" not found; saving subscriber without a group`);
    const send = (fields: Record<string, string>) =>
      ml("/subscribers", { method: "POST", body: JSON.stringify({ email, ...(Object.keys(fields).length ? { fields } : {}), ...(gid ? { groups: [gid] } : {}) }) });

    let res = await send({ ...standard, ...custom });
    if (res.status === 422 && Object.keys(custom).length) res = await send(standard); // custom field missing/rejected: still save the lead
    if (!res.ok) {
      console.error("[subscribe] MailerLite error", res.status, JSON.stringify(res.json)?.slice(0, 300));
      return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] request failed", err);
    return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
  }
}

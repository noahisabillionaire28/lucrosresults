/* Call Queue — cold-calling tracker PWA. All data stays on this device (localStorage). */
(() => {
'use strict';

const STEPS = [1, 3, 5, 7];
const STORE = 'cq.v1';
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- date-only helpers (local calendar days, no time component) ---------- */
const pad = (n) => String(n).padStart(2, '0');
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => isoDate(new Date());
const parts = (s) => s.split('-').map(Number);
const addDays = (s, n) => { const [y, m, d] = parts(s); return isoDate(new Date(y, m - 1, d + n)); };
const daysBetween = (a, b) => { const [y1, m1, d1] = parts(a); const [y2, m2, d2] = parts(b); return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 864e5); };
const fmtDate = (s) => { const [y, m, d] = parts(s); return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); };

/* ---------- state ---------- */
let state = load();
let ui = { tab: 'queue', dayFilter: 'all', leadSeg: 'new', search: '', openId: null };
let lastDeleted = null;
let pendingCallId = null;

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE));
    if (s && Array.isArray(s.leads)) return Object.assign({ leads: [], settings: {} }, s);
  } catch (e) {}
  return { leads: [], settings: {} };
}
function save() {
  try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { toast('Could not save — storage full or blocked'); }
}
const byId = (id) => state.leads.find((l) => l.id === id);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* =====================================================================
   LAYER 1 — QUERY: which leads qualify? (data only, no grouping/styling)
   Active sequence AND next attempt date on or before today (date-only).
   ===================================================================== */
function queryDueLeads(leads, asOf) {
  return leads.filter((l) => l.status === 'active' && l.nextDate && l.nextDate <= asOf);
}

/* =====================================================================
   LAYER 2 — PRESENTATION: bucket by day-in-sequence, overdue first.
   Due today = on time. Due before today = overdue.
   ===================================================================== */
function buildQueueView(dueLeads, asOf) {
  const groups = STEPS.map((day) => ({ day, rows: [] }));
  for (const lead of dueLeads) {
    const g = groups.find((x) => x.day === lead.seqDay) || groups[0];
    const daysLate = daysBetween(lead.nextDate, asOf);
    g.rows.push({ lead, daysLate, overdue: daysLate > 0 });
  }
  for (const g of groups) {
    g.rows.sort((a, b) => b.daysLate - a.daysLate || (a.lead.name || '').localeCompare(b.lead.name || ''));
    g.overdue = g.rows.filter((r) => r.overdue).length;
  }
  return groups;
}

/* ---------- lead actions ---------- */
function startSequence(lead) {
  const t = today();
  Object.assign(lead, { status: 'active', seqDay: 1, seqStart: t, nextDate: t });
}
const ADVANCE = new Set(['noanswer', 'voicemail', 'talked']);
const OUTCOMES = {
  noanswer: 'No answer', voicemail: 'Left voicemail', talked: 'Talked – follow up',
  callback: 'Call back on date', booked: 'Booked meeting', notint: 'Not interested', badnum: 'Bad number',
};
function logOutcome(lead, outcome, note, callbackDate) {
  const t = today();
  lead.log = lead.log || [];
  lead.log.push({ at: new Date().toISOString(), day: lead.seqDay, outcome, note: note || '' });
  if (ADVANCE.has(outcome)) {
    const i = STEPS.indexOf(lead.seqDay);
    if (i === -1 || i === STEPS.length - 1) { lead.status = 'done'; lead.nextDate = null; }
    else { const next = STEPS[i + 1]; lead.nextDate = addDays(t, next - lead.seqDay); lead.seqDay = next; }
  } else if (outcome === 'callback') {
    lead.nextDate = callbackDate && callbackDate > t ? callbackDate : addDays(t, 1);
  } else if (outcome === 'booked') { lead.status = 'won'; lead.nextDate = null; }
  else { lead.status = 'lost'; lead.nextDate = null; }
}
function deleteLead(id) {
  const i = state.leads.findIndex((l) => l.id === id);
  if (i < 0) return;
  lastDeleted = { lead: state.leads[i], index: i };
  state.leads.splice(i, 1);
  save(); render();
  toast(`Deleted ${lastDeleted.lead.name || 'lead'}`, 'Undo', () => {
    if (!lastDeleted) return;
    state.leads.splice(lastDeleted.index, 0, lastDeleted.lead);
    lastDeleted = null; save(); render();
  });
}

/* ---------- CSV ---------- */
function parseCSV(text) {
  const rows = []; let row = []; let f = ''; let q = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(f); rows.push(row); row = []; f = '';
    } else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== ''));
}
const FIELDS = {
  name: ['name', 'full name', 'contact', 'contact name', 'owner', 'owner name', 'lead', 'lead name'],
  first: ['first name', 'first', 'firstname'],
  last: ['last name', 'last', 'lastname', 'surname'],
  company: ['company', 'business', 'business name', 'company name', 'organization', 'account', 'title'],
  phone: ['phone', 'phone number', 'mobile', 'cell', 'number', 'tel', 'telephone', 'mobile phone', 'work phone'],
  email: ['email', 'email address', 'e-mail'],
  website: ['website', 'url', 'site', 'web', 'domain'],
  city: ['city', 'location', 'area', 'address'],
  industry: ['industry', 'niche', 'category', 'type'],
  notes: ['notes', 'note', 'comments'],
  // columns written by Export CSV, so an export can be re-imported with sequence progress intact
  status: ['status'], seqDay: ['seqday', 'sequence day'], nextDate: ['nextdate', 'next date'],
  lastOutcome: ['lastoutcome', 'last outcome'], lastNote: ['lastnote', 'last note'], lastCalled: ['lastcalled', 'last called'], attempts: ['attempts'],
};
const normHead = (h) => h.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
function rowsToLeads(rows) {
  if (rows.length < 2) return [];
  const heads = rows[0].map(normHead);
  const col = {};
  for (const [k, names] of Object.entries(FIELDS)) {
    const i = heads.findIndex((h) => names.includes(h));
    if (i > -1) col[k] = i;
  }
  if (col.phone === undefined) { const i = heads.findIndex((h) => /phone|mobile|cell/.test(h)); if (i > -1) col.phone = i; }
  const used = new Set(Object.values(col));
  return rows.slice(1).map((r) => {
    const g = (k) => (col[k] !== undefined ? (r[col[k]] || '').trim() : '');
    const extra = {};
    rows[0].forEach((h, i) => { if (!used.has(i) && (r[i] || '').trim()) extra[h.trim() || `col${i + 1}`] = r[i].trim(); });
    let name = g('name') || [g('first'), g('last')].filter(Boolean).join(' ');
    const company = g('company');
    if (!name) name = company;
    const lead = { name, company: company === name ? '' : company, phone: g('phone'), email: g('email'), website: g('website'), city: g('city'), industry: g('industry'), notes: g('notes'), extra };
    const status = g('status');
    if (['new', 'active', 'done', 'won', 'lost'].includes(status)) {
      const day = Number(g('seqDay'));
      lead.restore = { status, seqDay: STEPS.includes(day) ? day : null, nextDate: /^\d{4}-\d{2}-\d{2}$/.test(g('nextDate')) ? g('nextDate') : null,
        lastOutcome: Object.keys(OUTCOMES).find((k) => OUTCOMES[k] === g('lastOutcome')), lastNote: g('lastNote'), lastCalled: g('lastCalled') };
      if (status === 'active' && !lead.restore.nextDate) lead.restore.nextDate = today();
    }
    return lead;
  }).filter((l) => l.name || l.phone);
}
const leadKey = (l) => { const d = (l.phone || '').replace(/\D/g, '').slice(-10); return d.length >= 7 ? 'p' + d : 'n' + (l.name + '|' + l.company).toLowerCase(); };
function mergeLeads(incoming, source) {
  const map = new Map(state.leads.map((l) => [leadKey(l), l]));
  let added = 0, updated = 0;
  for (const { restore, ...n } of incoming) {
    const ex = map.get(leadKey(n));
    if (ex) { for (const k of ['name', 'company', 'phone', 'email', 'website', 'city', 'industry']) if (n[k]) ex[k] = n[k]; ex.extra = Object.assign(ex.extra || {}, n.extra); updated++; }
    else { const l = Object.assign({ id: uid(), status: 'new', seqDay: null, seqStart: null, nextDate: null, log: [], source, createdAt: today() }, n); state.leads.push(l); map.set(leadKey(l), l); added++; }
    if (restore) applyRestore(map.get(leadKey(n)), restore);
  }
  save(); render();
  return { added, updated };
}
function applyRestore(l, r) {
  Object.assign(l, { status: r.status, seqDay: r.seqDay, nextDate: r.status === 'active' ? r.nextDate : null, seqStart: l.seqStart || (r.seqDay ? today() : null) });
  if (r.lastOutcome && !(l.log || []).length) {
    const at = /^\d{4}-\d{2}-\d{2}$/.test(r.lastCalled) ? new Date(r.lastCalled + 'T12:00:00').toISOString() : new Date().toISOString();
    l.log = [{ at, day: r.seqDay, outcome: r.lastOutcome, note: r.lastNote || '' }];
  }
}
function sheetCsvUrl(url) {
  if (/output=csv|tqx=out:csv|format=csv/.test(url)) return url;
  const id = (url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/) || [])[1];
  if (!id) return null;
  const gid = (url.match(/[#&?]gid=(\d+)/) || [])[1];
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv${gid ? '&gid=' + gid : ''}`;
}
async function syncSheet(url) {
  const csvUrl = sheetCsvUrl(url);
  if (!csvUrl) throw new Error('That does not look like a Google Sheets link.');
  const res = await fetch(csvUrl, { cache: 'no-store' });
  const text = await res.text();
  if (!res.ok || /^\s*<(!doctype|html)/i.test(text)) throw new Error('Could not read the sheet. Set sharing to "Anyone with the link → Viewer".');
  return mergeLeads(rowsToLeads(parseCSV(text)), 'sheet');
}
function exportCSV() {
  const cols = ['name', 'company', 'phone', 'email', 'website', 'city', 'industry', 'status', 'seqDay', 'nextDate', 'attempts', 'lastOutcome', 'lastNote', 'lastCalled'];
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [cols.join(',')].concat(state.leads.map((l) => {
    const last = (l.log || [])[l.log.length - 1] || {};
    const v = { ...l, attempts: (l.log || []).length, lastOutcome: OUTCOMES[last.outcome] || '', lastNote: last.note || '', lastCalled: last.at ? last.at.slice(0, 10) : '' };
    return cols.map((c) => q(v[c])).join(',');
  }));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `call-queue-${today()}.csv`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------- suggestions ---------- */
const me = () => state.settings.myName || '[your name]';
const first = (l) => (l.name || '').split(' ')[0] || 'there';
const DAY_TIPS = {
  1: (l) => `Opener: "Hey ${first(l)}, it's ${me()} — I'll be quick. I was looking at ${l.company || 'your business'} online and had a question: who handles the calls when you can't pick up?" Goal = book a 15-min call, not sell.`,
  3: () => 'Call at a different time than Day 1 (early AM or 4–5pm). If they pick up: "Tried you earlier this week — 30 seconds and you tell me if it’s worth a follow-up?"',
  5: (l) => `Leave a 15-sec voicemail, then text right after: "Hey ${first(l)}, ${me()} here — just left you a VM. Quick q: are you missing calls after hours?"`,
  7: (l) => `Breakup call: "${first(l)}, I’ve tried you a few times — should I close your file?" Breakups get the highest reply rate. Text the same line if no answer.`,
};
const RULES = [
  { re: /not interested|no thanks|not looking|don'?t want|remove me|stop calling/, t: 'Not interested', s: ['"Totally fair — most owners say that before they hear the numbers. Can I ask one question and then let you go?"', '"If I could show you 10–20 more booked jobs a month without more ad spend, worth 15 minutes, or still a no?"'], tip: 'Don’t argue. Ask one question. If still no → mark Not interested.' },
  { re: /email|send (me )?(some )?(info|details|something)|send it over|website/, t: 'Send me info', s: ['"Happy to. So I send the right thing — is your bigger gap getting new leads, or following up with the ones you already get?"', '"I’ll send it now and hold 10 minutes to walk you through it — Tuesday or Thursday better?"'], tip: '"Send info" is a soft brush-off. Tie the email to a calendar slot.' },
  { re: /expensive|cost|price|pricing|budget|afford|money|how much/, t: 'Price', s: ['"Makes sense. What’s one new customer worth to you, roughly?"', '"So if this books 2 extra jobs a month it pays for itself. Let me show you the math in 15 min — fair?"'], tip: 'Never quote price on a cold call. Anchor on value of one customer.' },
  { re: /already (have|got|use|work)|agency|(a|my) guy|someone (who )?(does|handles)|in.?house|marketing (company|person)/, t: 'Already have someone', s: ['"Good — means you value it. Quick one: who answers when someone calls at 8pm or on a Sunday?"', '"We don’t replace them — we plug the leak. Worth seeing side by side?"'], tip: 'Position as add-on (missed calls, speed-to-lead), not replacement.' },
  { re: /busy|bad time|call (me )?back|in a meeting|driving|on a job|later/, t: 'Busy / call back', s: ['"Totally — 20 seconds and you tell me if it’s worth a call back?"', '"When’s better — tomorrow 8am or 4pm?"'], tip: 'Lock an exact time → use "Call back on date".' },
  { re: /how did you get|where did you get|who gave you|how'?d you get/, t: 'How’d you get my number', s: ['"It’s on your Google listing — I was looking at businesses in your area and noticed something on your site. That’s why I called."'], tip: 'Be specific about what you noticed. Builds trust instantly.' },
  { re: /enough (work|business|leads|clients|customers)|busy enough|fully booked|don'?t need (more|any)/, t: 'We’re busy enough', s: ['"Love that. Then it’s about margin, not volume — are you catching every call?"', '"Our voice AI books the overflow so you can raise prices or pick better jobs. Worth 15 min?"'], tip: 'Shift from more leads → better leads / less admin / higher prices.' },
  { re: /partner|owner|wife|husband|boss|manager|decision|talk to my/, t: 'Need to ask someone', s: ['"Makes sense. Who else weighs in on this?"', '"Let’s get 15 min with both of you so you don’t have to relay it — Thursday work?"'], tip: 'Get the decision maker on the booked call.' },
  { re: /tried (that|it|this|before)|didn'?t work|burned|scam|bad experience|waste of money/, t: 'Got burned before', s: ['"That’s common — what went wrong last time?"', '"That’s exactly why we start month-to-month with clear numbers. Fair to take a look?"'], tip: 'Let them vent. Then contrast with your risk reversal.' },
  { re: /\bai\b|robot|\bbot\b|automated|sounds fake/, t: 'Skeptical of AI', s: ['"Fair. Most callers can’t tell — I can have it call you right now so you hear it."'], tip: 'Live demo beats explaining. Send a 60-sec recording after.' },
  { re: /who is this|what is this|what do you (do|want|sell)|what('?s| is) this about|what company/, t: 'What’s this about', s: [`"I’m ${me()} — we help local businesses answer every call and follow up automatically with AI, so no lead slips. Who handles that for you now?"`], tip: '15-second pitch, then hand it back with a question.' },
  { re: /sounds (good|interesting|cool)|tell me more|how does (it|that) work|what would (it|that)|interested|let'?s do it|sure/, not: /not interested/, t: 'Buying signal 🔥', s: ['"Easiest next step is a quick 15-min walkthrough — I’ve got Tuesday 10am or Wednesday 2pm."'], tip: 'Stop pitching. Book the meeting now.' },
];
function suggest(text) {
  const t = (text || '').toLowerCase();
  if (!t.trim()) return [];
  return RULES.filter((r) => r.re.test(t) && !(r.not && r.not.test(t)));
}
async function askAI(lead, said) {
  const key = state.settings.apiKey;
  if (!key) throw new Error('Add your Claude API key in Import → AI coach.');
  const history = (lead.log || []).slice(-3).map((x) => `${x.at.slice(0, 10)} Day ${x.day}: ${OUTCOMES[x.outcome]}${x.note ? ' — ' + x.note : ''}`).join('\n');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({
      model: state.settings.model || 'claude-haiku-5-5',
      max_tokens: 400,
      system: `You are a live cold-call coach for ${me()}, who runs an AI automation agency (websites, AI automations, voice AI receptionists, lead generation) selling to local business owners. The goal of every call is to book a 15-minute meeting. Reply in under 90 words: 2-3 exact lines to say next (in quotes), then one short tip. Plain text, no markdown headers.`,
      messages: [{ role: 'user', content: `Lead: ${lead.name}${lead.company ? ' at ' + lead.company : ''}${lead.industry ? ' (' + lead.industry + ')' : ''}${lead.city ? ', ' + lead.city : ''}\nSequence day: ${lead.seqDay || 'not started'}\nPrevious attempts:\n${history || 'none'}\n\nWhat the prospect / I just said:\n${said || '(nothing yet — give me an opener)'}` }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `API error ${res.status}`);
  return (data.content || []).map((c) => c.text || '').join('').trim();
}

/* ---------- rendering ---------- */
const main = $('#main');
function render() {
  const t = today();
  const due = queryDueLeads(state.leads, t);
  const n = due.length;
  for (const el of [$('#dueBadge'), $('#tabBadge')]) { el.textContent = n; el.classList.toggle('zero', n === 0); }
  $('#tabBadge').style.display = n ? '' : 'none';
  try { if (navigator.setAppBadge) (n ? navigator.setAppBadge(n) : navigator.clearAppBadge()).catch(() => {}); } catch (e) {}
  const callsToday = state.leads.reduce((s, l) => s + (l.log || []).filter((x) => isoDate(new Date(x.at)) === t).length, 0);
  const booked = state.leads.filter((l) => l.status === 'won').length;
  $('#stats').innerHTML = `<b>${callsToday}</b> calls today<br><b>${booked}</b> booked`;
  document.querySelectorAll('nav.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === ui.tab));
  $('#dueBadge').style.display = ui.tab === 'queue' ? '' : 'none';
  if (ui.tab === 'queue') renderQueue(due, t);
  else if (ui.tab === 'leads') renderLeads(t);
  else renderSetup();
  if (ui.openId) renderSheet();
}

function rowHTML(lead, meta, swipeR) {
  const phone = (lead.phone || '').replace(/[^\d+]/g, '');
  return `<li class="swipe" data-id="${lead.id}">
    <div class="bg"><span class="l">✓ ${swipeR}</span><span class="r">Delete ✕</span></div>
    <div class="row ${meta.overdue ? 'overdue' : ''}">
      <div class="info">
        <div class="name">${esc(lead.name || lead.company || lead.phone)}</div>
        <div class="sub">${meta.tags}${esc([lead.company, lead.city].filter(Boolean).join(' · ') || lead.phone || '')}</div>
      </div>
      ${phone ? `<a class="callbtn" href="tel:${esc(phone)}" data-call="${lead.id}" aria-label="Call">✆</a>` : ''}
    </div></li>`;
}

function renderQueue(due, t) {
  const groups = buildQueueView(due, t);
  $('#title').firstChild.nodeValue = 'Call Queue ';
  $('#subhead').innerHTML = `<div class="chips">${[{ k: 'all', l: 'All', n: due.length }].concat(groups.map((g) => ({ k: String(g.day), l: `Day ${g.day}`, n: g.rows.length })))
    .map((c) => `<button class="chip ${ui.dayFilter === c.k ? 'on' : ''}" data-filter="${c.k}">${c.l}<span class="n">${c.n}</span></button>`).join('')}</div>`;

  if (!due.length) {
    const upcoming = state.leads.filter((l) => l.status === 'active' && l.nextDate > t).sort((a, b) => a.nextDate.localeCompare(b.nextDate));
    const fresh = state.leads.filter((l) => l.status === 'new').length;
    main.innerHTML = `<div class="empty"><div class="big">✅</div><h2>You’re all caught up</h2>
      <div>${state.leads.length === 0 ? 'Import leads to start your queue.' : upcoming.length ? `Next up: ${upcoming.length} lead${upcoming.length > 1 ? 's' : ''} — first due ${fmtDate(upcoming[0].nextDate)}.` : 'No follow-ups scheduled.'}</div>
      ${fresh ? `<div class="btnrow" style="justify-content:center"><button class="btn primary" data-go="leads">Start ${fresh} new lead${fresh > 1 ? 's' : ''} →</button></div>` : ''}
      ${state.leads.length === 0 ? `<div class="btnrow" style="justify-content:center"><button class="btn primary" data-go="setup">Import leads</button></div>` : ''}</div>`;
    return;
  }
  const shown = groups.filter((g) => g.rows.length && (ui.dayFilter === 'all' || String(g.day) === ui.dayFilter));
  if (!shown.length) {
    main.innerHTML = `<div class="empty"><div class="big">✅</div><h2>Day ${ui.dayFilter} is clear</h2><div>${due.length} still due in other days.</div>
      <div class="btnrow" style="justify-content:center"><button class="btn" data-filter="all">Show all</button></div></div>`;
    return;
  }
  main.innerHTML = shown.map((g) => `<div class="group-h"><span>Day ${g.day} · ${g.rows.length}</span>${g.overdue ? `<span class="od">${g.overdue} overdue</span>` : ''}</div>
    <ul class="list">${g.rows.map((r) => rowHTML(r.lead, { overdue: r.overdue, tags: r.overdue ? `<span class="tag od">${r.daysLate}d overdue</span>` : '<span class="tag today">Today</span>' }, 'No answer → next')).join('')}</ul>`).join('')
    + `<p class="hint">Swipe right = no answer, move to next day · Swipe left = delete · Tap = details</p>`;
}

function renderLeads(t) {
  $('#title').firstChild.nodeValue = 'Leads ';
  const segs = [['new', 'New'], ['active', 'In sequence'], ['closed', 'Closed']];
  const count = (k) => state.leads.filter((l) => (k === 'closed' ? ['won', 'lost', 'done'].includes(l.status) : l.status === k)).length;
  $('#subhead').innerHTML = `<div class="seg">${segs.map(([k, l]) => `<button class="${ui.leadSeg === k ? 'on' : ''}" data-seg="${k}">${l} ${count(k)}</button>`).join('')}</div>
    <input class="search" type="search" placeholder="Search name, company, phone" value="${esc(ui.search)}" id="search">`;
  const q = ui.search.toLowerCase();
  const list = state.leads.filter((l) => (ui.leadSeg === 'closed' ? ['won', 'lost', 'done'].includes(l.status) : l.status === ui.leadSeg))
    .filter((l) => !q || [l.name, l.company, l.phone, l.city].join(' ').toLowerCase().includes(q));
  if (!list.length) {
    main.innerHTML = `<div class="empty"><div class="big">${ui.leadSeg === 'new' ? '📥' : '—'}</div><h2>${ui.leadSeg === 'new' ? 'No new leads' : 'Nothing here'}</h2>
      <div>${ui.leadSeg === 'new' ? 'Upload a CSV or connect a Google Sheet.' : ''}</div>
      ${ui.leadSeg === 'new' ? '<div class="btnrow" style="justify-content:center"><button class="btn primary" data-go="setup">Import leads</button></div>' : ''}</div>`;
    return;
  }
  const label = { won: '<span class="tag today">Booked</span>', lost: '<span class="tag">Lost</span>', done: '<span class="tag">Seq. done</span>' };
  const swipeR = ui.leadSeg === 'active' ? 'In sequence' : ui.leadSeg === 'new' ? 'Add to sequence' : 'Restart sequence';
  main.innerHTML = `<ul class="list">${list.slice(0, 500).map((l) => {
    let tags = '';
    if (l.status === 'active') tags = `<span class="tag ${l.nextDate < t ? 'od' : ''}">Day ${l.seqDay} · ${l.nextDate <= t ? (l.nextDate < t ? 'overdue' : 'due today') : fmtDate(l.nextDate)}</span>`;
    else if (label[l.status]) tags = label[l.status];
    return rowHTML(l, { overdue: false, tags }, swipeR);
  }).join('')}</ul><p class="hint">Swipe right = ${swipeR.toLowerCase()} · Swipe left = delete</p>`;
}

function renderSetup() {
  $('#title').firstChild.nodeValue = 'Import & Settings ';
  $('#subhead').innerHTML = '';
  const s = state.settings;
  main.innerHTML = `
  <div class="card"><h3>Upload CSV</h3><p>Columns auto-detected: name, company, phone, email, website, city, industry. Duplicates (same phone) are merged, call history kept.</p>
    <label class="btn primary block">Choose CSV file<input type="file" accept=".csv,text/csv" id="csvFile" hidden></label></div>
  <div class="card"><h3>Google Sheet</h3><p>Share the sheet as <b>Anyone with the link → Viewer</b>, paste the link, tap Sync. Re-sync anytime to pull new rows.</p>
    <input type="url" id="sheetUrl" placeholder="https://docs.google.com/spreadsheets/d/…" value="${esc(s.sheetUrl || '')}">
    <div class="btnrow"><button class="btn primary" id="syncBtn">Sync sheet</button></div>
    ${s.lastSync ? `<p style="margin:8px 0 0">Last sync: ${esc(s.lastSync)}</p>` : ''}</div>
  <div class="card"><h3>AI coach (optional)</h3><p>Instant objection suggestions work offline. For AI suggestions on any reply, add a Claude API key (stored only on this phone).</p>
    <input type="text" id="myName" placeholder="Your name (used in scripts)" value="${esc(s.myName || '')}">
    <div style="height:8px"></div>
    <input type="password" id="apiKey" placeholder="sk-ant-…" value="${esc(s.apiKey || '')}" autocomplete="off">
    <div style="height:8px"></div>
    <select id="model">${[['claude-haiku-5-5', 'Fast (Haiku)'], ['claude-sonnet-5-5', 'Smarter (Sonnet)']].map(([v, l]) => `<option value="${v}" ${(s.model || 'claude-haiku-5-5') === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
    <div class="btnrow"><button class="btn primary" id="saveSettings">Save</button></div></div>
  <div class="card"><h3>Data</h3><p>${state.leads.length} leads saved on this device at this web address. Export a backup weekly. Moving devices or links: Export CSV here, then Upload CSV there — sequence progress comes with it.</p>
    <div class="btnrow"><button class="btn" id="exportBtn">Export CSV</button><button class="btn" id="sampleBtn">Load sample</button></div>
    <div class="btnrow"><button class="btn bad" id="clearBtn">Delete all leads</button></div></div>
  <div class="card"><h3>Add to iPhone home screen</h3><p>Open this page in Safari → Share → <b>Add to Home Screen</b>.</p></div>`;
}

function renderSheet() {
  const l = byId(ui.openId);
  if (!l) { closeSheet(); return; }
  const phone = (l.phone || '').replace(/[^\d+]/g, '');
  const t = today();
  const status = l.status === 'active' ? `Day ${l.seqDay} · ${l.nextDate < t ? `<b style="color:var(--bad)">${daysBetween(l.nextDate, t)}d overdue</b>` : l.nextDate === t ? 'due today' : 'next ' + fmtDate(l.nextDate)}`
    : { new: 'Not in sequence', won: 'Booked ✅', lost: 'Lost', done: 'Sequence finished' }[l.status];
  const extra = Object.entries(l.extra || {}).map(([k, v]) => `<div class="kv">${esc(k)}: ${esc(v)}</div>`).join('');
  const sheet = $('#sheet');
  const draft = $('#said', sheet)?.value ?? '';
  sheet.innerHTML = `<div class="grab"></div>
    <h2>${esc(l.name)}</h2>
    <div class="kv">${esc([l.company, l.industry, l.city].filter(Boolean).join(' · '))}</div>
    <div class="kv">${status}</div>
    ${l.email ? `<div class="kv"><a href="mailto:${esc(l.email)}">${esc(l.email)}</a></div>` : ''}
    ${l.website ? `<div class="kv"><a href="${esc(/^https?:/.test(l.website) ? l.website : 'https://' + l.website)}" target="_blank" rel="noopener">${esc(l.website)}</a></div>` : ''}
    ${extra}
    <div class="btnrow">
      ${phone ? `<a class="btn ok" href="tel:${esc(phone)}" data-call="${l.id}">✆ Call ${esc(l.phone)}</a><a class="btn" href="sms:${esc(phone)}">Text</a>` : '<span class="kv">No phone number</span>'}
    </div>
    <div class="btnrow">
      ${l.status === 'active' ? '' : `<button class="btn primary" data-act="start">${l.status === 'new' ? 'Add to sequence' : 'Restart sequence'} & next →</button>`}
      <button class="btn bad" data-act="delete">Delete & next →</button>
    </div>

    <div class="label">Script for this step</div>
    <div class="sug"><b>Day ${l.seqDay || 1}</b>${esc(DAY_TIPS[l.seqDay || 1](l))}</div>

    <div class="label">What are they saying?</div>
    <textarea id="said" placeholder="Type or use 🎤 dictation: “send me an email”, “we already have a guy”…">${esc(draft)}</textarea>
    <div id="sugs"></div>
    <div class="btnrow"><button class="btn" id="aiBtn">✨ Ask AI coach</button></div>
    <div id="aiOut"></div>

    ${l.status === 'active' ? `<div class="label">Log this call</div>
    <div class="grid2">
      <button class="btn" data-out="noanswer">No answer</button>
      <button class="btn" data-out="voicemail">Left voicemail</button>
      <button class="btn" data-out="talked">Talked – follow up</button>
      <button class="btn ok" data-out="booked">Booked ✅</button>
      <button class="btn" data-out="notint">Not interested</button>
      <button class="btn" data-out="badnum">Bad number</button>
    </div>
    <div class="btnrow"><input type="date" id="cbDate" min="${addDays(t, 1)}" value="${addDays(t, 1)}" style="flex:1"><button class="btn" data-out="callback">Call back then</button></div>
    <p class="hint">No answer / voicemail / follow-up moves them to the next day (1 → 3 → 5 → 7). The note above is saved with the call.</p>` : ''}

    ${(l.log || []).length ? `<div class="label">History</div>${l.log.slice().reverse().map((x) => `<div class="log">${fmtDate(isoDate(new Date(x.at)))} · Day ${x.day ?? '-'} · ${esc(OUTCOMES[x.outcome] || x.outcome)}${x.note ? ' — ' + esc(x.note) : ''}</div>`).join('')}` : ''}
    <div class="btnrow"><button class="btn bad" data-act="delete">Delete & next →</button><button class="btn" data-act="close">Close</button></div>`;
  showSuggestions(draft);
}
function showSuggestions(text) {
  const box = $('#sugs'); if (!box) return;
  box.innerHTML = suggest(text).map((r) => `<div class="sug"><b>${esc(r.t)}</b>${r.s.map(esc).join('<br>')}<div class="kv" style="margin-top:4px">💡 ${esc(r.tip)}</div></div>`).join('');
}
// "& next" flow: remember list order before the action, then open the following lead still on screen.
const listOrder = () => [...main.querySelectorAll('li.swipe')].map((li) => li.dataset.id);
function openNext(ids, id) {
  const i = ids.indexOf(id);
  const visible = new Set(listOrder());
  const next = ids.slice(i + 1).concat(ids.slice(0, Math.max(i, 0))).find((x) => x !== id && visible.has(x));
  if (next) openSheet(next); else closeSheet();
}
function openSheet(id) { ui.openId = id; $('#sheet').innerHTML = ''; renderSheet(); $('#sheetWrap').classList.add('open'); $('#sheet').scrollTop = 0; }
function closeSheet() { ui.openId = null; $('#sheetWrap').classList.remove('open'); }

/* ---------- toast ---------- */
let toastTimer;
function toast(msg, btn, fn) {
  $('#toastMsg').textContent = msg;
  const b = $('#toastBtn'); b.style.display = btn ? '' : 'none'; b.textContent = btn || ''; b.onclick = () => { fn && fn(); hideToast(); };
  $('#toast').classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, 5000);
}
function hideToast() { $('#toast').classList.remove('show'); }

/* ---------- swipe (pointer events; vertical scroll stays native via touch-action: pan-y) ---------- */
let sw = null; let suppressClick = false;
main.addEventListener('pointerdown', (e) => {
  const row = e.target.closest('.row'); if (!row || e.target.closest('a,button')) return;
  sw = { row, li: row.parentElement, x: e.clientX, y: e.clientY, dx: 0, lock: null, id: e.pointerId };
});
main.addEventListener('pointermove', (e) => {
  if (!sw || e.pointerId !== sw.id) return;
  const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
  if (!sw.lock && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
    sw.lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (sw.lock === 'x') { try { sw.row.setPointerCapture(e.pointerId); } catch (_) {} sw.row.style.transition = 'none'; }
  }
  if (sw.lock !== 'x') return;
  sw.dx = dx;
  sw.li.dataset.dir = dx > 0 ? 'right' : 'left';
  sw.row.style.transform = `translateX(${dx}px)`;
});
const endSwipe = (e) => {
  if (!sw || e.pointerId !== sw.id) return;
  const s = sw; sw = null;
  if (s.lock !== 'x') return;
  suppressClick = true; setTimeout(() => (suppressClick = false), 50);
  const w = s.li.offsetWidth;
  s.row.style.transition = 'transform .2s ease';
  if (Math.abs(s.dx) > w * 0.3 && e.type !== 'pointercancel') {
    s.row.style.transform = `translateX(${s.dx > 0 ? w : -w}px)`;
    setTimeout(() => onSwipe(s.li.dataset.id, s.dx > 0 ? 'right' : 'left'), 180);
  } else s.row.style.transform = '';
};
main.addEventListener('pointerup', endSwipe);
main.addEventListener('pointercancel', endSwipe);

function onSwipe(id, dir) {
  const l = byId(id); if (!l) return;
  if (dir === 'left') return deleteLead(id);
  if (ui.tab === 'queue' && l.status === 'active') {
    const prev = JSON.stringify(l);
    logOutcome(l, 'noanswer', '');
    save(); render();
    toast(l.status === 'done' ? `${l.name}: sequence finished` : `${l.name} → Day ${l.seqDay}, ${fmtDate(l.nextDate)}`, 'Undo', () => { Object.assign(l, JSON.parse(prev)); save(); render(); });
  } else if (l.status !== 'active') {
    const prev = JSON.stringify(l);
    startSequence(l); save(); render();
    toast(`${l.name} added — Day 1 due today`, 'Undo', () => { Object.assign(l, JSON.parse(prev)); save(); render(); });
  } else { render(); toast(`${l.name} is already in sequence`); }
}

/* ---------- events ---------- */
document.addEventListener('click', (e) => {
  if (suppressClick) { e.preventDefault(); return; }
  const tab = e.target.closest('nav.tabs button');
  if (tab) { ui.tab = tab.dataset.tab; closeSheet(); render(); window.scrollTo(0, 0); return; }
  const go = e.target.closest('[data-go]');
  if (go) { ui.tab = go.dataset.go; render(); return; }
  const f = e.target.closest('[data-filter]');
  if (f) { ui.dayFilter = f.dataset.filter; render(); return; }
  const seg = e.target.closest('[data-seg]');
  if (seg) { ui.leadSeg = seg.dataset.seg; render(); return; }
  const call = e.target.closest('[data-call]');
  if (call) { pendingCallId = call.dataset.call; return; } // let tel: link proceed
  const out = e.target.closest('[data-out]');
  if (out) {
    const l = byId(ui.openId); if (!l) return;
    const note = $('#said')?.value.trim();
    logOutcome(l, out.dataset.out, note, $('#cbDate')?.value);
    const ids = listOrder();
    save(); render(); openNext(ids, l.id);
    toast(`${l.name}: ${OUTCOMES[out.dataset.out]}${l.status === 'active' ? ` · next ${fmtDate(l.nextDate)}` : ''}`);
    return;
  }
  const act = e.target.closest('[data-act]');
  if (act) {
    const l = byId(ui.openId);
    if (act.dataset.act === 'close') closeSheet();
    else if (act.dataset.act === 'delete' && l) { const ids = listOrder(); deleteLead(l.id); openNext(ids, l.id); }
    else if (act.dataset.act === 'start' && l) { const ids = listOrder(); startSequence(l); save(); render(); openNext(ids, l.id); toast(`${l.name} added — Day 1 due today`); }
    return;
  }
  if (e.target.id === 'aiBtn') { runAI(); return; }
  if (e.target.id === 'sheetWrap') { closeSheet(); return; }
  const row = e.target.closest('.row');
  if (row) openSheet(row.parentElement.dataset.id);
});
async function runAI() {
  const l = byId(ui.openId); const out = $('#aiOut'); const btn = $('#aiBtn');
  if (!l || !out) return;
  btn.disabled = true; btn.textContent = 'Thinking…';
  try { out.innerHTML = `<div class="sug ai"><b>AI coach</b>${esc(await askAI(l, $('#said').value.trim()))}</div>`; }
  catch (err) { out.innerHTML = `<div class="sug ai"><b>AI coach</b>${esc(err.message)}</div>`; }
  btn.disabled = false; btn.textContent = '✨ Ask AI coach';
}
let sugTimer;
document.addEventListener('input', (e) => {
  if (e.target.id === 'said') { clearTimeout(sugTimer); sugTimer = setTimeout(() => showSuggestions(e.target.value), 150); }
  if (e.target.id === 'search') { ui.search = e.target.value; const pos = e.target.selectionStart; render(); const s = $('#search'); s.focus(); s.setSelectionRange(pos, pos); }
});
document.addEventListener('change', async (e) => {
  if (e.target.id === 'csvFile' && e.target.files[0]) {
    const text = await e.target.files[0].text();
    const r = mergeLeads(rowsToLeads(parseCSV(text)), 'csv');
    toast(`Imported: ${r.added} new, ${r.updated} updated`);
    e.target.value = '';
  }
});
document.addEventListener('click', async (e) => {
  const id = e.target.id; const s = state.settings;
  if (id === 'syncBtn') {
    const url = $('#sheetUrl').value.trim(); s.sheetUrl = url; save();
    e.target.disabled = true; e.target.textContent = 'Syncing…';
    try { const r = await syncSheet(url); s.lastSync = new Date().toLocaleString(); save(); render(); toast(`Synced: ${r.added} new, ${r.updated} updated`); }
    catch (err) { toast(err.message); e.target.disabled = false; e.target.textContent = 'Sync sheet'; }
  }
  if (id === 'saveSettings') { s.apiKey = $('#apiKey').value.trim(); s.myName = $('#myName').value.trim(); s.model = $('#model').value; save(); toast('Saved'); }
  if (id === 'exportBtn') exportCSV();
  if (id === 'clearBtn' && confirm('Delete ALL leads and history from this phone?')) { state.leads = []; save(); render(); toast('All leads deleted'); }
  if (id === 'sampleBtn') loadSample();
});

// After a tel: call, coming back to the app opens the lead so you can log the outcome.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  render(); // also refreshes "today" if the date rolled over
  if (pendingCallId && byId(pendingCallId)) { const id = pendingCallId; pendingCallId = null; setTimeout(() => openSheet(id), 300); }
});
let lastDay = today();
setInterval(() => { if (today() !== lastDay) { lastDay = today(); render(); } }, 60000);

function loadSample() {
  const t = today();
  const mk = (name, company, phone, city, industry, seqDay, nextOffset) => {
    const l = { id: uid(), name, company, phone, email: '', website: '', city, industry, notes: '', extra: {}, log: [], source: 'sample', createdAt: t };
    if (seqDay) Object.assign(l, { status: 'active', seqDay, seqStart: addDays(t, -seqDay), nextDate: addDays(t, nextOffset) });
    else Object.assign(l, { status: 'new', seqDay: null, seqStart: null, nextDate: null });
    return l;
  };
  state.leads.push(
    mk('Mike Alvarez', 'Alvarez Plumbing', '(555) 201-4410', 'Phoenix', 'Plumbing', 1, 0),
    mk('Sara Chen', 'Bright Smile Dental', '(555) 201-4411', 'Tempe', 'Dental', 1, -2),
    mk('James Ortiz', 'Ortiz Roofing', '(555) 201-4412', 'Mesa', 'Roofing', 3, 0),
    mk('Priya Patel', 'Glow Med Spa', '(555) 201-4413', 'Scottsdale', 'Med spa', 3, -1),
    mk('Tom Becker', 'Becker HVAC', '(555) 201-4414', 'Chandler', 'HVAC', 5, -3),
    mk('Lena Ruiz', 'Ruiz Law Group', '(555) 201-4415', 'Phoenix', 'Law', 7, 0),
    mk('Dan Wells', 'Wells Auto', '(555) 201-4416', 'Gilbert', 'Auto repair', 3, 2),
    mk('Kim Nguyen', 'Nguyen Landscaping', '(555) 201-4417', 'Tempe', 'Landscaping', null),
    mk('Chris Lee', 'Lee Electric', '(555) 201-4418', 'Mesa', 'Electrical', null),
  );
  save(); ui.tab = 'queue'; render(); toast('Sample leads loaded');
}

try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/calls/sw.js', { scope: '/calls' }).catch(() => {});
render();

// exposed for quick testing in the console
window.CQ = { queryDueLeads, buildQueueView, logOutcome, parseCSV, rowsToLeads, suggest, sheetCsvUrl };
})();

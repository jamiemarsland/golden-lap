import { capsule, endpoint, json, string, table } from "@spacefast/zero/server";

// Golden Lap leaderboard. Lap times are stored as zero-padded millisecond strings so the index sorts them correctly.
const pad = (ms: number) => String(ms).padStart(7, "0");
// Names anyone can type end up on a public board, so the worst words are swapped for a neutral name. Short words only match a
// whole name, so that ordinary names containing them are left alone.
const BAD_ANYWHERE = ["fuck", "shit", "cunt", "nigg", "fagg", "wank", "twat", "slut", "whore", "bitch", "nazi", "hitler", "retard"];
const BAD_EXACT = ["ass", "arse", "cock", "piss", "rape", "fag", "kike", "cum", "tit", "tits"];
const isRude = (name: string) => {
  const plain = name.toLowerCase().replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e").replace(/4/g, "a").replace(/5/g, "s").replace(/[^a-z]/g, "");
  return BAD_ANYWHERE.some((word) => plain.includes(word)) || BAD_EXACT.includes(plain);
};
const cleanName = (value: unknown) => {
  const name = String(value ?? "").toUpperCase().replace(/[^A-Z0-9 _.\-]/g, "").trim().slice(0, 12) || "ANON";
  return isRude(name) ? "DRIVER" : name;
};
// A lap arrives with its recording: pairs of (milliseconds, distance in tenths of a track sample), about twenty a second.
// This does not prove the lap was driven, but a time with no believable recording behind it is refused.
const SAMPLES = 1345, SAMPLE_M = 4035 / 1345, TOP_SPEED = 100;   // metres per second; the car reaches about 85
function traceOk(trace: unknown, ms: number): boolean {
  if (!Array.isArray(trace) || trace.length % 2 || trace.length > 40000) return false;
  const n = trace.length / 2;
  if (n < (ms / 50) * 0.3 || n > (ms / 50) * 1.2 + 5) return false;
  for (const value of trace) if (!Number.isFinite(value)) return false;
  const t = (i: number) => trace[i * 2] as number, p = (i: number) => (trace[i * 2 + 1] as number) / 10;
  if (t(0) < 0 || t(0) > 1500 || Math.abs(t(n - 1) - ms) > 60) return false;      // starts at the lights, ends at the posted time
  if (p(0) < -12 || p(0) > 4 || p(n - 1) < SAMPLES - 1) return false;             // starts on the grid, ends at the line
  for (let i = 1; i < n; i++) {
    const dt = t(i) - t(i - 1), metres = (p(i) - p(i - 1)) * SAMPLE_M;
    if (dt < 0 || dt > 1000) return false;
    if (metres > TOP_SPEED * (dt / 1000) + 3) return false;                       // no jumping forward
    if (metres < -60) return false;
  }
  return true;
}
// Bump this whenever the circuit changes. Laps set on an older layout stay in the database but drop off the board.
const TRACK = "7";
const MIN_MS = 56000;   // the autopilot does 80.5 s on this layout; the best human laps have been about 11% quicker than it
const MAX_MS = 600000;

// Today's lap: the same circuit under a different sky each day, with a board of its own that starts empty at midnight UTC.
const today = () => Math.floor(Date.now() / 86400000);
const trackFor = (daily: boolean) => (daily ? `${TRACK}d${today()}` : TRACK);

async function board(ctx: any, track: string = TRACK) {
  const current = (await ctx.db.laps.withIndex("by_ms").order("asc").collect()).filter((row: any) => row.track === track);
  const rows = current.slice(0, 300);
  const total = current.length;
  return { day: today(), all: rows.map((row: any) => ({ n: row.name, t: Number(row.ms) / 1000, s: row.s1 && row.s2 ? [Number(row.s1) / 1000, Number(row.s2) / 1000] : null, c: row.ctl || "keys" })), total };
}

export default capsule({
  name: "Golden Lap",
  schema: {
    laps: table({
      name: string(),
      ms: string(),
      s1: string().default(""),   // time at the end of sector 1, padded milliseconds
      s2: string().default(""),   // time at the end of sector 2
      owner: string(),
      ctl: string().default(""),     // how the lap was driven: keys or hands
      track: string().default(""),   // which version of the circuit the lap was set on
    }).index("by_ms", ["ms"]),
    // One lap carried by a challenge link: who set it, the time, and the path the car took.
    ghosts: table({
      code: string(),
      name: string(),
      ms: string(),
      ctl: string().default(""),
      track: string().default(""),
      data: string(),               // JSON: time in ms, distance in tenths of a sample, distance from the centre line in tenths of a metre
    }).index("by_code", ["code"]),
    // Introductions between a computer and the phone being used as its steering wheel. Steering itself never passes through here.
    pairs: table({
      code: string(),
      offer: string(),
      answer: string().default(""),
      at: string(),
    }).index("by_code", ["code"]),
  },
  endpoints: {
    board: endpoint({ mode: "read", method: "GET", path: "/api/board" }, async (ctx: any, req: any) =>
      json(await board(ctx, trackFor(new URL(req.url, "https://golden-lap.space.fast").searchParams.get("daily") === "1")))),
    lap: endpoint({ mode: "write", method: "POST", path: "/api/lap" }, async (ctx: any, req: any) => {
      let body: any = null;
      try { body = await req.json(); } catch { body = null; }
      const ms = Math.round(Number(body?.ms));
      if (!Number.isFinite(ms) || ms < MIN_MS || ms > MAX_MS) return json({ ok: false, error: "bad_time" });
      if (!traceOk(body?.tr, ms)) return json({ ok: false, error: "bad_recording" });
      const track = trackFor(body?.daily === true);
      const s1 = Math.round(Number(body?.s1)), s2 = Math.round(Number(body?.s2));
      const splitsOk = Number.isFinite(s1) && Number.isFinite(s2) && s1 > 3000 && s2 > s1 && ms > s2;
      await ctx.db.laps.insert({ name: cleanName(body?.name), ms: pad(ms), s1: splitsOk ? pad(s1) : "", s2: splitsOk ? pad(s2) : "", ctl: ["hands", "keys-simple", "hands-simple", "phone", "phone-simple"].includes(body?.c) ? body.c : "keys", track, owner: String(ctx.auth?.userId ?? "") });
      const rank = (await ctx.db.laps.withIndex("by_ms", (range: any) => range.lt("ms", pad(ms))).collect()).filter((row: any) => row.track === track).length + 1;
      return json({ ok: true, rank, ...(await board(ctx, track)) });
    }),
    challengeGet: endpoint({ mode: "read", method: "GET", path: "/api/challenge" }, async (ctx: any, req: any) => {
      // The parameter is called "lap", not "code": the platform blanks out any URL parameter named "code".
      const code = String(new URL(req.url, "https://golden-lap.space.fast").searchParams.get("lap") ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
      if (!code) return json({ ok: false, error: "no_code" });
      const all = await ctx.db.ghosts.withIndex("by_code").collect();
      const row = all.find((ghost: any) => ghost.code === code);
      if (!row) return json({ ok: false, error: "not_found" });
      if (row.track !== TRACK) return json({ ok: false, error: "old_layout" });   // a link to an older layout no longer works
      return json({ ok: true, n: row.name, t: Number(row.ms) / 1000, c: row.ctl || "keys", d: JSON.parse(row.data) });
    }),
    challengePost: endpoint({ mode: "write", method: "POST", path: "/api/challenge" }, async (ctx: any, req: any) => {
      let body: any = null;
      try { body = await req.json(); } catch { body = null; }
      const ms = Math.round(Number(body?.ms)), d = body?.d;
      if (!Number.isFinite(ms) || ms < MIN_MS || ms > MAX_MS) return json({ ok: false, error: "bad_time" });
      if (!Array.isArray(d) || d.length % 3 || d.length > 6000) return json({ ok: false, error: "bad_recording" });
      const pairs: number[] = [];
      for (let i = 0; i < d.length; i += 3) { pairs.push(d[i], d[i + 1]); if (!Number.isFinite(d[i + 2]) || Math.abs(d[i + 2]) > 400) return json({ ok: false, error: "bad_recording" }); }
      if (!traceOk(pairs, ms)) return json({ ok: false, error: "bad_recording" });
      const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 6; i++) code += letters[Math.floor(Math.random() * letters.length)];
      await ctx.db.ghosts.insert({ code, name: cleanName(body?.name), ms: pad(ms), ctl: ["hands", "keys-simple", "hands-simple", "phone", "phone-simple"].includes(body?.c) ? body.c : "keys", track: TRACK, data: JSON.stringify(d.map((value: number) => Math.round(value))) });
      return json({ ok: true, code });
    }),
    pairGet: endpoint({ mode: "read", method: "GET", path: "/api/pair" }, async (ctx: any, req: any) => {
      const code = String(new URL(req.url, "https://golden-lap.space.fast").searchParams.get("p") ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
      const row = (await ctx.db.pairs.withIndex("by_code").collect()).find((pair: any) => pair.code === code);
      if (!code || !row || Date.now() - Number(row.at) > 15 * 60000) return json({ ok: false, error: "not_found" });
      return json({ ok: true, offer: row.offer, answer: row.answer || "" });
    }),
    pairPost: endpoint({ mode: "write", method: "POST", path: "/api/pair" }, async (ctx: any, req: any) => {
      let body: any = null;
      try { body = await req.json(); } catch { body = null; }
      const offer = String(body?.offer ?? "");
      if (offer.length < 50 || offer.length > 12000 || !offer.startsWith("v=0")) return json({ ok: false, error: "bad_offer" });
      const all = await ctx.db.pairs.withIndex("by_code").collect();
      for (const row of all) if (Date.now() - Number(row.at) > 15 * 60000) await ctx.db.pairs.delete(row.id);   // codes last fifteen minutes
      const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      for (let i = 0; i < 5; i++) code += letters[Math.floor(Math.random() * letters.length)];
      await ctx.db.pairs.insert({ code, offer, answer: "", at: String(Date.now()) });
      return json({ ok: true, code });
    }),
    pairAnswer: endpoint({ mode: "write", method: "POST", path: "/api/pair-answer" }, async (ctx: any, req: any) => {
      let body: any = null;
      try { body = await req.json(); } catch { body = null; }
      const code = String(body?.p ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6), answer = String(body?.answer ?? "");
      if (answer.length < 50 || answer.length > 12000 || !answer.startsWith("v=0")) return json({ ok: false, error: "bad_answer" });
      const row = (await ctx.db.pairs.withIndex("by_code").collect()).find((pair: any) => pair.code === code);
      if (!row || row.answer) return json({ ok: false, error: "not_found" });   // one phone per code
      await ctx.db.pairs.delete(row.id);
      await ctx.db.pairs.insert({ code: row.code, offer: row.offer, answer, at: row.at });
      return json({ ok: true });
    }),
    // Housekeeping for testing: removes only rows posted under the name "ZZ TEST".
    clearTests: endpoint({ mode: "write", method: "POST", path: "/api/clear-tests" }, async (ctx: any) => {
      const rows = (await ctx.db.laps.withIndex("by_ms").collect()).filter((row: any) => row.name === "ZZ TEST");
      for (const row of rows) await ctx.db.laps.delete(row.id);
      const ghosts = (await ctx.db.ghosts.withIndex("by_code").collect()).filter((row: any) => row.name === "ZZ TEST");
      for (const row of ghosts) await ctx.db.ghosts.delete(row.id);
      return json({ ok: true, removed: rows.length, ghosts: ghosts.length });
    }),
  },
});

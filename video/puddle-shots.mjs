// Takes still frames of the wet road at spots where standing water should be, to check how the puddles really look.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.HOME + '/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const OUT = decodeURIComponent(new URL('./raw/puddles/', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => { try { localStorage.setItem('goldenlap.ctl', 'keys'); localStorage.setItem('goldenlap.hc', '1'); } catch (e) {} });
const p = await ctx.newPage();
await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(2500);
const found = await p.evaluate(() => { document.getElementById('start').style.display = 'none'; G.applyEnv('rain');
  const fr = v => v - Math.floor(v), f32 = Math.fround; const vh = (x, y) => { let a = fr(f32(x * 0.1031)), b = fr(f32(y * 0.1031)), c = fr(f32(x * 0.1031)); const d = a * (b + 33.33) + b * (c + 33.33) + c * (a + 33.33); a += d; b += d; c += d; return fr((a + b) * c); };      // same hash as the shader
  const vn = (x, y) => { const ix = Math.floor(x), iy = Math.floor(y); let fx = x - ix, fy = y - iy; fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    const a = vh(ix, iy), b = vh(ix + 1, iy), c = vh(ix, iy + 1), d = vh(ix + 1, iy + 1); return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fy; };
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const score = []; for (let i = 0; i < G.N; i++) { if (G.tun[i]) { score.push(0); continue; } let sc = 0;
    for (let k = 4; k <= 14; k++) { const q = G.P[(i + k) % G.N]; const st = sm(0.46, 0.6, vn(q.x * 0.011 + 3.7, q.z * 0.011 + 3.7)); const pn = vn(q.x * 0.42 + 11, q.z * 0.42 + 11) * 0.7 + vn(q.x * 1.4 + 5, q.z * 1.4 + 5) * 0.3; sc += st * sm(0.62, 0.645, pn); }
    score.push(sc); }
  const best = []; for (let n = 0; n < 3; n++) { let bi = -1, bv = 0; score.forEach((v, i) => { if (v > bv && best.every(b => Math.abs(b - i) > 60)) { bv = v; bi = i; } }); if (bi >= 0) best.push(bi); }
  return best; });
console.log('spots with the most standing water just ahead:', found.join(', '));
const run = ms => p.evaluate(ms => new Promise(res => { const t0 = performance.now(); (function f() { G.frame(); if (performance.now() - t0 < ms) setTimeout(f, 12); else res(); })(); }), ms);
await p.evaluate(() => G.toGrid()); await run(4300);
let n = 0;
for (const i of found) { for (const fx of [1, 0]) { await p.evaluate(([i, fx]) => { G.placeOnTrack(i, 3); G.passB.uniforms.fx.value = fx; }, [i, fx]); await run(600);
  await p.screenshot({ path: OUT + 'spot' + (++n) + (fx ? '-tape' : '-raw') + '.png' }); } }
p.on('console', m => { if (m.type() === 'error') console.log('page error:', m.text().slice(0, 200)); });
const fps = await p.evaluate(async () => { const t0 = performance.now(); let n = 0; await new Promise(r => { (function f() { n++; G.frame(); if (performance.now() - t0 < 2000) requestAnimationFrame(f); else r(); })(); }); return Math.round(n / ((performance.now() - t0) / 1000)); });
console.log('frames per second in the rain, headless:', fps);
await b.close();

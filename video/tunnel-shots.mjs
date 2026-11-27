// Still frames from inside the tunnel, approaching the exit in the rain: is it wet and raining outside?
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.HOME + '/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const OUT = decodeURIComponent(new URL('./raw/tunnel/', import.meta.url).pathname);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => { try { localStorage.setItem('goldenlap.ctl', 'keys'); localStorage.setItem('goldenlap.hc', '1'); } catch (e) {} });
const p = await ctx.newPage();
await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(2500);
const run = ms => p.evaluate(ms => new Promise(res => { const t0 = performance.now(); (function f() { G.frame(); if (performance.now() - t0 < ms) setTimeout(f, 12); else res(); })(); }), ms);
await p.evaluate(() => { document.getElementById('start').style.display = 'none'; G.applyEnv('rain'); G.toGrid(); }); await run(4300);
let n = 0;
for (const back of [10, 5, 2]) { await p.evaluate(back => G.placeOnTrack(G.iTun1 - back, 3), back); await run(700); await p.screenshot({ path: OUT + 'tun' + (++n) + '.png' }); }
await b.close();

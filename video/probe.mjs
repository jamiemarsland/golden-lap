// Opens the game in headless Chrome and reports whether it runs at full speed with sound, before any footage is recorded.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.HOME + '/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => { try { localStorage.setItem('goldenlap.ctl', 'keys'); localStorage.setItem('goldenlap.hc', '1'); } catch (e) {} });
const p = await ctx.newPage();
await p.goto('http://localhost:8765/index.html');
await p.waitForFunction(() => window.G);
await p.click('#gobtn');
await p.waitForTimeout(6000);
console.log(await p.evaluate(() => { const gl = document.createElement('canvas').getContext('webgl'); const e = gl.getExtension('WEBGL_debug_renderer_info'); const c = document.getElementById('c'); return { gpu: e && gl.getParameter(e.UNMASKED_RENDERER_WEBGL), fps: Math.round(G.diag.fps), canvas: c.width + 'x' + c.height, audio: G.snd.ac && G.snd.ac.state, samples: !!G.snd.smp, mode: G.mode }; }));
await b.close();

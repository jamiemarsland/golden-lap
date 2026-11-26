// Records footage of Golden Lap for the film: the game's own picture and engine sound, captured in headless Chrome
// while the autopilot drives. Needs the local preview server on port 8765. Writes WebM files to video/raw/.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.HOME + '/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const OUT = decodeURIComponent(new URL('./raw/', import.meta.url).pathname);
const only = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => { try { localStorage.setItem('goldenlap.ctl', 'keys'); localStorage.setItem('goldenlap.hc', '1'); } catch (e) {} });
const p = await ctx.newPage();
await p.exposeFunction('saveChunk', (name, b64) => { fs.appendFileSync(OUT + name + '.webm', Buffer.from(b64, 'base64')); });
await p.goto('http://localhost:8765/index.html');
await p.waitForFunction(() => window.G);
await p.screenshot({ path: OUT + 'start.png' });
await p.click('#gobtn');
await p.waitForFunction(() => G.snd && G.snd.smp && G.snd.master, null, { timeout: 30000 });
await p.evaluate(() => {
  // The game's HUD is ordinary page text, which a canvas recording does not see. For clips that want it, the picture and the HUD
  // are redrawn together onto a second canvas every frame, reading the live values off the page, and that canvas is recorded.
  window.__hud = () => { if (window.__hudC) return window.__hudC;
    const c2 = window.__hudC = document.createElement('canvas'); c2.width = 1920; c2.height = 1080; const g = c2.getContext('2d'), src = document.getElementById('c'), el = id => document.getElementById(id), Y = '#f3e36b';
    const draw = () => { requestAnimationFrame(draw); g.shadowColor = 'transparent'; g.globalAlpha = 1; g.drawImage(src, 0, 0, 1920, 1080);
      g.globalAlpha = 0.8; g.drawImage(el('map'), 96, 76, 130, 130); g.globalAlpha = 1;
      g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowOffsetX = 2; g.shadowOffsetY = 2; g.shadowBlur = 0; g.fillStyle = Y; g.textBaseline = 'alphabetic';
      g.textAlign = 'left'; g.font = '700 44px "Courier New", monospace'; g.fillText(el('spd').textContent + ' KM/H', 96, 944);
      g.font = '700 22px "Courier New", monospace'; g.fillText('GEAR ' + el('gear').textContent + '   ' + el('rpm').textContent + ' RPM', 96, 974);
      g.textAlign = 'right'; g.fillText(el('lap').textContent, 1824, 98); g.fillText(el('last').textContent, 1824, 126);
      g.font = '700 18px "Courier New", monospace'; [...el('sec').children].forEach((d, i) => g.fillText(d.textContent, 1824, 156 + i * 24));
      g.shadowColor = 'transparent'; g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(96, 986, 220, 8);
      g.fillStyle = G.car.rpm > 11800 ? '#ff5a3a' : Y; g.fillRect(96, 986, 220 * Math.max(0, Math.min(1, G.car.rpm / 13000)), 8);
      if (window.__hands) hands(); };
    // A drawn stand-in for the camera view: two gloved hands on a ring, tilting exactly as the car steers.
    let tilt = 0;
    const glove = (x, y, side) => { g.save(); g.translate(x, y); g.scale(side, 1);
      g.fillStyle = '#d9d6cc'; g.beginPath(); g.roundRect(-17, -30, 34, 58, 15); g.fill();                    // the hand
      g.beginPath(); g.roundRect(8, -8, 20, 15, 7); g.fill();                                                  // thumb, hooked over the rim
      g.fillStyle = '#c23f1c'; g.fillRect(-17, 12, 34, 9);                                                     // red cuff band, as on the car's gloves
      g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 2; for (const fx of [-8, 0, 8]) { g.beginPath(); g.moveTo(fx, -26); g.lineTo(fx, -8); g.stroke(); }
      g.restore(); };
    const hands = () => { const cx = 960, cy = 170, R = 86;
      const want = Math.max(-1, Math.min(1, G.car.steer / 0.16)) * -0.62; tilt += (want - tilt) * 0.25;      // radians of hand tilt; left turn lifts the right hand
      g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 24; g.shadowOffsetX = 0; g.shadowOffsetY = 8;
      g.fillStyle = 'rgba(14,15,17,.62)'; g.beginPath(); g.roundRect(cx - 190, cy - 120, 380, 262, 26); g.fill(); g.restore();
      g.save(); g.translate(cx, cy); g.rotate(tilt);
      g.strokeStyle = 'rgba(243,227,107,.95)'; g.lineWidth = 9; g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.stroke();
      g.lineWidth = 6; g.beginPath(); g.moveTo(-R, 0); g.lineTo(R, 0); g.moveTo(0, 0); g.lineTo(0, R); g.stroke();
      g.fillStyle = '#17181b'; g.beginPath(); g.arc(0, 0, 17, 0, Math.PI * 2); g.fill(); g.strokeStyle = Y; g.lineWidth = 3; g.stroke();
      glove(-R, -2, 1); glove(R, -2, -1); g.restore();
      g.fillStyle = Y; g.textAlign = 'center'; g.font = '700 19px "Courier New", monospace'; g.shadowColor = 'transparent';
      g.fillText('STEERED BY HAND, ON A WEBCAM', cx, cy + 124); };
    requestAnimationFrame(draw); return c2; };
  window.__rec = async (name, secs, hud) => { window.__hands = hud === 'hands';
    const c = hud ? window.__hud() : document.getElementById('c'), vs = c.captureStream(30);
    if (!window.__dest) { window.__dest = G.snd.ac.createMediaStreamDestination(); G.snd.master.connect(window.__dest); }
    const ms = new MediaStream([...vs.getVideoTracks(), ...window.__dest.stream.getAudioTracks()]);
    const mr = new MediaRecorder(ms, { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: 14e6, audioBitsPerSecond: 192000 });
    let chain = Promise.resolve();
    mr.ondataavailable = e => { if (!e.data.size) return; chain = chain.then(async () => { const u = new Uint8Array(await e.data.arrayBuffer()); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); await window.saveChunk(name, btoa(s)); }); };
    const done = new Promise(r => { mr.onstop = r; });
    mr.start(1000); await new Promise(r => setTimeout(r, secs * 1000)); mr.stop(); await done; await chain;
    return Math.round(G.diag.fps);
  };
});
const clip = async (name, secs, setup, hud) => { if (only.length && !only.includes(name)) return; try { fs.unlinkSync(OUT + name + '.webm'); } catch (e) {}
  await p.evaluate(setup); const fps = await p.evaluate(([n, s, h]) => window.__rec(n, s, h), [name, secs, hud || false]); console.log(name, secs + 's', 'game fps', fps); };

await clip('lap', 90, () => { G.applyEnv('dry'); G.toGrid(); G.auto = true; });
// the same lap with the HUD drawn in, in three lights
await clip('laphud', 90, () => { G.applyEnv('dry'); G.toGrid(); G.auto = true; }, process.env.HANDS ? 'hands' : true);      // the drawn hands panel is off unless HANDS=1
await clip('lapgolden', 90, () => { G.applyEnv('golden'); G.toGrid(); G.auto = true; }, process.env.HANDS ? 'hands' : true);      // the drawn hands panel is off unless HANDS=1
await clip('lapdusk', 90, () => { G.applyEnv('dusk'); G.toGrid(); G.auto = true; }, process.env.HANDS ? 'hands' : true);      // the drawn hands panel is off unless HANDS=1
// a flying second lap, for the Spa swoop at full speed (recorded after the swoop was opened up)
await clip('lapfly', 102, () => { G.applyEnv('dry'); G.toGrid(); G.auto = true; }, true);
// the same flying lap, but the weather turns: dry fades to full rain over three seconds, starting just after the plunge into the swoop
await clip('lapflyrain', 102, () => { G.applyEnv('dry'); G.toGrid(); G.auto = true; const C = G.CONDS, a = C.dry, b = C.rain; C.ramp = { ...a };
  const mix = (x, y, k) => x + (y - x) * k, ch = (x, y, k, s) => Math.round(mix(x >> s & 255, y >> s & 255, k)) << s, hex = (x, y, k) => ch(x, y, k, 16) | ch(x, y, k, 8) | ch(x, y, k, 0);
  setTimeout(() => { const t0 = performance.now(); const step = () => { const k = Math.min(1, (performance.now() - t0) / 3000), e = k * k * (3 - 2 * k);
    Object.assign(C.ramp, { sky: hex(a.sky, b.sky, e), haze: hex(a.haze, b.haze, e), sun: hex(a.sun, b.sun, e), road: hex(a.road, b.road, e), fog: mix(a.fog, b.fog, e), tint: a.tint.map((v, i) => mix(v, b.tint[i], e)), rain: e, grip: mix(a.grip, b.grip, e), pace: mix(a.pace, b.pace, e), expo: mix(a.expo, b.expo, e) });
    G.applyEnv('ramp'); if (k < 1) requestAnimationFrame(step); }; step(); }, 84700); }, true);
// the start, for the trailer: the driver blips the throttle on each countdown beep, then the autopilot takes the launch
await clip('gridrev', 12, () => { G.applyEnv('dry'); G.toGrid(); const key = (type) => dispatchEvent(new KeyboardEvent(type, { code: 'ArrowUp' }));
  [[350, 800], [1350, 1850], [2300, 3150]].forEach(([d, u]) => { setTimeout(() => key('keydown'), d); setTimeout(() => key('keyup'), u); });
  setTimeout(() => { G.auto = true; }, 3180); }, true);
await clip('laprain', 90, () => { G.applyEnv('rain'); G.toGrid(); G.auto = true; }, true);
await clip('fx', 14, () => { G.placeOnTrack(G.nearIdx(0, -200), 70); G.auto = true; G.passB.uniforms.fx.value = 0; setTimeout(() => { G.passB.uniforms.fx.value = 1; }, 6500); });
await clip('weather', 23, () => { G.placeOnTrack(G.nearIdx(0, -330) - 12, 70); G.auto = true; ['golden', 'fog', 'dusk', 'rain', 'raindusk'].forEach((k, i) => setTimeout(() => G.applyEnv(k), i * 4500)); setTimeout(() => G.applyEnv('dry'), 22900); });
await clip('raintunnel', 18, () => { G.applyEnv('rain'); G.placeOnTrack(G.iCity0 - 45, 70); G.auto = true; });
await clip('newcorners', 27, () => { G.applyEnv('dry'); G.placeOnTrack(G.nearIdx(600, 454), 60); G.auto = true; });
await clip('replay', 84, () => { G.applyEnv('dry'); G.toGrid(); G.auto = true; const S = []; let k = 0;
  while (G.mode !== 'done' && k < 9000) { G.frame(1 / 60); k++; if (G.lap.t != null && k % 3 === 0 && G.mode !== 'done') S.push([+G.lap.t.toFixed(3), G.car.x, G.car.z, G.car.h, G.car.yS, G.progress(), G.car.lat]); }
  S.push([G.lap.last, G.car.x, G.car.z, G.car.h, G.car.yS, G.N, G.car.lat]); G.lastRec = S; G.startReplay(); });
console.log(await p.evaluate(() => { const gl = document.createElement('canvas').getContext('webgl'); const e = gl.getExtension('WEBGL_debug_renderer_info'); return e && gl.getParameter(e.UNMASKED_RENDERER_WEBGL); }));
await b.close();

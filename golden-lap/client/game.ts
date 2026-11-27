// @ts-nocheck
// Generated from ../index.html by build-space.py. Edit index.html, not this file.
import * as THREE from "three";
import qrcode from "qrcode-generator";
import { SOUNDS } from "./sounds";

export function boot() {
(window as any).GL_SOUNDS = SOUNDS;
(function () {
// ---------- phone as steering wheel ----------
// Opened with ?w=CODE this page is not the game at all: it is the wheel. It reads the phone's tilt and sends it straight to the
// computer over a direct browser-to-browser link (WebRTC). The server only introduces the two; no steering passes through it.
const RTC = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const waitIce = pc => new Promise(res => { if (pc.iceGatheringState === 'complete') return res(); const t = setTimeout(res, 2500);
  pc.addEventListener('icegatheringstatechange', () => { if (pc.iceGatheringState === 'complete') { clearTimeout(t); res(); } }); });
const postJ = (u, b) => fetch(u, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then(r => r.json());
{ let w = ''; try { w = (new URLSearchParams(location.search).get('w') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6); } catch (e) {}
  if (w) { phoneWheel(w); return; } }
function phoneWheel(code) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#15171a;color:#fff;font:16px/1.5 "Courier New",monospace;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;text-align:center;padding:max(18px,env(safe-area-inset-top)) max(18px,env(safe-area-inset-right)) max(18px,env(safe-area-inset-bottom)) max(18px,env(safe-area-inset-left));touch-action:none;overscroll-behavior:none;user-select:none;-webkit-user-select:none;overflow:hidden';
  const B = 'display:inline-block;padding:12px 26px;background:#f3e36b;color:#111;font-weight:700;letter-spacing:3px;font-size:18px';
  el.innerHTML = `<div style="color:#f3e36b;font-weight:700;letter-spacing:5px;font-size:20px">GOLDEN LAP</div><div id="pwst" style="letter-spacing:2px">CONNECTING...</div>
    <canvas id="pwc" width="200" height="200" style="width:150px;height:150px"></canvas><div id="pwgo" style="${B}">TAP TO START</div>
    <div id="pwtip" style="font-size:14px;color:#ccc;max-width:420px">Hold the phone sideways like a steering wheel, screen facing you. Turn it to steer. Touch the screen to brake.</div>
    <div id="pwinv" style="font-size:12px;color:#999;text-decoration:underline;display:none">Steering backwards? Tap here</div>
    <div id="pwhap" style="font-size:12px;color:#999;text-decoration:underline;display:none">Vibration is on. Tap to turn off</div>
    <label id="pwsw" style="position:fixed;left:-200px;top:0;opacity:0;pointer-events:none"><input type="checkbox" switch></label>`;
  document.body.appendChild(el); document.title = 'Golden Lap wheel';
  /* As clean a screen as the phone allows: nothing scrolls, bounces or zooms, the page runs under the notch, and the browser's bars take the page's colour.
     Android can go properly full screen on the first tap (below). An iPhone cannot hide Safari's bars from a web page. */
  { const meta = (name, content) => { let m = document.querySelector(`meta[name="${name}"]`); if (!m) { m = document.createElement('meta'); m.name = name; document.head.appendChild(m); } m.content = content; };
    meta('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'); meta('theme-color', '#15171a');
    for (const n of [document.documentElement, document.body]) n.style.cssText += ';background:#15171a;overflow:hidden;overscroll-behavior:none;height:100%;margin:0';
    for (const ev of ['gesturestart', 'gesturechange', 'dblclick']) document.addEventListener(ev, e => e.preventDefault(), { passive: false }); }
  const goFull = () => { try { const d = document.documentElement, f = d.requestFullscreen || d.webkitRequestFullscreen; if (f && !document.fullscreenElement && !document.webkitFullscreenElement) { const r = f.call(d, { navigationUI: 'hide' }); if (r && r.catch) r.catch(() => {}); } } catch (err) {} };
  const q = id => el.querySelector('#' + id), st = t => { q('pwst').textContent = t; };
  let ch = null, base = null, inv = 1, brake = 0, ang = 0, lastSend = 0, flat = false, started = false, hapOn = true;
  /* The game tells the phone what the car is feeling: 'k' a kerb or the grass, 'b' a barrier, 'g' a gear change.
     Android can vibrate properly. An iPhone gives web pages no vibration. Flipping a hidden switch control used to make it tick (iOS 17.4 to 26.4); Apple closed that in iOS 26.5,
     so on a current iPhone this does nothing. The attempt is left in for older iPhones, where it is harmless. */
  const tick = () => { try { q('pwsw').click(); } catch (err) {} };
  const native = (() => { try { return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.haptic; } catch (err) { return null; } })();      /* inside the Golden Lap iPhone app, which can use the phone's real haptics */
  const haptic = h => { if (!started || !hapOn) return;
    if (native) { try { native.postMessage(h); } catch (err) {} return; }
    if (navigator.vibrate) { navigator.vibrate(h === 'b' ? [70, 30, 110] : h === 'g' ? 16 : 24); return; }
    tick(); if (h === 'b') { setTimeout(tick, 70); setTimeout(tick, 140); } };
  (async () => {
    try { const j = await fetch('/api/pair?p=' + code, { cache: 'no-store' }).then(r => r.json()); if (!j.ok) return st('THAT CODE HAS EXPIRED: SCAN AGAIN');
      const pc = new RTCPeerConnection(RTC);
      pc.ondatachannel = e => { ch = e.channel; ch.onmessage = ev => { try { const m = JSON.parse(ev.data); if (m.h) haptic(m.h); } catch (err) {} }; ch.onopen = () => st(started ? 'CONNECTED' : 'CONNECTED: TAP TO START'); ch.onclose = () => { ch = null; st('DISCONNECTED: SCAN AGAIN'); }; };
      await pc.setRemoteDescription({ type: 'offer', sdp: j.offer }); await pc.setLocalDescription(await pc.createAnswer()); await waitIce(pc);
      const a = await postJ('/api/pair-answer', { p: code, answer: pc.localDescription.sdp }); if (!a.ok) return st('COULD NOT CONNECT: SCAN AGAIN');
      setTimeout(() => { if (!ch || ch.readyState !== 'open') st('STILL CONNECTING... SAME WI-FI HELPS'); }, 8000);
    } catch (e) { st('COULD NOT CONNECT: SCAN AGAIN'); }
  })();
  // The angle of gravity in the plane of the screen is how far the phone has been turned, like a wheel. It works on its side or upright.
  function onMotion(e) { const g = e.accelerationIncludingGravity; if (!g || g.x == null) return;
    if (Math.hypot(g.x, g.y) < 3) { flat = true; return; } flat = false;      // lying flat: no reading, hold the last angle
    const a = Math.atan2(g.x, g.y) * 57.2958; if (base == null) base = a; let d = a - base; d = ((d + 540) % 360) - 180; ang += (d - ang) * 0.5;
    const now = performance.now(); if (ch && ch.readyState === 'open' && now - lastSend > 30) { lastSend = now; ch.send(JSON.stringify({ s: +(ang * inv).toFixed(1), b: brake })); } }
  q('pwgo').addEventListener('click', async e => { e.stopPropagation(); goFull();      /* must be asked for inside the tap itself */
    try { if (window.DeviceMotionEvent && DeviceMotionEvent.requestPermission) { const p = await DeviceMotionEvent.requestPermission(); if (p !== 'granted') return st('MOTION ACCESS WAS REFUSED'); } } catch (err) { return st('MOTION SENSORS NOT AVAILABLE'); }
    if (!started) { addEventListener('devicemotion', onMotion); started = true; try { navigator.wakeLock && navigator.wakeLock.request('screen').catch(() => {}); } catch (err) {} }
    base = null; ang = 0; q('pwgo').textContent = 'RE-CENTRE'; q('pwgo').style.cssText = 'display:inline-block;padding:6px 16px;border:1px solid #f3e36b;color:#f3e36b;font-weight:700;font-size:13px;letter-spacing:2px'; q('pwinv').style.display = 'block'; if (navigator.vibrate || native) q('pwhap').style.display = 'block'; haptic('g');      /* the vibration line only shows where the phone can really vibrate: not on an iPhone */      /* one tick so you know it works */
    if (ch && ch.readyState === 'open') st('CONNECTED'); });
  q('pwinv').addEventListener('click', e => { e.stopPropagation(); inv = -inv; q('pwinv').textContent = 'Steering direction switched. Tap to switch back'; });
  q('pwhap').addEventListener('click', e => { e.stopPropagation(); hapOn = !hapOn; q('pwhap').textContent = hapOn ? 'Vibration is on. Tap to turn off' : 'Vibration is off. Tap to turn on'; haptic('g'); });
  for (const id of ['pwgo', 'pwinv', 'pwhap']) for (const ev of ['touchstart', 'touchend']) q(id).addEventListener(ev, e => e.stopPropagation(), { passive: true });
  el.addEventListener('touchstart', e => { brake = 1; e.preventDefault(); }, { passive: false }); el.addEventListener('touchend', e => { if (!e.touches.length) brake = 0; }); el.addEventListener('touchcancel', () => { brake = 0; });
  const c = q('pwc').getContext('2d');
  (function draw() { requestAnimationFrame(draw); c.clearRect(0, 0, 200, 200); c.save(); c.translate(100, 100); c.rotate(-ang * 0.01745);
    c.lineWidth = 16; c.strokeStyle = brake ? '#ff5a3a' : '#f3e36b'; c.beginPath(); c.arc(0, 0, 82, 0, 7); c.stroke(); c.lineWidth = 12; c.beginPath(); c.moveTo(-82, 0); c.lineTo(82, 0); c.moveTo(0, 0); c.lineTo(0, 82); c.stroke();
    c.fillStyle = '#15171a'; c.beginPath(); c.arc(0, 0, 20, 0, 7); c.fill(); c.restore();
    if (started) q('pwtip').textContent = flat ? 'Tilt the screen up to face you: lying flat, the phone cannot tell which way it is turned.' : brake ? 'BRAKING' : 'Turn to steer. Touch the screen to brake.'; })();
}
const V3 = THREE.Vector3;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);

// ---------- tuning ----------
const CAM = { pos: [-0.30, 0.95, 0.20], yaw: -0.12, pitch: -0.16, roll: 0.05, fov: 92 };
const RT_LINES = 600;          // vertical resolution of the "tape"
const SKY = 0xf2f3ee, HAZE = 0xe6e8cf;
const ROAD_HALF = 6, KERB_OUT = 7.4, WALL = 15.5;

// ---------- renderer ----------
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: false });
document.getElementById('c').addEventListener('webglcontextlost', () => { try { note('the game lost its graphics context'); } catch (e) {} });
renderer.setPixelRatio(1);
const W = new THREE.Scene();           // world
W.background = new THREE.Color(SKY);
W.fog = new THREE.FogExp2(HAZE, 0.0017);
const C = new THREE.Scene();           // cockpit, drawn over the world
W.add(new THREE.HemisphereLight(0xffffff, 0x556644, 0.95));
// ---------- today's lap: the same circuit under a different sky each day ----------
// tint is applied to the finished picture, so every surface darkens together whatever it is made of.
const CONDS = {
  dry:      { name: '',             sky: SKY,      haze: HAZE,     fog: 0.0017, sun: 0xfff4d6, tint: [1, 1, 1],          rain: 0, grip: 1,    pace: 1,    road: 0xffffff, expo: 1 },
  golden:   { name: 'GOLDEN HOUR',  sky: 0xf7deaa, haze: 0xf0c486, fog: 0.0026, sun: 0xffb060, tint: [1.07, 0.97, 0.8],  rain: 0, grip: 1,    pace: 1,    road: 0xffecd2, expo: 1.06 },
  rain:     { name: 'RAIN',         sky: 0xb7bdc5, haze: 0xb2bac3, fog: 0.0045, sun: 0xdfe6f0, tint: [0.9, 0.95, 1.03],  rain: 1, grip: 0.8,  pace: 0.86, road: 0x858b96, expo: 0.95 },
  fog:      { name: 'FOG',          sky: 0xdcdedd, haze: 0xd9dcda, fog: 0.012,  sun: 0xffffff, tint: [1, 1, 1],          rain: 0, grip: 0.96, pace: 0.97, road: 0xe2e2e2, expo: 1 },
  dusk:     { name: 'DUSK',         sky: 0x8a86ad, haze: 0xd39a7e, fog: 0.0028, sun: 0xff9a6a, tint: [0.86, 0.72, 0.84], rain: 0, grip: 1,    pace: 1,    road: 0xc6bccb, expo: 1 },
  raindusk: { name: 'RAINY DUSK',   sky: 0x5d6280, haze: 0x7f8196, fog: 0.0048, sun: 0xc9b0c0, tint: [0.74, 0.76, 0.9],  rain: 1, grip: 0.8,  pace: 0.86, road: 0x767a8a, expo: 0.95 },
};
const DAILY = ['golden', 'rain', 'fog', 'dusk', 'raindusk'];
let ENV = CONDS.dry, envKey = 'dry', mRoad = null;
// Rain, done the way the Golden Hour Ride does it: streaks in the air, a shine on the road, drops on the lens.
const rainU = { uT0: { value: new THREE.Vector4() }, uT1: { value: new THREE.Vector4() }, uTime: { value: 0 }, uRain: { value: 0 }, uVel: { value: new THREE.Vector3() }, uCol: { value: new THREE.Vector3(0.86, 0.9, 0.96) }, uSky: { value: new THREE.Color(SKY) } };
// Real reflections in the rain: the world is drawn a second time from a camera mirrored under the road, and puddles show that picture.
const reflU = { uRefl: { value: null }, uRM: { value: new THREE.Matrix4() }, uReflOn: { value: 0 } };
const camM = new THREE.PerspectiveCamera(60, 16 / 9, 0.3, 2500), reflPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
let rtR = null, roadMeshes = null;
const rainMesh = (() => {
  const n = 14000, a = new Float32Array(n * 6), e = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) { const x = Math.random() * 30, y = Math.random() * 30, z = Math.random() * 30; a.set([x, y, z, x, y, z], i * 6); e[i * 2 + 1] = 1; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(a, 3)); g.setAttribute('aEnd', new THREE.BufferAttribute(e, 1));
  const m = new THREE.LineSegments(g, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: rainU,
    vertexShader: `uniform float uTime; uniform vec3 uVel; uniform vec4 uT0, uT1; attribute float aEnd; varying float vA;
      void main(){
        vec3 fall = vec3(1.5, -13., 0.8);
        vec3 p = mod(position + fall * uTime - cameraPosition, 30.) - 15. + cameraPosition;
        p += (fall - uVel) * 0.03 * aEnd;                                    // each streak is where the drop was a moment ago, as seen from a moving car
        vec4 mv = viewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
        vA = smoothstep(15., 9., -mv.z) * (1. - aEnd * 0.6);
        vec2 q = p.xz; if (dot(q - uT0.xy, uT0.zw) > 0. && dot(q - uT1.xy, uT1.zw) < 0.) vA = 0.;      // no rain inside the tunnel, but it keeps falling just beyond each mouth
      }`,
    fragmentShader: 'uniform vec3 uCol; uniform float uRain; varying float vA; void main(){ gl_FragColor = vec4(uCol, vA * 0.42 * uRain); }' }));
  m.frustumCulled = false; m.renderOrder = 3; m.visible = false; W.add(m); return m;
})();
const sun = new THREE.DirectionalLight(0xfff4d6, 0.5); sun.position.set(0.3, 1, 0.2); W.add(sun);
const hemiC = new THREE.HemisphereLight(0xffffff, 0x3a3a3a, 0.9); C.add(hemiC);
const sunC = new THREE.DirectionalLight(0xfff4d6, 0.55); sunC.position.set(-0.4, 1, 0.3); C.add(sunC);
function applyEnv(key) { envKey = CONDS[key] ? key : 'dry'; ENV = CONDS[envKey];
  W.background.setHex(ENV.sky); W.fog.color.setHex(ENV.haze); sun.color.setHex(ENV.sun); sunC.color.setHex(ENV.sun); if (mRoad) mRoad.color.setHex(ENV.road); rainU.uSky.value.setHex(ENV.sky);
  if (typeof passB !== 'undefined') passB.uniforms.tint.value.set(ENV.tint[0], ENV.tint[1], ENV.tint[2]); }

function tex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return t;
}
function speckle(g, w, h, n, lo, hi) {
  for (let i = 0; i < n; i++) {
    const v = Math.floor(rnd(lo, hi));
    g.fillStyle = `rgba(${v},${v},${v},${rnd(0.15, 0.5)})`;
    g.fillRect(Math.random() * w, Math.random() * h, rnd(1, 3), rnd(1, 4));
  }
}

// ---------- track ----------
// "Greatest hits" lap: famous corner shapes as inspiration, one original circuit. x, height, z in metres.
const CTRL = [
  [0,19,160],[0,22,0],[0,21,-200],[0,14,-330],                                 // pit straight, then downhill
  [0,6,-410],[-6,8,-484],[-2,17,-562],[-13,28,-650],                          // the swoop: left, right up the hill, left over the crest
  [-40,37,-760],[-70,42,-1000],                                                // long climbing straight
  [-6,42,-1156],[150,40,-1220],[306,37,-1156],[370,35,-1000],[400,34,-830],    // the long flat-out right
  [416,34,-680],[384,32,-540],[416,30,-400],[384,28,-260],                     // esses, now running downhill
  [404,25,-150],[452,21,-62],[545,17,-12],                                     // into the city: one wide, fast left between the walls
  [650,13,-8],[742,9,38],[792,7,130],                                          // the tunnel: a long fast right, as the real one is
  [800,5,225],[808,5,280],[800,5,335],[785,5,405],[735,5,446],                                         // harbour chicane, opened into a fast flick
  [660,5,456],[560,7,452],[470,10,455],                                       // the waterfront, then a gentle climb as the city ends
  [400,10,466],[336,10,506],[288,9,567],[278,8,646],[308,6,718],               // the long left: downhill, two apexes (after Pouhon)
  [361,6,803],[409,6,902],[467,7,984],[502,7,1062],[538,8,1116],               // the slalom: left, right, left, right (after Maggotts and Becketts)
  [559,7,1167],[566,6,1221],[559,7,1275],[538,8,1326],                         // first fast right, down into a dip (after Arrabbiata 1)
  [504,10,1369],[461,11,1403],[410,11,1424],[356,11,1431],                     // second fast right, up over a crest (after Arrabbiata 2)
  [250,11,1431],[130,11,1431],[80,11,1421],[38,11,1393],[10,11,1351],[0,11,1301],   // run to the banking, then the banked right that slings you onto the straight (after Zandvoort)
  [30,11,950],[0,12,560],[0,13,320],                                           // main straight, with one flat-out kink
];
const SC = 0.6;      // plan scale: tuned so a good lap is about a minute
const curve = new THREE.CatmullRomCurve3(CTRL.map(p => new V3(p[0] * SC, p[1], p[2] * SC)), true, 'centripetal');
curve.arcLengthDivisions = 4000;
const TRACK_LEN = curve.getLength();
const N = Math.round(TRACK_LEN / 3);
const DS = TRACK_LEN / N;
const P = curve.getSpacedPoints(N).slice(0, N);
for (let pass = 0; pass < 3; pass++) { const y = P.map(p => p.y); for (let i = 0; i < N; i++) P[i].y = (y[(i + N - 2) % N] + y[(i + N - 1) % N] + y[i] + y[(i + 1) % N] + y[(i + 2) % N]) / 5; }
const TAN = [], R = [], K = [], Y = P.map(p => p.y), SL = [], KV = [];
for (let i = 0; i < N; i++) {
  const a = P[(i + N - 1) % N], b = P[(i + 1) % N];
  const t = new V3(b.x - a.x, 0, b.z - a.z).normalize();
  TAN.push(t); R.push({ x: -t.z, z: t.x });
  SL.push((b.y - a.y) / (2 * DS));                    // gradient
}
for (let i = 0; i < N; i++) {
  const a = TAN[(i + N - 2) % N], b = TAN[(i + 2) % N];
  K.push(-(a.x * b.z - a.z * b.x) / (4 * DS));      // positive = left-hander
  KV.push((SL[(i + 2) % N] - SL[(i + N - 2) % N]) / (4 * DS));   // positive = compression, negative = crest
}
function dilate(mask, n) {
  const out = new Array(N).fill(false);
  for (let i = 0; i < N; i++) if (mask[i]) for (let k = -n; k <= n; k++) out[((i + k) % N + N) % N] = true;
  return out;
}
function nearIdx(x, z) { x *= SC; z *= SC; let best = 1e18, bi = 0; for (let i = 0; i < N; i++) { const d = (x - P[i].x) ** 2 + (z - P[i].z) ** 2; if (d < best) { best = d; bi = i; } } return bi; }
const inR = (i, a, b) => i >= a && i <= b;
const iCity0 = nearIdx(400, -110), iCity1 = nearIdx(480, 455), iTun0 = nearIdx(440, -80), iTun1 = nearIdx(797, 172), iHar0 = nearIdx(760, 430), iHar1 = nearIdx(485, 455);
const city = P.map((_, i) => inR(i, iCity0, iCity1)), tun = P.map((_, i) => inR(i, iTun0, iTun1));
rainU.uT0.value.set(P[iTun0].x, P[iTun0].z, TAN[iTun0].x, TAN[iTun0].z); rainU.uT1.value.set(P[(iTun1 + 1) % N].x, P[(iTun1 + 1) % N].z, TAN[(iTun1 + 1) % N].x, TAN[(iTun1 + 1) % N].z);      /* the tunnel's two mouths, each facing along the track */
const iHp0 = -1, iHp1 = -2;      // no hairpin any more
// ---------- banking: the last corner is tilted so the outside edge is higher, like a bowl ----------
const iBk0 = nearIdx(160, 1431), iBk1 = nearIdx(0, 1275);
const insB = P.map((p, i) => { const a = P[(i + N - 6) % N], b = P[(i + 6) % N]; return Math.sign(((a.x + b.x) / 2 - p.x) * R[i].x + ((a.z + b.z) / 2 - p.z) * R[i].z) || 1; });      // which side of the road is the inside of the bend
const BANK = P.map((_, i) => { if (!inR(i, iBk0, iBk1)) return 0; const u = (i - iBk0) / (iBk1 - iBk0), e = Math.min(1, u / 0.22, (1 - u) / 0.22); return 0.24 * e * e * (3 - 2 * e); });      // rise per metre across the road: about 13 degrees at its steepest, eased in and out
const BH = (j, a) => BANK[j] ? BANK[j] * clamp(ROAD_HALF - a * insB[j], 0, ROAD_HALF * 2 + 1.6) : 0;      // height of the surface at a metres from the centre line: zero at the inside edge
const WO = (() => { const raw = city.map((c, i) => inR(i, iHp0, iHp1) ? 11 : c ? 7.2 : WALL);   /* extra room at the hairpin */ return raw.map((_, i) => { let a = 0; for (let k = -8; k <= 8; k++) a += raw[((i + k) % N + N) % N]; return a / 17; }); })();   // barrier distance
const kerbMask = dilate(K.map(k => Math.abs(k) > 0.004), 8).map((k, i) => k && !city[i]);
const sandR = dilate(K.map(k => k > 0.005), 14), sandL = dilate(K.map(k => k < -0.005), 14);

function minDistToTrack(x, z) {
  let best = 1e18;
  for (let i = 0; i < N; i += 2) { const dx = x - P[i].x, dz = z - P[i].z, d = dx * dx + dz * dz; if (d < best) best = d; }
  return Math.sqrt(best);
}
// A strip that follows the track. Offsets and heights can be numbers or functions of the sample index; heights are relative to the road.
function ribbon(o0, y0, o1, y1, vLen, keep) {
  const ev = (o, j) => typeof o === 'function' ? o(j) : o;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= N; i++) {
    const j = i % N, p = P[j], r = R[j], a = ev(o0, j), b = ev(o1, j);
    pos.push(p.x + r.x * a, p.y + ev(y0, j), p.z + r.z * a, p.x + r.x * b, p.y + ev(y1, j), p.z + r.z * b);
    uv.push(0, i * DS / vLen, 1, i * DS / vLen);
    if (i < N && (!keep || keep(j))) { const q = i * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}
{
  const M = o => new THREE.MeshBasicMaterial(Object.assign({ side: THREE.DoubleSide }, o));
  const add = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.frustumCulled = false; W.add(m); return m; };
  const place = (i, off) => { const g = new THREE.Group(); g.position.set(P[i].x + R[i].x * off, Y[i], P[i].z + R[i].z * off); g.rotation.y = Math.atan2(-TAN[i].x, -TAN[i].z); W.add(g); return g; };
  const drawGrass = (g, w, h) => { g.fillStyle = '#4c7434'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 5000; i++) { g.fillStyle = `rgba(${rnd(40,110)|0},${rnd(90,150)|0},${rnd(30,70)|0},.35)`; g.fillRect(Math.random()*w, Math.random()*h, 2, 3); } };
  const grassT = tex(256, 256, drawGrass); grassT.repeat.set(500, 500);
  const gp = new THREE.PlaneGeometry(7000, 7000); gp.rotateX(-Math.PI / 2); gp.translate(350, -0.5, -380);
  add(gp, M({ map: grassT }));
  const water = new THREE.PlaneGeometry(2400, 1100); water.rotateX(-Math.PI / 2); water.translate(400 * SC, 3.2, 462 * SC + 560);
  add(water, M({ color: 0x5f7f96 }));
  for (let k = 0; k < 9; k++) box(W, rnd(3, 5), 1.6, rnd(9, 16), rnd(120, 740) * SC, 4, 462 * SC + rnd(30, 110), M({ color: 0xf0efe8 }));

  const roadT = tex(512, 2048, (g, w, h) => {
    g.fillStyle = '#8d8c92'; g.fillRect(0, 0, w, h);
    // Borrowed from the Real Ride cycling app's asphalt: grain on every pixel, not scattered dots, plus the odd bright stone; and repairs.
    for (let i = 0; i < 70; i++) { const x = Math.random() * w, y = Math.random() * h, r = rnd(40, 170), b = g.createRadialGradient(x, y, 0, x, y, r), v = Math.random() < 0.5 ? 30 : 215;      // broad, soft patches of older and newer surface
      b.addColorStop(0, `rgba(${v},${v},${v + 3},.1)`); b.addColorStop(1, `rgba(${v},${v},${v + 3},0)`); g.fillStyle = b; g.fillRect(x - r, y - r, r * 2, r * 2); }
    for (let i = 0; i < 10; i++) { const x = rnd(50, w - 190), y = Math.random() * h, pw = rnd(40, 140), ph = rnd(60, 260), v = rnd(150, 178);      // repairs: paler rectangles with a tar seal round the edge
      g.fillStyle = `rgba(${v},${v},${v + 4},.3)`; g.fillRect(x, y, pw, ph); g.strokeStyle = 'rgba(22,22,26,.4)'; g.lineWidth = 2; g.strokeRect(x, y, pw, ph); }
    { const img = g.getImageData(0, 0, w, h), d = img.data;
      for (let i = 0; i < d.length; i += 4) { const k = Math.random(), n = (Math.random() - 0.5) * 44 + (k < 0.02 ? 48 : k < 0.035 ? -42 : 0); d[i] += n; d[i + 1] += n; d[i + 2] += n; }
      g.putImageData(img, 0, 0); }
    for (let i = 0; i < 7; i++) { g.strokeStyle = 'rgba(18,18,22,.5)'; g.lineWidth = rnd(1.5, 3); g.beginPath(); let x = rnd(40, w - 40), y = Math.random() * h; g.moveTo(x, y);      // tar snakes over old cracks
      for (let k = 0; k < 9; k++) { x += rnd(-14, 14); y += rnd(18, 46); g.lineTo(x, y); } g.stroke(); }
    for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(${Math.random() < 0.5 ? 30 : 200},${Math.random() < 0.5 ? 30 : 200},${Math.random() < 0.5 ? 34 : 204},.07)`; g.fillRect(Math.random() * w, Math.random() * h, rnd(1, 3), rnd(60, 400)); }
    const gr = g.createLinearGradient(0, 0, w, 0);
    gr.addColorStop(0.2, 'rgba(15,15,18,0)'); gr.addColorStop(0.5, 'rgba(15,15,18,.32)'); gr.addColorStop(0.8, 'rgba(15,15,18,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(20,20,22,${rnd(0.1, 0.25)})`; g.fillRect(rnd(10, w - 90), Math.random() * h, rnd(30, 90), rnd(20, 120)); }
    for (let i = 0; i < 5; i++) { g.fillStyle = 'rgba(25,25,28,.5)'; g.fillRect(0, Math.random() * h, w, 3); }
    g.fillStyle = '#e8e8e2'; g.fillRect(w * 0.025, 0, w * 0.022, h); g.fillRect(w * 0.953, 0, w * 0.022, h);
  });
  roadT.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());      // keeps the grain readable far down the road, where the surface is seen almost edge-on
  const kerbT = tex(8, 64, (g, w, h) => { g.fillStyle = '#c8281e'; g.fillRect(0, 0, w, h / 2); g.fillStyle = '#ecece6'; g.fillRect(0, h / 2, w, h / 2); });
  kerbT.magFilter = THREE.NearestFilter;
  const armco = tex(32, 64, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0);
    ['#7d8286', '#c9cdd0', '#8a8f93', '#d4d8da', '#80858a', '#b9bdc0'].forEach((c, i) => gr.addColorStop(i / 5, c));
    g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(40,40,40,.6)'; g.fillRect(0, 0, w, 3);
  });
  const gs = tex(256, 256, drawGrass); gs.repeat.set(5, 1);
  const mGrass = M({ map: gs }), mSand = M({ color: 0xc6b086 }), mPave = M({ color: 0x8f8f92 }), mKerb = M({ map: kerbT }), bm = M({ map: armco }), mDark = M({ color: 0x2c2c30 });
  // The ground is built from strips that sit side by side and never overlap, so nothing flickers on the hills.
  const KO = j => Math.min(KERB_OUT, WO[j] - 0.2);
  for (const s of [-1, 1]) {
    const wo = j => s * WO[j], ko = j => s * KO(j), sand = s > 0 ? sandR : sandL;
    add(ribbon(wo, j => BH(j, wo(j)), s * 62, 0, 10, j => !city[j]), mGrass);
    add(ribbon(s * 62, 0, s * 115, j => -Y[j], 10, j => !city[j]), mGrass);
    const hk = j => BH(j, ko(j)), hw = j => BH(j, wo(j)), he = j => BH(j, s * ROAD_HALF);
    add(ribbon(ko, hk, wo, hw, 10, j => !city[j] && sand[j]), mSand);
    add(ribbon(ko, hk, wo, hw, 10, j => !city[j] && !sand[j]), mGrass);
    add(ribbon(ko, 0, wo, 0, 10, j => city[j] && !tun[j]), mPave); add(ribbon(ko, 0, wo, 0, 10, j => tun[j]), mDark);
    add(ribbon(s * ROAD_HALF, he, ko, hk, 5, j => kerbMask[j]), mKerb);
    add(ribbon(s * ROAD_HALF, he, ko, hk, 5, j => !kerbMask[j] && !city[j]), mGrass);
    add(ribbon(s * ROAD_HALF, 0, ko, 0, 5, j => city[j] && !tun[j]), mPave); add(ribbon(s * ROAD_HALF, 0, ko, 0, 5, j => tun[j]), mDark);
    add(ribbon(wo, hw, wo, j => hw(j) + 0.95, 4, j => !tun[j]), bm); add(ribbon(wo, 0, wo, 0.95, 4, j => tun[j]), M({ map: armco, color: 0x4a4a4a }));
  }
  add(ribbon(j => -WO[j] - 16, 0, j => -WO[j], 0, 10, j => inR(j, iHar0 - 6, iHar1 + 6)), mPave);    // quay on the water side
  // The grain of the road as tilts, not colour: a tileable height field of small stones, turned into a slope map. Only the wet road uses it.
  const grainT = tex(256, 256, (g, w, h) => { const H = new Float32Array(w * h);
    for (let k = 0; k < 5200; k++) { const cx = rnd(0, w), cy = rnd(0, h), r = rnd(1.1, 3.4), a = rnd(-1, 1) * r; const R2 = Math.ceil(r * 2);
      for (let y = -R2; y <= R2; y++) for (let x = -R2; x <= R2; x++) { const d = (x * x + y * y) / (r * r); if (d < 4) H[(((cy + y) | 0) + h) % h * w + (((cx + x) | 0) + w) % w] += a * Math.exp(-d * 1.4); } }
    const im = g.createImageData(w, h), D = im.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = H[y * w + (x + 1) % w] - H[y * w + (x + w - 1) % w], dy = H[(y + 1) % h * w + x] - H[(y + h - 1) % h * w + x], i = (y * w + x) * 4;
      D[i] = 128 + clamp(dx * 46, -127, 127); D[i + 1] = 128 + clamp(dy * 46, -127, 127); D[i + 2] = 255; D[i + 3] = 255; }
    g.putImageData(im, 0, 0); });
  mRoad = M({ map: roadT });
  mRoad.onBeforeCompile = sh => {      // wet tarmac: darker, mirroring the sky where you look along it, with rings where the drops land
    sh.uniforms.uRain = rainU.uRain; sh.uniforms.uTime = rainU.uTime; sh.uniforms.uSky = rainU.uSky; sh.uniforms.uNrm = { value: grainT }; sh.uniforms.uRefl = reflU.uRefl; sh.uniforms.uRM = reflU.uRM; sh.uniforms.uReflOn = reflU.uReflOn;
    sh.vertexShader = 'varying vec3 vWp;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vWp = (modelMatrix * vec4(transformed, 1.)).xyz;');
    sh.fragmentShader = `uniform float uRain, uTime, uReflOn; uniform vec3 uSky; uniform sampler2D uNrm, uRefl; uniform mat4 uRM; varying vec3 vWp;
      vec2 rip(vec2 p, float t){
        vec2 i = floor(p), f = fract(p) - 0.5;
        float h1 = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453), h2 = fract(h1 * 57.31 + 0.37);
        float life = fract(t * (0.7 + h2 * 0.6) + h1 * 7.);
        vec2 d = f - (vec2(h1, h2) - 0.5) * 0.24; float r = length(d) + 1e-4, R = life * 0.36;
        return d / r * sin((r - R) * 60.) * exp(-pow((r - R) * 14., 2.)) * (1. - life);
      }
      float bigRing(vec2 p, float t){      /* fat rings, a hand-span wide, so they still show at the tape's 600 lines */
        vec2 i = floor(p), f = fract(p) - 0.5;
        float h1 = fract(sin(dot(i, vec2(41.3, 289.1))) * 43758.5453), h2 = fract(h1 * 31.7 + 0.11);
        float life = fract(t * (0.55 + h2 * 0.5) + h1 * 5.); vec2 d = f - (vec2(h1, h2) - 0.5) * 0.3; float r = length(d), R = 0.06 + life * 0.38;
        return exp(-pow((r - R) * 9., 2.)) * (1. - life) * step(0.35, h2);
      }
      float vh(vec2 i){ vec3 p3 = fract(vec3(i.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }      /* no sine: gives the same answer on every graphics card */
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(vh(i), vh(i + vec2(1., 0.)), f.x), mix(vh(i + vec2(0., 1.)), vh(i + vec2(1., 1.)), f.x), f.y); }
    ` + sh.fragmentShader.replace('#include <tonemapping_fragment>', `if (uRain > 0.01) {
        /* Wet tarmac, built the way the cycling game's is: a finely grained surface under a film of water. The grain and the rain rings
           tilt the surface, and what you see is the sky bouncing off those tilts, so the wet look comes from reflection, not from paint.
           Where water stands, the grain is drowned and the surface is a clean mirror. */
        vec3 V = cameraPosition - vWp; float dist = length(V); V /= dist;
        vec2 rp = (rip(vWp.xz * 1.6, uTime) + rip(vWp.xz * 1.1 + 13.7, uTime * 0.9 + 3.)) * smoothstep(38., 5., dist);      /* rings twice the size of before, so they survive the tape filter */
        float stretch = smoothstep(0.56, 0.66, vn(vWp.xz * 0.011 + 3.7));                    /* which parts of the circuit hold more water */
        float pn = vn(vWp.xz * 0.42 + 11.) * 0.7 + vn(vWp.xz * 1.4 + 5.) * 0.3;      /* puddles a metre or two across */
        float pool = smoothstep(0.675, 0.7, pn) * stretch * smoothstep(0.55, 1., uRain);      /* fewer puddles, with crisper edges */
        vec2 g1 = texture2D(uNrm, vWp.xz * 0.62).xy * 2. - 1., g2 = texture2D(uNrm, vWp.zx * 0.17 + 0.37).xy * 2. - 1.;
        float grain = smoothstep(90., 9., dist) * (1. - pool * 0.94);                      /* far away the grain averages out; under standing water it is gone */
        vec3 N = normalize(vec3((g1.x * 0.85 + g2.x * 0.4) * grain + rp.x * 0.55, 1., (g1.y * 0.85 + g2.y * 0.4) * grain + rp.y * 0.55));
        vec3 R = reflect(-V, N);
        float ang = atan(R.z, R.x), treeTop = 0.004 + 0.022 * vn(vec2(ang * 7., 2.3)) + 0.012 * vn(vec2(ang * 31., 9.1));      /* the trees are far off, so in a puddle ahead they are only a thin dark fringe under a big bright sky */
        float soft = mix(0.09, 0.012, pool);                                                /* damp tarmac blurs the mirror; a pool keeps it sharp */
        vec3 skyC = uSky * mix(1.45, 0.9, clamp(R.y * 1.5, 0., 1.));                       /* brightest just above the horizon */
        vec3 env = mix(uSky * vec3(0.58, 0.62, 0.6), skyC, smoothstep(treeTop - soft, treeTop + soft, R.y));      /* in the rain the far treeline is a misty grey band, only a little darker than the sky */
        if (uReflOn > 0.5) {      /* the real mirrored world: sharp in a puddle, smeared on damp tarmac, wobbled by the grain and the rain rings */
          vec4 rc = uRM * vec4(vWp, 1.); vec2 ruv = rc.xy / rc.w * 0.5 + 0.5 + N.xz * mix(0.05, 0.012, pool);      /* a puddle is still water: only the rain rings disturb it */
          vec3 sharp = texture2D(uRefl, ruv).rgb;
          vec3 smear = (texture2D(uRefl, ruv + vec2(0.01, 0.025)).rgb + texture2D(uRefl, ruv - vec2(0.01, 0.025)).rgb + texture2D(uRefl, ruv + vec2(-0.014, 0.05)).rgb + texture2D(uRefl, ruv + vec2(0.014, -0.012)).rgb) * 0.25;
          float inView = step(0., rc.w) * (1. - smoothstep(0.46, 0.5, abs(ruv.x - 0.5))) * (1. - smoothstep(0.46, 0.5, abs(ruv.y - 0.5)));
          env = mix(env, mix(smear, sharp, pool), inView);
        }
        float F = 0.03 + 0.97 * pow(1. - clamp(dot(N, V), 0., 1.), 5.);
        float spec = clamp(F * mix(0.36, 1., pool) + 0.05 * (1. - pool), 0., 1.);      /* damp tarmac gives back a third of the sky; a puddle gives back all of it */      /* a soft sheen even looking straight down: water on tarmac is never fully dark */
        vec3 base = gl_FragColor.rgb * mix(0.5, 0.34, pool) * (1. - 0.3 * smoothstep(0.63, 0.675, pn) * (1. - smoothstep(0.675, 0.7, pn)) * stretch);
        float rim = clamp(length(rp) * 1.2 + (bigRing(vWp.xz * 0.8, uTime) + bigRing(vWp.xz * 0.6 + 7.3, uTime * 0.8 + 2.)) * smoothstep(26., 4., dist), 0., 1.);                                          /* the ring itself catches the sky: a bright circle where each drop landed */
        gl_FragColor.rgb = mix(gl_FragColor.rgb, base * (1. - spec) + env * spec + uSky * rim * 0.45, uRain);
      }
      #include <tonemapping_fragment>`);
  }; add(ribbon(-ROAD_HALF, j => BH(j, -ROAD_HALF), ROAD_HALF, j => BH(j, ROAD_HALF), 40, j => !tun[j]), mRoad);
  add(ribbon(-ROAD_HALF, 0, ROAD_HALF, 0, 40, j => tun[j]), M({ map: roadT, color: 0x505056 }));

  // rubber: dark tyre tracks that follow the racing line and sweep toward the inside of each corner
  const rubT = tex(256, 1024, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    for (let i = 0; i < 150; i++) {
      let x = ((Math.random() < 0.5 ? 0.32 : 0.68) + (Math.random() + Math.random() - 1) * 0.17) * w;
      const y0 = Math.random() * h, len = rnd(250, h), pts = [];
      for (let t = 0; t <= len; t += 40) { x += rnd(-2.5, 2.5); pts.push([x, y0 + t]); }
      g.strokeStyle = `rgba(12,12,15,${rnd(0.06, 0.24)})`; g.lineWidth = rnd(1, 7);
      for (const dy of [0, -h]) { g.beginPath(); pts.forEach((q, k) => k ? g.lineTo(q[0], q[1] + dy) : g.moveTo(q[0], q[1] + dy)); g.stroke(); }
    }
  });
  const lineRaw = P.map((_, i) => { let a = 0; for (let k = -6; k <= 18; k++) a += K[(i + k + N) % N]; return clamp(-a / 25 * 260, -3.4, 3.4); });
  const lineOff = lineRaw.map((_, i) => { let a = 0; for (let k = -6; k <= 6; k++) a += lineRaw[(i + k + N) % N]; return a / 13; });
  add(ribbon(j => lineOff[j] - 2.5, j => BH(j, lineOff[j] - 2.5), j => lineOff[j] + 2.5, j => BH(j, lineOff[j] + 2.5), 60), M({ map: rubT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 }));

  const chk = tex(64, 8, (g, w, h) => { for (let x = 0; x < 32; x++) for (let y = 0; y < 2; y++) { g.fillStyle = (x + y) % 2 ? '#111' : '#eee'; g.fillRect(x * 2, y * 4, 2, 4); } });
  chk.magFilter = THREE.NearestFilter;
  const sl = new THREE.PlaneGeometry(ROAD_HALF * 2, 1.2); sl.rotateX(-Math.PI / 2);
  const slm = add(sl, M({ map: chk, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8 }));
  slm.position.set(P[0].x, Y[0] + 0.02, P[0].z); slm.rotation.y = Math.atan2(-TAN[0].x, -TAN[0].z);

  // tunnel: walls, ceiling with light fittings, and a portal at each end
  const tw = tex(64, 64, (g, w, h) => { g.fillStyle = '#3a3a3e'; g.fillRect(0, 0, w, h); speckle(g, w, h, 500, 30, 80); g.fillStyle = '#5c5b55'; g.fillRect(w * 0.28, 0, w * 0.1, h); { const gl = g.createLinearGradient(w, 0, w * 0.5, 0); gl.addColorStop(0, 'rgba(255,238,196,.5)'); gl.addColorStop(1, 'rgba(255,238,196,0)'); g.fillStyle = gl; g.fillRect(w * 0.5, 0, w * 0.5, h); } g.fillStyle = '#222'; g.fillRect(0, 0, w, 2); });      // the lights wash down the top of the walls
  const tc = tex(64, 64, (g, w, h) => { g.fillStyle = '#222226'; g.fillRect(0, 0, w, h); for (const x of [0.07, 0.86]) { g.fillStyle = 'rgba(255,240,200,.22)'; g.fillRect(w * (x - 0.05), 0, w * 0.17, h); g.fillStyle = '#fff6d0'; g.fillRect(w * x, h * 0.04, w * 0.07, h * 0.4); g.fillRect(w * x, h * 0.54, w * 0.07, h * 0.4); } });      // a row of fittings along each edge, with their glow on the ceiling
  const inT = j => tun[j];
  add(ribbon(-7.5, 0, -7.5, 5.6, 6, inT), M({ map: tw })); add(ribbon(7.5, 0, 7.5, 5.6, 6, inT), M({ map: tw })); add(ribbon(-7.5, 5.6, 7.5, 5.6, 12, inT), M({ map: tc }));
  const conc = new THREE.MeshLambertMaterial({ color: 0x9a9a94 });
  for (const i of [iTun0, iTun1 + 1]) { const g = place(i, 0); box(g, 44, 9, 1.6, 0, 10.1, 0, conc); box(g, 14.5, 5.6, 1.6, -14.75, 2.8, 0, conc); box(g, 14.5, 5.6, 1.6, 14.75, 2.8, 0, conc); }

  // city blocks hard up against the barriers
  // Art deco: one bay of one floor per tile. A tall window between fluted piers, glazing bars, and a chevron panel under each window.
  const bT = tex(128, 128, (g, w, h) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e6e0d2'; g.fillRect(0, 0, 14, h); g.fillRect(w - 14, 0, 14, h);                          // piers running the full height
    g.fillStyle = '#c9c2b2'; for (const x of [3, 7, 11, w - 12, w - 8, w - 4]) g.fillRect(x, 0, 1.5, h);     // fluting
    g.fillStyle = '#33484f'; g.fillRect(36, 14, 56, 84);                                                     // window
    g.fillStyle = '#5d7880'; g.fillRect(36, 14, 56, 26);                                                     // sky in the top panes
    g.fillStyle = '#e9e4d6'; for (const y of [40, 60, 80]) g.fillRect(36, y, 56, 2); g.fillRect(54, 14, 2, 84); g.fillRect(72, 14, 2, 84);      // glazing bars
    g.strokeStyle = '#efeadc'; g.lineWidth = 3; g.strokeRect(34.5, 12.5, 59, 87);
    g.strokeStyle = '#bdb5a2'; g.lineWidth = 2; for (const o of [0, 7, 14]) { g.beginPath(); g.moveTo(30, 104 + o); g.lineTo(64, 112 + o); g.lineTo(98, 104 + o); g.stroke(); }      // chevrons
    g.fillStyle = '#d8d1c0'; g.fillRect(14, 0, w - 28, 5);                                                   // floor band
  });
  bT.repeat.set(4, 5);
  const bs = [];
  for (let i = 0; i < N; i += 5) { if (!city[i]) continue; for (const s of [-1, 1]) {
    if (s < 0 && inR(i, iHar0 - 8, iHar1 + 8)) continue;
    const d = rnd(11, 16), off = WO[i] + 1.5 + d / 2, x = P[i].x + R[i].x * s * off, z = P[i].z + R[i].z * s * off;
    if (minDistToTrack(x, z) > off - 1.5) bs.push({ x, z, i, d, s, h: rnd(12, 26) });
  } }
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), col = new THREE.Color(), up = new V3(0, 1, 0);
  const pastel = [0xf2d4c2, 0xcfe6dc, 0xf3e7c4, 0xf0c9c9, 0xc9dfe8, 0xf5efe2, 0xe9d28c];      // peach, mint, cream, pink, aqua, ivory, yellow
  const parts = [], trim = [];      // tinted, windowed masses; and plain white bands, fins and spires
  bs.forEach((b, n) => {
    const c = pastel[(n * 3 + (n >> 2)) % pastel.length], top = Y[b.i] + b.h, rx = R[b.i].x * b.s, rz = R[b.i].z * b.s, L = 15.5;
    const at = (back, y) => new V3(b.x + rx * back, y, b.z + rz * back);      // back: metres further from the road than the block's centre
    parts.push({ p: at(0, Y[b.i] + b.h / 2 - 4), sc: new V3(b.d, b.h + 8, L), c, i: b.i });
    trim.push({ p: at(0, top + 0.25), sc: new V3(b.d + 0.9, 0.5, L + 0.5), i: b.i });                         // cornice
    trim.push({ p: at(-0.2, Y[b.i] + 4.6), sc: new V3(b.d + 0.5, 0.35, L + 0.3), i: b.i });                   // canopy line over the ground floor
    let y = top, w = b.d, len = L, back = 0;
    const steps = n % 5 === 0 ? 0 : n % 3 === 0 ? 3 : n % 2 ? 2 : 1;                                          // the ziggurat top: each tier smaller and set back
    for (let k = 0; k < steps; k++) { const hh = rnd(3.5, 7); back += w * 0.11; w *= 0.72; len *= 0.7;
      parts.push({ p: at(back, y + hh / 2), sc: new V3(w, hh, len), c, i: b.i }); y += hh;
      trim.push({ p: at(back, y + 0.18), sc: new V3(w + 0.6, 0.36, len + 0.4), i: b.i }); }
    if (n % 3 !== 1) { const fh = (y - Y[b.i]) + rnd(2, 6);                                                   // a white fin up the street front, ending in a spire
      trim.push({ p: at(-b.d / 2 - 0.25, Y[b.i] + fh / 2), sc: new V3(0.9, fh, 1.8), i: b.i });
      trim.push({ p: at(-b.d / 2 - 0.25, Y[b.i] + fh + 0.6), sc: new V3(0.6, 1.2, 1.1), i: b.i });
      trim.push({ p: at(-b.d / 2 - 0.25, Y[b.i] + fh + 3.2), sc: new V3(0.22, 4, 0.22), i: b.i }); }
    else for (const o of [-5, 0, 5]) trim.push({ p: new V3(b.x - rx * (b.d / 2 + 0.15) - TAN[b.i].x * o, Y[b.i] + b.h / 2, b.z - rz * (b.d / 2 + 0.15) - TAN[b.i].z * o), sc: new V3(0.5, b.h, 0.7), i: b.i });      // or three slim piers
  });
  const blocks = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ map: bT }), parts.length);
  const trims = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({ color: 0xfaf5e8 }), trim.length);
  const rot = i => q.setFromAxisAngle(up, Math.atan2(-TAN[i].x, -TAN[i].z));
  parts.forEach((p, n) => { m4.compose(p.p, rot(p.i), p.sc); blocks.setMatrixAt(n, m4); blocks.setColorAt(n, col.setHex(p.c)); });
  trim.forEach((p, n) => { m4.compose(p.p, rot(p.i), p.sc); trims.setMatrixAt(n, m4); });
  trims.frustumCulled = false; W.add(trims);
  blocks.frustumCulled = false; W.add(blocks);

  // forest: a dark wall behind, rounded trees in front
  const clearL = [], clearR = [];
  for (let i = 0; i < N; i++) {
    clearR.push(!city[i] && minDistToTrack(P[i].x + R[i].x * 62, P[i].z + R[i].z * 62) > 58);
    clearL.push(!city[i] && minDistToTrack(P[i].x - R[i].x * 62, P[i].z - R[i].z * 62) > 58);
  }
  const fm = M({ color: 0x1d3a1e });
  add(ribbon(62, 0, 62, 15, 10, j => clearR[j] && clearR[(j + 1) % N]), fm); add(ribbon(-62, 0, -62, 15, 10, j => clearL[j] && clearL[(j + 1) % N]), fm);
  const tg = new THREE.SphereGeometry(1, 9, 7);
  const tp = tg.attributes.position;
  for (let i = 0; i < tp.count; i++) { const k = 1 + Math.sin(tp.getX(i) * 7.1 + tp.getY(i) * 5.3 + tp.getZ(i) * 9.7) * 0.18; tp.setXYZ(i, tp.getX(i) * k, tp.getY(i) * k, tp.getZ(i) * k); }
  tg.computeVertexNormals();
  { const cols = []; for (let i = 0; i < tp.count; i++) { const v = (0.62 + 0.3 * (tp.getY(i) * 0.5 + 0.5)) * rnd(0.72, 1.3); cols.push(v, v * rnd(0.95, 1.1), v * 0.9); }
    tg.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); }       // dappled light: brighter tops, random patches
  const spots = [];
  for (let i = 0; i < N; i += 2) for (const s of [-1, 1]) for (let row = 0; row < 3; row++) {
    if (city[i] || WO[i] < WALL - 0.5) continue;
    const off = 23 + row * 12 + rnd(0, 8), along = rnd(-3, 3);
    const x = P[i].x + R[i].x * s * off + TAN[i].x * along, z = P[i].z + R[i].z * s * off + TAN[i].z * along;
    if (i > 12 && i < 112 && off < 52) continue;      // room for the pit straight buildings
    if (minDistToTrack(x, z) > off - 4) spots.push([x, z, row, Y[i]]);
  }
  const trees = new THREE.InstancedMesh(tg, new THREE.MeshLambertMaterial({ color: 0xffffff, vertexColors: true }), spots.length);
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22, 0.3, 1, 5), new THREE.MeshBasicMaterial({ color: 0x2b241c }), spots.length);
  const bushes = new THREE.InstancedMesh(tg, new THREE.MeshLambertMaterial({ color: 0xffffff, vertexColors: true }), spots.length);
  spots.forEach((s, i) => {
    const sx = rnd(3.5, 6.5), sy = rnd(6, 10) + s[2] * 2.5, lift = rnd(2, 6);
    q.setFromAxisAngle(up, Math.random() * 6.28);
    m4.compose(new V3(s[0], s[3] + lift + sy * 0.8, s[1]), q, new V3(sx, sy, sx));
    trees.setMatrixAt(i, m4);
    m4.compose(new V3(s[0], s[3] + lift * 0.5 + 1, s[1]), q, new V3(1, lift + 3, 1)); trunks.setMatrixAt(i, m4);
    m4.compose(new V3(s[0] + rnd(-4, 4), s[3] + 0.6, s[1] + rnd(-4, 4)), q, new V3(rnd(1.5, 3), rnd(1, 2.2), rnd(1.5, 3))); bushes.setMatrixAt(i, m4);
    bushes.setColorAt(i, col.setHSL(rnd(0.2, 0.28), rnd(0.35, 0.5), rnd(0.2, 0.3)));
    if (Math.random() < 0.1) col.setHSL(rnd(0.74, 0.82), 0.22, rnd(0.2, 0.3)); else col.setHSL(rnd(0.22, 0.34), rnd(0.3, 0.5), rnd(0.11, 0.24));
    trees.setColorAt(i, col);
  });
  trees.frustumCulled = trunks.frustumCulled = bushes.frustumCulled = false; W.add(trees, trunks, bushes);

  // trackside: plain hoardings on the straights and two footbridges, for speed cues
  const hc = [0xe8e4d6, 0xd9b21f, 0xb8271c, 0x1c4f9c, 0x1d6f3a].map(c => new THREE.MeshBasicMaterial({ color: c }));
  for (let i = 10; i < N; i += 11) {
    if (city[i] || WO[i] < WALL - 0.5 || Math.abs(K[i]) > 0.003 || Math.random() < 0.4) continue;
    const sd = Math.random() < 0.5 ? 1 : -1, off = WALL + 1.2;
    const b = box(W, 0.2, 1.3, 8, P[i].x + R[i].x * sd * off, Y[i] + 1.55, P[i].z + R[i].z * sd * off, hc[(Math.random() * 5) | 0]);
    b.rotation.y = Math.atan2(-TAN[i].x, -TAN[i].z);
  }
  // pit straight: pit building, grandstand, marquee tents
  const winT = tex(64, 32, (g, w, h) => { g.fillStyle = '#b9b6ad'; g.fillRect(0, 0, w, h); g.fillStyle = '#2c3550'; g.fillRect(0, 6, w, 7); g.fillRect(0, 19, w, 7);
    g.fillStyle = '#b9b6ad'; for (let x = 0; x < w; x += 8) g.fillRect(x, 0, 1, h); });
  winT.repeat.set(10, 1);
  const crowdT = tex(128, 64, (g, w, h) => { g.fillStyle = '#6d6a66'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { g.fillStyle = ['#c33', '#ddd', '#35a', '#dc4', '#333', '#e9b'][(Math.random() * 6) | 0]; g.fillRect(Math.random() * w, h * 0.1 + Math.random() * h * 0.8, 2, 2); } });
  crowdT.repeat.set(5, 1);
  { const g = place(44, -36); box(g, 12, 12, 110, 0, 3, 0, M({ map: winT })); box(g, 15, 0.7, 114, 1, 9.4, 0, hc[2]); }
  { const g = place(46, 36); const st = box(g, 16, 11, 100, 0, 3, 0, M({ map: crowdT })); st.rotation.z = -0.5; box(g, 16, 0.5, 104, 2, 13, 0, hc[0]);
    for (let z = -50; z <= 50; z += 25) box(g, 0.5, 15, 0.5, 8, 5.5, z, hc[0]); }
  for (let k = 0; k < 6; k++) { const g = place(78 + k * 5, -34 - (k % 2) * 9); box(g, 8, 5, 8, 0, 0.5, 0, hc[0]);
    const rf = new THREE.Mesh(new THREE.ConeGeometry(6.4, 3, 4), hc[0]); rf.position.y = 4.5; rf.rotation.y = Math.PI / 4; g.add(rf); }
  for (const [i, m] of [[112, hc[1]], [nearIdx(-55, -880), hc[3]]]) {
    const g = place(i, 0);
    box(g, 36, 1.0, 3.2, 0, 6.6, 0, conc); box(g, 30, 1.5, 0.15, 0, 7.2, 1.7, m); box(g, 30, 1.5, 0.15, 0, 7.2, -1.7, m);
    box(g, 1.2, 10, 2.6, -17, 1.2, 0, conc); box(g, 1.2, 10, 2.6, 17, 1.2, 0, conc);
  }
}

// speed profile for AI and autopilot
// grip-limited corner speed: v^2*k = 0.8*mu*(g + downforce/m), scaled by how hard the hill is pressing the car into the road
// A speed for every point on the lap: how fast a corner can be taken, then how early you must brake for it and how soon you can
// be back on the power. `grip` is the share of the tyres' cornering grip it uses; `brake` and `drive` are m/s^2.
function speedProfile(grip, brake, drive, bank = 2.4) {
  const pr = K.map((k, i) => { let v = 88;
    for (let it = 0; it < 3; it++) { const f = clamp(1 + v * v * KV[i] / 9.81, 0.5, 1.6), bk = 1 + bank * BANK[i], d = Math.abs(k) - grip * 0.0061 * f * bk; v = d > 1e-5 ? Math.min(88, Math.sqrt(grip * 20.6 * f * bk / d)) : 88; }
    return v; });
  for (let pass = 0; pass < 2; pass++) {
    for (let i = N - 1; i >= 0; i--) pr[i] = Math.min(pr[i], Math.sqrt(pr[(i + 1) % N] ** 2 + 2 * brake * DS));
    for (let i = 0; i < N; i++) pr[i] = Math.min(pr[i], Math.sqrt(pr[(i + N - 1) % N] ** 2 + 2 * drive * DS));
  }
  return pr;
}
const PROF = speedProfile(0.8, 15, 9);       // the autopilot's: a fifth of the grip in hand, early on the brakes
const PROFX = speedProfile(0.9, 20, 11, 1.4);   // close to the car's real limit: most of the grip, later on the brakes, and less faith in the banking, where the first try ran wide. Simple mode works up towards this
function locate(x, z, hint, span) {
  let best = 1e18, bi = hint;
  for (let k = -span; k <= span; k++) {
    const j = ((hint + k) % N + N) % N, dx = x - P[j].x, dz = z - P[j].z, d = dx * dx + dz * dz;
    if (d < best) { best = d; bi = j; }
  }
  return { i: bi, lat: (x - P[bi].x) * R[bi].x + (z - P[bi].z) * R[bi].z };
}

// ---------- shared part builders ----------
const UP = new V3(0, 1, 0), _d = new V3();
const lam = (c, o) => new THREE.MeshLambertMaterial(Object.assign({ color: c }, o || {}));
function box(parent, w, h, d, x, y, z, m) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); parent.add(b); return b; }
function setRod(mesh, a, b) {
  _d.subVectors(b, a); const len = _d.length();
  mesh.position.copy(a).addScaledVector(_d, 0.5); mesh.scale.set(1, len, 1);
  mesh.quaternion.setFromUnitVectors(UP, _d.normalize());
}
function rod(parent, a, b, r, m) { const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 8), m); setRod(mesh, a, b); parent.add(mesh); return mesh; }
function wheelGeo(r, w) { const g = new THREE.CylinderGeometry(r, r, w, 24); g.rotateZ(Math.PI / 2); return g; }

// ---------- other cars ----------
function makeCar(c1, c2) {
  const g = new THREE.Group(), m1 = lam(c1), m2 = lam(c2), blk = lam(0x151515);
  box(g, 0.55, 0.32, 3.6, 0, 0.33, -0.2, m1); box(g, 1.35, 0.3, 1.5, 0, 0.3, 0.5, m1);
  box(g, 0.32, 0.4, 0.9, 0, 0.72, 0.75, m1);
  box(g, 0.98, 0.05, 0.32, 0, 0.9, 1.75, m2); box(g, 0.03, 0.45, 0.42, -0.49, 0.72, 1.75, m2); box(g, 0.03, 0.45, 0.42, 0.49, 0.72, 1.75, m2);
  box(g, 1.45, 0.04, 0.32, 0, 0.12, -2.05, m2);
  const hm = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), lam(c2)); hm.position.set(0, 0.8, 0); g.add(hm);
  for (const [x, z, w] of [[-0.78, -1.5, 0.3], [0.78, -1.5, 0.3], [-0.78, 1.25, 0.42], [0.78, 1.25, 0.42]]) {
    const wh = new THREE.Mesh(wheelGeo(0.33, w), blk); wh.position.set(x, 0.33, z); g.add(wh);
  }
  W.add(g); return g;
}
const rivals = [
  { mesh: makeCar(0x1b2a6b, 0xc8281e), s: 40, pace: 0.82 },
  { mesh: makeCar(0xd9d4c2, 0x1d6f7a), s: 85, pace: 0.86 },
];

// ---------- cockpit ----------
const body = lam(0x08090d), carbon = lam(0x101012), metal = lam(0x8a8d92), suit = lam(0x16161b);
const cock = new THREE.Group(); C.add(cock);
// tub: side walls, floor, scuttle
box(cock, 0.06, 0.44, 1.5, -0.31, 0.36, -0.1, body); box(cock, 0.06, 0.44, 1.5, 0.31, 0.36, -0.1, body);
box(cock, 0.62, 0.05, 1.5, 0, 0.14, -0.1, carbon);
box(cock, 0.68, 0.46, 0.12, 0, 0.37, -0.86, body);
box(cock, 0.5, 0.05, 0.3, 0, 0.6, -0.78, carbon);             // dash hood
box(cock, 0.34, 0.26, 0.08, 0, 0.7, 0.22, body);              // headrest
{ // nose, tapered
  const g = new THREE.CylinderGeometry(0.1, 0.36, 1.5, 16); g.rotateX(-Math.PI / 2);
  const n = new THREE.Mesh(g, body); n.scale.set(1, 0.62, 1); n.position.set(0, 0.35, -1.6); n.rotation.x = -0.07; cock.add(n);
  const rimT = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.035, 8, 20, Math.PI), body);   // cockpit lip
  rimT.rotation.x = -Math.PI / 2; rimT.scale.set(1, 0.9, 1); rimT.position.set(0, 0.585, -0.5); cock.add(rimT);
}
for (const sd of [-1, 1]) {      // sidepods: rounded and glossy so they read as bodywork, not as a black slab
  const g = new THREE.CylinderGeometry(0.25, 0.2, 1.3, 18); g.rotateX(Math.PI / 2);
  const pod = new THREE.Mesh(g, new THREE.MeshPhongMaterial({ color: 0x11131b, shininess: 55, specular: 0x555555 })); pod.scale.set(1, 0.5, 1); pod.position.set(sd * 0.58, 0.24, 0.62); cock.add(pod);
  box(cock, 0.012, 0.012, 1.2, sd * 0.74, 0.3, 0.62, lam(0xb4b2a6));
}   // start behind the front wheels, so the tyre's contact with the road stays in view   // sidepods
box(cock, 1.5, 0.03, 0.34, 0, 0.1, -2.4, body);
box(cock, 0.02, 0.2, 0.38, -0.75, 0.17, -2.4, body); box(cock, 0.02, 0.2, 0.38, 0.75, 0.17, -2.4, body);

const tyreSide = tex(256, 64, (g, w, h) => { g.fillStyle = '#19191b'; g.fillRect(0, 0, w, h); speckle(g, w, h, 900, 20, 70);
  g.fillStyle = 'rgba(70,70,72,.5)'; g.fillRect(30, 0, 26, h); g.fillRect(150, 10, 12, 40); });
const tyreCap = tex(128, 128, (g, w) => {
  g.fillStyle = '#19191b'; g.fillRect(0, 0, w, w);
  g.strokeStyle = 'rgba(214,190,90,.75)'; g.lineWidth = 5;
  for (let a = 0; a < 3; a++) { g.beginPath(); g.arc(w / 2, w / 2, w * 0.4, a * 2.1, a * 2.1 + 0.9); g.stroke(); }
  g.fillStyle = '#2a2a2c'; g.beginPath(); g.arc(w / 2, w / 2, w * 0.29, 0, 7); g.fill();
  g.fillStyle = '#9a8f6a'; g.beginPath(); g.arc(w / 2, w / 2, w * 0.25, 0, 7); g.fill();
  g.fillStyle = '#222'; for (let a = 0; a < 5; a++) { g.beginPath(); g.arc(w / 2 + Math.cos(a * 1.257) * w * 0.14, w / 2 + Math.sin(a * 1.257) * w * 0.14, w * 0.05, 0, 7); g.fill(); }
});
const tyreMats = [new THREE.MeshLambertMaterial({ map: tyreSide }), new THREE.MeshLambertMaterial({ map: tyreCap }), new THREE.MeshLambertMaterial({ map: tyreCap })];
// Front tyres: a rounded profile spun into shape. Two maps: one with marks you can see turning, one where the marks have blurred into rings.
function tyreMap(blur) { return tex(512, 128, (g, w, h) => {
  g.fillStyle = '#19191b'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#232325'; g.fillRect(0, h * 0.3, w, h * 0.4);                                   // tread band, slightly polished
  for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(${i % 2 ? 60 : 8},${i % 2 ? 60 : 8},${i % 2 ? 62 : 10},.35)`; g.fillRect(0, h * 0.3 + Math.random() * h * 0.4, w, 1); }
  if (blur) { g.fillStyle = 'rgba(214,196,120,.2)'; g.fillRect(0, h * 0.1, w, 5); g.fillRect(0, h * 0.86, w, 5); g.fillStyle = 'rgba(90,90,92,.25)'; g.fillRect(0, h * 0.42, w, 10); }
  else {
    speckle(g, w, h, 1400, 20, 90);
    for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(95,95,98,${rnd(0.25, 0.5)})`; g.fillRect(Math.random() * w, h * 0.3 + Math.random() * h * 0.3, rnd(14, 44), rnd(4, 14)); }   // scuffs
    g.fillStyle = 'rgba(222,204,120,.85)';
    for (let i = 0; i < 12; i++) { if (i % 4 === 3) continue; g.fillRect(i * w / 12 + 6, h * 0.1, w / 12 - 16, 5); g.fillRect(i * w / 12 + 6, h * 0.86, w / 12 - 16, 5); }                  // sidewall marks
  } }); }
const tyreT = tyreMap(false), tyreBlurT = tyreMap(true);
const tyreMat = new THREE.MeshPhongMaterial({ map: tyreT, shininess: 22, specular: 0x333333 });
const tyreGeo = (() => { const pr = [[0.205, -0.172], [0.25, -0.188], [0.3, -0.184], [0.33, -0.155], [0.343, -0.095], [0.346, 0], [0.343, 0.095], [0.33, 0.155], [0.3, 0.184], [0.25, 0.188], [0.205, 0.172]];
  const g = new THREE.LatheGeometry(pr.map(q => new THREE.Vector2(q[0], q[1])), 40); g.rotateZ(Math.PI / 2); return g; })();
const fw = [];
for (const s of [-1, 1]) {
  const hub = new THREE.Group(); hub.position.set(s * 0.8, 0.335, -1.3); cock.add(hub);
  const spin = new THREE.Mesh(tyreGeo, tyreMat); hub.add(spin);
  fw.push({ hub, spin, y0: 0.335 });
  const o = (x, y, z) => new V3(s * x, y, z);
  rod(cock, o(0.22, 0.5, -1.1), o(0.62, 0.5, -1.38), 0.012, carbon); rod(cock, o(0.16, 0.47, -1.75), o(0.62, 0.5, -1.38), 0.012, carbon);
  rod(cock, o(0.22, 0.22, -1.05), o(0.62, 0.2, -1.38), 0.014, carbon); rod(cock, o(0.15, 0.22, -1.8), o(0.62, 0.2, -1.38), 0.014, carbon);
  rod(cock, o(0.6, 0.22, -1.38), o(0.18, 0.53, -1.36), 0.011, metal);
  rod(cock, o(0.22, 0.4, -1.2), o(0.62, 0.4, -1.26), 0.008, metal);
  // mirror
  rod(cock, o(0.33, 0.56, -0.6), o(0.46, 0.66, -0.62), 0.008, carbon);
  box(cock, 0.17, 0.095, 0.06, s * 0.47, 0.68, -0.62, carbon);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.07), new THREE.MeshBasicMaterial({ map: tex(32, 16, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#dfe3dc'); gr.addColorStop(0.45, '#6f7f6a'); gr.addColorStop(0.5, '#2a2c33'); gr.addColorStop(1, '#3a3530');
    g.fillStyle = gr; g.fillRect(0, 0, w, h); }) }));
  glass.position.set(s * 0.47, 0.68, -0.588); cock.add(glass);
}
// steering wheel
const sw = new THREE.Group(); sw.position.set(0, 0.57, -0.52); sw.rotation.x = -0.3; cock.add(sw);
const rim = new THREE.Group(); sw.add(rim);
const RIM_R = 0.135;
rim.add(new THREE.Mesh(new THREE.TorusGeometry(RIM_R, 0.017, 8, 28), lam(0xb9b4a0)));
box(rim, 0.26, 0.03, 0.008, 0, 0, 0, metal); box(rim, 0.03, 0.13, 0.008, 0, -0.065, 0, metal);
{ const h = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 12), carbon); h.rotation.x = Math.PI / 2; rim.add(h); }
rod(sw, new V3(0, 0, 0), new V3(0, 0, -0.3), 0.015, metal);
// a small red lamp in the hub that glows with the brake: the only feedback a clenched fist or a touch on the phone gets
const brakeLamp = new THREE.Mesh(new THREE.CircleGeometry(0.013, 16), new THREE.MeshBasicMaterial({ color: 0x1c0605 })); brakeLamp.position.z = 0.0115; rim.add(brakeLamp);
const brakeHalo = new THREE.Mesh(new THREE.CircleGeometry(0.034, 20), new THREE.MeshBasicMaterial({ color: 0xff2a10, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); brakeHalo.position.z = 0.012; rim.add(brakeHalo);
// old school: a chrome bezel round a ruby lens, with a bulb behind it that warms up and dies away like a filament, not a switch
{ const bz = new THREE.Mesh(new THREE.RingGeometry(0.013, 0.0175, 20), new THREE.MeshBasicMaterial({ color: 0xa9a59a })); bz.position.z = 0.0117; rim.add(bz); }
const brakeHot = new THREE.Mesh(new THREE.CircleGeometry(0.006, 12), new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); brakeHot.position.set(-0.002, 0.002, 0.0121); rim.add(brakeHot);
let lampV = 0;
// driver
box(cock, 0.4, 0.34, 0.2, 0, 0.48, 0.06, suit); box(cock, 0.48, 0.1, 0.2, 0, 0.65, 0.06, suit);
const head = new THREE.Group(); head.position.set(0, 0.81, 0); cock.add(head);
{
  const ht = tex(256, 128, (g, w, h) => {
    g.fillStyle = '#b9b5a9'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c23f1c'; g.fillRect(0, 34, w, 16);
    g.fillStyle = '#1d6f7a'; g.fillRect(0, 54, w, 9);
    g.fillStyle = '#d5451f'; g.fillRect(0, 86, w, 6);
    g.fillStyle = '#0d0d10'; g.fillRect(w * 0.6, 50, w * 0.3, 24);
  });
  const hm = new THREE.Mesh(new THREE.SphereGeometry(0.15, 28, 18), new THREE.MeshPhongMaterial({ map: ht, shininess: 90, specular: 0x333333 }));
  hm.scale.set(1, 1.05, 1.12); head.add(hm);
}
const glove = lam(0x8d8d88);
const arms = [-1, 1].map(s => ({
  s, shoulder: new V3(s * 0.21, 0.63, 0.02),
  upper: rod(cock, new V3(), new V3(0, 1, 0), 0.047, suit), fore: rod(cock, new V3(), new V3(0, 1, 0), 0.04, suit),
  hand: (() => { const h = new THREE.Mesh(new THREE.SphereGeometry(0.047, 10, 8), glove); h.scale.set(1, 1.25, 1); cock.add(h); return h; })(),
  H: new V3(), E: new V3(), pole: new V3(s * 0.7, -1, 0.15).normalize(),
}));
function solveArms() {
  rim.updateWorldMatrix(true, false);
  for (const a of arms) {
    a.H.set(a.s * RIM_R, 0.01, 0.025); rim.localToWorld(a.H);
    const A = 0.3, B = 0.29;
    _d.subVectors(a.H, a.shoulder); const len = _d.length(), L = Math.min(len, A + B - 0.002); _d.multiplyScalar(1 / len);
    const x = (A * A - B * B + L * L) / (2 * L), h = Math.sqrt(Math.max(0, A * A - x * x));
    const perp = a.pole.clone().addScaledVector(_d, -a.pole.dot(_d)).normalize();
    a.E.copy(a.shoulder).addScaledVector(_d, x).addScaledVector(perp, h);
    setRod(a.upper, a.shoulder, a.E); setRod(a.fore, a.E, a.H); a.hand.position.copy(a.H);
  }
}


// The driver's helmet reflected in each mirror. It bobs and tilts with the real head.
const reflT = tex(32, 32, (g, w, h) => { g.fillStyle = '#b9b5a9'; g.fillRect(0, 0, w, h); g.fillStyle = '#c23f1c'; g.fillRect(0, 8, w, 6); g.fillStyle = '#1d6f7a'; g.fillRect(0, 16, w, 3); g.fillStyle = '#0d0d10'; g.fillRect(9, 19, 14, 7); });
const refl = [-1, 1].map(s => { const m = new THREE.Mesh(new THREE.CircleGeometry(0.026, 18), new THREE.MeshBasicMaterial({ map: reflT })); m.scale.set(1.25, 0.95, 1);
  m.userData = { x: s * 0.47 - s * 0.028, y: 0.674, s }; m.position.set(m.userData.x, m.userData.y, -0.5875); cock.add(m); return m; });

// ---------- cockpit detail pass ----------
{
  const pale = lam(0xb4b2a6), gold = new THREE.MeshBasicMaterial({ color: 0xb89a3c }), belt = lam(0x14203a), red = lam(0xa8261c);
  // wheels: rim lip, rounded shoulders, upright and brake duct that steer with the wheel
  fw.forEach((w, i) => { const s = i ? 1 : -1;
    const bright = new THREE.MeshPhongMaterial({ color: 0xd6d3c6, shininess: 60, specular: 0x888888 }), dark = lam(0x17171a);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.207, 0.017, 8, 36), bright); lip.rotation.y = Math.PI / 2; lip.position.x = -s * 0.172; w.spin.add(lip);      // rim edge
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.33, 28, 1, true), new THREE.MeshLambertMaterial({ color: 0x3a3a3e, side: THREE.DoubleSide })); barrel.rotation.z = Math.PI / 2; w.spin.add(barrel);
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 24), new THREE.MeshPhongMaterial({ color: 0x77736a, shininess: 40 })); disc.rotation.z = Math.PI / 2; disc.position.x = -s * 0.1; w.spin.add(disc);
    for (let k = 0; k < 5; k++) { const n = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.03, 0.03), dark); const a = k * 1.2566; n.position.set(-s * 0.112, Math.cos(a) * 0.06, Math.sin(a) * 0.06); w.spin.add(n); }   // wheel studs, so the turning reads
    box(w.hub, 0.05, 0.07, 0.13, -s * 0.105, 0.11, 0.05, lam(0x8a2a1e));                                // brake caliper
    box(w.hub, 0.1, 0.34, 0.2, -s * 0.2, 0, 0, carbon);
    const duct = box(w.hub, 0.12, 0.12, 0.26, -s * 0.27, 0.02, -0.16, carbon); duct.rotation.y = s * 0.3;
    const o = (x, y, z) => new V3(s * x, y, z);
    rod(cock, o(0.6, 0.5, -1.3), o(0.2, 0.36, -1.02), 0.007, metal);              // damper link
    rod(cock, o(0.58, 0.3, -1.3), o(0.24, 0.3, -0.98), 0.004, pale);              // brake line
    rod(cock, o(0.22, 0.52, -1.08), o(0.22, 0.5, -1.7), 0.006, carbon);
  });
  // tub top: pale cockpit edge, small marks, aerial
  const edge = new THREE.Mesh(new THREE.TorusGeometry(0.335, 0.012, 6, 24, Math.PI), pale); edge.rotation.x = -Math.PI / 2; edge.scale.set(1, 0.9, 1); edge.position.set(0, 0.615, -0.5); cock.add(edge);
  for (const s of [-1, 1]) { box(cock, 0.012, 0.012, 1.0, s * 0.34, 0.585, 0.0, pale); box(cock, 0.05, 0.004, 0.02, s * 0.2, 0.572, -0.95, gold); box(cock, 0.03, 0.004, 0.012, s * 0.2, 0.572, -0.98, gold); }
  box(cock, 0.09, 0.004, 0.03, 0, 0.56, -1.05, gold);
  rod(cock, new V3(0.05, 0.52, -1.25), new V3(0.05, 0.78, -1.22), 0.003, metal);
  // dash: three dials, a row of switches, warning lamp
  const dashT = tex(128, 48, (g, w, h) => { g.fillStyle = '#0d0d0f'; g.fillRect(0, 0, w, h);
    for (const [x, r] of [[30, 13], [64, 17], [98, 13]]) { g.fillStyle = '#d8d6c8'; g.beginPath(); g.arc(x, 22, r, 0, 7); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(x, 22, r - 2, 0, 7); g.fill();
      g.strokeStyle = '#e24a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 22); g.lineTo(x + r * 0.7, 22 - r * 0.6); g.stroke(); }
    g.fillStyle = '#c33'; g.fillRect(8, 40, 5, 5); g.fillStyle = '#bbb'; for (let x = 24; x < 110; x += 12) g.fillRect(x, 41, 4, 4); });
  const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.15), new THREE.MeshBasicMaterial({ map: dashT })); dash.position.set(0, 0.5, -0.79); dash.rotation.x = -0.25; cock.add(dash);
  // driver: belts over the shoulders, cuffs, thumbs
  for (const s of [-1, 1]) { const b = box(cock, 0.055, 0.02, 0.24, s * 0.1, 0.705, 0.06, belt); b.rotation.x = 0.1; }
  box(cock, 0.07, 0.05, 0.03, 0, 0.44, -0.05, metal);
  arms.forEach(a => { const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.05, 8), red); a.fore.add(cuff); cuff.position.y = 0.38;
    const th = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 5), glove); th.position.set(-a.s * 0.03, 0.03, 0.02); a.hand.add(th); });
  const gt = tex(32, 32, (g, w, h) => { g.fillStyle = '#8d8d88'; g.fillRect(0, 0, w, h); speckle(g, w, h, 160, 40, 220); });
  glove.map = gt; glove.needsUpdate = true;
}

// ---------- cameras ----------
const carObj = new THREE.Object3D(); carObj.rotation.order = 'YXZ'; W.add(carObj);
const camW = new THREE.PerspectiveCamera(CAM.fov, 1, 0.05, 2500); camW.rotation.order = 'YXZ'; carObj.add(camW);
const camC = new THREE.PerspectiveCamera(CAM.fov, 1, 0.05, 20); camC.rotation.order = 'YXZ'; C.add(camC);
// ---------- nose camera: looks back at the driver. It is the backdrop for the player's own camera picture, so they sit in the real car
// on the real track. The back half of the car only exists for this view.
const rearG = new THREE.Group(); rearG.visible = false; cock.add(rearG);
{
  const tyreM = lam(0x1b1b1d), redM = lam(0xa8261c);
  const cover = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), body); cover.scale.set(0.33, 0.34, 1.15); cover.position.set(0, 0.42, 1.0); rearG.add(cover);
  const air = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), body); air.scale.set(0.17, 0.2, 0.55); air.position.set(0, 0.98, 0.72); rearG.add(air);      // airbox over the driver's head
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.105, 16), new THREE.MeshBasicMaterial({ color: 0x050506 })); hole.scale.set(1, 0.8, 1); hole.rotation.y = Math.PI; hole.position.set(0, 1.0, 0.3); rearG.add(hole);
  box(rearG, 0.2, 0.34, 0.3, 0, 0.84, 0.42, body);                                             // roll hoop
  box(rearG, 1.0, 0.04, 0.32, 0, 1.0, 2.05, body); box(rearG, 1.0, 0.03, 0.2, 0, 0.84, 2.1, body); box(rearG, 1.0, 0.045, 0.02, 0, 1.0, 1.88, redM);      // rear wing
  for (const sx of [-1, 1]) { box(rearG, 0.025, 0.5, 0.45, sx * 0.5, 0.82, 2.05, body);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.44, 22), tyreM); t.rotation.z = Math.PI / 2; t.position.set(sx * 0.8, 0.34, 1.55); rearG.add(t);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.45, 16), lam(0x2a2a2d)); rim.rotation.z = Math.PI / 2; rim.position.copy(t.position); rearG.add(rim); }
}
const selfie = { rt: new THREE.WebGLRenderTarget(240, 135), buf: new Uint8Array(240 * 135 * 4), cv: document.createElement('canvas'), n: 0, ready: false };
selfie.cv.width = 240; selfie.cv.height = 135; selfie.img = selfie.cv.getContext('2d').createImageData(240, 135);
const camSW = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 2500), camSC = new THREE.PerspectiveCamera(30, 16 / 9, 0.05, 20);
for (const cm of [camSW, camSC]) { cm.rotation.order = 'YXZ'; cm.position.set(0, 1.0, -1.5); cm.rotation.set(-0.13, Math.PI, 0); }
carObj.add(camSW); C.add(camSC);
function renderSelfie() {
  const hide = [head, sw, ...refl]; arms.forEach(a => hide.push(a.upper, a.fore, a.hand));      // the player takes the driver's place
  hide.forEach(o => { o.userData.vis = o.visible; o.visible = false; }); rearG.visible = true;
  renderer.setRenderTarget(selfie.rt); renderer.render(W, camSW);
  renderer.autoClear = false; renderer.clearDepth(); renderer.render(C, camSC); renderer.autoClear = true;
  renderer.readRenderTargetPixels(selfie.rt, 0, 0, 240, 135, selfie.buf);
  hide.forEach(o => { o.visible = o.userData.vis; }); rearG.visible = false;
  const d = selfie.img.data, row = 240 * 4; for (let y = 0; y < 135; y++) d.set(selfie.buf.subarray((134 - y) * row, (135 - y) * row), y * row);
  for (let i = 3; i < d.length; i += 4) d[i] = 255;
  selfie.cv.getContext('2d').putImageData(selfie.img, 0, 0); selfie.ready = true;
}


// soft contact shadows so cars sit on the road instead of floating
const shadowT = tex(64, 64, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(0,0,0,.3)'); gr.addColorStop(0.6, 'rgba(0,0,0,.2)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
function addShadow(parent, z) { const g = new THREE.PlaneGeometry(2.0, 4.7); g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: shadowT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 })); m.position.set(0, 0.03, z); parent.add(m); }
addShadow(carObj, -0.3); rivals.forEach(r => addShadow(r.mesh, 0));
// a tight, dark patch right where each tyre touches the road
const patchT = tex(64, 64, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(0,0,0,.9)'); gr.addColorStop(0.55, 'rgba(0,0,0,.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
for (const [x, z] of [[-0.8, -1.3], [0.8, -1.3], [-0.8, 1.25], [0.8, 1.25]]) { const g = new THREE.PlaneGeometry(0.62, 1.0); g.rotateX(-Math.PI / 2);
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: patchT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -6 })); m.position.set(x, 0.035, z); carObj.add(m); }

// ---------- post ----------
const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
let rtW, rtC, rtM, rtP, rtK, portrait = false;
const passA = new THREE.ShaderMaterial({ depthTest: false, vertexShader: VS,
  uniforms: { tW: { value: null }, tC: { value: null }, tP: { value: null }, ghost: { value: 0.32 }, vp: { value: new THREE.Vector2(0.5, 0.6) }, blur: { value: 0 }, shake: { value: 0 }, time: { value: 0 } },
  fragmentShader: `
    uniform sampler2D tW, tC, tP; uniform vec2 vp; uniform float blur, shake, time, ghost; varying vec2 vUv;
    void main(){
      vec2 d = vUv - vp;
      float below = smoothstep(vp.y + 0.05, vp.y - 0.35, vUv.y);
      float road = below * (1. - smoothstep(0.75, 1.25, abs(d.x) / max(0.02, (vp.y - vUv.y) * 1.3)));   // the wedge of tarmac running to the vanishing point
      float amt = blur * mix(0.55, 1.0, below) * mix(1.0, 0.6, road) * (0.6 + 0.8 * length(d));          // more smear toward the edges of frame; the road itself stays a little crisper than the scenery
      float j = fract(sin(dot(vUv, vec2(12.9898, 78.233)) + time) * 43758.5453);
      vec3 w = vec3(0.);
      for (int i = 0; i < 16; i++) w += texture2D(tW, vUv - d * amt * (float(i) + j) / 16.).rgb;
      w /= 16.;
      vec2 o = vec2(0., shake);
      vec4 c = 0.5 * (texture2D(tC, vUv + o) + texture2D(tC, vUv - o));
      gl_FragColor = vec4(mix(mix(w, c.rgb, c.a), texture2D(tP, vUv).rgb, ghost), 1.);   // ghost = last frame bleeding through
    }` });
const smudge = { on: false, next: 8, force: false };
let stuckT = 0, stuckSaid = -99;
const passB = new THREE.ShaderMaterial({ depthTest: false, vertexShader: VS,
  uniforms: { t: { value: null }, res: { value: new THREE.Vector2(768, 432) }, time: { value: 0 }, fx: { value: 1 }, expo: { value: 1 }, soft: { value: 1 }, rain: { value: 0 }, tint: { value: new THREE.Vector3(1, 1, 1) }, smA: { value: new THREE.Vector4(0.5, 0.5, 0.05, 0.05) }, smB: { value: new THREE.Vector3(1, 0, 0) } },
  fragmentShader: `
    uniform sampler2D t; uniform vec2 res; uniform float time, fx, expo, soft, rain; uniform vec3 tint; uniform vec4 smA; uniform vec3 smB; varying vec2 vUv;
    float hash(float n){ return fract(sin(n) * 43758.5453); }
    float hash2(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    vec3 drops(vec2 uv, float t){            // water on the lens: each drop lands, sits, slides a little and dries
      vec2 off = vec2(0.); float m = 0.; float asp = res.x / res.y;
      for (int L = 0; L < 2; L++) {
        vec2 g = vec2(9. * asp, 9.) * (1. + float(L) * 0.7);
        vec2 p = uv * g + float(L) * 17.3, i = floor(p), f = fract(p) - 0.5;
        float h1 = hash2(i), h2 = hash2(i + 31.7);
        float life = fract(t * (0.08 + h2 * 0.1) + h1 * 9.);
        float on = step(0.6, h1) * smoothstep(0., 0.04, life) * (1. - smoothstep(0.6, 1., life));
        vec2 d = f - (vec2(h1, h2) - 0.5) * 0.5 + vec2(0., life * 0.14 * h2);
        float R = 0.08 + h2 * 0.1, k = smoothstep(R, R * 0.55, length(d)) * on;
        off -= d * k * 0.9 / g; m += k;
      }
      return vec3(off, m);
    }
    vec2 lens(vec2 uv, float k){ vec2 p = uv * 2. - 1.; p *= (1. + k * dot(p, p)) / (1. + k * 2.); return p * .5 + .5; }
    vec3 yiq(vec3 c){ return vec3(dot(c, vec3(.299, .587, .114)), dot(c, vec3(.596, -.274, -.322)), dot(c, vec3(.211, -.523, .312))); }
    vec3 rgb(vec3 c){ return vec3(c.x + .956 * c.y + .621 * c.z, c.x - .272 * c.y - .647 * c.z, c.x - 1.106 * c.y + 1.703 * c.z); }
    void main(){
      vec2 uv = vUv;
      vec3 dr = rain > 0.01 ? drops(vUv, mod(time, 600.)) * rain : vec3(0.);
      uv += dr.xy;
      float line = floor(uv.y * res.y);
      uv.x += sin(uv.y * 9. + time * 2.3) * 0.0005;
      float k = 0.36, px = 1.4 / res.x;
      vec2 ug = lens(uv, k);
      vec3 c0 = vec3(texture2D(t, lens(uv, k * 1.07)).r, texture2D(t, ug).g, texture2D(t, lens(uv, k * 0.93)).b);
      float yl = yiq(texture2D(t, ug - vec2(px * 2., 0.)).rgb).x, yr = yiq(texture2D(t, ug + vec2(px * 2., 0.)).rgb).x;
      float Y = mix(yiq(c0).x, yiq(c0).x * .4 + .3 * (yl + yr), soft);      // soft = 0 crisp at a standstill, 1 smeared flat out
      vec2 IQ = vec2(0.);
      for (int i = -3; i <= 3; i++) IQ += yiq(texture2D(t, ug + vec2((float(i) * 2. + 2.5) * px, 0.)).rgb).yz;
      vec3 c = rgb(vec3(Y, IQ / 7. * 1.12));
      c += abs(yl - yr) * vec3(0.11, -0.04, 0.16);                     // purple fringe on hard edges
      vec3 glow = vec3(0.);
      for (int i = 0; i < 8; i++) { float a = float(i) * 0.785; vec2 o = vec2(cos(a), sin(a) * res.x / res.y) * px;
        glow += max(texture2D(t, ug + o * 6.).rgb - .6, 0.) + max(texture2D(t, ug + o * 16.).rgb - .6, 0.); }
      c += glow / 16. * vec3(1.2, 1.18, 0.95);
      if (smB.z > 0.003) {                                             /* a smudge on the lens: that patch goes soft and milky, so it barely shows over dark road and glows against the sky */
        vec2 sd = (vUv - smA.xy) * vec2(res.x / res.y, 1.);
        float sa = dot(sd, smB.xy) / smA.z, sb = dot(sd, vec2(-smB.y, smB.x)) / smA.w;
        float sm = smB.z * exp(-(sa * sa + sb * sb) * .5);
        if (sm > 0.01) { vec3 bl = vec3(0.);
          for (int i = 0; i < 12; i++) { float a = float(i) * 2.4, rr = 0.012 + 0.03 * fract(float(i) * 0.618); bl += texture2D(t, ug + vec2(cos(a) * res.y / res.x, sin(a)) * rr).rgb; }
          c = mix(c, bl / 12. * 0.8 + 0.1, sm); }
      }
      c = c * 1.1 * expo + 0.045;                                      // expo = the camera's auto-gain, slow to react
      c = mix(c, smoothstep(0., 1., c), 0.3);
      float l = dot(c, vec3(.299, .587, .114));
      c = mix(vec3(l), c, 0.84);                                        // faded, pastel colour
      c += vec3(0.018, 0.0, 0.03) * (1. - l);
      c *= mix(vec3(1.), vec3(1.02, 1.02, 0.96), l);
      c *= tint;
      if (rain > 0.01) {                                                // rain: flatter and bluer, with a glint on each drop on the lens
        c = mix(c, vec3(dot(c, vec3(.333))) * vec3(.93, .97, 1.05), 0.3 * rain);
        c += dr.z * 0.02;
      }
      float tm = mod(time, 50.);
      c += (hash2(floor(uv * res * 0.7) + tm * 91.) - .5) * 0.02;       // a little soft grain, no scanlines
      vec2 p = vUv * 2. - 1.;
      c *= 1. - 0.3 * pow(dot(p, p) * .5, 1.6);
      gl_FragColor = vec4(mix(texture2D(t, vUv).rgb, c, fx), 1.);
    }` });
// Paint pass (Kuwahara filter): each pixel takes the average of whichever neighbouring patch is calmest.
// Flat areas go smooth and edges stay crisp, which is the "upscaled old tape" look.
const passK = new THREE.ShaderMaterial({ depthTest: false, vertexShader: VS,
  uniforms: { t: { value: null }, res: { value: new THREE.Vector2(1066, 600) }, amt: { value: 0.9 } },
  fragmentShader: `
    uniform sampler2D t; uniform vec2 res; uniform float amt; varying vec2 vUv;
    void main(){
      vec2 px = 1. / res;
      vec3 m0 = vec3(0.), m1 = vec3(0.), m2 = vec3(0.), m3 = vec3(0.), s0 = vec3(0.), s1 = vec3(0.), s2 = vec3(0.), s3 = vec3(0.), c;
      for (int j = 0; j <= 3; j++) for (int i = 0; i <= 3; i++) {
        vec2 o = vec2(float(i), float(j)) * px;
        c = texture2D(t, vUv + vec2(-o.x, -o.y)).rgb; m0 += c; s0 += c * c;
        c = texture2D(t, vUv + vec2( o.x, -o.y)).rgb; m1 += c; s1 += c * c;
        c = texture2D(t, vUv + vec2(-o.x,  o.y)).rgb; m2 += c; s2 += c * c;
        c = texture2D(t, vUv + vec2( o.x,  o.y)).rgb; m3 += c; s3 += c * c;
      }
      m0 /= 16.; m1 /= 16.; m2 /= 16.; m3 /= 16.;
      float v0 = dot(abs(s0 / 16. - m0 * m0), vec3(1.)), v1 = dot(abs(s1 / 16. - m1 * m1), vec3(1.)), v2 = dot(abs(s2 / 16. - m2 * m2), vec3(1.)), v3 = dot(abs(s3 / 16. - m3 * m3), vec3(1.));
      vec3 r = m0; float v = v0;
      if (v1 < v) { v = v1; r = m1; } if (v2 < v) { v = v2; r = m2; } if (v3 < v) { r = m3; }
      gl_FragColor = vec4(mix(texture2D(t, vUv).rgb, r, amt), 1.);
    }` });
const quadScene = new THREE.Scene(), quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), passA); quad.frustumCulled = false; quadScene.add(quad);
function resize() {
  const h = Math.max(innerHeight, 2), w = portrait ? Math.round(h * 9 / 16) : Math.max(innerWidth, 2), rw = Math.round(RT_LINES * w / h);
  renderer.setSize(w, h, false);
  renderer.domElement.style.cssText = `display:block;margin:0 auto;width:${w}px;height:${h}px`;
  camW.fov = camC.fov = portrait ? 112 : CAM.fov;
  camW.aspect = camC.aspect = w / h; camW.updateProjectionMatrix(); camC.updateProjectionMatrix();
  [rtW, rtC, rtM, rtP, rtK].forEach(r => r && r.dispose());
  const o = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
  const RTc = renderer.capabilities.isWebGL2 ? THREE.WebGLMultisampleRenderTarget : THREE.WebGLRenderTarget;     // smooth edges, not stair-steps
  rtW = new RTc(rw, RT_LINES, o); rtC = new RTc(rw, RT_LINES, o);
  rtK = new THREE.WebGLRenderTarget(rw, RT_LINES, Object.assign({ depthBuffer: false }, o)); passK.uniforms.res.value.set(rw, RT_LINES);
  rtM = new THREE.WebGLRenderTarget(rw, RT_LINES, Object.assign({ depthBuffer: false }, o));
  rtP = new THREE.WebGLRenderTarget(rw, RT_LINES, Object.assign({ depthBuffer: false }, o));
  passB.uniforms.res.value.set(rw, RT_LINES);
  if (rtR) rtR.dispose(); rtR = new THREE.WebGLRenderTarget(rw, RT_LINES, o); reflU.uRefl.value = rtR.texture;      /* full size, so the puddles are as sharp as the tape allows */
}
addEventListener('resize', resize); resize();

// ---------- car physics ----------
const PH = { m: 620, Iz: 780, lf: 1.55, lr: 1.25, mu: 2.1, B: 11.5, Cc: 1.4, P: 520e3, Fmax: 10500, CdA: 1.15, ClA: 3.0, g: 9.81 };
const GEARS = [26, 37.5, 48.6, 59.7, 72, 93];     // top speed per gear, m/s
const car = { x: 0, z: 0, h: 0, vx: 0, vy: 0, r: 0, steer: 0, thr: 0, brk: 0, ax: 0, ay: 0, slip: 0, off: false, kerb: false,
  idx: 0, lat: 0, y: 19, yS: 19, slope: 0, slopeS: 0, kv: 0, tun: 0, expo: 1, holdT: 0, holdDir: 0, gear: 0, rpm: 3500, shiftT: 0, bump: 0, axS: 0, ayS: 0, spin: 0 };
function placeOnTrack(i, v) {
  i = ((i % N) + N) % N;
  car.x = P[i].x; car.z = P[i].z; car.h = Math.atan2(-TAN[i].x, -TAN[i].z);
  car.vx = v || 0; car.vy = 0; car.r = 0; car.steer = 0; car.idx = i; car.gear = 0;
}
// Steering feel, 1 (calm) to 9 (sharp). Adjustable in the game with [ and ] and remembered per browser.
// Simple mode: the player only steers. The car picks its own speed for every corner, a little under the limit.
let easy = false, easyUsed = false, easyPace = 0.96, easyCeil = 1, easyTidy = true, steerOnly = false; /* steerOnly: a test aid, the autopilot steers while simple mode sets the speed */ try { easy = localStorage.getItem('goldenlap.easy') !== '0'; } catch (e) {}      /* a first visit starts in Beginner */
let feel = 4; try { feel = clamp(parseInt(localStorage.getItem('goldenlap.feel')) || 4, 1, 9); } catch (e) {}     // 4 is James's pick after driving it
const maxSteer = v => Math.min(0.46, 0.02 + 3.4 * (20.6 + 0.0061 * v * v) / Math.max(v * v, 30));     // never more lock than the tyres can use at this speed
const tyre = (a, D) => -D * Math.sin(PH.Cc * Math.atan(PH.B * a));
function step(dt) {
  const L = PH.lf + PH.lr, v = Math.hypot(car.vx, car.vy), grip = (car.off ? 0.5 : 1) * (car.tun > 0.5 ? 1 : ENV.grip) * (1 + 2.4 * BANK[car.idx]);      // a wet road everywhere except under the tunnel roof
  const df = 0.6 * PH.ClA * car.vx * car.vx;
  const wt = PH.m * PH.g * clamp(1 + car.vx * car.vx * car.kv / PH.g, 0.5, 1.6);     // heavy in a dip, light over a crest
  const Nf = wt * PH.lr / L + df * 0.4, Nr = wt * PH.lf / L + df * 0.6;
  const vxs = Math.max(Math.abs(car.vx), 4), st = car.vx < -0.5 ? -car.steer : car.steer;
  const af = Math.atan2(car.vy + PH.lf * car.r, vxs) - st, ar = Math.atan2(car.vy - PH.lr * car.r, vxs);
  const maxR = PH.mu * 1.14 * grip * Nr;      // wider rear tyres: keeps the balance on the safe side
  const Fd = Math.min(car.thr * (car.shiftT > 0 ? 0 : 1) * Math.min(PH.P / Math.max(v, 10), PH.Fmax), maxR * 0.95);
  const use = Math.min(0.85, 0.55 * Fd / maxR);
  let Fx = Fd - PH.m * PH.g * car.slope;
  if (car.vx > 0.3) Fx -= car.brk * PH.mu * grip * (Nf + Nr) * 0.95;
  else if (car.brk > 0 && car.thr < 0.05 && car.vx > -8) Fx -= car.brk * 3500;
  Fx -= 0.6 * PH.CdA * car.vx * Math.abs(car.vx) + Math.sign(car.vx) * (180 + (car.off ? 2200 + 25 * Math.abs(car.vx) : 0));
  const Fyf = tyre(af, PH.mu * grip * Nf), Fyr = tyre(ar, maxR) * Math.sqrt(1 - use * use);
  const cs = Math.cos(st), sn = Math.sin(st);
  car.ax = (Fx - Fyf * sn) / PH.m; car.ay = (Fyf * cs + Fyr) / PH.m;
  car.vx += (car.ax + car.r * car.vy) * dt; car.vy += (car.ay - car.r * car.vx) * dt;
  car.r += ((PH.lf * Fyf * cs - PH.lr * Fyr) / PH.Iz - car.r * (2.6 - 0.2 * feel)) * dt;     // a little yaw damping calms the car's reactions
  if (Math.abs(car.vx) < 3) { const k = Math.exp(-dt * 6 * (1 - Math.abs(car.vx) / 3)); car.vy *= k; car.r *= k; }
  if (car.thr < 0.02 && car.brk < 0.02 && Math.abs(car.vx) < 0.4) car.vx *= 0.97;
  if (mode === 'grid') { car.vx = 0; car.vy = 0; car.r = 0; }      // held on the grid: no rolling back down the hill, no reversing on the brake
  car.h += car.r * dt;
  const s = Math.sin(car.h), c = Math.cos(car.h);
  car.x += (-s * car.vx - c * car.vy) * dt; car.z += (-c * car.vx + s * car.vy) * dt;
  car.slip = Math.max(Math.abs(af), Math.abs(ar));
}

// ---------- input ----------
const keys = {};
let autopilot = true, started = false, fxOn = true, muted = false;
addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (e.target.tagName === 'INPUT') return;
  if (mode === 'preview' && ['Enter', 'Escape', 'Space'].includes(e.code)) { e.preventDefault(); endPreview(); return; }
  if (mode === 'replay' && ['Enter', 'Escape', 'Space'].includes(e.code)) { e.preventDefault(); endReplay(); return; }
  keys[e.code] = true;
  if (!started || e.repeat) return;
  if (e.code === 'KeyR') toGrid();
  if (e.code === 'KeyV') { fxOn = !fxOn; passB.uniforms.fx.value = fxOn ? 1 : 0; }
  if (e.code === 'KeyT') { autopilot = !autopilot; }
  if (e.code === 'KeyK') nextCam();
  if (e.code === 'KeyX') { setEasy(!easy); say(easy ? 'BEGINNER: JUST STEER' : 'PRO: YOU BRAKE TOO'); }
  if (e.code === 'KeyC') { if (hand.on) { stopHands(); setCtl(false); } else { setCtl(true); startHands().catch(() => stopHands()); } }
  if (e.code === 'BracketLeft' || e.code === 'BracketRight') { feel = clamp(feel + (e.code === 'BracketRight' ? 1 : -1), 1, 9); try { localStorage.setItem('goldenlap.feel', feel); } catch (x) {}
    $('flash').textContent = 'STEERING ' + feel + ' OF 9'; $('flash').className = 'plain'; $('flash').style.display = 'block'; flashT = 2; }
  if (e.code === 'KeyE') { snd.useSamples = !snd.useSamples; $('flash').textContent = snd.useSamples && snd.smp ? 'ENGINE: RECORDED' : 'ENGINE: SYNTH'; $('flash').className = 'plain'; $('flash').style.display = 'block'; flashT = 2; }
  if (e.code === 'KeyL') { const o = $('lbo'); o.style.display = o.style.display === 'block' ? 'none' : 'block'; if (o.style.display === 'block') refreshBoard(); }
  if (e.code === 'KeyP') { portrait = !portrait; resize(); }
  if (e.code === 'KeyI') { diag.show = !diag.show; $('dbg').style.display = diag.show ? 'block' : 'none'; }
  if (e.code === 'KeyH') { const h = document.getElementById('hud'); h.style.display = h.style.display === 'none' ? '' : 'none'; }
  if (e.code === 'KeyM') { muted = !muted; if (snd.master) snd.master.gain.value = muted ? 0 : 0.5; }
});
addEventListener('keyup', e => { keys[e.code] = false; });
let gridRev = 0;
// ---------- the computer's end of the phone wheel ----------
const phone = { on: false, steer: 0, target: 0, brk: 0, t: 0, used: false, pc: null, poll: 0 };
const phoneLive = () => phone.on && performance.now() - phone.t < 800;      // no message for most of a second: treat the wheel as let go
function closePhone() { phone.poll++; if (phone.pc) { try { phone.pc.close(); } catch (e) {} } phone.pc = null; phone.on = false; }
async function pairPhone() {
  closePhone(); const my = phone.poll, msg = t => { $('pwmsg').textContent = t; };
  $('pwcode').textContent = ''; msg('Making a code...'); $('pwqr').getContext('2d').clearRect(0, 0, 232, 232);
  try {
    const pc = phone.pc = new RTCPeerConnection(RTC), ch = phone.ch = pc.createDataChannel('wheel', { ordered: false, maxRetransmits: 0 });      // late steering is worse than lost steering
    ch.onmessage = e => { try { const m = JSON.parse(e.data); let s = clamp(m.s / 35, -1, 1); s = Math.sign(s) * Math.pow(Math.max(0, Math.abs(s) - 0.04) / 0.96, 1.2); phone.target = s; phone.brk = m.b ? 1 : 0; phone.t = performance.now(); } catch (err) {} };
    ch.onopen = () => { phone.on = true; phone.t = performance.now(); if (hand.on) stopHands(); msg(''); startState(); };
    ch.onclose = () => { if (phone.pc === pc) { closePhone(); setCtl(useHands); say('PHONE DISCONNECTED: KEYBOARD STEERING'); startState(); if (startShown()) pairPhone(); } };
    await pc.setLocalDescription(await pc.createOffer()); await waitIce(pc);
    const j = await postJ('/api/pair', { offer: pc.localDescription.sdp }); if (!j.ok) throw new Error(j.error || 'refused'); if (phone.poll !== my) return;
    const url = location.origin + '/?w=' + j.code, qr = qrcode(0, 'M'); qr.addData(url); qr.make();
    const n = qr.getModuleCount(), g = $('pwqr').getContext('2d'), cell = Math.floor(216 / n), off = Math.floor((232 - cell * n) / 2); g.fillStyle = '#f4f1e6'; g.fillRect(0, 0, 232, 232); g.fillStyle = '#111';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) g.fillRect(off + x * cell, off + y * cell, cell, cell);
    $('pwcode').textContent = url.replace(/^https?:\/\//, ''); msg('Both on the same Wi-Fi works best.');
    for (let k = 0; k < 240 && phone.poll === my && pc.signalingState !== 'stable'; k++) { await new Promise(r => setTimeout(r, 1000));
      const a = await fetch('/api/pair?p=' + j.code, { cache: 'no-store' }).then(r => r.json()).catch(() => null);
      if (a && a.answer && phone.poll === my && pc.signalingState !== 'stable') { await pc.setRemoteDescription({ type: 'answer', sdp: a.answer }); msg('Phone found. Connecting...'); } }
    if (phone.poll === my && pc.signalingState !== 'stable') { if (startShown() && (phone.renew = (phone.renew || 0) + 1) < 8) return pairPhone();      /* codes last four minutes: make a fresh one while the start screen is still up */
      msg('This code has expired. Click it for a new one.'); }
  } catch (e) { msg('The phone wheel is not available here. Use your hands or the keyboard below.'); }
}
// ---------- hand check: before a first lap with camera steering, prove each gesture works ----------
let checking = false; const hc = { step: 0, t: 0, hold: 0, done: 0 };
const HC_STEPS = [
  ['BOTH HANDS SEEN', () => hand.ok && hand.raw.length >= 2, 'Hands not found. Sit back a little so both hands are in the picture. On a Mac, turn Centre Stage off (green camera icon in the menu bar).'],
  ['TILT LEFT', () => hand.ok && hand.steer > 0.5, 'Turn the wheel to the left: right hand up, left hand down.'],
  ['TILT RIGHT', () => hand.ok && hand.steer < -0.5, 'Now the other way: left hand up, right hand down.'],
  ['CLENCH YOUR FISTS TO BRAKE', () => hand.ok && hand.brk > 0.6, 'Squeeze both hands into tight fists, as if gripping the wheel hard.'],
];
const hcCount = () => easy ? 3 : 4;      // simple mode never brakes, so it is not tested
function drawCheck() { $('hcl').innerHTML = HC_STEPS.slice(0, hcCount()).map((q, i) => `<div class="${i < hc.step ? 'ok' : i === hc.step ? 'now' : ''}"><i></i>${q[0]}</div>`).join(''); $('hch').textContent = hc.done ? 'All working. Lights in a moment.' : 'Hold your hands up like a steering wheel.'; }
function startCheck() { checking = true; hc.step = 0; hc.t = 0; hc.hold = 0; hc.done = 0; hand.seen = 0; $('hc').style.display = 'flex'; $('cam').classList.add('big'); drawCheck(); }
function endCheck(go) { checking = false; $('hc').style.display = 'none'; $('cam').classList.remove('big'); if (go) { try { localStorage.setItem('goldenlap.hc', '1'); } catch (e) {} toGrid(); } }
function tickCheck(dt) {
  if (!checking) return; hc.t += dt;
  if (hc.done) { hc.done -= dt; if (hc.done <= 0) endCheck(true); return; }
  if (HC_STEPS[hc.step][1]()) { hc.hold += dt;
    if (hc.hold > (hc.step ? 0.25 : 0.6)) { if (hc.step === 0) hand.seen = 0;      // they are in position now: this is their normal grip
      hc.step++; hc.hold = 0; hc.t = 0; if (hc.step >= hcCount()) { hc.done = 0.9; beep(true); } else beep(false); drawCheck(); } }
  else hc.hold = 0;
  if (!hc.done && hc.t > (hc.step ? 6 : 5)) $('hch').textContent = HC_STEPS[hc.step][2];
}
// ---------- ghost: your best lap, recorded 20 times a second, drives the lap again as a faint car ----------
let otherBoard = [];      // the board you are not driving on, shown beside yours on the start screen
let daily = false, dayNo = Math.floor(Date.now() / 86400000);      // days since 1970, UTC: everyone in the world gets the same condition on the same day
// The weather for any day. Until 27 Nov 2026 it went round DAILY in a fixed loop; from the 28th each day steps on by a
// hashed 1 to 4 places, so it never repeats two days running and no longer comes round like clockwork. Same for everyone, worked out from the date alone.
const WX0 = 20784, wxMemo = {};
function wxIdx(d) { if (d <= WX0) return d % DAILY.length; if (wxMemo[d] != null) return wxMemo[d];
  let k = WX0, i = WX0 % DAILY.length; for (; k < d; ) { k++; let h = Math.imul(k ^ 0x9e3779b9, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
    i = (i + 1 + (h >>> 0) % (DAILY.length - 1)) % DAILY.length; } return wxMemo[d] = i; }
const wxKey = d => DAILY[wxIdx(d)];
const todayKey = () => wxKey(dayNo);
const ghostKey = () => 'goldenlap.ghost7' + (daily ? '.d' + dayNo : '');      // tied to the circuit version, like the board; a wet lap gets its own ghost
let ghost = null;
function loadGhost() { try { ghost = JSON.parse(localStorage.getItem(ghostKey())); if (!ghost || !ghost.s || ghost.s.length < 20) ghost = null; } catch (e) { ghost = null; } }
loadGhost();
function setDaily(on) { daily = on; applyEnv(on ? todayKey() : 'dry'); loadGhost();
  const left = 86400000 - Date.now() % 86400000, hh = Math.floor(left / 3600000), mm = Math.floor(left % 3600000 / 60000);
  dayLabels(); board = []; otherBoard = []; if (typeof refreshBoard === 'function') refreshBoard(); }
// Today's lap is the default: the day's weather, on a board that starts empty every midnight (UTC). The dry lap is "Practice" and feeds the all-time board.
const WXI = {      // little forecast pictures, drawn as SVG so they stay crisp under the tape filter
  golden: '<circle cx="20" cy="20" r="7" fill="#f6b73c"/><g stroke="#f6b73c" stroke-width="2.4" stroke-linecap="round"><path d="M20 4v4M20 32v4M4 20h4M32 20h4M8.7 8.7l2.8 2.8M28.5 28.5l2.8 2.8M8.7 31.3l2.8-2.8M28.5 11.5l2.8-2.8"/></g>',
  rain: '<path d="M11 24a6 6 0 0 1 1-11.9A8 8 0 0 1 27.5 11 6.5 6.5 0 0 1 29 24z" fill="#e8e8e8"/><g stroke="#5fb0ff" stroke-width="2.4" stroke-linecap="round"><path d="M14 28l-2 5M21 28l-2 5M28 28l-2 5"/></g>',
  fog: '<g stroke="#d8d8d8" stroke-width="2.6" stroke-linecap="round"><path d="M7 13h26M4 20h24M10 27h26M7 34h18"/></g>',
  dusk: '<path d="M10 26a10 10 0 0 1 20 0z" fill="#ff9a6a"/><g stroke="#ff9a6a" stroke-width="2.4" stroke-linecap="round"><path d="M20 8v4M8 14l2.8 2.8M32 14l-2.8 2.8"/></g><path d="M4 30h32" stroke="#b6a4d0" stroke-width="2.4" stroke-linecap="round"/>',
  raindusk: '<path d="M11 24a6 6 0 0 1 1-11.9A8 8 0 0 1 27.5 11 6.5 6.5 0 0 1 29 24z" fill="#9c97c4"/><g stroke="#7fb9ff" stroke-width="2.4" stroke-linecap="round"><path d="M14 28l-2 5M21 28l-2 5M28 28l-2 5"/></g>' };
const WXN = { golden: 'Golden', rain: 'Rain', fog: 'Fog', dusk: 'Dusk', raindusk: 'Rainy dusk' };
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], nth = n => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
function forecast() { let h = '';
  for (let i = 0; i < 7; i++) { const d = dayNo + i, k = wxKey(d), dt = new Date(d * 86400000), lbl = i ? DOW[dt.getUTCDay()] + ' ' + nth(dt.getUTCDate()) : 'Today';
    h += `<div class="fc${i ? '' : ' now'}${!i && !daily ? ' off' : ''}"><i>${lbl}</i><svg viewBox="0 0 40 40">${WXI[k]}</svg><b>${WXN[k]}</b></div>`; }
  $('wx').innerHTML = h; }
function dayLabels() { forecast(); const left = 86400000 - Date.now() % 86400000, hh = Math.floor(left / 3600000), mm = Math.floor(left % 3600000 / 60000);
  $('todayline').innerHTML = daily ? `<b>TODAY'S LAP: ${CONDS[todayKey()].name}</b> <span>&nbsp;·&nbsp; new weather in ${hh} h ${mm} m</span>` : `<b>PRACTICE: DRY</b> <span>&nbsp;·&nbsp; counts for the all-time board</span>`;
  $('daybtn').textContent = daily ? 'Practice in the dry' : "Back to today's lap"; $('dayhint').style.display = 'none'; }
setInterval(() => { if ($('start').style.display !== 'none') dayLabels(); }, 60000);
let rec = [], recT = 0, gp = 0, gq = 0, wantShot = false;
// ---------- challenge links: one lap, carried in a link, for someone else to race ----------
let rival = null;      // { n, t, c, s } once a challenge link has loaded; it then replaces your own ghost on track
const CTL = { phone: 'WITH A PHONE AS THE WHEEL, PRO', 'phone-simple': 'WITH A PHONE, BEGINNER', hands: 'WITH THEIR HANDS, PRO', keys: 'ON THE KEYBOARD, PRO', 'keys-simple': 'ON THE KEYBOARD, BEGINNER', 'hands-simple': 'WITH THEIR HANDS, BEGINNER' };   /* the stored tags still say "simple": that was the mode's first name */
// A challenge is stored small: time, distance round the lap and distance from the centre line, ten times a second. The car's path is rebuilt from the circuit.
function packLap(r) { const out = []; r.forEach((q, i) => { if (i % 2 === 0 || i === r.length - 1) out.push(Math.round(q[0] * 1000), Math.round(q[5] * 10), Math.round((q[6] || 0) * 10)); }); return out; }
function unpackLap(d) { const S = [];
  for (let k = 0; k + 2 < d.length; k += 3) { const p = d[k + 1] / 10, lat = d[k + 2] / 10, f = Math.floor(p), u = p - f, i = ((f % N) + N) % N, j = (i + 1) % N;
    S.push([d[k] / 1000, P[i].x + (P[j].x - P[i].x) * u + R[i].x * lat, P[i].z + (P[j].z - P[i].z) * u + R[i].z * lat, Math.atan2(-TAN[i].x, -TAN[i].z), Y[i] + (Y[j] - Y[i]) * u, p]); }
  return S; }
function showDare() { if (!rival) return; $('dare').innerHTML = `<b>${rival.n}</b> SET <b>${fmt(rival.t)}</b> ${CTL[rival.c] || ''}<br>YOU WILL RACE THEIR GHOST`; $('dare').style.display = 'block'; $('gobtn').textContent = 'BEAT IT'; $('tagline').style.display = 'none'; }
{ let code = ''; try { code = (new URLSearchParams(location.search).get('c') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8); } catch (e) {}
  if (code) fetch('/api/challenge?lap=' + code).then(r => r.json()).then(j => { if (!j || !j.ok) { $('dare').textContent = 'THAT CHALLENGE LINK IS NOT VALID ANY MORE'; $('dare').style.display = 'block'; return; }
    const S = unpackLap(j.d); if (S.length < 20) return; rival = { n: j.n, t: j.t, c: j.c, s: S }; showDare(); }).catch(() => {}); }
async function sendChallenge() {
  const b = $('chbtn'); if (!mine || !mine.pk || b.dataset.busy) return; b.dataset.busy = '1'; b.textContent = 'Making link...';
  try { const j = await fetch('/api/challenge', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: $('name').value || '', ms: Math.round(mine.t * 1000), c: mine.c, d: mine.pk }) }).then(r => r.json());
    if (!j.ok) throw new Error(j.error || 'refused');
    const url = location.origin + '/?c=' + j.code; let copied = false; try { await navigator.clipboard.writeText(url); copied = true; } catch (e) {}
    b.textContent = copied ? 'Link copied' : 'Link ready'; $('chlink').value = url; $('chlink').style.display = 'block'; if (!copied) $('chlink').select();
  } catch (e) { b.textContent = 'Could not make a link'; }
  delete b.dataset.busy;
}
const ghostM = new THREE.MeshBasicMaterial({ color: 0xffe94a, transparent: true, opacity: 0.4, depthWrite: false, fog: false });
const ghostCar = new THREE.Group(); ghostCar.rotation.order = 'YXZ'; ghostCar.visible = false; W.add(ghostCar);
box(ghostCar, 0.62, 0.34, 2.6, 0, 0.36, 0.1, ghostM); box(ghostCar, 0.3, 0.2, 1.3, 0, 0.3, -1.75, ghostM); box(ghostCar, 1.5, 0.05, 0.3, 0, 0.18, -2.3, ghostM);
box(ghostCar, 1.0, 0.05, 0.32, 0, 0.98, 2.05, ghostM); box(ghostCar, 0.3, 0.4, 0.7, 0, 0.78, 0.6, ghostM);
for (const [x, z, w] of [[-0.8, -1.3, 0.3], [0.8, -1.3, 0.3], [-0.8, 1.55, 0.44], [0.8, 1.55, 0.44]]) box(ghostCar, w, 0.66, 0.66, x, 0.33, z, ghostM);
function progress() { const i = car.idx; let p = i + ((car.x - P[i].x) * TAN[i].x + (car.z - P[i].z) * TAN[i].z) / DS;
  if (!lap.half && p > N * 0.8) p -= N; if (lap.half && p < N * 0.2) p += N; return p; }
const sample = p => [+lap.t.toFixed(3), +car.x.toFixed(2), +car.z.toFixed(2), +car.h.toFixed(3), +car.yS.toFixed(2), +p.toFixed(2), +car.lat.toFixed(1)];
let gside = 0, gsaid = -99;
const gv = new V3(); let ghostHints = 0; try { ghostHints = +localStorage.getItem('goldenlap.gh') || 0; } catch (e) {}
function tickGhost(dt) {
  const live = (mode === 'run' || mode === 'grid') && lap.t != null;
  if (live && !autopilot) { recT -= dt; if (recT <= 0) { recT += 0.05; rec.push(sample(progress())); } }
  const G0 = daily ? ghost : rival || ghost;      // a challenge was set in the dry, so it is not raced in the rain
  if (!live || !G0 || autopilot) { ghostCar.visible = false; $('gap').style.display = 'none'; $('gtag').style.display = 'none'; return; }
  const S = G0.s, t = lap.t;
  while (gp < S.length - 2 && S[gp + 1][0] <= t) gp++;
  const a = S[gp], b = S[gp + 1], u = clamp((t - a[0]) / Math.max(1e-3, b[0] - a[0]), 0, 1);
  let dh = b[3] - a[3]; dh = Math.atan2(Math.sin(dh), Math.cos(dh));
  ghostCar.position.set(a[1] + (b[1] - a[1]) * u, a[4] + (b[4] - a[4]) * u, a[2] + (b[2] - a[2]) * u); ghostCar.rotation.y = a[3] + dh * u;
  const d = Math.hypot(ghostCar.position.x - car.x, ghostCar.position.z - car.z);
  ghostM.opacity = 0.85 * clamp((d - 5) / 8, 0, 1);      // never a close-up: it fades out as you draw level
  ghostCar.visible = t < G0.t && ghostM.opacity > 0.01;
  { /* The first few laps with a ghost, a small label rides above it for the opening seconds, so you know what the yellow car is. */
    const tag = $('gtag'); let show = ghostCar.visible && mode === 'run' && t > 0.6 && t < 9 && ghostHints < 3;
    if (show) { gv.copy(ghostCar.position); gv.y += 1.9; gv.project(camW); show = gv.z < 1 && Math.abs(gv.x) < 0.95 && Math.abs(gv.y) < 0.95; }
    if (show) { let qx = gv.x, qy = gv.y; for (let i = 0; i < 3; i++) { const f = 1.72 / (1 + 0.36 * (qx * qx + qy * qy)); qx = gv.x * f; qy = gv.y * f; }      // the tape filter bends the picture; bend the label's position the same way
      if (!tag.shown) { tag.shown = true; tag.textContent = G0 === rival && rival ? (rival.n || 'THEIR') + "'S LAP: BEAT IT" : 'YOUR BEST LAP: BEAT IT'; }
      tag.style.display = 'block'; tag.style.opacity = Math.min(1, ghostM.opacity * 1.3, (9 - t) / 1.5); tag.style.transform = `translate(${((qx * 0.5 + 0.5) * innerWidth).toFixed(1)}px, ${((-qy * 0.5 + 0.5) * innerHeight).toFixed(1)}px) translateY(-100%)`; }
    else { tag.style.display = 'none'; if (tag.shown && t >= 9) { tag.shown = false; ghostHints++; try { localStorage.setItem('goldenlap.gh', ghostHints); } catch (e) {} } } }
  if (mode !== 'run') { $('gap').style.display = 'none'; return; }
  const p = progress();
  while (gq < S.length - 2 && S[gq + 1][5] <= p) gq++;
  const c = S[gq], e = S[gq + 1], tg = c[0] + (e[0] - c[0]) * clamp((p - c[5]) / Math.max(1e-3, e[5] - c[5]), 0, 1), gap = t - tg;
  if (t > 4) {      /* the moment you get ahead of the ghost, say so */
    if (gap > 0.15) gside = 1;
    else if (gap < -0.15 && gside !== -1) { gside = -1; if (T - gsaid > 8) { gsaid = T; say(G0 === rival && rival ? 'AHEAD OF ' + (rival.n || 'THEIR LAP') : 'AHEAD OF YOUR BEST'); $('flash').className = 'green'; } } }
  const el = $('gap'); el.style.display = Math.abs(gap) < 10 ? 'block' : 'none'; el.style.color = gap <= 0 ? '#8fe08a' : '#ff8c6e';
  el.innerHTML = (gap <= 0 ? '-' : '+') + Math.abs(gap).toFixed(2) + ' <small>VS ' + (rival ? rival.n : 'YOUR BEST') + '</small>';      // a quiet line under the lap time, and nothing at all once the gap is past ten seconds
}
// ---------- television replay: the lap you just drove, from cameras beside the track ----------
let lastRec = null, rT = 0, rp = 0, tvCam = null, tvFov = 30;
const camRW = new THREE.PerspectiveCamera(30, 16 / 9, 0.3, 2500), camRC = new THREE.PerspectiveCamera(30, 16 / 9, 0.3, 800), tvLook = new V3(), _m4 = new THREE.Matrix4();
W.add(camRW); C.add(camRC);
// Sixteen cameras: fourteen spread evenly round the lap, plus two inside the tunnel so the car is never seen through a wall.
const TVCAMS = [];
{ const put = (i, side) => { i = ((Math.round(i) % N) + N) % N; { const a = P[(i + N - 8) % N], b = P[(i + 8) % N], ins = ((a.x + b.x) / 2 - P[i].x) * R[i].x + ((a.z + b.z) / 2 - P[i].z) * R[i].z; if (Math.abs(ins) > 0.25) side = -Math.sign(ins); }      // on a bend, stand on the outside: nothing on the inside can get between camera and car
    if (inR(i, iHar0 - 8, iHar1 + 8)) side = -1;      // on the waterfront, shoot from the quay so the city is behind the car, not open water
    const lat = (tun[i] ? 5.6 : city[i] ? WO[i] - 0.6 : WO[i] + 2.5) * side, h = tun[i] ? 2.4 : city[i] ? 4.6 : 4.2;
    TVCAMS.push({ i, tun: tun[i], pos: new V3(P[i].x + R[i].x * lat, Y[i] + h, P[i].z + R[i].z * lat) }); };
  for (let k = 0; k < 14; k++) put(N * (k + 0.35) / 14, k % 2 ? 1 : -1);
  put(iTun0 + (iTun1 - iTun0) * 0.3, 1); put(iTun0 + (iTun1 - iTun0) * 0.8, -1); }
function startReplay() {
  if (!lastRec || lastRec.length < 20 || mode !== 'done') return;
  mode = 'replay'; rT = 0; rp = 0; tvCam = null; autopilot = true; $('panel').style.display = 'none'; document.body.classList.add('tv');
  $('tvname').textContent = ($('name').value || 'YOUR LAP').toUpperCase(); $('tv').style.display = 'block';
}
function endReplay() { if (mode !== 'replay') return; mode = 'done'; document.body.classList.remove('tv'); $('tv').style.display = 'none'; $('panel').style.display = 'flex'; car.vx = 45; car.vy = 0; car.r = 0; }
function replayStep(dt) {
  const S = lastRec, end = S[S.length - 1][0]; rT += dt; if (rT > end + 1.2) { endReplay(); return; }
  const t = Math.min(rT, end); while (rp < S.length - 2 && S[rp + 1][0] <= t) rp++;
  const a = S[rp], b = S[rp + 1], span = Math.max(1e-3, b[0] - a[0]), u = clamp((t - a[0]) / span, 0, 1); let dh = b[3] - a[3]; dh = Math.atan2(Math.sin(dh), Math.cos(dh));
  const sp = Math.hypot(b[1] - a[1], b[2] - a[2]) / span;
  car.thr = sp > car.vx + 0.05 ? 1 : 0.15; car.brk = 0; car.vx += (sp - car.vx) * Math.min(1, dt * 8); car.vy = 0; car.r = 0; car.steer = 0;
  car.x = a[1] + (b[1] - a[1]) * u; car.z = a[2] + (b[2] - a[2]) * u; car.h = a[3] + dh * u;
  let sec = SECTIONS[0]; for (const q of SECTIONS) if (car.idx >= q[0]) sec = q; if (car.idx > N - 25) sec = SECTIONS[0];
  $('tvinfo').textContent = 'REPLAY · ' + sec[1] + ' · ' + Math.round(car.vx * 3.6) + ' KM/H'; $('tvtime').textContent = fmt(t);
}
function aimTV(dt) {
  let best = null, bd = 1e9; const here = tun[car.idx];
  for (const c of TVCAMS) { let d = Math.abs(((car.idx - c.i + N * 1.5) % N) - N / 2); if (c.tun !== here) d += N; if (d < bd) { bd = d; best = c; } }
  const cut = best !== tvCam; tvCam = best;
  _v.set(car.x, car.yS + 0.6, car.z); const dist = best.pos.distanceTo(_v);
  if (cut) tvLook.copy(_v); else tvLook.lerp(_v, Math.min(1, dt * (12 + 400 / Math.max(dist, 4))));      // the operator follows a fraction late, but keeps up when the car is close
  const want = clamp(2 * Math.atan(6.5 / Math.max(dist, 4)) * 57.3, 7, 52); tvFov = cut ? want : tvFov + (want - tvFov) * Math.min(1, dt * 2.5);      // zooms in as the car goes away
  camRW.position.copy(best.pos); camRW.position.y += ns(T, 2.1, 3.3, 5.2) * 0.02; camRW.lookAt(tvLook);
  for (const c of [camRW, camRC]) { c.fov = tvFov; c.aspect = camW.aspect; c.updateProjectionMatrix(); }
  camRW.updateMatrixWorld(); carObj.updateMatrixWorld();
  _m4.copy(carObj.matrixWorld).invert().multiply(camRW.matrixWorld).decompose(camRC.position, camRC.quaternion, camRC.scale);      // the same camera, as seen from the car: the car model lives in its own scene
}
// ---------- finish card: a picture of the lap to keep or post ----------
const shot = { game: document.createElement('canvas'), cam: null };
shot.game.width = 1000; shot.game.height = 562;
function grabShot() {
  const src = renderer.domElement, g = shot.game.getContext('2d'), k = Math.max(1000 / src.width, 562 / src.height), w = src.width * k, h = src.height * k;
  g.fillStyle = '#000'; g.fillRect(0, 0, 1000, 562); g.drawImage(src, (1000 - w) / 2, (562 - h) / 2, w, h);
  shot.cam = null;
  if (hand.on) { const c = document.createElement('canvas'); c.width = 480; c.height = 270; const cg = c.getContext('2d'); cg.drawImage($('vbg'), 0, 0, 480, 270); cg.drawImage($('vov'), 0, 0, 480, 270); shot.cam = c; }
}
function makeCard() {
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1350; const g = c.getContext('2d'), F = (px, w) => `${w || 700} ${px}px "Courier New", monospace`;
  g.fillStyle = '#ece8dc'; g.fillRect(0, 0, 1080, 1350); g.drawImage(shot.game, 40, 40);
  if (shot.cam) { g.fillStyle = '#ece8dc'; g.fillRect(588, 344, 464, 270); g.drawImage(shot.cam, 600, 356, 440, 248); }
  const sorted = board.slice().sort((a, b) => a.t - b.t), pos = mine ? sorted.indexOf(mine) + 1 : 0, name = ($('name').value || '').toUpperCase().trim();
  g.fillStyle = '#17181b'; g.textAlign = 'left'; g.font = F(34); g.fillText('G O L D E N   L A P', 40, 700);
  g.font = F(190); g.fillText(fmt(lap.last), 30, 890);
  g.fillStyle = '#b5391a'; g.font = F(40); g.fillText((pos ? `P${pos} OF ${sorted.length}` : 'LAP COMPLETE') + (mine ? ' · ' + ({ phone: 'PHONE, PRO', 'phone-simple': 'PHONE, BEGINNER', hands: 'HANDS, PRO', keys: 'KEYS, PRO', 'keys-simple': 'KEYS, BEGINNER', 'hands-simple': 'HANDS, BEGINNER' }[mine.c] || '') : '') + (daily ? ' · ' + ENV.name : ''), 40, 960);
  g.fillStyle = '#5a6066'; g.font = F(30); if (secRows.length === 3) g.fillText(secRows.map((r, i) => `S${i + 1} ${r.sec.toFixed(3)}`).join('   '), 40, 1020);
  // circuit outline, with the start line marked
  g.save(); g.translate(40, 1060); g.scale(1.9, 1.9); g.strokeStyle = '#17181b'; g.lineWidth = 3; g.lineJoin = 'round'; g.beginPath();
  P.forEach((p, i) => { const [x, y] = mapBase.f(p.x, p.z); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.stroke();
  { const [x, y] = mapBase.f(P[0].x, P[0].z); g.fillStyle = '#c23f1c'; g.beginPath(); g.arc(x, y, 4.5, 0, 7); g.fill(); } g.restore();
  g.textAlign = 'right'; g.fillStyle = '#17181b'; g.font = F(52); g.fillText(name || 'GOLDEN LAP', 1040, 1230);
  g.fillStyle = '#5a6066'; g.font = F(28); g.fillText('golden-lap.space.fast', 1040, 1280); g.fillText(new Date().toISOString().slice(0, 10), 1040, 1180);
  return c;
}
function saveCard() { makeCard().toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'golden-lap-' + fmt(lap.last).replace(/[:.]/g, '-') + '.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }, 'image/png'); }
function readInput(dt) {
  const v = Math.hypot(car.vx, car.vy), ms = maxSteer(v);
  let sIn = (keys.ArrowLeft || keys.KeyA ? 1 : 0) - (keys.ArrowRight || keys.KeyD ? 1 : 0);
  let heavy = false, tIn = keys.ArrowUp || keys.KeyW ? 1 : 0, bIn = keys.ArrowDown || keys.KeyS || keys.Space ? 1 : 0, analog = false;
  const gp = navigator.getGamepads ? [...navigator.getGamepads()].find(g => g) : null;
  if (gp) {
    const ax = Math.abs(gp.axes[0]) > 0.06 ? gp.axes[0] : 0, gt = gp.buttons[7] ? gp.buttons[7].value : 0, gb = gp.buttons[6] ? gp.buttons[6].value : 0;
    if (ax || gt || gb) { sIn = -ax; tIn = gt; bIn = gb; analog = true; }
  }
  if (phone.on && !autopilot) { analog = true; const live = phoneLive(); phone.steer += ((live ? phone.target : 0) - phone.steer) * Math.min(1, dt * 18); sIn = phone.steer * (1 - 0.4 * Math.min(1, v / 85)); heavy = true; bIn = live ? phone.brk : 0; tIn = live && !phone.brk ? 1 : 0; if (mode === 'run') phone.used = true; }
  else if (hand.on && !autopilot) { analog = true; sIn = hand.ok ? hand.steer * (1 - 0.4 * Math.min(1, v / 85)) : 0; heavy = true;      /* the same tilt turns the car less the faster you go, as a real wheel loads up */ tIn = hand.ok ? hand.thr : 0; bIn = hand.ok ? hand.brk : 0; if (mode === 'run') hand.used = true; }
  if (easy && (!autopilot || steerOnly) && mode === 'run') {
    const ub = bIn;      /* what the player is asking of the brake, before Beginner takes the pedals */
    // Simple mode used to hold the car at 90% of the grip limit everywhere, which was safe and dull. Now: flat out on the straights,
    // and in the corners the car carries as much speed as you are showing you can steer. Keep it tidy and the pace climbs towards the
    // limit; run wide, leave the road or touch a barrier and it backs off quickly. The car learns to trust you.
    const tidy = Math.abs(car.lat) < 6.4 && !car.off && car.bump < 0.15;      // on the road and off the barriers is tidy enough
    if (!tidy && easyTidy) easyCeil = Math.max(0.92, easyCeil - 0.02);      // each time you overstep, the car stops short of that pace for the rest of the lap
    easyTidy = tidy; easyPace = clamp(easyPace + (tidy ? 0.009 : -0.14) * dt, 0.88, easyCeil);
    // easyPace runs from 0.88 to 1.0. Shown to the player as 88% to 100%, where 100% is the car's real limit, not the autopilot's.
    const j = (car.idx + 3) % N, u = clamp((easyPace - 0.88) / 0.12, 0, 1), p = (PROF[j] * 0.94 + (PROFX[j] - PROF[j] * 0.94) * u) * ENV.pace;
    const tv = PROFX[j] >= 87.5 ? 999 : p;      // 87.5+ means no corner is limiting: full throttle
    tIn = v < tv ? 1 : 0; bIn = v > tv + 1.5 ? clamp((v - tv) / 6, 0, 1) : 0; easyUsed = true;
    if (ub > 0.5 && car.vx < 4) { tIn = 0; bIn = ub; } }      /* nearly stopped and holding the brake: let it reverse, or a Beginner nose-first in a barrier is stuck for good */
  if (autopilot) {
    const Ld = 7 + 0.42 * v, j = (car.idx + Math.round(Ld / DS)) % N, dx = P[j].x - car.x, dz = P[j].z - car.z;
    const s = Math.sin(car.h), c = Math.cos(car.h), left = -dx * c + dz * s;
    sIn = clamp(Math.atan2(2 * (PH.lf + PH.lr) * left, Ld * Ld) / ms, -1, 1); analog = true;
    const tv = PROF[(car.idx + 3) % N] * 0.94 * ENV.pace;
    if (!steerOnly) { tIn = v < tv ? 1 : 0; bIn = v > tv + 1.5 ? clamp((v - tv) / 6, 0, 1) : 0; }
  }
  gridRev = mode === 'grid' ? (phone.on ? (phoneLive() ? phone.brk : 0) : hand.on ? (hand.ok ? hand.rev || 0 : 0) : tIn) : 0;      // revving on the line: stretch the wheel, or press the throttle key
  if (mode === 'grid') { tIn = 0; bIn = 1; }      /* held on the brake, but the wheel is live: you can feel the steering before the lights go out */
  // Keyboard steering eases in: a tap is a small correction, a held key winds on to full lock. It builds more slowly the faster you go.
  if (!analog) { const dir = Math.sign(sIn); if (dir !== 0 && dir === car.holdDir) car.holdT += dt; else car.holdT = 0; car.holdDir = dir;
    sIn *= Math.pow(Math.min(1, car.holdT / ((0.5 - 0.045 * feel) * (0.5 + 0.9 * Math.min(1, v / 60)))), 1.3); }
  const target = sIn * ms, rate = (heavy ? 8 - 3 * Math.min(1, v / 85) : analog ? 8 : (Math.abs(target) < Math.abs(car.steer) ? 3 : 5)) * ms;
  car.steer = clamp(car.steer + clamp(target - car.steer, -rate * dt, rate * dt), -ms, ms);
  car.thr += clamp(tIn - car.thr, -8 * dt, 6 * dt); car.brk += clamp(bIn - car.brk, -10 * dt, 8 * dt);
}

// ---------- hand control ----------
// The camera watches both hands. Hold them up as if gripping a wheel: the tilt of the line between them steers.
// Holding the wheel up is full throttle; letting it drop is the brake. Video is processed in the browser and never leaves it.
const HANDS_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/';
const hand = { on: false, ok: false, steer: 0, thr: 0, brk: 0, neutral: 0.5, seen: 0, lost: 0, raw: [], used: false, stream: null };
function loadScript(src) { return new Promise((res, rej) => { const el = document.createElement('script'); el.src = src; el.crossOrigin = 'anonymous'; el.onload = res; el.onerror = () => rej(new Error('could not load the hand tracker')); document.head.appendChild(el); }); }
function onHands(res) {
  // Now and then the tracker reports a hand with no finger positions in it. Reading that used to throw on every picture, which froze the steering.
  const whole = ((res && res.multiHandLandmarks) || []).filter(h => h && h.length >= 21 && h[0] && h[5] && h[9] && h[17] && Number.isFinite(h[5].x) && Number.isFinite(h[17].x));
  if (res && res.multiHandLandmarks && whole.length < res.multiHandLandmarks.length) { diag.badHands = (diag.badHands || 0) + 1; if (diag.badHands === 1) note('tracker reported a hand with no positions: ignored'); }
  // How straight the fingers are, as a number from 1 (flat hand) down to about -0.7 (tight fist): the bend at the middle knuckle of
  // each finger, averaged. It is measured in three dimensions, using the tracker's own model of the hand, so it does not change when
  // the hand turns or moves to the edge of the picture. (The first version measured the flat picture, and read a turned hand as a fist.)
  const opens = [];
  { const all = (res && res.multiHandLandmarks) || [], world = (res && res.multiHandWorldLandmarks) || [];
    all.forEach((h2, k) => { if (!whole.includes(h2)) return; const w = world[k] && world[k].length >= 21 ? world[k] : null;
      const P3 = i => w ? [w[i].x, w[i].y, w[i].z] : [h2[i].x * 16 / 9, h2[i].y, (h2[i].z || 0) * 16 / 9];
      let sum = 0, n = 0;
      for (const [a, b, c] of [[5, 6, 8], [9, 10, 12], [13, 14, 16], [17, 18, 20]]) { const A = P3(a), B = P3(b), C = P3(c);
        const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], v2 = [C[0] - B[0], C[1] - B[1], C[2] - B[2]], lu = Math.hypot(...u), lv = Math.hypot(...v2);
        if (lu > 1e-6 && lv > 1e-6) { sum += (u[0] * v2[0] + u[1] * v2[1] + u[2] * v2[2]) / (lu * lv); n++; } }
      if (n) opens.push(sum / n); }); }
  const pts = whole.map(h => ({ x: 1 - (h[5].x + h[17].x) / 2, y: (h[5].y + h[17].y) / 2, low: Math.max(h[0].y, h[5].y, h[17].y) })).sort((a, b) => a.x - b.x);   // the row of knuckles, mirrored so left is left. Knuckles sit higher than the wrist, so they stay in the picture longer as tired arms sink
  hand.raw = pts;
  const now = performance.now(), dth = clamp((now - (hand.t || now)) / 1000, 0.01, 0.2); hand.t = now;
  // How often the tracker answers. If the machine heats up and this falls, steering lags, so the decorative work is shed first.
  hand.hz = hand.hz ? hand.hz + (1 / dth - hand.hz) * 0.05 : 1 / dth;
  hand.slowT = hand.hz < (hand.shed ? 12 : 17) ? (hand.slowT || 0) + dth : 0;
  if (hand.slowT > 3 && (hand.shed || 0) < 2) { hand.shed = (hand.shed || 0) + 1; hand.slowT = 0; if (hand.shed === 2) $('vbg').getContext('2d').clearRect(0, 0, 240, 135); }
  hand.edge = pts.length ? (pts.some(q => q.low > 1.0) ? (hand.edge || 0) + dth : 0) : 0;      // part of a hand is below the bottom of the picture
  const AS = 16 / 9, far = (a, b) => Math.hypot((a.x - b.x) * AS, a.y - b.y);
  let L = null, R = null, guessed = false;
  if (pts.length >= 2) { L = pts[0]; R = pts[pts.length - 1]; hand.C = { x: (L.x + R.x) / 2, y: (L.y + R.y) / 2 }; }
  else if (pts.length === 1 && hand.C && hand.L) {
    // On a big turn one hand often hides the other. Keep steering from the hand that is still visible:
    // work out which hand it is, and assume the other is opposite it across the centre of the wheel.
    const P = pts[0], other = { x: 2 * hand.C.x - P.x, y: 2 * hand.C.y - P.y };
    if (far(P, hand.L) < far(P, hand.R)) { L = P; R = other; } else { R = P; L = other; }
    guessed = true;
  }
  if (L && R) {
    hand.L = L; hand.R = R; hand.lostT = 0;
    const tilt = Math.atan2(R.y - L.y, (R.x - L.x) * AS);                        // right hand higher = turning left
    const lock = 0.86 - 0.065 * feel;      // radians of tilt for full lock: 34 degrees at the default feel of 4, 16 at feel 9, 46 at feel 1 ([ and ] change it)
    let st = -tilt / lock; st = Math.sign(st) * Math.pow(Math.min(1, Math.max(0, Math.abs(st) - 0.08) / 0.92), 1.5);   // a bigger dead zone and a softer centre than before: small wobbles do little
    hand.steer += (st - hand.steer) * 0.4;
    if (!guessed) {
      const settle = (mode !== 'run' && !checking) || hand.seen < 12;
      // How far apart the hands are. This is now only used on the grid, where pulling them apart revs the engine.
      const wide = far(L, R);
      const blip = mode === 'grid' && hand.seen >= 12 && hand.wide && wide > hand.wide * 1.06;      // on the grid, pulling your hands apart revs the engine instead of resetting your grip width
      if (blip) hand.wide += (wide - hand.wide) * Math.min(1, dth / 6);
      else if (settle || !hand.wide) hand.wide = (hand.wide || wide) + (wide - (hand.wide || wide)) * Math.min(1, dth / 0.25);      // your normal grip width
      else if (wide > hand.wide * 0.88) hand.wide += (wide - hand.wide) * Math.min(1, dth / 2);
      const grip = wide / hand.wide, squeeze = clamp((0.8 - grip) / 0.22, 0, 1);
      // Brake 2: dip. Drop your hands below where they rest. Only used when there is room below them in the picture.
      const mid = hand.C.y, off = mid - hand.neutral;
      if (settle) hand.neutral += off * Math.min(1, dth / 0.25);                                       // before the start: wherever you hold the wheel is flat out
      else if (off < 0) hand.neutral += off * Math.min(1, dth / 3);                                    // hands raised: still flat out
      else if (off < 0.09) { hand.neutral += off * Math.min(1, dth / 1.5); hand.low = 0; }             // sagging lower: follow, slowly
      else { hand.low = (hand.low || 0) + dth; if (hand.low > 2.5) hand.neutral += off * Math.min(1, dth / 0.4); }
      hand.seen++;
      hand.rev = mode === 'grid' ? clamp((grip - 1.06) / 0.28, 0, 1) : 0;
      hand.room = false;
    }
    // Brake: clench your fists, as you would squeeze a real wheel when you stamp on the pedal. How far apart the hands are no longer
    // does anything, so drifting hands cannot lift the throttle or brake by accident. The game learns how you normally hold your
    // hands (most people already have them half closed) and measures the clench from there.
    if (opens.length) { const o = opens.reduce((a, b) => a + b, 0) / opens.length, least = Math.max(...opens);      // least = the more open of the two hands
      hand.open = hand.open != null ? hand.open + (o - hand.open) * 0.5 : o; hand.least = hand.least != null ? hand.least + (least - hand.least) * 0.5 : least;
      const learn = (mode !== 'run' && !checking) || hand.seen < 12;
      if (hand.rest == null || learn) hand.rest = (hand.rest == null ? hand.open : hand.rest) + (hand.open - (hand.rest == null ? hand.open : hand.rest)) * Math.min(1, dth / 0.3);
      else hand.rest += (hand.open - hand.rest) * Math.min(1, dth / (hand.open > hand.rest ? 1.5 : 10));      // opening up is believed quickly; a clench is not mistaken for a new normal
      // Both fists have to close: the brake follows the more open hand, so one hand misread for a moment cannot brake the car.
      const c = clamp((hand.rest - hand.least) / Math.max(0.45, hand.rest + 0.6), 0, 1);                      // 0 = your normal grip, 1 = a tight fist
      hand.brk = clamp((c - 0.4) / 0.45, 0, 1); hand.thr = 1 - clamp((c - 0.2) / 0.2, 0, 1); }                  // a clear clench lifts off, more brakes, progressively
    else { hand.brk = 0; hand.thr = 1; }
    hand.ok = true;
  } else {
    hand.lostT = (hand.lostT || 0) + dth;                                        // nothing visible: hold what you were doing for a moment, then let go gently
    if (hand.lostT > 0.8) { hand.steer *= Math.exp(-dth * 3); hand.thr = 0; hand.brk = 0; if (hand.lostT > 1.6) hand.ok = false; }
  }
  const W = 240, H = 135, c = $('vov').getContext('2d'); c.clearRect(0, 0, W, H);
  drawDriver(c, W, H, whole);
  c.strokeStyle = c.fillStyle = !hand.ok ? '#888' : hand.brk > 0.05 && !easy ? '#ff4a3a' : guessed || !L ? '#ff9a3a' : '#f3e36b'; c.lineWidth = 3;
  if (hand.L && hand.R && hand.ok) {      // a steering wheel between the hands; its colour is the state
    let ax = hand.L.x * W, ay = hand.L.y * H, bx = hand.R.x * W, by = hand.R.y * H; const cx = (ax + bx) / 2, cy = (ay + by) / 2, col = c.strokeStyle; let r = Math.hypot(bx - ax, by - ay) / 2;
    if (easy) { if (!hand.wr || hand.seen < 12) hand.wr = r; hand.wr += (r - hand.wr) * 0.01; const k = hand.wr / Math.max(r, 1e-3);      // simple mode: grip width does nothing, so the wheel keeps one size and only tilts
      ax = cx + (ax - cx) * k; ay = cy + (ay - cy) * k; bx = cx + (bx - cx) * k; by = cy + (by - cy) * k; r = hand.wr; } else hand.wr = 0;
    c.lineWidth = 7; c.strokeStyle = 'rgba(16,16,18,.85)'; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke(); c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke();
    c.lineWidth = 2; c.strokeStyle = col; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke(); c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke();
    c.fillStyle = '#101012'; c.beginPath(); c.arc(cx, cy, Math.max(4, r * 0.22), 0, 7); c.fill(); c.fillStyle = col; }
  $('camt').textContent = !hand.ok ? (hand.lostT > 4 ? 'NO HANDS IN VIEW: SIT BACK A LITTLE' : 'SHOW BOTH HANDS') : hand.edge > 1 ? 'HANDS TOO LOW: LIFT THEM A LITTLE' : hand.hz < 9 ? 'CAMERA TRACKING IS SLOW' : !L ? 'HOLDING' : guessed ? 'ONE HAND' : easy ? 'TILT TO STEER' : hand.brk > 0.05 ? 'BRAKING' : hand.thr > 0.5 ? 'TILT TO STEER' : 'COASTING';
}
// Cut the player out of their room and put them at the circuit: a painted backdrop in the game's own colours.
const seg = { s: null, failed: false, n: 0, bg: null };
const SEG_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/';
function paintBackdrop() {
  const cv = document.createElement('canvas'); cv.width = 240; cv.height = 135; const g = cv.getContext('2d'), W = 240, H = 135, cx = W / 2;
  let rs = 7; const rnd = () => (rs = (rs * 16807) % 2147483647) / 2147483647;
  const sky = g.createLinearGradient(0, 0, 0, 60); sky.addColorStop(0, '#9fc3cf'); sky.addColorStop(1, '#e6dcc0'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) { const x = rnd() * W, r = 5 + rnd() * 8; g.fillStyle = ['#5f7f52', '#6f8c58', '#4f6f4a'][i % 3]; g.beginPath(); g.arc(x, 50 - rnd() * 6, r, 0, 7); g.fill(); }      // trees behind
  g.fillStyle = '#79a05c'; g.fillRect(0, 52, W, H); g.fillStyle = '#8a8c88'; g.beginPath(); g.moveTo(cx - 14, 52); g.lineTo(cx + 14, 52); g.lineTo(W + 40, H); g.lineTo(-40, H); g.fill();      // the road falling away behind the car
  g.fillStyle = '#5c5e5c'; g.beginPath(); g.moveTo(cx - 3, 52); g.lineTo(cx + 3, 52); g.lineTo(cx + 40, H); g.lineTo(cx - 40, H); g.fill();      // rubber line
  // rear wing
  g.fillStyle = '#111114'; g.fillRect(cx - 62, 30, 4, 34); g.fillRect(cx + 58, 30, 4, 34); g.fillRect(cx - 60, 32, 120, 9); g.fillStyle = '#c23f1c'; g.fillRect(cx - 58, 34, 116, 3);
  g.fillStyle = '#111114'; g.fillRect(cx - 60, 46, 120, 5); g.fillRect(cx - 4, 41, 8, 30);
  // rear tyres
  for (const sx of [-1, 1]) { g.fillStyle = '#18181a'; g.beginPath(); g.ellipse(cx + sx * 88, 78, 24, 27, 0, 0, 7); g.fill(); g.strokeStyle = '#2c2c2e'; g.lineWidth = 2; g.beginPath(); g.ellipse(cx + sx * 88, 78, 15, 18, 0, 0, 7); g.stroke(); }
  // engine cover and airbox behind the head
  g.fillStyle = '#17171a'; g.beginPath(); g.moveTo(cx - 70, H); g.lineTo(cx - 56, 78); g.quadraticCurveTo(cx - 30, 58, cx - 20, 30); g.quadraticCurveTo(cx, 12, cx + 20, 30); g.quadraticCurveTo(cx + 30, 58, cx + 56, 78); g.lineTo(cx + 70, H); g.fill();
  g.fillStyle = '#060607'; g.beginPath(); g.ellipse(cx, 27, 11, 8, 0, 0, 7); g.fill();      // air intake
  g.strokeStyle = '#b89a3c'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(cx - 56, 80); g.quadraticCurveTo(cx - 30, 60, cx - 21, 34); g.moveTo(cx + 56, 80); g.quadraticCurveTo(cx + 30, 60, cx + 21, 34); g.stroke();      // gold pinstripe
  g.fillStyle = '#2a2a2e'; g.beginPath(); g.moveTo(cx - 30, H); g.quadraticCurveTo(cx - 34, 70, cx, 62); g.quadraticCurveTo(cx + 34, 70, cx + 30, H); g.fill();      // headrest
  // cockpit sides and mirrors
  g.fillStyle = '#111114'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, 112); g.quadraticCurveTo(50, 100, cx - 46, 118); g.lineTo(cx - 40, H); g.fill();
  g.beginPath(); g.moveTo(W, H); g.lineTo(W, 112); g.quadraticCurveTo(W - 50, 100, cx + 46, 118); g.lineTo(cx + 40, H); g.fill();
  for (const sx of [-1, 1]) { g.strokeStyle = '#111114'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx + sx * 80, 110); g.lineTo(cx + sx * 96, 92); g.stroke(); g.fillStyle = '#111114'; g.fillRect(cx + sx * 96 - 11, 84, 22, 12); g.fillStyle = '#b9c6cc'; g.fillRect(cx + sx * 96 - 9, 86, 18, 8); }
  return cv;
}
function onSeg(res) {
  const g = $('vbg').getContext('2d'), W = 240, H = 135;
  g.save(); g.clearRect(0, 0, W, H); g.translate(W, 0); g.scale(-1, 1);
  g.filter = 'blur(1.5px)'; g.drawImage(res.segmentationMask, 0, 0, W, H); g.filter = 'none';
  g.globalCompositeOperation = 'source-in'; g.drawImage(res.image, 0, 0, W, H); g.restore();
  g.globalCompositeOperation = 'destination-over'; g.drawImage(selfie.ready ? selfie.cv : seg.bg || (seg.bg = paintBackdrop()), 0, 0); g.globalCompositeOperation = 'source-over';
  g.fillStyle = 'rgba(236,230,204,.14)'; g.fillRect(0, 0, W, H);      // the same warm haze as the main picture, over player and car alike
}
async function startSeg() {
  if (seg.s || seg.failed) return;
  try { if (!window.SelfieSegmentation) await loadScript(SEG_CDN + 'selfie_segmentation.js');
    const d = new window.SelfieSegmentation({ locateFile: f => SEG_CDN + f }); d.setOptions({ modelSelection: 1 }); d.onResults(onSeg); seg.s = d;
  } catch (e) { seg.failed = true; }      // the plain camera picture stays
}
// Dress the player as the driver: the car's helmet over their head (their eyes show through the visor) and its gloves over their hands.
const face = { f: null, t: 0, det: null, busy: false, n: 0, failed: false };
const FACE_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1646425229/';
const FINGERS = [[0, 1, 2, 3, 4], [0, 5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [0, 17, 18, 19, 20], [5, 9, 13, 17]];
function onFace(res) {
  const d = res.detections && res.detections[0]; if (!d || !d.landmarks || d.landmarks.length < 2) return;
  const a = d.landmarks[0], b = d.landmarks[1];      // the two eyes
  const n = { x: 1 - (a.x + b.x) / 2, y: (a.y + b.y) / 2, w: Math.hypot((a.x - b.x) * 16 / 9, a.y - b.y), ang: Math.atan2((a.y - b.y) * Math.sign(a.x - b.x) * -1, Math.abs(a.x - b.x) * 16 / 9) };
  if (face.f && performance.now() - face.t < 1000) { const k = 0.5; face.f.x += (n.x - face.f.x) * k; face.f.y += (n.y - face.f.y) * k; face.f.w += (n.w - face.f.w) * k; face.f.ang += (n.ang - face.f.ang) * k; }
  else face.f = n;
  face.t = performance.now();
}
async function startFace() {
  if (face.det || face.failed) return;
  try { if (!window.FaceDetection) await loadScript(FACE_CDN + 'face_detection.js');
    const d = new window.FaceDetection({ locateFile: f => FACE_CDN + f }); d.setOptions({ model: 'short', minDetectionConfidence: 0.5 }); d.onResults(onFace); face.det = d;
  } catch (e) { face.failed = true; }      // no helmet, but the driving is unaffected
}
function drawDriver(c, W, H, hands) {
  // gloves: thick strokes along every finger
  for (const h of hands) {
    const px = i => (1 - h[i].x) * W, py = i => h[i].y * H, size = Math.hypot(px(0) - px(9), py(0) - py(9));
    c.lineCap = c.lineJoin = 'round';
    for (const [lw, col] of [[size * 0.36, '#3a3a38'], [size * 0.27, '#8d8d88']]) { c.lineWidth = Math.max(2, lw); c.strokeStyle = col;
      for (const f of FINGERS) { c.beginPath(); c.moveTo(px(f[0]), py(f[0])); for (let k = 1; k < f.length; k++) c.lineTo(px(f[k]), py(f[k])); c.stroke(); } }
    c.fillStyle = '#8d8d88'; c.beginPath(); c.moveTo(px(0), py(0)); for (const i of [5, 9, 13, 17]) c.lineTo(px(i), py(i)); c.closePath(); c.fill();
    c.strokeStyle = '#c23f1c'; c.lineWidth = Math.max(2, size * 0.16); c.beginPath(); c.moveTo(px(5), py(5)); c.lineTo(px(17), py(17)); c.stroke();      // red knuckle band
  }
  c.lineCap = 'butt'; c.lineJoin = 'miter';
  const f = face.f; if (!f || performance.now() - face.t > 1500) return;
  const e = f.w * H;      // distance between the eyes, in pixels: everything else is sized from it
  c.save(); c.translate(f.x * W, f.y * H); c.rotate(f.ang);
  const rx = e * 1.75, ry = e * 2.15, cy = e * 0.15;
  c.fillStyle = '#b9b5a9'; c.beginPath(); c.ellipse(0, cy, rx, ry, 0, 0, 7); c.fill();
  c.save(); c.beginPath(); c.ellipse(0, cy, rx, ry, 0, 0, 7); c.clip();
  c.fillStyle = '#c23f1c'; c.fillRect(-rx, cy - ry * 0.74, rx * 2, ry * 0.26);      // the same bands as the helmet in the car's mirrors
  c.fillStyle = '#1d6f7a'; c.fillRect(-rx, cy - ry * 0.42, rx * 2, ry * 0.1);
  c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-rx, cy + ry * 0.55, rx * 2, ry);      // chin bar shading
  { const sh = c.createRadialGradient(-rx * 0.35, cy - ry * 0.55, rx * 0.1, 0, cy, ry * 1.15); sh.addColorStop(0, 'rgba(255,255,255,.45)'); sh.addColorStop(0.35, 'rgba(255,255,255,0)'); sh.addColorStop(0.7, 'rgba(0,0,0,.08)'); sh.addColorStop(1, 'rgba(0,0,0,.5)'); c.fillStyle = sh; c.fillRect(-rx, cy - ry, rx * 2, ry * 2); }      // rounded: lit from above, dark at the edges
  c.restore();
  const vw = rx * 0.84, vh = e * 0.5, vr = vh * 0.7;      // visor opening: your own eyes stay visible through it
  const visor = () => { c.beginPath(); c.moveTo(-vw + vr, -vh); c.lineTo(vw - vr, -vh); c.quadraticCurveTo(vw, -vh, vw, -vh + vr); c.lineTo(vw, vh - vr); c.quadraticCurveTo(vw, vh, vw - vr, vh); c.lineTo(-vw + vr, vh); c.quadraticCurveTo(-vw, vh, -vw, vh - vr); c.lineTo(-vw, -vh + vr); c.quadraticCurveTo(-vw, -vh, -vw + vr, -vh); c.closePath(); };
  c.globalCompositeOperation = 'destination-out'; visor(); c.fill(); c.globalCompositeOperation = 'source-over';
  c.fillStyle = 'rgba(20,24,40,.28)'; visor(); c.fill(); c.strokeStyle = '#0d0d10'; c.lineWidth = Math.max(1.5, e * 0.12); visor(); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-vw * 0.8, -vh * 0.55); c.lineTo(vw * 0.1, -vh * 0.55); c.stroke();
  c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1; c.beginPath(); c.ellipse(0, cy, rx, ry, 0, 0, 7); c.stroke();
  c.restore();
}
// Software cannot tilt a camera, but it can use a different one: a phone propped low, an external webcam, or a desk-view camera.
function say(text) { $('flash').textContent = text; $('flash').className = 'plain'; $('flash').style.display = 'block'; flashT = 3; }
async function openCam(deviceId) {
  if (hand.stream) hand.stream.getTracks().forEach(t => t.stop());
  const want = { width: 640, height: 360, aspectRatio: 16 / 9 }; let stream;      // the full width of the sensor: hands sit out at the sides
  try { stream = await navigator.mediaDevices.getUserMedia({ video: deviceId ? Object.assign({ deviceId: { exact: deviceId } }, want) : Object.assign({ facingMode: 'user' }, want), audio: false }); }
  catch (e) { if (!deviceId) throw e; stream = await navigator.mediaDevices.getUserMedia({ video: want, audio: false }); }      // the remembered camera is gone: fall back to the default
  const v = $('vid'); v.srcObject = stream; await v.play(); hand.stream = stream;
  { const tr0 = stream.getVideoTracks()[0]; tr0.addEventListener('ended', () => note('camera track ended')); tr0.addEventListener('mute', () => note('camera track muted by the system')); tr0.addEventListener('unmute', () => note('camera track unmuted')); }
 
  hand.cams = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'videoinput');
  const id = stream.getVideoTracks()[0].getSettings().deviceId;
  hand.camIdx = Math.max(0, hand.cams.findIndex(d => d.deviceId === id)); hand.C = null; hand.L = null; hand.seen = 0; hand.wide = 0;
  // Auto-framing (Apple calls it Centre Stage) zooms in on the face and crops the hands out. A web page cannot switch it off on a Mac,
  // but where the browser reports it we try, and otherwise we tell the player.
  try { const tr = stream.getVideoTracks()[0], caps = tr.getCapabilities ? tr.getCapabilities() : {};
    if (caps.faceFraming && caps.faceFraming.includes(false) && tr.getSettings().faceFraming) await tr.applyConstraints({ advanced: [{ faceFraming: false }] });
    hand.framed = tr.getSettings().faceFraming === true; } catch (e) { hand.framed = false; }
  if (hand.framed) say('CENTRE STAGE IS ON: TURN IT OFF IN THE CAMERA MENU');
  if (hand.cams.length > 1) say('CAMERA ' + (hand.camIdx + 1) + ' OF ' + hand.cams.length + ': ' + ((hand.cams[hand.camIdx] || {}).label || 'unnamed').toUpperCase().slice(0, 34));
}
async function nextCam() {
  if (!hand.on) return;
  if (!hand.cams || hand.cams.length < 2) { say('ONLY ONE CAMERA FOUND'); return; }
  const d = hand.cams[(hand.camIdx + 1) % hand.cams.length];
  try { await openCam(d.deviceId); localStorage.setItem('goldenlap.cam', d.deviceId); } catch (e) { say('COULD NOT OPEN THAT CAMERA'); }
}
// ---------- keeping camera steering alive ----------
// Three things can stop it without any error reaching the player: the tracker throws or hangs, the camera stops delivering pictures
// (another app takes it, the lid half-closes, the system pauses it), or one of the decorative trackers hangs and blocks the queue.
// Each is now timed, logged and recovered from. The I key shows a diagnostics panel; it is not advertised to players.
const diag = { log: [], errs: 0, lastErr: '', restarts: 0, camRestarts: 0, show: false, fps: 60 };
function note(msg) { const t = new Date().toTimeString().slice(0, 8); diag.log.push(t + ' ' + msg); if (diag.log.length > 40) diag.log.shift(); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const timed = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('no answer in ' + ms + ' ms')), ms))]);
async function runTracker(gen) {
  const v = $('vid'); let h;
  try { if (!window.Hands) await loadScript(HANDS_CDN + 'hands.js');
    h = new window.Hands({ locateFile: f => HANDS_CDN + f });
    h.setOptions({ maxNumHands: 2, modelComplexity: 0, minDetectionConfidence: 0.5, minTrackingConfidence: 0.4 }); h.onResults(onHands);
  } catch (e) { note('tracker failed to start: ' + (e && e.message)); diag.errs++; diag.lastErr = String(e && e.message); return; }
  let bad = 0;
  const make = () => { const n = new window.Hands({ locateFile: f => HANDS_CDN + f }); n.setOptions({ maxNumHands: 2, modelComplexity: 0, minDetectionConfidence: 0.5, minTrackingConfidence: 0.4 }); n.onResults(onHands); return n; };
  while (hand.on && hand.gen === gen) {
    try { await timed(h.send({ image: v }), 2000); bad = 0; }
    catch (e) { diag.errs++; diag.lastErr = String(e && e.message || e);
      if (++bad === 1) { const at = String(e && e.stack || '').split('\n').slice(1, 3).map(l => l.trim().replace(/^at /, '').replace(/https?:\/\/[^/]+\//, '').slice(0, 70)).join(' < '); note('hand tracker error: ' + diag.lastErr + (at ? ' @ ' + at : '')); }
      if (bad >= 3) { try { h.close(); } catch (err) {} try { h = make(); diag.restarts++; note('hand tracker rebuilt after ' + bad + ' errors in a row'); } catch (err) { note('rebuild failed: ' + (err && err.message)); } bad = 0; hand.t = performance.now(); hand.fixAt = performance.now(); }      // three bad pictures running: do not wait for the watchdog
      await sleep(40); }
    // The helmet and the cut-out are decoration. If either throws or hangs it is switched off, never allowed to hold up the steering.
    if (face.det && ++face.n % [4, 12, 24][hand.shed || 0] === 0) { try { await timed(face.det.send({ image: v }), 1200); } catch (e) { note('helmet tracker switched off: ' + (e && e.message)); face.det = null; face.failed = true; } }
    if (seg.s && (hand.shed || 0) < 2 && ++seg.n % [2, 6, 1][hand.shed || 0] === 0) { try { await timed(seg.s.send({ image: v }), 1200); } catch (e) { note('cut-out switched off: ' + (e && e.message)); seg.s = null; seg.failed = true; $('vbg').getContext('2d').clearRect(0, 0, 240, 135); } }
    await sleep(12);
  }
  try { h.close(); } catch (e) {}
}
async function startHands() {
  $('cam').style.display = 'block'; $('camt').textContent = 'STARTING CAMERA';
  let saved = null; try { saved = localStorage.getItem('goldenlap.cam'); } catch (e) {}
  await openCam(saved);
  hand.on = true; hand.seen = 0; hand.t = performance.now(); hand.vt = -1; hand.vtAt = performance.now(); hand.gen = (hand.gen || 0) + 1; hand.fixAt = performance.now();
  startFace(); startSeg(); note('camera steering started'); runTracker(hand.gen);
}
// Called every frame. Notices silence within about half a second, lets go of the wheel, and restarts whatever stopped.
function watchHands(dt) {
  diag.fps += (1 / Math.max(dt, 1e-3) - diag.fps) * 0.05;
  if (!hand.on) return; const now = performance.now(), v = $('vid'), tr = hand.stream && hand.stream.getVideoTracks()[0];
  if (v.currentTime !== hand.vt) { hand.vt = v.currentTime; hand.vtAt = now; }      // is the camera still delivering new pictures?
  const quiet = now - (hand.t || now), frozen = now - hand.vtAt, camBad = !tr || tr.readyState !== 'live' || tr.muted || frozen > 1500;
  hand.stalled = quiet > 600 || frozen > 800;
  if (hand.stalled) { hand.ok = false; hand.steer *= Math.exp(-dt * 4); hand.thr = 0; hand.brk = 0; $('camt').textContent = camBad ? 'CAMERA STOPPED: RESTARTING' : 'TRACKING STOPPED: RESTARTING'; }
  if ((quiet > 2500 || camBad) && now - hand.fixAt > 4000) { hand.fixAt = now;
    if (camBad) { diag.camRestarts++; note('camera restarted (' + (!tr ? 'no track' : tr.readyState !== 'live' ? 'track ended' : tr.muted ? 'track muted' : 'picture frozen ' + Math.round(frozen) + ' ms') + ')');
      let saved = null; try { saved = localStorage.getItem('goldenlap.cam'); } catch (e) {} openCam(saved).then(() => { hand.vtAt = performance.now(); }).catch(e => note('camera would not reopen: ' + (e && e.message))); }
    if (quiet > 2500) { diag.restarts++; note('hand tracker restarted after ' + Math.round(quiet) + ' ms of silence'); hand.gen++; hand.t = now; runTracker(hand.gen); }
  }      // the panel no longer opens by itself: it is for whoever is debugging, on the I key
  if (diag.show && (diag.n = (diag.n || 0) + 1) % 10 === 0) $('dbg').textContent =
    `CAMERA STEERING DIAGNOSTICS (I hides)\ntracker answers  ${hand.hz ? hand.hz.toFixed(0) : '-'}/s   last ${Math.round(quiet)} ms ago   hands seen ${hand.raw ? hand.raw.length : 0}   ok ${hand.ok}\n` +
    `camera           ${tr ? tr.readyState + (tr.muted ? ' MUTED' : '') : 'none'}   new picture ${Math.round(frozen)} ms ago   ${v.videoWidth}x${v.videoHeight}\n` +
    `bad hands ignored ${diag.badHands || 0}   errors ${diag.errs}${diag.lastErr ? ' (' + diag.lastErr.slice(0, 60) + ')' : ''}   tracker restarts ${diag.restarts}   camera restarts ${diag.camRestarts}   load shed ${hand.shed || 0}   helmet ${face.det ? 'on' : 'off'}   cut-out ${seg.s ? 'on' : 'off'}\n` +
    `fingers straight ${(hand.open || 0).toFixed(2)}  more open hand ${(hand.least || 0).toFixed(2)}  normal ${(hand.rest || 0).toFixed(2)}   game ${diag.fps.toFixed(0)} fps   mode ${mode}   autopilot ${autopilot}   steer ${hand.steer.toFixed(2)}  thr ${(hand.thr || 0).toFixed(2)}  brk ${(hand.brk || 0).toFixed(2)}\n` + diag.log.slice(-7).join('\n');
}
function stopHands() { hand.on = false; hand.ok = false; if (hand.stream) hand.stream.getTracks().forEach(t => t.stop()); hand.stream = null; $('cam').style.display = 'none'; $('vbg').getContext('2d').clearRect(0, 0, 240, 135); }

// ---------- audio ----------
// The whole mix is synthesised per sample in an AudioWorklet, then pushed through an "onboard microphone" chain.
const snd = {};
let lastLight = null;
// Start-light tones, like the timing beeps on a TV broadcast: three short low ones, then a long high one for GO.
function beep(go) {
  const AC = snd.ac; if (!AC || muted || AC.state !== 'running') return;
  const t = AC.currentTime + 0.01, dur = go ? 0.7 : 0.16, g = AC.createGain(), out = snd.master || AC.destination;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(go ? 0.5 : 0.4, t + 0.008); g.gain.setValueAtTime(go ? 0.5 : 0.4, t + dur - 0.05); g.gain.linearRampToValueAtTime(0, t + dur);
  for (const [f, type, lvl] of [[go ? 1320 : 660, 'sine', 1], [go ? 2640 : 1320, 'triangle', 0.25]]) { const o = AC.createOscillator(), og = AC.createGain(); o.type = type; o.frequency.value = f; og.gain.value = lvl * (snd.master ? 1 : 0.5); o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + 0.02); }
  g.connect(out);
}
const WORKLET = `
class Onboard extends AudioWorkletProcessor {
  constructor() {
    super();
    this.p = { rpm: 3500, thr: 0, v: 0, slip: 0, off: 0, kerb: 0, bump: 0, shift: 0, eng: 1 };
    this.s = { rpm: 3500, thr: 0, v: 0, slip: 0, off: 0, kerb: 0 };
    this.ph = 0; this.amp = new Float32Array(12).fill(1); this.pop = 0; this.wph = 0; this.kph = 0; this.buf = 0;
    this.wl = 0; this.gl = 0; this.kl = 0; this.y1 = 0; this.y2 = 0; this.thud = 0; this.tph = 0; this.clunk = 0; this.cl = 0;
    this.port.onmessage = e => { const d = e.data; if (d.bump > 0.2) this.thud = Math.max(this.thud, d.bump); if (d.shift) this.clunk = 1; Object.assign(this.p, d); };
  }
  process(_, out) {
    const o = out[0][0], sr = sampleRate, p = this.p, s = this.s, TAU = 6.283185307;
    for (let i = 0; i < o.length; i++) {
      s.rpm += (p.rpm - s.rpm) * 0.0012; s.thr += (p.thr - s.thr) * 0.006; s.v += (p.v - s.v) * 0.0008;
      s.slip += (p.slip - s.slip) * 0.002; s.off += (p.off - s.off) * 0.002; s.kerb += (p.kerb - s.kerb) * 0.004;
      // engine: twelve cylinders, each a decaying exhaust pulse, one firing cycle = two crank revolutions
      this.ph += s.rpm * 0.66 / 120 / sr;                                 // 0.66 = pitch trim; James found the first version too high
      if (this.ph >= 1) { this.ph -= 1; for (let k = 0; k < 12; k++) this.amp[k] = 0.8 + Math.random() * 0.4; }   // combustion never repeats exactly
      const sharp = 24 + s.thr * 52;
      let e = 0;
      for (let k = 0; k < 12; k++) { let x = this.ph - k / 12; if (x < 0) x += 1; e += this.amp[k] * Math.exp(-x * sharp); }
      e = e * sharp / 30 - 0.4;
      const n = Math.random() * 2 - 1;
      e *= 1 + n * (0.12 + 0.3 * s.thr);                                   // intake and exhaust hiss riding on the pulses
      if (s.thr < 0.12 && s.rpm > 6000 && Math.random() < 16 / sr) this.pop = 0.7 + Math.random() * 0.6;   // overrun crackle
      this.pop *= 0.9982; e += this.pop * n * 1.6;
      e *= 0.22 + 0.78 * s.thr * s.thr + 0.1 * s.rpm / 13000;
      // straight-cut gear whine follows road speed
      this.wph += s.v * 19 / sr; if (this.wph > 1) this.wph -= 1;
      const whine = (Math.sin(TAU * this.wph) + 0.5 * Math.sin(TAU * this.wph * 1.5)) * 0.05 * Math.min(1, s.v / 25);
      // wind over the mic, with buffeting
      this.buf += (Math.random() - 0.5) * 0.002; this.buf *= 0.9995;
      this.wl += (n - this.wl) * 0.12;
      const sv = s.v / 90, wind = this.wl * sv * sv * (1.3 + this.buf * 30);
      // tyres: a ringing band of noise when sliding
      const sq = Math.max(0, Math.min(1, (s.slip - 0.085) * 7)) * (1 - s.off) * Math.min(1, s.v / 15);
      const y = n * 0.05 + 1.936 * this.y1 - 0.992 * this.y2; this.y2 = this.y1; this.y1 = y;
      // kerbs thump at stripe rate, grass is a low rumble
      this.kph += s.v / 2.5 / sr; if (this.kph > 1) this.kph -= 1;
      this.kl += ((this.kph < 0.5 ? 1 : -1) - this.kl) * 0.03;
      this.gl += (n - this.gl) * 0.015;
      const rumble = this.kl * s.kerb * 0.5 + this.gl * s.off * Math.min(1, s.v / 20) * 5;
      // impacts and gearbox clunk
      this.tph += 70 / sr; this.thud *= 0.9993; this.clunk *= 0.996; this.cl += (n - this.cl) * 0.2;
      o[i] = e * 0.55 * p.eng + whine + wind + y * sq * 0.9 + rumble + Math.sin(TAU * this.tph) * this.thud * 0.8 + this.cl * this.clunk * 0.5;
    }
    return true;
  }
}
registerProcessor('onboard', Onboard);`;
async function initAudio() {
  const AC = snd.ac = new (window.AudioContext || window.webkitAudioContext)();
  await AC.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' })));
  snd.node = new AudioWorkletNode(AC, 'onboard', { numberOfInputs: 0, outputChannelCount: [1] });
  const bq = (type, f, q, g) => { const b = AC.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; if (g) b.gain.value = g; return b; };
  // onboard mic and TV sound chain: thin, peaky, overdriven, band-limited, squashed
  const ws = AC.createWaveShaper(), cv = new Float32Array(1024);
  for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; cv[i] = Math.tanh(x * 3.2) * 0.9 + 0.1 * Math.tanh(x * 12); }
  ws.curve = cv; ws.oversample = '2x';
  const comp = AC.createDynamicsCompressor(); comp.threshold.value = -24; comp.ratio.value = 10; comp.attack.value = 0.002; comp.release.value = 0.12;
  snd.master = AC.createGain(); snd.master.gain.value = muted ? 0 : 0.5;
  const chain = [snd.node, bq('highpass', 150, 0.7), bq('peaking', 620, 1.3, 8), bq('peaking', 1700, 1.8, 6), ws, bq('lowpass', 4200, 0.8), bq('highpass', 110, 0.7), comp, snd.master, AC.destination];
  for (let i = 0; i < chain.length - 1; i++) chain[i].connect(chain[i + 1]);
  // echo off hard walls: three feedback delays, opened up in the tunnel and a little between the buildings
  snd.wet = AC.createGain(); snd.wet.gain.value = 0; comp.connect(snd.wet);
  for (const [d, fb] of [[0.043, 0.62], [0.067, 0.58], [0.101, 0.5]]) {
    const dl = AC.createDelay(0.5), g = AC.createGain(), l = bq('lowpass', 2600, 0.5); dl.delayTime.value = d; g.gain.value = fb;
    snd.wet.connect(dl); dl.connect(l); l.connect(g); g.connect(dl); l.connect(snd.master);
  }
  // Recorded engine: four loops generated with ElevenLabs sound effects (low, mid, high revs on throttle, and off-throttle).
  // Each loop has a measured pitch, so it is given the engine speed that pitch stands for and is then sped up or slowed to follow the revs.
  snd.useSamples = true;
  (async () => {
    const refs = { low: 5040, mid: 6130, midhigh: 10090, high: 11500, coast: 4960 }, smp = {};
    const bus = AC.createGain(); bus.gain.value = 0;
    const sc = AC.createDynamicsCompressor(); sc.threshold.value = -18; sc.ratio.value = 6; sc.attack.value = 0.003; sc.release.value = 0.15;
    const out = AC.createGain(); out.gain.value = 1.5;
    snd.shelf = bq('lowshelf', 180, 0.7);      // bass lift that grows with speed
    bus.connect(snd.shelf).connect(bq('highpass', 55, 0.7)).connect(bq('lowpass', 7000, 0.7)).connect(sc).connect(out); out.connect(snd.master); out.connect(snd.wet);
    for (const k of Object.keys(refs)) {
      const url = window.GL_SOUNDS && window.GL_SOUNDS[k] ? 'data:audio/mpeg;base64,' + window.GL_SOUNDS[k] : 'sounds/' + k + '.mp3';
      const buf = await AC.decodeAudioData(await (await fetch(url)).arrayBuffer());
      const src = AC.createBufferSource(), g = AC.createGain(); src.buffer = buf; src.loop = true; g.gain.value = 0; src.connect(g); g.connect(bus); src.start(0, Math.random() * buf.duration);
      smp[k] = { src, g, ref: refs[k] };
    }
    // The idle throb, kept alive at speed: the low-rev loop played an octave under the engine's real pitch.
    { const src = AC.createBufferSource(), g = AC.createGain(); src.buffer = smp.low.src.buffer; src.loop = true; g.gain.value = 0; src.connect(g); g.connect(bus); src.start(); snd.sub = { src, g }; }
    snd.bus = bus; snd.smp = smp;
  })().catch(e => console.warn('recorded engine unavailable, using the synthesised one', e));
}
function updateAudio(v) {
  if (!snd.node) return;
  if (ENV.rain && snd.master && !snd.rain) { const AC = snd.ac, buf = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = AC.createBufferSource(), bp = AC.createBiquadFilter(), g = AC.createGain(); src.buffer = buf; src.loop = true; bp.type = 'bandpass'; bp.frequency.value = 3200; bp.Q.value = 0.5; g.gain.value = 0; src.connect(bp); bp.connect(g); g.connect(snd.master); src.start(); snd.rain = g; }
  if (snd.rain) snd.rain.gain.setTargetAtTime(ENV.rain * (1 - car.tun) * (0.05 + 0.09 * Math.min(1, v / 70)), snd.ac.currentTime, 0.2);      // hiss of rain and spray, louder with speed, gone in the tunnel
  snd.wet.gain.setTargetAtTime(0.6 * car.tun + (city[car.idx] ? 0.12 : 0), snd.ac.currentTime, 0.12);
  const thr = mode === 'grid' ? gridRev : car.shiftT > 0 ? 0 : (car.blipT > 0 ? 1 : car.thr);
  const rec = snd.smp && snd.useSamples;
  if (snd.smp) {
    const t = snd.ac.currentTime, r = car.rpm, st = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
    const ON = ['low', 'mid', 'midhigh', 'high'];      // on-throttle loops in rev order; each fades into its neighbours
    ON.forEach((k, i) => { const q = snd.smp[k], up = i < ON.length - 1 ? 1 - st(q.ref, snd.smp[ON[i + 1]].ref, r) : 1, dn = i > 0 ? st(snd.smp[ON[i - 1]].ref, q.ref, r) : 1;
      q.src.playbackRate.setTargetAtTime(clamp(r / q.ref, 0.6, 1.9), t, 0.03); q.g.gain.setTargetAtTime(Math.sqrt(up * dn) * (0.2 + 0.8 * thr), t, 0.04); });
    snd.smp.coast.src.playbackRate.setTargetAtTime(clamp(r / snd.smp.coast.ref, 0.6, 2), t, 0.03);
    snd.smp.coast.g.gain.setTargetAtTime((1 - thr) * 0.7 * st(4000, 7000, r), t, 0.05);
    snd.sub.src.playbackRate.setTargetAtTime(clamp(r / 5040 / 2, 0.5, 1.4), t, 0.03);
    snd.sub.g.gain.setTargetAtTime(0.6 * st(5500, 10500, r) * (0.35 + 0.65 * thr), t, 0.06);
    snd.shelf.gain.setTargetAtTime(8 * Math.min(1, v / 80), t, 0.2);
    snd.bus.gain.setTargetAtTime(rec ? 1 : 0, t, 0.06);
  }
  snd.node.port.postMessage({ eng: rec ? 0 : 1, rpm: car.rpm, thr, v, slip: car.slip, off: car.off ? 1 : 0, kerb: car.kerb ? Math.min(1, v / 15) : 0, bump: car.bump, shift: car.shiftT > 0.05 ? 1 : 0 });
}

// ---------- HUD ----------
const $ = id => document.getElementById(id);
const fmt = t => t == null ? '--:--.---' : Math.floor(t / 60) + ':' + (t % 60).toFixed(3).padStart(6, '0');
const lap = { t: null, last: null, best: null, half: false };
const mapC = $('map').getContext('2d');
const mapBase = (() => {
  let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (const p of P) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.z); z1 = Math.max(z1, p.z); }
  const sc = 114 / Math.max(x1 - x0, z1 - z0), f = (x, z) => [8 + (x - x0) * sc, 8 + (z - z0) * sc];
  const c = document.createElement('canvas'); c.width = c.height = 130; const g = c.getContext('2d');
  g.strokeStyle = '#f3e36b'; g.lineWidth = 3; g.beginPath(); P.forEach((p, i) => { const [x, y] = f(p.x, p.z); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.stroke();
  return { c, f };
})();

// ---------- golden lap: one timed lap from a standing start, then the board ----------
const BOARD_KEY = 'goldenlap.v6';   // bump whenever the circuit changes, so old times do not carry over
let board = []; try { board = JSON.parse(localStorage.getItem(BOARD_KEY)) || []; } catch (e) {}
let mode = 'attract', goT = 0, usedAuto = false, mine = null;
// Sectors: 1 ends over the crest of the swoop, 2 ends at the city limits, 3 ends at the line.
const SECTOR_END = [nearIdx(400, -830), nearIdx(470, 455)];      // thirds of the longer lap: after the long right, and where the city ends
let splits = [], secRows = [], flashT = 0, pb = null; try { pb = JSON.parse(localStorage.getItem('goldenlap.pb6')); } catch (e) {}
const cumOf = b => b.s && b.s.length === 2 ? [b.s[0], b.s[1], b.t] : null;
const secOf = b => b.s && b.s.length === 2 ? [b.s[0], b.s[1] - b.s[0], b.t - b.s[1]] : null;
// What is coming, in order, with one line of advice each. Used by the preview lap.
const SECTIONS = [
  [0, 'PIT STRAIGHT', 'Flat out, then downhill'],
  [nearIdx(0, -330), 'THE SWOOP', 'Left, right up the hill, left over a blind crest. Keep it pinned if you dare'],
  [nearIdx(-40, -760), 'THE CLIMB', 'Flat out'],
  [nearIdx(-70, -1000), 'THE LONG RIGHT', 'One long corner. Lift a little, do not brake'],
  [nearIdx(400, -830), 'THE ESSES', 'Left, right, left, right. Smooth hands'],
  [iCity0, 'INTO THE CITY', 'Walls on both sides now. Straight into the dark'],
  [iTun0, 'THE TUNNEL', 'A fast left, then a long right, all of it underground. The light at the exit will blind you'],
  [nearIdx(790, 150), 'HARBOUR CHICANE', 'Brake early. Left then right'],
  [nearIdx(760, 430), 'THE WATERFRONT', 'Water on your left. Climb to the crest'],
  [nearIdx(470, 455), 'THE LONG LEFT', 'Downhill with two apexes. Commit before you can see it'],
  [nearIdx(308, 718), 'THE SLALOM', 'Left, right, left, right. Each one tighter than the last'],
  [nearIdx(538, 1116), 'THE TWO RIGHTS', 'Down into the dip, then up over the crest'],
  [nearIdx(260, 1431), 'THE BANKING', 'The tilted road holds you. Flat out onto the straight'],
  [nearIdx(0, 1280), 'MAIN STRAIGHT', 'Flat out, one kink, to the line'],
];
const FROM = { 'THE SWOOP': 'Eau Rouge and Raidillon, Spa-Francorchamps', 'THE CLIMB': 'the Kemmel Straight, Spa-Francorchamps', 'THE LONG RIGHT': 'the Curva Grande, Monza',
  'THE ESSES': 'the Esses, Suzuka', 'INTO THE CITY': 'the streets of Monte Carlo', 'THE TUNNEL': 'the Tunnel, Monaco', 'HARBOUR CHICANE': 'the harbour chicane, Monaco',
  'THE WATERFRONT': 'the harbour front, Monaco', 'THE LONG LEFT': 'Pouhon, Spa-Francorchamps', 'THE SLALOM': 'Maggotts and Becketts, Silverstone', 'THE TWO RIGHTS': 'the Arrabbiatas, Mugello', 'THE BANKING': 'the banked final corner, Zandvoort' };
SECTIONS.forEach(q => { q[3] = FROM[q[1]] ? `<b class="gold">Inspired by ${FROM[q[1]]}</b>` : ''; });
let prevT = 0, curSec = null, capT = 0;
function startPreview() {
  splits = []; secRows = []; $('sec').innerHTML = ''; $('flash').style.display = 'none';
  mode = 'preview'; prevT = 0; autopilot = true; placeOnTrack(N - 4, 0); lap.t = 0; lap.half = false;
  $('start').style.display = 'none'; $('panel').style.display = 'none'; $('cap').style.display = 'block';
  if (!snd.ac) initAudio().catch(() => {});
}
function endPreview() { mode = 'attract'; $('cap').style.display = 'none'; $('start').style.display = 'flex'; }
function onSplit(k) {
  const c = lap.t, sec = c - (k ? splits[k - 1] : 0); splits[k] = c;
  const others = board.filter(b => b !== mine), cums = others.map(cumOf).filter(Boolean), secs = others.map(secOf).filter(Boolean);
  const pos = 1 + cums.filter(o => o[k] < c).length, lead = cums.length ? Math.min(...cums.map(o => o[k])) : null;
  const bestSec = secs.length ? Math.min(...secs.map(o => o[k])) : null, pbSec = pb && pb.sec ? pb.sec[k] : null;
  const cls = bestSec == null || sec < bestSec ? 'gold' : (pbSec != null && sec < pbSec ? 'green' : 'plain');     // gold = fastest anyone has done, green = your best
  const text = `S${k + 1} ${sec.toFixed(3)}  P${pos} OF ${cums.length + 1}` + (lead != null ? `  ${c - lead >= 0 ? '+' : ''}${(c - lead).toFixed(3)}` : '');
  $('best').textContent = `POSITION P${pos} OF ${cums.length + 1}`;
  secRows[k] = { text, cls, sec };
  $('sec').innerHTML = secRows.map(r => `<div class="${r.cls}">${r.text}</div>`).join('');
  $('flash').textContent = text; $('flash').className = cls; $('flash').style.display = 'block'; flashT = 3.5;
}
let remote = false, total = 0;      // remote = a shared board is answering at /api; otherwise times stay in this browser
const saveBoard = () => { if (remote) return; try { localStorage.setItem(BOARD_KEY, JSON.stringify(board.slice(0, 100).map(b => Object.assign({}, b, { tr: undefined, pk: undefined })))); } catch (e) {} };
async function refreshBoard() {
  try {
    const was = daily, r = await fetch('/api/board' + (daily ? '?daily=1' : ''), { cache: 'no-store' }); if (!r.ok) return;
    const d = await r.json(); if (!d || !Array.isArray(d.all) || was !== daily) return;
    if (Number.isFinite(d.day) && d.day !== dayNo) { dayNo = d.day; if (daily) return setDaily(true); dayLabels(); }      // the server's calendar is the one that counts
    remote = true; total = d.total || d.all.length; board = d.all;
    fetch('/api/board' + (was ? '' : '?daily=1'), { cache: 'no-store' }).then(q => q.ok ? q.json() : null).then(o => { if (o && Array.isArray(o.all) && was === daily) { otherBoard = o.all; drawTop(); } }).catch(() => {});
    if (mine && !mine.posted) board.push(mine);
    if (mode === 'done') drawBoard(); else drawTop();
  } catch (e) {}
}
async function postLap(m) {
  try { await fetch('/api/lap', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: m.n === 'YOU' ? '' : m.n, daily: !!m.daily, ms: Math.round(m.t * 1000), c: m.c, s1: m.s ? Math.round(m.s[0] * 1000) : 0, s2: m.s ? Math.round(m.s[1] * 1000) : 0, tr: m.tr || [] }) }).then(r => r.json()).then(j => { if (j && j.ok === false) say('THE BOARD DID NOT ACCEPT THAT LAP'); }); } catch (e) {}
  refreshBoard();
}
refreshBoard();
function toGrid() {
  if (checking) endCheck(false);
  rec = []; recT = 0; gp = 0; gq = 0; gside = 0;
  if (remote && mine && !mine.posted) board = board.filter(b => b !== mine);     // a time you did not post does not stay on the board
  curSec = null; capT = 0; $('cap').style.display = 'none'; $('best').textContent = '';
  easyUsed = false; easyPace = 0.96; easyCeil = 1; easyTidy = true;
  phone.used = false; hand.used = false; if (hand.on) hand.seen = 0;      // the height you hold the wheel at during the countdown becomes flat out
  mode = 'grid'; goT = 3.2; lastLight = null; autopilot = false; usedAuto = false; mine = null; splits = []; secRows = []; $('sec').innerHTML = ''; $('flash').style.display = 'none';
  placeOnTrack(N - 4, 0); lap.t = null; lap.last = null; lap.half = false;
  $('panel').style.display = 'none'; $('lights').style.display = 'block';
}
const tagOf = c => { const t = { phone: 'PHONE, PRO', 'phone-simple': 'PHONE, BEGINNER', hands: 'HANDS, PRO', keys: 'KEYS, PRO', 'keys-simple': 'KEYS, BEGINNER', 'hands-simple': 'HANDS, BEGINNER' }[c]; return t ? ` <small>${t}</small>` : ''; };
function setEasy(v) { easy = v; try { localStorage.setItem('goldenlap.easy', v ? '1' : '0'); } catch (e) {} $('modeB').className = easy ? 'on' : ''; $('modeP').className = easy ? '' : 'on'; }
function drawTop() {
  const table = (list, cap, none) => { const rows = list.slice().sort((a, b) => a.t - b.t).slice(0, 10);
    return '<caption>' + cap + '</caption>' + (rows.length ? rows.map((b, i) => `<tr><td>${i + 1}</td><td>${(b.n || '---').replace(/[<>&]/g, '')}${tagOf(b.c)}</td><td>${fmt(b.t)}</td></tr>`).join('') : `<tr><td>${none}</td></tr>`); };
  const today = table(daily ? board : otherBoard, 'TODAY', 'Nobody yet today. Be first.'), all = table(daily ? otherBoard : board, 'ALL TIME, DRY', 'No times yet.');
  $('lb').innerHTML = today; $('lbAll').innerHTML = all; $('lb').className = 'lbt' + (daily ? '' : ' dim'); $('lbAll').className = 'lbt' + (daily ? ' dim' : '');      /* the board you are about to drive on is the bright one */
  $('lb2').innerHTML = daily ? today : all;
}
function drawBoard() {
  drawTop();
  board.sort((a, b) => a.t - b.t);
  const pos = mine ? board.indexOf(mine) : -1, rows = board.map((b, i) => [i, b]).filter(([i]) => i < 8 || i === pos);
  $('pb').innerHTML = rows.map(([i, b]) => `<tr class="${i === pos ? 'me' : ''}"><td>${i + 1}</td><td>${(b.n || '---').replace(/[<>&]/g, '')}${tagOf(b.c)}</td><td>${fmt(b.t)}</td></tr>`).join('');
  $('pr').textContent = mine ? `P${pos + 1} of ${Math.max(board.length, total + (mine.posted ? 0 : 1))}` + (pos === 0 ? ' — the golden lap' : ` — ${(mine.t - board[0].t).toFixed(3)}s off P1`) : '';
}
function finish() {
  if (splits.length === 2) onSplit(2);
  $('ps').innerHTML = secRows.map(r => `<span class="${r.cls}">S${secRows.indexOf(r) + 1} ${r.sec.toFixed(3)}</span>`).join('   ');
  if (!usedAuto && secRows.length === 3) { pb = pb && pb.sec ? pb : { sec: [1e9, 1e9, 1e9] }; pb.sec = pb.sec.map((v, k) => Math.min(v, secRows[k].sec)); try { localStorage.setItem('goldenlap.pb6', JSON.stringify(pb)); } catch (e) {} }
  $('cap').style.display = 'none';
  lap.last = lap.t; mode = 'done'; autopilot = true;
  $('pt').textContent = fmt(lap.last); $('panel').style.display = 'flex';
  $('pn').style.display = usedAuto ? 'none' : ''; $('pa').style.display = usedAuto ? '' : 'none';
  if (!usedAuto) { let n = ''; try { n = localStorage.getItem('goldenlap.name') || ''; } catch (e) {}
    mine = { n: n || 'YOU', t: +lap.last.toFixed(3), d: Date.now(), c: (phone.used ? 'phone' : hand.used ? 'hands' : 'keys') + (easyUsed ? '-simple' : ''), s: splits.length >= 2 ? [+splits[0].toFixed(3), +splits[1].toFixed(3)] : null }; mine.tr = []; mine.daily = daily; board.push(mine); saveBoard(); $('name').value = n; setTimeout(() => $('name').focus(), 50); }
  $('pc').style.display = usedAuto ? 'none' : ''; $('ghostmsg').textContent = ''; if (!usedAuto) lastRec = rec;
  if (!usedAuto) { wantShot = true; rec.push([+lap.last.toFixed(3), +car.x.toFixed(2), +car.z.toFixed(2), +car.h.toFixed(3), +car.yS.toFixed(2), N]);
    for (const q of rec) mine.tr.push(Math.round(q[0] * 1000), Math.round(q[5] * 10));      // time in ms, distance in tenths of a track sample: what the server checks
    mine.pk = packLap(rec); $('chbtn').textContent = 'Challenge a friend'; $('chbtn').style.display = remote && !daily ? '' : 'none'; $('chlink').style.display = 'none';
    if (!ghost || lap.last < ghost.t) { $('ghostmsg').textContent = ghost ? 'You beat your ghost. This lap is the new one.' : 'Next lap you race the ghost of this one.'; ghost = { t: lap.last, s: rec }; try { localStorage.setItem(ghostKey(), JSON.stringify(ghost)); } catch (e) {} } }
  if (!usedAuto && rival) $('ghostmsg').textContent = lap.last < rival.t ? `You beat ${rival.n} by ${(rival.t - lap.last).toFixed(3)}. Send one back.` : `${rival.n} is still ${(lap.last - rival.t).toFixed(3)} ahead.`;
  drawBoard();
}
document.getElementById('name').addEventListener('input', e => { if (mine) { mine.n = e.target.value.toUpperCase().slice(0, 12) || 'YOU'; saveBoard(); drawBoard(); try { localStorage.setItem('goldenlap.name', mine.n); } catch (x) {} } });
document.getElementById('name').addEventListener('keydown', e => { if (e.code === 'Enter') { e.target.blur(); if (remote && mine && !mine.posted) { mine.posted = true; postLap(mine); } toGrid(); } e.stopPropagation(); });

drawTop(); setInterval(() => { if (mode !== 'run') refreshBoard(); }, 30000);     // keep the board fresh while nobody is mid-lap

// ---------- main loop ----------
let T = 0, acc = 0, lastNow = performance.now();
const _v = new V3();
const ns = (t, a, b, c) => Math.sin(t * a) * 0.6 + Math.sin(t * b + 1.3) * 0.3 + Math.sin(t * c + 4.1) * 0.25;
placeOnTrack(N - 14, 0);
function frame(dtForced) {
  const now = performance.now();
  const dt = dtForced || Math.min(0.05, (now - lastNow) / 1000); lastNow = now; T += dt;

  if (mode === 'replay') replayStep(dt);
  else { readInput(dt); acc += dt; while (acc > 1 / 240) { step(1 / 240); acc -= 1 / 240; } }
  const v = Math.hypot(car.vx, car.vy), sf = Math.min(1, v / 90);

  // where are we on the track
  const prev = car.idx, loc = locate(car.x, car.z, car.idx, 30);
  car.idx = loc.i; car.lat = loc.lat;
  const al = Math.abs(loc.lat);
  car.off = !city[loc.i] && al > 7.3; car.kerb = kerbMask[loc.i] && al > 5.1 && al < 8.2;
  { const t = TAN[loc.i], sh = Math.sin(car.h), ch = Math.cos(car.h);
    car.y = Y[loc.i] + SL[loc.i] * ((car.x - P[loc.i].x) * t.x + (car.z - P[loc.i].z) * t.z) + BH(loc.i, loc.lat);
    car.bankS = (car.bankS || 0) + (Math.atan(BANK[loc.i]) * insB[loc.i] * (-sh * t.x - ch * t.z) - (car.bankS || 0)) * Math.min(1, dt * 8);      // how far the car is tipped over by the banking
    car.slope = SL[loc.i] * (-sh * t.x - ch * t.z); car.kv = KV[loc.i];
    car.yS += (car.y - car.yS) * Math.min(1, dt * 25); car.slopeS += (car.slope - car.slopeS) * Math.min(1, dt * 12);
    const inT = tun[loc.i] ? 1 : 0;
    car.tun += (inT - car.tun) * Math.min(1, dt * 7); car.expo += (1 + 0.9 * inT - car.expo) * Math.min(1, dt * 2.2);
    W.fog.density = ENV.fog * (1 - 0.9 * car.tun); passB.uniforms.rain.value = ENV.rain * (1 - car.tun);
    rainU.uTime.value = T % 600; rainU.uRain.value = ENV.rain; rainMesh.visible = rainU.uRain.value > 0.01;      /* the road outside stays wet and rain keeps falling beyond the exit; the shaders keep the tunnel itself dry */
    rainU.uVel.value.set(-Math.sin(car.h) * car.vx, 0, -Math.cos(car.h) * car.vx);
    hemiC.intensity = 0.9 * (1 - 0.75 * car.tun) + car.tun * 0.6 * Math.pow(Math.max(0, Math.sin(loc.i * DS / 12 * 6.2832)), 4);   // tunnel lights sweep over the cockpit
    sunC.intensity = 0.55 * (1 - car.tun); passB.uniforms.expo.value = car.expo * ENV.expo; }
  // Barrier contact is tested at the four corners of the car, so a wheel can no longer sink into the armco.
  let hitOver = 0, hitF = 0, hitSg = 0;
  { const r = R[loc.i], s_ = Math.sin(car.h), c_ = Math.cos(car.h), fR = -s_ * r.x - c_ * r.z, rR = c_ * r.x - s_ * r.z;
    for (const [f, sd] of [[1.55, 1.05], [1.55, -1.05], [-1.7, 1.05], [-1.7, -1.05]]) {
      const l = loc.lat + f * fR + sd * rR, o = Math.abs(l) - (WO[loc.i] - 0.2);
      if (o > hitOver) { hitOver = o; hitF = f; hitSg = Math.sign(l); } } }
  if (hitOver > 0) {
    const sg = hitSg, r = R[loc.i], over = hitOver, s = Math.sin(car.h), c = Math.cos(car.h);
    car.h += (hitF > 0 ? 1 : -1) * sg * Math.min(0.05, over * 0.12);      // the wall turns the car parallel to it
    car.x -= r.x * sg * over; car.z -= r.z * sg * over;
    let wx = -s * car.vx - c * car.vy, wz = -c * car.vx + s * car.vy;
    const vn = (wx * r.x + wz * r.z) * sg;
    if (vn > 0) {
      wx -= r.x * sg * vn * 1.25; wz -= r.z * sg * vn * 1.25;
      const k = 0.99 - Math.min(0.5, vn * 0.03); wx *= k; wz *= k;
      car.vx = -wx * s - wz * c; car.vy = -wx * c + wz * s; car.r *= 0.5; car.bump = Math.min(1, car.bump + vn / 8);
    }
  }
  // laps
  tickCheck(dt); tickGhost(dt); watchHands(dt);
  if (mode === 'grid') { goT -= dt; { const lt = goT > 0.2 ? Math.ceil(goT - 0.2) : 'GO'; if (lt !== lastLight) { lastLight = lt; beep(lt === 'GO'); } } $('lights').textContent = goT > 0.2 ? Math.ceil(goT - 0.2) : 'GO'; if (goT <= 0.2 && lap.t == null) lap.t = 0; if (goT <= -0.6) { mode = 'run'; $('lights').style.display = 'none'; } }
  if (mode === 'grid' || mode === 'run') {
    if (lap.t != null) lap.t += dt;
    if (autopilot) usedAuto = true;
    if (mode === 'run') { let sec = SECTIONS[0]; for (const q of SECTIONS) if (car.idx >= q[0]) sec = q; if (car.idx > N - 25) sec = SECTIONS[0];
      if (sec !== curSec) { curSec = sec; capT = 3.5; $('cap').innerHTML = `${sec[1]}<i>${sec[3]}</i><i>${sec[2]}</i>`; $('cap').style.display = 'block'; }
      if (capT > 0) { capT -= dt; if (capT <= 0) $('cap').style.display = 'none'; } }
    if (car.idx > N * 0.45 && car.idx < N * 0.55) lap.half = true;
    if (splits.length === 0 && prev < SECTOR_END[0] && car.idx >= SECTOR_END[0]) onSplit(0);
    if (splits.length === 1 && prev < SECTOR_END[1] && car.idx >= SECTOR_END[1]) onSplit(1);
    if (lap.half && prev > N * 0.9 && car.idx < N * 0.1) finish();
  } else if (mode === 'preview') {
    prevT += dt; lap.t += dt;
    let sec = SECTIONS[0]; for (const q of SECTIONS) if (car.idx >= q[0]) sec = q;
    if (car.idx > N - 25) sec = SECTIONS[0];
    $('cap').innerHTML = `<small>PREVIEW LAP</small>${sec[1]}<i>${sec[3]}</i><i>${sec[2]}</i><i>Click or press Enter when you are ready to drive</i>`;
    if (car.idx > N * 0.45 && car.idx < N * 0.55) lap.half = true;
    if (lap.half && prev > N * 0.9 && car.idx < N * 0.1) endPreview();
  } else if (mode === 'attract') {
  if (lap.t != null) lap.t += dt;
  if (car.idx > N * 0.45 && car.idx < N * 0.55) lap.half = true;
  if (prev > N * 0.9 && car.idx < N * 0.1) {
    if (lap.t != null && lap.half) { lap.last = lap.t; lap.best = lap.best == null ? lap.t : Math.min(lap.best, lap.t); }
    lap.t = 0; lap.half = false;
  }
  }
  // gears
  car.shiftT -= dt;
  if (car.gear < 5 && v > GEARS[car.gear] * 0.975) { car.gear++; car.shiftT = 0.07; }
  if (car.gear > 0 && v < GEARS[car.gear - 1] * 0.84) { car.gear--; car.blipT = 0.13; }
  car.blipT = (car.blipT || 0) - dt;
  if (mode === 'grid') { const tr = 3500 + 8800 * gridRev; car.rpm += (tr - car.rpm) * Math.min(1, dt * (tr > car.rpm ? 11 : 4.5)); }      // free revving, clutch in: quick up, slower falling back
  else car.rpm += (Math.max(3500, 13200 * v / GEARS[car.gear]) - car.rpm) * Math.min(1, dt * 22);

  // rivals
  for (const rv of rivals) {
    const i = Math.floor(rv.s) % N, j = (i + 1) % N, f = rv.s - Math.floor(rv.s);
    rv.v = PROF[i] * rv.pace; rv.s = (rv.s + rv.v * dt / DS) % N;
    // Rivals are scenery: always ahead in the distance, never caught. If you close in they pull away; if you fall back they wait.
    { const k = rivals.indexOf(rv), lo = k ? 85 : 45, hi = k ? 170 : 120, gap = ((rv.s - car.idx) % N + N) % N;
      if (gap < lo || gap > hi) rv.s = (car.idx + clamp(gap > N / 2 ? lo : gap, lo, hi)) % N; }
    rv.mesh.position.set(P[i].x + (P[j].x - P[i].x) * f, Y[i] + (Y[j] - Y[i]) * f, P[i].z + (P[j].z - P[i].z) * f);
    rv.mesh.rotation.order = 'YXZ'; rv.mesh.rotation.set(Math.atan(SL[i]), Math.atan2(-TAN[i].x, -TAN[i].z), 0);
  }

  // car and camera
  car.axS += (car.ax - car.axS) * Math.min(1, dt * 8); car.ayS += (car.ay - car.ayS) * Math.min(1, dt * 8);
  car.bump *= Math.exp(-dt * 5);
  if (phone.on && phone.ch && phone.ch.readyState === 'open' && mode === 'run') {      /* tell the phone what the car is feeling, so it can buzz in your hands */
    const H = phone.hap || (phone.hap = { g: car.gear, b: 0, k: 0 }), now = performance.now(); let m = '';
    if (car.bump > H.b + 0.12) m = 'b'; else if (car.gear !== H.g) m = 'g'; else if ((car.kerb || car.off) && v > 8 && now - H.k > 95) { m = 'k'; H.k = now; }
    H.b = car.bump; H.g = car.gear; if (m) { try { phone.ch.send('{"h":"' + m + '"}'); } catch (err) {} phone.hapN = (phone.hapN || 0) + 1; } }
  if (mode === 'run' && !autopilot && lap.t > 2 && Math.abs(car.vx) < 1.5) { stuckT += dt;      /* going nowhere for a couple of seconds: say how to back out */
    if (stuckT > 2.2 && T - stuckSaid > 4) { stuckSaid = T; say('STUCK?\n' + (phone.on ? 'HOLD THE PHONE SCREEN TO REVERSE' : hand.on ? 'CLENCH BOTH FISTS TO REVERSE' : 'HOLD SPACE TO REVERSE')); } }
  else if (Math.abs(car.vx) > 3) stuckT = 0;
  const rough = sf + (car.kerb ? 1.6 * Math.min(1, v / 15) : 0) + (car.off ? 2.2 * Math.min(1, v / 15) : 0) + car.bump * 4;
  carObj.position.set(car.x, car.yS, car.z);
  carObj.rotation.set(Math.atan(car.slopeS) + car.axS * 0.0008 + ns(T, 31, 57, 83) * 0.0015 * rough, car.h, -car.ayS * 0.0012 + ns(T, 27, 49, 71) * 0.002 * rough - (car.bankS || 0));
  const sh = 0.0025 + 0.006 * rough;
  camW.position.set(CAM.pos[0] + ns(T, 53, 97, 131) * 0.002 * rough, CAM.pos[1] + ns(T, 61, 89, 143) * 0.004 * rough, CAM.pos[2]);
  camW.rotation.set(CAM.pitch + ns(T, 47, 83, 127) * sh, CAM.yaw + (portrait ? -0.05 : 0) + ns(T, 43, 79, 113) * sh * 0.6, CAM.roll - car.ayS * 0.0012 + ns(T, 37, 67, 101) * sh * 0.8);
  camC.position.copy(camW.position); camC.rotation.copy(camW.rotation);

  // cockpit animation
  car.spin -= car.vx / 0.33 * dt;
  { const m = Math.abs(car.vx) > 13 ? tyreBlurT : tyreT; if (tyreMat.map !== m) tyreMat.map = m; }     // marks blur into rings once the wheel is turning fast
  fw.forEach((w, i) => {
    w.hub.rotation.y = car.steer; w.spin.rotation.x = car.spin;
    if (i === 0) { const tb = clamp(car.brk, 0, 1); lampV += (tb - lampV) * Math.min(1, dt * (tb > lampV ? 14 : 5)); const b = lampV;      /* quick to light, slower to fade */
      brakeLamp.material.color.setRGB(0.16 + 0.84 * b, 0.03 + 0.25 * b, 0.03 + 0.07 * b); brakeHalo.material.opacity = 0.5 * b * b; brakeHot.material.opacity = 0.8 * b * b * b; }
    w.hub.position.y = w.y0 + ns(T + i * 7, 71, 113, 157) * 0.006 * rough;
  });
  const saw = ns(T, 9, 17, 29) * 0.05 * sf + ns(T, 23, 41, 7) * Math.min(0.25, car.slip * 1.2) * (v > 8 ? 1 : 0);
  rim.rotation.z = clamp(car.steer * 11, -1.9, 1.9) + saw;
  solveArms();
  head.rotation.set(car.axS * -0.004 + ns(T, 19, 33, 51) * 0.012 * rough, car.steer * 2.2, clamp(-car.ayS * 0.0045, -0.25, 0.25) + ns(T, 13, 29, 43) * 0.012 * rough);
  head.position.y = 0.81 + ns(T, 23, 39, 59) * 0.004 * rough;
  for (const m of refl) { const u = m.userData; m.position.y = u.y + (head.position.y - 0.81) * 2.2 + head.rotation.x * 0.12; m.position.x = u.x + head.rotation.z * 0.05 - u.s * head.rotation.y * 0.02; m.rotation.z = -head.rotation.z * 1.5; }

  // vanishing point of the motion blur = where we are actually heading
  carObj.updateMatrixWorld(true);
  const s = Math.sin(car.h), c = Math.cos(car.h);
  let wx = -s * car.vx - c * car.vy, wz = -c * car.vx + s * car.vy;
  if (v < 3) { wx = -s; wz = -c; } else { wx /= v; wz /= v; }
  camW.getWorldPosition(_v); _v.x += wx * 100; _v.z += wz * 100; _v.y = car.yS + 0.5 + car.slopeS * 100; _v.project(camW);
  passA.uniforms.vp.value.set(clamp(_v.x * 0.5 + 0.5, -0.3, 1.3), clamp(_v.y * 0.5 + 0.5, 0.2, 1.0));
  passA.uniforms.blur.value = 0.03 * sf + 0.3 * Math.pow(sf, 2.2);      // gentle at town speeds, heavy smear flat out
  { const f = (portrait ? 112 : CAM.fov) + 9 * sf * sf; if (Math.abs(camW.fov - f) > 0.05) { camW.fov = camC.fov = f; camW.updateProjectionMatrix(); camC.updateProjectionMatrix(); } }   // view widens with speed passA.uniforms.shake.value = 0.0012 * rough; passA.uniforms.time.value = T % 50;
  passB.uniforms.time.value = T;
  { const S = smudge, u3 = passB.uniforms;       /* every so often something lands on the lens, sits for a moment, and the airflow drags it off the edge */
    if (!S.on && (S.force || (mode === 'run' && T > S.next && v > 35 && car.tun < 0.1 && !ENV.rain))) { S.force = false; S.on = true; S.t0 = T;
      S.x = 0.3 + 0.4 * Math.random(); S.y = 0.56 + 0.2 * Math.random(); const a = 0.35 + 0.4 * Math.random();
      S.ux = (S.x < 0.5 ? -1 : 1) * Math.cos(a); S.uy = Math.sin(a); S.r = 0.045 + 0.02 * Math.random(); S.dur = clamp(0.9 * 70 / Math.max(v, 30), 0.6, 1.5); }
    if (S.on) { const u = clamp((T - S.t0 - 0.45) / S.dur, 0, 1), e = u * u, asp = u3.res.value.x / u3.res.value.y;
      u3.smA.value.set(S.x + S.ux * 0.85 * e / asp, S.y + S.uy * 0.85 * e, S.r * (1 + 3.5 * e), S.r * (1 - 0.45 * e));
      u3.smB.value.set(S.ux, S.uy, clamp((T - S.t0) / 0.12, 0, 1) * (1 - u * u * u));
      if (u >= 1) { S.on = false; S.next = T + 9 + 14 * Math.random(); u3.smB.value.z = 0; } } }
  passB.uniforms.soft.value = 0.15 + 0.85 * sf; passK.uniforms.amt.value = 0.35 + 0.55 * sf; passA.uniforms.ghost.value = 0.1 + 0.26 * sf;   // sharper when slow

  // render: world, cockpit, composite, tape
  renderer.setClearColor(0x000000, 0);
  if (hand.on && (hand.shed || 0) < 2 && selfie.n++ % (hand.shed ? 6 : 2) === 0) renderSelfie();
  const tv = mode === 'replay';
  if (tv) { aimTV(dt); rearG.visible = true; passA.uniforms.blur.value = 0.012; passA.uniforms.vp.value.set(0.5, 0.5); passA.uniforms.shake.value = 0; passA.uniforms.ghost.value = 0.12; passB.uniforms.soft.value = 0.3; passK.uniforms.amt.value = 0.4; }
  reflU.uReflOn.value = 0;
  if (!tv && rtR && rainU.uRain.value > 0.3) {
    if (!roadMeshes) { roadMeshes = []; W.traverse(o => { if (o.material === mRoad) roadMeshes.push(o); }); }
    const y0 = car.yS; camW.updateMatrixWorld(); camW.getWorldPosition(_v); const d = new V3(); camW.getWorldDirection(d); const up = new V3(0, 1, 0).applyQuaternion(camW.getWorldQuaternion(new THREE.Quaternion()));
    camM.position.set(_v.x, 2 * y0 - _v.y, _v.z); camM.up.set(up.x, -up.y, up.z); camM.lookAt(_v.x + d.x * 10, 2 * y0 - (_v.y + d.y * 10), _v.z + d.z * 10);
    if (camM.fov !== camW.fov || camM.aspect !== camW.aspect) { camM.fov = camW.fov; camM.aspect = camW.aspect; camM.updateProjectionMatrix(); }
    camM.updateMatrixWorld(); reflU.uRM.value.multiplyMatrices(camM.projectionMatrix, camM.matrixWorldInverse);
    reflPlane.constant = -(y0 - 0.04); renderer.clippingPlanes = [reflPlane];      /* nothing below the road is drawn, and the road itself is hidden, so the mirror camera can see up through it */
    roadMeshes.forEach(m => m.visible = false); const rv = rainMesh.visible; rainMesh.visible = false;
    renderer.setRenderTarget(rtR); renderer.render(W, camM);
    roadMeshes.forEach(m => m.visible = true); rainMesh.visible = rv; renderer.clippingPlanes = []; reflU.uReflOn.value = 1;
  }
  renderer.setRenderTarget(rtW); renderer.render(W, tv ? camRW : camW);
  renderer.setRenderTarget(rtC); renderer.render(C, tv ? camRC : camC);
  if (tv) rearG.visible = false;
  passA.uniforms.tW.value = rtW.texture; passA.uniforms.tC.value = rtC.texture; passA.uniforms.tP.value = rtP.texture;
  quad.material = passA; renderer.setRenderTarget(rtM); renderer.render(quadScene, quadCam);
  passK.uniforms.t.value = rtM.texture; quad.material = passK; renderer.setRenderTarget(rtK); renderer.render(quadScene, quadCam);
  passB.uniforms.t.value = rtK.texture;
  { const sw_ = rtM; rtM = rtP; rtP = sw_; }
  quad.material = passB; renderer.setRenderTarget(null); renderer.render(quadScene, quadCam);
  if (wantShot) { wantShot = false; grabShot(); }

  // HUD and sound
  $('spd').textContent = Math.round(v * 3.6); $('gear').textContent = car.gear + 1;
  $('rev').firstChild.style.width = clamp(car.rpm / 13000 * 100, 0, 100) + '%'; { const r = Math.round(car.rpm / 100) * 100; if (r !== car.rpmShown) { car.rpmShown = r; $('rpm').textContent = r.toLocaleString('en-GB'); $('rev').firstChild.style.background = car.rpm > 11800 ? '#ff5a3a' : '#f3e36b'; } }
  $('lap').textContent = 'LAP ' + fmt(lap.t);
  $('last').textContent = board.length ? 'P1 ' + fmt(board[0].t) : 'NO TIMES YET';
  if (flashT > 0) { flashT -= dt; if (flashT <= 0) $('flash').style.display = 'none'; }
  $('auto').textContent = autopilot ? 'AUTOPILOT' : 'BEGINNER · PACE ' + Math.round(easyPace * 100) + '%'; $('auto').style.display = (autopilot || easy) && started && mode !== 'done' ? 'block' : 'none';
  mapC.clearRect(0, 0, 130, 130); mapC.drawImage(mapBase.c, 0, 0);
  for (const rv of rivals) { const [x, y] = mapBase.f(rv.mesh.position.x, rv.mesh.position.z); mapC.fillStyle = '#fff'; mapC.fillRect(x - 2, y - 2, 4, 4); }
  { const [x, y] = mapBase.f(car.x, car.z); mapC.fillStyle = '#ff3b3b'; mapC.fillRect(x - 3, y - 3, 6, 6); }
  updateAudio(v);
}
function loop() { frame(); requestAnimationFrame(loop); }
loop();

$('prev').addEventListener('click', e => { e.stopPropagation(); startPreview(); });
$('modeB').addEventListener('click', e => { e.stopPropagation(); setEasy(true); }); $('modeP').addEventListener('click', e => { e.stopPropagation(); setEasy(false); }); setEasy(easy);
let useHands = true; try { useHands = localStorage.getItem('goldenlap.ctl') !== 'keys'; } catch (e) {}
function setCtl(h) { useHands = h; try { localStorage.setItem('goldenlap.ctl', h ? 'hands' : 'keys'); } catch (e) {}
  $('ctlhint').innerHTML = h ? 'Hold your hands up like a steering wheel. Tilt to steer, clench your fists to brake.' : '<b>Arrows</b> or <b>WASD</b> to drive, <b>Space</b> to brake.'; }
// The start screen: a phone is the main way to play, so the code is on screen from the start. altCtl means the player asked for hands or keyboard instead.
let altCtl = false;
const startShown = () => $('start').style.display !== 'none';
function startState() { const el = $('start'); el.classList.remove('s-scan', 's-ready', 's-alt'); el.classList.add(phone.on ? 's-ready' : altCtl ? 's-alt' : 's-scan'); }
$('usehands').addEventListener('click', () => { altCtl = true; setCtl(true); startState(); });
$('usekeys').addEventListener('click', () => { altCtl = true; setCtl(false); startState(); });
$('usephone').addEventListener('click', () => { altCtl = false; startState(); if (!phone.pc) { phone.renew = 0; pairPhone(); } });
$('dropphone').addEventListener('click', () => { closePhone(); altCtl = false; startState(); phone.renew = 0; pairPhone(); });
$('pwqr').addEventListener('click', () => { if (!phone.on) { phone.renew = 0; pairPhone(); } });
{ let a = 0; const c = $('swheel').getContext('2d');      // on the ready screen a wheel follows the phone, so you can see it works before the lights
  (function turn() { requestAnimationFrame(turn); if (!phone.on || !startShown()) return; const live = phoneLive(); a += ((live ? phone.target : 0) - a) * 0.25;
    c.clearRect(0, 0, 200, 200); c.save(); c.translate(100, 100); c.rotate(-a * 0.61); c.strokeStyle = '#f3e36b'; c.lineWidth = 16; c.beginPath(); c.arc(0, 0, 82, 0, 7); c.stroke();
    c.lineWidth = 12; c.beginPath(); c.moveTo(-82, 0); c.lineTo(82, 0); c.moveTo(0, 0); c.lineTo(0, 82); c.stroke(); c.fillStyle = '#15171a'; c.beginPath(); c.arc(0, 0, 22, 0, 7); c.fill();
    c.fillStyle = live && phone.brk ? '#ff3a1c' : '#5a1410'; c.strokeStyle = '#a9a59a'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 10, 0, 7); c.fill(); c.stroke(); c.restore(); })(); }
$('daybtn').addEventListener('click', e => { e.stopPropagation(); setDaily(!daily); });
$('keysbtn').addEventListener('click', e => { e.stopPropagation(); const k = $('keys'); k.style.display = k.style.display === 'block' ? 'none' : 'block'; });
$('keys').addEventListener('click', e => e.stopPropagation());
setCtl(useHands); startState(); pairPhone();
setDaily(!/[?&]c=/.test(location.search));      /* today's lap unless you came in on a challenge link, which is raced in the dry */
addEventListener('click', () => { if (mode === 'preview' && prevT > 0.4) endPreview(); if (mode === 'replay' && rT > 0.4) endReplay(); });
$('hcskip').addEventListener('click', () => endCheck(true));
$('hckeys').addEventListener('click', () => { stopHands(); setCtl(false); endCheck(false); toGrid(); });
$('savebtn').addEventListener('click', e => { e.stopPropagation(); saveCard(); });
$('rpbtn').addEventListener('click', e => { e.stopPropagation(); startReplay(); });
$('chbtn').addEventListener('click', e => { e.stopPropagation(); sendChallenge(); });
$('chlink').addEventListener('keydown', e => e.stopPropagation());
let starting = false;
addEventListener('keydown', e => { if (e.code === 'Enter' && startShown() && !$('start').classList.contains('s-scan') && document.activeElement === document.body) $('gobtn').click(); });
$('start').addEventListener('click', ev => {
  if (starting || !ev.target.closest('#gobtn')) return;      /* only the START button starts a lap now, not a click anywhere */
  initAudio().catch(e => console.warn('no audio', e));
  const go = () => { starting = false; $('start').style.display = 'none'; $('handmsg').textContent = ''; started = true; toGrid(); };
  if (!useHands || hand.on || phone.on) { go(); return; }
  starting = true; $('handmsg').textContent = 'Allow the camera when your browser asks...';
  startHands().then(() => { let seen = false; try { seen = localStorage.getItem('goldenlap.hc') === '1'; } catch (e) {} if (seen) return go(); starting = false; $('start').style.display = 'none'; $('handmsg').textContent = ''; started = true; startCheck(); }).catch(err => { stopHands(); go(); say('NO CAMERA: DRIVING WITH THE KEYBOARD'); });     // no camera or not allowed: keys still work
});

// handle for testing and for scripted B-roll
window.G = { startState, smudge, brakeLamp, speedProfile, PROFX, DS, get easyPace() { return easyPace; }, set steerOnly(v) { steerOnly = v; }, diag, note, watchHands, phone, pairPhone, closePhone, startReplay, endReplay, TVCAMS, set lastRec(v) { lastRec = v; }, get rT() { return rT; }, applyEnv, setDaily, CONDS, get ENV() { return ENV; }, get daily() { return daily; }, packLap, unpackLap, get rival() { return rival; }, set rival(v) { rival = v; showDare(); }, get mine() { return mine; }, startCheck, hc, get checking() { return checking; }, get ghost() { return ghost; }, set ghost(v) { ghost = v; }, ghostCar, makeCard, shot, progress, selfie, renderSelfie, rearG, camSC, camSW, get gridRev() { return gridRev; }, seg, startSeg, onSeg, paintBackdrop, beep, face, onFace, startFace, drawDriver, snd, car, setEasy, get easy() { return easy; }, hand, onHands, get feel() { return feel; }, toGrid, startPreview, refl, SECTOR_END, get secRows() { return secRows; }, finish, set usedAuto(v) { usedAuto = v; }, get mode() { return mode; }, get board() { return board; }, P, Y, K, tun, city, nearIdx, iTun0, iTun1, iCity0, set portrait(v) { portrait = v; resize(); }, lap, frame, placeOnTrack, CAM, passB, set auto(v) { autopilot = v; }, get auto() { return autopilot; }, N, PROF, TRACK_LEN };
})();

}

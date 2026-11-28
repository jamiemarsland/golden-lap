#!/usr/bin/env python3
"""Rough animatic of the Golden Lap film, built from the storyboard (storyboard/panels.json) as a HyperFrames project in animatic/.
A guide voice (the Mac's Daniel) reads each panel's draft line, so the timing is roughly real; footage that exists is cut in,
shots still to film show a TO SHOOT slate. Run from video/:  python3 build_animatic.py  then  cd animatic && npm run render"""
import json, os, re, subprocess, html
ROOT = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(ROOT, 'animatic', 'assets')
P = json.load(open(os.path.join(ROOT, 'storyboard', 'panels.json')))
SRC = {'film': 'film/assets/clips', 'tricks': 'raw/tricks', 'camera': 'raw/camera', 'stills': 'film/assets/stills', 'raw': 'raw', 'top': '..'}
def asset(where, name):      # hard-link a source file into the project once
    dst = os.path.join(A, name)
    if not os.path.exists(dst): os.link(os.path.join(ROOT, SRC[where], name), dst)
    return 'assets/' + name
def length(path): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path]).strip())
# footage per panel: (where, file, media start, weight). Images take no media start.
T = 'golden-lap-trailer-soon.mp4'
SHOTS = {
 1: [('top', T, 0, 1)], 2: [('film', 'fx.mp4', 3.5, 1)], 3: [], 4: [('film', 'laphud.mp4', 30, 1)],
 5: [('tricks', 'layers.mp4', 0.8, 1)], 6: [('film', 'tunfast.mp4', 0.15, 1)],
 7: [('camera', 'golden-lines.png', 0, 0.8), ('camera', 'cmp-height.mp4', 0.3, 1.2), ('camera', 'cmp-lens.mp4', 0.3, 1.2), ('camera', 'cmp-blur.mp4', 0.3, 1.2)],
 8: [('film', 'lap.mp4', 10, 1), ('raw', 'nose-before.png', 0, 0.8), ('film', 'lap.mp4', 30, 0.6)],
 9: [('tricks', 'climb-wire.mp4', 0, 1), ('tricks', 'climb-tape.mp4', 1, 0.8)],
 10: [('tricks', 'tree-ball.mp4', 0.5, 1), ('tricks', 'forest-grows.mp4', 1.5, 1), ('tricks', 'car-apart-wire.mp4', 1, 1), ('tricks', 'textures-sheet.png', 0, 0.8), ('tricks', 'puddle-compare.png', 0, 0.8)],
 11: [('film', 'laphud.mp4', 55, 1)], 12: [('film', 'lapdusk.mp4', 58, 1)], 13: [('film', 'laphud.mp4', 6, 1)],
 14: [('stills', 'helmet-live.png', 0, 1), ('film', 'gridrev.mp4', 1, 1.4)], 15: [('film', 'lapgolden.mp4', 60, 1)],
 16: [('film', 'newcorners.mp4', 4, 1)], 17: [('stills', 'diagnostics.png', 0, 1)], 18: [('stills', 'helmet-live.png', 0, 1)],
 19: [('stills', 'start.png', 0, 1)], 20: [('film', 'raintunnel.mp4', 2, 1), ('film', 'swooprain.mp4', 5, 1), ('film', 'laprain.mp4', 40, 1)],
 21: [('film', 'lapgolden.mp4', 74, 1)], 22: [('film', 'fx.mp4', 3.5, 1), ('top', T, 17.7, 1.2)],
}
FIXED = {1: 17.7, 3: 6.0}                     # the trailer runs its own length; the title card is short
TOSHOOT = {4: 'You on camera, the original YouTube Short beside you, pointing at it', 16: 'The steering dying mid-lap: COASTING, the car runs on into the barrier',
           18: 'Your brother at the laptop, hands up, crashing. Or you telling it to camera', 19: 'Scanning the code; the phone becomes the wheel; driving on the projector'}
VOICE, RATE = 'Daniel', 182
def clean(vo): return re.sub(r'\s+', ' ', re.sub(r'\([^)]*\)', ' ', vo)).strip()
def hms(s): s = max(0, int(round(s))); return f'{s // 3600:02d}:{s % 3600 // 60:02d}:{s % 60:02d}'
def secs(c): h, m, s = map(int, c.split(':')); return h * 3600 + m * 60 + s
e = html.escape
vids, overlays, audios, tl = [], [], [], []
t, vi = 0.0, 0
for n, p in enumerate(P, 1):
    line = clean(p['vo']) if p['vo'] not in ('(none)', 'Nothing. Engine only.') else ''
    vlen = 0.0
    if line:
        wav = os.path.join(A, 'vo', f'p{n:02d}.wav')
        if not os.path.exists(wav) or os.path.getmtime(wav) < os.path.getmtime(os.path.join(ROOT, 'storyboard', 'panels.json')):
            aiff = wav[:-4] + '.aiff'; subprocess.run(['say', '-v', VOICE, '-r', str(RATE), '-o', aiff, line], check=True)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', aiff, '-ar', '48000', '-ac', '2', wav], check=True); os.remove(aiff)
        vlen = length(wav)
    dur = FIXED.get(n) or round(max(p['d'] * 0.6, vlen + 1.4) if line else p['d'], 2)
    # pictures: share the panel between its shots by weight; a clip shorter than its slot is played again from its start
    shots = SHOTS[n]; W = sum(s[3] for s in shots) or 1; at = t
    for where, f, m0, w in shots:
        slot = dur * w / W; src = asset(where, f)
        if f.endswith('.png'):
            vids.append(f'      <img id="i{vi}" class="clip still" src="{src}" data-start="{at:.2f}" data-duration="{slot:.2f}" data-track-index="0" alt="">'); vi += 1
        else:
            L = length(os.path.join(ROOT, SRC[where], f)); left, ms = slot, min(m0, max(0, L - 1)); a2 = at
            vol = 1 if not line else 0.22
            while left > 0.05:
                seg = min(left, L - ms - 0.05)
                vids.append(f'      <video id="v{vi}" class="clip" src="{src}" data-has-audio="true" data-volume="{vol}" playsinline data-start="{a2:.2f}" data-duration="{seg:.2f}" data-media-start="{ms:.2f}" data-track-index="0"></video>'); vi += 1
                a2 += seg; left -= seg; ms = 0
        at += slot
    if n == 3:
        overlays.append(f'''      <div id="card" class="clip card" data-start="{t:.2f}" data-duration="{dur:.2f}" data-track-index="1"><div class="tl">This Little Thing.</div><div class="th">How I built a pro F1 game</div><div class="tw">with my friend <b>Claude</b> <span class="claude">✳</span> + <b>Spacefast</b> <span class="sf"></span></div><div class="tn">ONE DAY. NO CODE.</div></div>''')
    if line:
        audios.append(f'      <audio id="vo{n}" class="clip" src="assets/vo/p{n:02d}.wav" data-start="{t + 0.4:.2f}" data-duration="{vlen:.2f}" data-track-index="5" data-volume="1"></audio>')
        raw = [s.strip() for s in re.split(r'(?<=[.?!])\s+', line) if s.strip()]; sents = []
        for s in raw:      # short sentences ride together, so no caption flashes by
            if sents and (len(sents[-1]) < 38 or len(s) < 14) and len(sents[-1]) + len(s) < 95: sents[-1] += ' ' + s
            else: sents.append(s)
        tot = sum(len(s) for s in sents); c0 = t + 0.4
        for k, s in enumerate(sents):
            sd = vlen * len(s) / tot
            overlays.append(f'      <div id="c{n}_{k}" class="clip cap" data-start="{c0:.2f}" data-duration="{sd:.2f}" data-track-index="4"><span>{e(s)}</span></div>'); c0 += sd
    if n not in (1, 3):
        tag = {'box': f'INSIDE THE BLACK BOX · {p.get("box", "")}', 'action': 'ACTION', 'loop': 'LOOP', 'hook': 'HOOK', 'story': 'STORY'}[p['k']]
        overlays.append(f'      <div id="lb{n}" class="clip label k-{p["k"]}" data-start="{t:.2f}" data-duration="{dur:.2f}" data-track-index="2"><b>{n:02d}</b> {e(p["title"])}<i>{tag}</i></div>')
    if p.get('clock'):
        nxt = next((q['clock'] for q in P[n:] if q.get('clock')), p['clock'])
        overlays.append(f'      <div id="ck{n}" class="clip clock" data-start="{t:.2f}" data-duration="{dur:.2f}" data-track-index="3"><span id="ckt{n}">{p["clock"]}</span></div>')
        a0, a1 = secs(p['clock']), secs(nxt)
        tl.append(f'{{ const o = {{ v: {a0} }}, el = document.getElementById("ckt{n}"); tl.to(o, {{ v: {a1}, duration: {dur:.2f}, ease: "none", onUpdate: () => {{ const s = Math.max(0, Math.round(o.v)); el.textContent = String(Math.floor(s / 3600)).padStart(2, "0") + ":" + String(Math.floor(s % 3600 / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }} }}, {t:.2f}); }}')
    if p.get('beat'):
        overlays.append(f'      <div id="bt{n}" class="clip beat" data-start="{t:.2f}" data-duration="1.6" data-track-index="6"><span id="btw{n}">{p["beat"].upper()}…</span></div>')
        tl.append(f'tl.fromTo("#btw{n}", {{ scale: 1.6, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2)" }}, {t:.2f}); tl.to("#btw{n}", {{ opacity: 0, duration: 0.3 }}, {t + 1.25:.2f});')
    if n in TOSHOOT:
        overlays.append(f'      <div id="ts{n}" class="clip shoot" data-start="{t:.2f}" data-duration="{dur:.2f}" data-track-index="7"><b>TO SHOOT</b>{e(TOSHOOT[n])}</div>')
    t += dur
END = round(t, 2)
open(os.path.join(ROOT, 'animatic', 'index.html'), 'w').write(f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1920px; height: 1080px; overflow: hidden; background: #000; }}
      #root {{ position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #0b0705; color: #f3e6c8; font-family: Inter, sans-serif; }}
      video, .still {{ position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; object-fit: contain; background: #0b0705; z-index: 1; }}
      video {{ object-fit: cover; }}
      .label {{ position: absolute; left: 60px; top: 48px; z-index: 5; font: 700 26px 'JetBrains Mono', monospace; color: #f3e6c8; background: rgba(11,7,5,.72); padding: 10px 16px; border-radius: 6px; }}
      .label b {{ color: #b5a58a; margin-right: 8px; }} .label i {{ font-style: normal; font-size: 22px; letter-spacing: .14em; margin-left: 18px; padding: 4px 10px; border-radius: 99px; background: #3a2a1f; vertical-align: 3px; }}
      .label i {{ color: #f3e6c8; }} .k-box i {{ background: #f0b53a; color: #1c110b; }} .k-action i {{ background: #2f9b96; color: #08201f; }} .k-loop i {{ background: #e0412a; color: #1c110b; }} .k-hook i {{ background: #e2562b; color: #1c110b; }}
      .clock {{ position: absolute; right: 60px; top: 48px; z-index: 5; font: 700 44px 'JetBrains Mono', monospace; color: #e0412a; background: rgba(11,7,5,.78); padding: 8px 18px; border-radius: 6px; letter-spacing: .04em; }}
      .cap {{ position: absolute; left: 180px; width: 1560px; bottom: 70px; z-index: 6; text-align: center; }}
      .cap span {{ display: inline-block; font: 600 38px/1.3 Inter, sans-serif; color: #fff; background: rgba(0,0,0,.66); padding: 10px 22px; border-radius: 8px; }}
      .beat {{ position: absolute; inset: 0; z-index: 8; display: flex; align-items: center; justify-content: center; pointer-events: none; }}
      .beat span {{ display: inline-block; font-family: 'Archivo Black', sans-serif; font-size: 230px; color: #e0412a; transform: skewX(-10deg); text-shadow: 8px 8px 0 #1c110b; }}
      .shoot {{ position: absolute; left: 50%; top: 150px; transform: translateX(-50%); z-index: 7; width: 1200px; text-align: center; font: 600 30px Inter, sans-serif; color: #fff; background: rgba(160,30,20,.86); padding: 16px 26px; border-radius: 8px; }}
      .shoot b {{ display: block; font: 700 22px 'JetBrains Mono', monospace; letter-spacing: .3em; margin-bottom: 6px; color: #ffd9a8; }}
      .card {{ position: absolute; inset: 0; z-index: 4; background: #1c110b; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; text-align: center; }}
      .card .tl {{ font: 400 54px 'Playfair Display', serif; font-style: italic; color: #f0b53a; }}
      .card .th {{ font: 400 104px 'Archivo Black', sans-serif; color: #f3e6c8; text-shadow: 6px 6px 0 #e2562b, 12px 12px 0 #5e2414; }}
      .card .tw {{ font: 500 48px Inter, sans-serif; }} .card .claude {{ color: #d97757; }} .card .sf {{ display: inline-block; width: 40px; height: 40px; background: #3ddc84; border-radius: 8px; vertical-align: -4px; }}
      .card .tn {{ font: 700 30px 'JetBrains Mono', monospace; letter-spacing: .3em; color: #b5a58a; margin-top: 10px; }}
    </style>
  </head>
  <body>
    <!-- Golden Lap film, rough animatic. Generated by ../build_animatic.py from ../storyboard/panels.json. Guide voice only; replace with James's takes. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1920" data-height="1080">
{chr(10).join(vids)}
{chr(10).join(overlays)}
{chr(10).join(audios)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      (() => {{
      const tl = gsap.timeline({{ paused: true }});
      {(chr(10) + '      ').join(tl)}
      tl.to({{}}, {{ duration: 0.01 }}, {END - 0.02});
      window.__timelines["main"] = tl;
      }})();
    </script>
  </body>
</html>
''')
print('animatic', END, 's =', f'{int(END // 60)}:{int(END % 60):02d}', '|', vi, 'shots')

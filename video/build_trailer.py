#!/usr/bin/env python3
"""Builds the "Lights out" trailer as a HyperFrames project in trailer/. No music: beeps, engine, silence.
Run from video/:  python3 build_trailer.py   then   cd trailer && npm run check && npm run render"""
GO = 3.0  # the game's own go tone in gridrev.mp4; the car launches at about 3.8
import os
RAIN = bool(os.environ.get('RAIN'))   # RAIN=1: the weather turns mid-shot, just after the plunge into the swoop, and the shot runs a little longer
CUTS = [(0, 'swooprain', 4.6), (6.8, 'tunfast', 0.5),] if RAIN else [(0, 'swoop', 4.6), (6.2, 'tunfast', 0.15),]   # the tunnel cut starts once the car is into the long right, so the motion carries across the cut
CUTS += [ (8.1, 'lapgolden', 19.8), (9.8, 'laprain', 9.6), (11.7, 'lapdusk', 60.6), (13.4, 'laphud', 73.4), (16.0, 'lapgolden', 79.0)]
SOON = bool(os.environ.get('SOON'))   # SOON=1: 'COMING SOON' instead of the address, and a Brazilian voice over the end card
VO = 'vo-crowd.wav'   # the voice (starts 0.9 s in) over a grandstand crowd, mixed in ffmpeg from vo/br/f3.mp3 (one breath) + bed.mp3 (steady crowd) + crowd.mp3 1-4.2 s (roar after the last word)
OUT, END = 17.7, (25.1 if SOON else 23.0)
FULL = 'position:absolute;left:0;top:0;width:1920px;height:1080px'
vids = []
for i, (t0, clip, m0) in enumerate(CUTS):
    t1 = CUTS[i + 1][0] if i + 1 < len(CUTS) else OUT
    vids.append(f'      <video id="v{i}" class="clip" src="assets/{clip}.mp4" data-has-audio="true" data-volume="1" playsinline data-start="{t0}" data-duration="{round(t1 - t0, 2)}" data-media-start="{m0}" data-track-index="0" style="{FULL};object-fit:cover;z-index:1"></video>')
words = []   # no words over the opening: just the picture (James, 26 Nov)
els, tl = [], []
for i, (a, b, w) in enumerate(words):
    els.append(f'      <div id="w{i}" class="clip word" data-start="{a}" data-duration="{round(b - a, 2)}" data-track-index="2"><span id="w{i}-in">{w}</span></div>')
    tl.append(f'tl.fromTo("#w{i}-in", {{ opacity: 0, y: 10 }}, {{ opacity: 1, y: 0, duration: 0.14, ease: "power3.out" }}, {a});')
end = [('t-name', 18.2, 'GOLDEN LAP', 'name'), ('t-line', 19.0, 'One lap. Steered with your bare hands.', 'line'), ('t-board', 19.9, '<b>1</b><i>YOUR NAME</i><u>--:--.---</u>', 'board'), ('t-cap', 20.3, 'ONE WORLD LEADERBOARD. EVERY LAP COUNTS.', 'cap'), ('t-url', 21.0, 'COMING SOON' if SOON else 'golden-lap.space.fast', 'url')]
for i, a, w, cls in end:
    els.append(f'      <div id="{i}" class="clip {cls}" data-start="{a}" data-duration="{round(END - a, 2)}" data-track-index="2"><span id="{i}-in">{w}</span></div>')
    tl.append(f'tl.fromTo("#{i}-in", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }}, {a});')
if SOON:   # English subtitles for the Portuguese line, timed to his words (voice starts 1 s into the card)
    V = OUT + 1.0
    subs = [(0.22, 1.1, 'One lap...'), (1.14, 1.85, 'Just one.'), (1.88, 2.7, 'Perfect.'), (2.74, 6.1, 'Can you <b id="sb-em">do it?</b>')]
    for i, (a, b, w) in enumerate(subs):
        a, b = round(V + a, 2), round(V + b, 2)
        els.append(f'      <div id="sb{i}" class="clip sub" data-start="{a}" data-duration="{round(b - a, 2)}" data-track-index="7"><span id="sb{i}-in">{w}</span></div>')
        tl.append(f'tl.fromTo("#sb{i}-in", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.08 }}, {a});')
    tl.append(f'tl.fromTo("#sb-em", {{ opacity: 0, scale: 0.8 }}, {{ opacity: 1, scale: 1, duration: 0.12, ease: "back.out(3)" }}, {round(V + 3.26, 2)});')
cols = ['#5e2414', '#e2562b', '#f0b53a', '#f3e6c8', '#2f9b96']   # the helmet's colours, plus mustard and brown
bands = ''.join(f'<i id="s{k}" style="top:{k * 16}px;background:{c}"></i>' for k, c in enumerate(cols))
els.insert(0, f'      <div id="card" class="clip" data-start="{OUT}" data-duration="{round(END - OUT, 2)}" data-track-index="1"></div>')
els.append(f'      <div id="stripes" class="clip" data-start="18.2" data-duration="{round(END - 18.2, 2)}" data-track-index="3">{bands}</div>')
for k in range(5): tl.append(f'tl.fromTo("#s{k}", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.7, ease: "power3.out" }}, {18.3 + k * 0.07});')
NL = '\n'
open('trailer/index.html', 'w').write(f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1920px; height: 1080px; overflow: hidden; background: #000; }}
      #root {{ position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #000; color: #f4efe6; font-family: Inter, sans-serif; }}
      .name span, .line span, .url span, .board span, .cap span {{ display: inline-block; }}
      .board {{ position: absolute; left: 160px; top: 690px; width: 1600px; text-align: center; font-family: 'Archivo Black', sans-serif; font-size: 46px; letter-spacing: .05em; z-index: 4; }}
      .board span {{ background: #f3e6c8; border-radius: 60px; padding: 12px 46px 12px 12px; box-shadow: 8px 8px 0 #b8371f; }}
      .board b {{ display: inline-block; width: 76px; height: 76px; line-height: 76px; border-radius: 50%; background: #e2562b; color: #f3e6c8; font-weight: 400; }}
      .board i {{ font-style: normal; display: inline-block; padding: 0 60px 0 30px; color: #2a1810; }}
      .board u {{ text-decoration: none; display: inline-block; color: #b8371f; }}
      .cap {{ position: absolute; left: 160px; top: 822px; width: 1600px; text-align: center; font-family: 'Oswald', sans-serif; font-size: 30px; letter-spacing: .3em; color: #c9b892; z-index: 4; }}
      #card {{ position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; background: #1c110b; z-index: 3; }}
      #stripes {{ position: absolute; left: 0; top: 440px; width: 1920px; height: 80px; z-index: 4; }}
      #stripes i {{ position: absolute; left: 0; width: 1920px; height: 16px; transform-origin: 0 50%; }}
      .name {{ position: absolute; left: 60px; top: 150px; width: 1800px; text-align: center; font-family: 'Archivo Black', sans-serif; font-size: 214px; letter-spacing: .01em; color: #f3e6c8; text-shadow: 5px 5px 0 #f0b53a, 10px 10px 0 #e2562b, 15px 15px 0 #b8371f, 20px 20px 0 #5e2414; transform: skewX(-10deg); z-index: 4; }}
      .line {{ position: absolute; left: 160px; top: 566px; width: 1600px; text-align: center; font-family: 'Playfair Display', serif; font-style: italic; font-size: 60px; color: #f3e6c8; z-index: 4; }}
      .sub {{ position: absolute; left: 160px; top: 1008px; width: 1600px; text-align: center; font-family: Inter, sans-serif; font-weight: 500; font-style: italic; font-size: 30px; color: #e8dcc0; z-index: 5; }}
      .sub span {{ display: inline-block; }} .sub b {{ display: inline-block; color: #f0b53a; font-weight: 800; text-transform: uppercase; }}
      .url {{ position: absolute; left: 160px; top: {896 if SOON else 916}px; width: 1600px; text-align: center; font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 50px; letter-spacing: .14em; color: #f0b53a; z-index: 4; }}
    </style>
  </head>
  <body>
    <!-- Golden Lap "Lights out" trailer. Generated by ../build_trailer.py. No music: opens flat out into the swoop, ends with the engine fading into the distance under the end card. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1920" data-height="1080">
{NL.join(vids)}
{NL.join(els)}
      <audio id="away" class="clip" src="assets/away.wav" data-start="{OUT}" data-duration="5.3" data-track-index="5" data-volume="1"></audio>{f'''
      <audio id="vo" class="clip" src="assets/{VO}" data-start="{OUT}" data-duration="7.32" data-track-index="6" data-volume="1.8"></audio>''' if SOON else ''}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      (() => {{
      const tl = gsap.timeline({{ paused: true }});
      {(NL + '      ').join(tl)}
      tl.to({{}}, {{ duration: 0.01 }}, {END - 0.02});
      window.__timelines["main"] = tl;
      }})();
    </script>
  </body>
</html>
""")
print('trailer', END, 's')

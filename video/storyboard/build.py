#!/usr/bin/env python3
"""Builds video/storyboard/storyboard.html: the Golden Lap film storyboard, stills embedded. Run from the repo root."""
import base64, html, json, os, sys
SB = sys.argv[1] if len(sys.argv) > 1 else 'video/storyboard/stills'
def img(n): return 'data:image/jpeg;base64,' + base64.b64encode(open(f'{SB}/{n}.jpg', 'rb').read()).decode()

# kind: hook | story | box | action | loop
P = [
 dict(t='0:00', d=20, clock=None, k='hook', title='Hook: Lights out', im='hook1',
  screen='The coming-soon trailer, end card removed. Five lights, three beeps, launch, six cuts flat out: swoop, rain coming up the hill, tunnel, golden hour, dusk, banking. HUD in every shot.',
  vo='Nothing. Engine only.', snd='Beeps, then the engine at full volume. No music.'),
 dict(t='0:20', d=18, clock='24:00:00', k='loop', loop='open1', title='"That isn\'t footage"', im='fxoff',
  screen='Freeze on a tape frame. The filter drops away to the flat world underneath, then snaps back. Huge red headline, marker style: CAN I BUILD A PRO F1 GAME IN ONE DAY? A 24-hour clock appears in the corner and starts counting down.',
  vo='That isn\'t onboard footage. There\'s no car. No track. No camera. I typed it. So here\'s the question. Can I build a proper Formula One game, in one day? Stay to the end, and I\'ll give you the link, so you can race me.',
  snd='Engine cuts dead on "I typed it".'),
 dict(t='0:38', d=8, clock='24:00:00', k='story', title='Title card', im=None, card=True,
  screen='Same banner as the Golden Hour Ride, plus logos: This Little Thing. / How I built a pro F1 game / with my friend Claude ✳ + Spacefast ◼ / One day. No code.',
  vo='(none)', snd='Music starts here, as in the Golden Hour film.'),
 dict(t='0:46', d=30, clock='24:00:00', k='story', title='Tuesday, 17:05: this video', im='start', dec=[1],
  screen='James on camera, the original YouTube Short playing on a screen beside him. He points at it as he talks: the helmet, the front tyre, the hands. Keep the Short brief and credit it on screen; it is someone else\'s footage. Then a cut to the chat with the one line typed. Caption: TUE 24 NOV · 17:05. The clock starts. TO SHOOT.',
  vo='To explain, we go back to a Tuesday evening, and this. Old Formula One onboard footage. Look where the camera is, on the driver\'s shoulder. The helmet. That front tyre. Two hands sawing at the wheel. And the picture, soft and washed out, like a tape that\'s been played too many times. So I asked Claude one question: could we make a racing game in a browser that looks like this? Not in a game engine. One web page.',
  snd='Music under; engine bed low.'),
 dict(t='1:16', d=30, clock='23:40:00', k='box', box='01', title='The look is the camera, and the tape', im='fxon', dec=[2],
  screen='Filter off / on, wiping across a moving lap. Callouts: 432 lines of "tape". 32% of each frame bleeds into the next. Bent lens. Colour smeared sideways. Caption at 17:25: TWENTY MINUTES IN.',
  vo='Its first answer surprised me. It said most of that look isn\'t the car, or the track. It\'s the camera, and the tape. So it built a plain little world, which is, frankly, rubbish. Then it ran the picture through a filter. And twenty minutes in, the same frame turned into footage.',
  snd='Engine comes up between lines.'),
 dict(t='1:46', d=8, clock=None, k='action', title='Action break: the tunnel', im='tunnel',
  screen='Eight seconds flat out through the tunnel. No words, no graphics except the HUD.', vo='(none)', snd='Engine at full volume, tunnel echo.'),
 dict(t='1:54', d=45, clock=None, k='box', box='02', title='Why is it so watchable?', im='goldenlines', dec=[3],
  screen='Freeze the tunnel frame. Draw the golden lines on: the horizon sits on the top line, the vanishing point on the top-right crossing. Then the three side-by-sides: eye at 0.95 m vs 1.70 m, lens 92° vs 60°, blur on vs off. End on the five camera numbers typed out.',
  vo='So why is it so watchable? I assumed some maths, the golden ratio maybe. It wasn\'t. The whole camera is five numbers, tuned by eye. And yet, look. The horizon lands on the golden line. The tunnel disappears right on the golden point. Raise the camera to head height, and the speed goes. Narrow the lens, and the walls slow down. Turn the blur off, and it\'s a video game again. It didn\'t use a formula. It copied the spot where teams in the nineties bolted their cameras, the one place on a car where speed looks terrifying.',
  snd='Each comparison plays with its own engine sound.'),
 dict(t='2:39', d=22, clock='23:32:00', k='story', title='Looking: not quite', im='nosebefore',
  screen='Rapid "before" stills, each struck out in red marker: wheel hovering in the barrier, a black slab for a shadow, no tyre marks. Then the helmet, circled: PERFECT. DO NOT TOUCH.',
  vo='Then I started looking. That\'s the whole job, really. You look, and say what\'s wrong. The wheel hovered in the barrier. The shadow was a black slab. One thing at a time, it fixed them. The one thing I never asked it to change, was the helmet.',
  snd='Music, engine low.'),
 dict(t='3:01', d=25, clock='23:25:00', k='box', box='03', title='A greatest-hits circuit', im='corners', dec=[4],
  screen='Track drawn from the game\'s real control points: sixty dots, curve, ticks, tarmac, kerbs, height. Each famous corner lights up with its caption as the real footage of it plays.',
  vo='The track is a greatest hits. A swoop like Spa. A long right like Monza. The tunnel from Monaco. It starts as sixty dots, a curve through every one, chopped every three metres, six metres of tarmac each side, and a kerb wherever the curve is tight. One lap. About a minute.',
  snd='Engine up on each corner name.'),
 dict(t='3:26', d=20, clock='23:26:00', k='story', title='Online in 34 minutes', im='hud', dec=[5],
  screen='Caption 17:39: LIVE. The public address appears. First lap posted: 1:44.066 · JAMIE M. The computer\'s lap beside it: 1:10.8.',
  vo='Thirty-four minutes in, it was online, with a leaderboard for the whole world, published by Spacefast. So I had a go. One minute forty-four. The computer, which never misses a braking point, did one minute ten.',
  snd='A flat little thud on 1:44.'),
 dict(t='3:46', d=30, clock='22:20:00', k='box', box='04', title='The sound is the speed', im='dusk', dec=[6],
  screen='Engine to full volume; the shouted lines slammed up on screen. Then the four loops drawn as pitch lines (125, 154, 250, 285 Hz) cross-fading as the revs climb.',
  vo='(shouted) That engine isn\'t a real car! I described it in words! And ElevenLabs made it! (engine cuts) Sorry. Claude can\'t hear, so it measured the pitch of every loop, kept the four that held steady, and threw the rest away.',
  snd='Engine up 6 dB, then dead silence.'),
 dict(t='4:16', d=20, clock='11:00:00', k='loop', loop='open2', title='Midpoint: the bet', im='helmet-live', dec=[7],
  screen='Overnight time-lapse on the clock. Caption WED 06:02. A scoreboard appears in the corner and stays: COMPUTER 1:05.1 · ME —',
  vo='Next morning I had a slightly silly idea. What if I didn\'t use the keyboard at all? What if I just held my hands up, like a wheel? So here\'s a second question. The computer laps in about a minute. Can I beat it, with my bare hands?',
  snd='Music drops to a pulse.'),
 dict(t='4:36', d=25, clock='10:52:00', k='box', box='05', title='How a webcam becomes a steering wheel', im='grid', dec=[8],
  screen='The camera view: knuckles found, a yellow line between them, its tilt becoming the wheel angle. Fists close: the brake lamp lights. The player dressed as the driver, in the helmet.',
  vo='The camera finds my two hands. The tilt of the line between them is the steering. Squeeze, and it brakes, like you would on a real wheel. And because it can see me, it puts me in the helmet.',
  snd='Engine revving on the grid with the hands.'),
 dict(t='5:01', d=20, clock='03:53:00', k='action', title='Laps falling', im='golden', 
  screen='Fast cuts at full speed, the corner scoreboard ticking down: 1:06.592 (keyboard) → 1:00.340 (hands, 13:12).',
  vo='One minute six on the keyboard. One minute, point three four, with my hands. A third of a second over.', snd='Engine, short.'),
 dict(t='5:21', d=18, clock='03:12:00', k='loop', loop='close2', title='Loop 2 closed: 0:53.5', im='hud',
  screen='Real pause, then 0:53.513 slams onto the scoreboard against the computer\'s 1:00.3. Small honest caption: two corners before the tunnel were opened up first.',
  vo='Two corners before the tunnel were slowing everyone down, so we opened them up. On the new lap, the computer did one minute flat. And me? Fifty-three point five. With my hands.',
  snd='Silence for the pause, then the engine.'),
 dict(t='5:39', d=25, clock='00:00:00', k='loop', loop='close1', title='Loop 1 closed: the clock runs out', im='raintun', dec=[9],
  screen='The clock hits 00:00:00 at WED 17:05. What one day made, ticked off over action: 40 versions · online · world leaderboard · steer with your hands · challenge links · weather.',
  vo='Twenty-four hours. Forty versions. A game you steer with your hands, online, with a leaderboard, that looks like old tape. Is it pro? You can judge that for yourself. But it did something none of the games I own do. And then a stranger played it, and it broke.',
  snd='Music resolves; the last line lands on silence.'),
 dict(t='6:04', d=30, clock=None, k='box', box='06', title='The black box', im='diagnostics', loop='open3',
  screen='The real diagnostics panel. 45 identical errors in three bursts. Zoom on the line: Cannot read properties of undefined (reading \'x\'). Draw the hand with no fingers.',
  vo='After about five laps, the steering died. Claude guessed my laptop overheating. Wrong. Then my arms getting tired. Also wrong. It has no camera, and no hands, so it built a black box, a panel that records everything. One screenshot later: every couple of minutes, the tracker handed back a hand with no fingers.',
  snd='Music thins to ticking.'),
 dict(t='6:34', d=25, clock=None, k='action', title='It didn\'t stop at one day', im='swooprain', dec=[10, 11, 12],
  screen='Full-speed montage, one decision per cut: rain borrowed from the cycling game · the phone as a steering wheel · puddles that reflect · front wheels kept on the road at Eau Rouge · the sponsor banner cut because nobody can read it at 280.',
  vo='(light) I couldn\'t stop. Rain, borrowed from my cycling game. My phone as a steering wheel. Puddles. And a sponsor banner, which I cut, because at two hundred and eighty, nobody can read it.',
  snd='Engine and music together, the loudest moment.'),
 dict(t='6:59', d=25, clock=None, k='hook', title='Payoff: back to the tape', im='endcard', loop='close3',
  screen='The opening frame again. Filter off, then on. End card from the trailer, with the Claude and Spacefast logos and the address.',
  vo='None of it needed me to write code. It needed an eye, and the patience to keep saying, not quite. The link\'s below. My time\'s on the board. Come and beat it.',
  snd='Engine fades into the distance.'),
]
DEC = [
 (1, 'TUE 17:10', 'One web page, not a game engine', 'Three.js in a single file. No downloads, no build step; anyone can open the link and play.'),
 (2, 'TUE 17:06', 'The look is the camera and the tape, not the graphics', '"About 70% of the look is one shader." Low-poly trees stop mattering once the tape is on.'),
 (3, 'TUE 17:20', 'Tune the camera by eye against the reference', 'Lowered, levelled, 80° to 92° lens, axle 0.5 m closer. Five numbers, no formula.'),
 (4, 'TUE 17:30', 'An original lap built from the best corners, about a minute long', 'Borrows corner shapes, copies no real track. A minute means one more go.'),
 (5, 'TUE 17:39', 'Online straight away, one shared leaderboard', 'Published by Spacefast 34 minutes in. A board turns a demo into a game.'),
 (6, 'TUE 18:45', 'A described engine over a synthesised one', 'ElevenLabs loops, measured by pitch, cross-faded with the revs. "The sound is incredibly important."'),
 (7, 'WED 06:02', 'Steer with your hands', 'Real analogue steering from a webcam, which the keyboard could never give.'),
 (8, 'THU', 'Squeeze to brake, full throttle at rest', 'From the first user test. How you would grip a real wheel.'),
 (9, 'WED', 'Beginner and Pro', 'The car picks the speed in Beginner, so a newcomer only steers.'),
 (10, 'THU', 'Copy what already worked', 'The rain and the road surface came from the cycling game.'),
 (11, 'THU', 'The phone becomes the main wheel', 'Haptics, tilt to steer, and start or go again from across the room.'),
 (12, 'SAT', 'Cut what can\'t be read at speed', 'The Spacefast banner: lovely in a still, a blur at 280 km/h.'),
]
KIND = {'hook': 'Hook', 'story': 'Story', 'box': 'Inside the black box', 'action': 'Action', 'loop': 'Loop'}
LOOP = {'open1': 'Opens loop 1', 'close1': 'Closes loop 1', 'open2': 'Opens loop 2', 'close2': 'Closes loop 2', 'open3': 'Opens loop 3', 'close3': 'Closes loop 3'}
def secs(t): m, s = t.split(':'); return int(m) * 60 + int(s)
TOTAL = secs(P[-1]['t']) + P[-1]['d']
e = html.escape
cards = []
for i, p in enumerate(P):
    pic = f'<img src="{img(p["im"])}" alt="" loading="lazy">' if p['im'] else ('<div class="tcard"><div class="tl">This Little Thing.</div><div class="th">How I built a pro F1 game</div><div class="tw">with my friend <b>Claude</b> <span class="lg c">✳</span> + <b>Spacefast</b> <span class="lg s"></span></div><div class="tn">One day. No code.</div></div>')
    chips = f'<span class="chip k-{p["k"]}">{KIND[p["k"]]}{" · " + p["box"] if p.get("box") else ""}</span>'
    if p.get('loop'): chips += f'<span class="chip lp">{LOOP[p["loop"]]}</span>'
    if p.get('dec'): chips += ''.join(f'<a class="chip dc" href="#d{n}">Decision {n}</a>' for n in p['dec'])
    clock = f'<span class="clk">{p["clock"]}</span>' if p['clock'] else ''
    cards.append(f'''<article class="panel k-{p["k"]}" id="p{i+1}">
  <div class="frame">{pic}<span class="tc">{p["t"]}</span>{clock}</div>
  <div class="body">
    <div class="chips">{chips}</div>
    <h3><span class="n">{i+1:02d}</span>{e(p["title"])}</h3>
    <dl><dt>Picture</dt><dd>{e(p["screen"])}</dd><dt>Voice</dt><dd class="vo">{e(p["vo"])}</dd><dt>Sound</dt><dd>{e(p["snd"])}</dd></dl>
  </div></article>''')
decs = ''.join(f'<li id="d{n}"><span class="dn">{n}</span><div><div class="dt">{e(when)}</div><b>{e(what)}</b><p>{e(why)}</p></div></li>' for n, when, what, why in DEC)
segs = json.dumps([[secs(p['t']), p['d'], p['k'], i + 1] for i, p in enumerate(P)])
loops = json.dumps([[secs(P[1]['t']), secs(P[15]['t']) + P[15]['d'], 'Loop 1 · one day?', 1], [secs(P[11]['t']), secs(P[14]['t']) + P[14]['d'], 'Loop 2 · beat the computer', 2], [secs(P[16]['t']), secs(P[18]['t']) + 10, 'Loop 3 · it broke', 3]])
tpl = open(os.path.join(os.path.dirname(__file__), 'template.html')).read()
out = tpl.replace('{{CARDS}}', '\n'.join(cards)).replace('{{DECS}}', decs).replace('{{SEGS}}', segs).replace('{{LOOPS}}', loops).replace('{{TOTAL}}', str(TOTAL)).replace('{{RUNTIME}}', f'{TOTAL // 60}:{TOTAL % 60:02d}')
open('video/storyboard/storyboard.html', 'w').write(out)
print('storyboard', TOTAL, 's', len(out) // 1024, 'KB')

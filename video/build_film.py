#!/usr/bin/env python3
"""Builds the Golden Lap film as a HyperFrames project in film/.

The cut is driven by the voiceover: each scene's start is fixed, and cues inside a scene are placed where a phrase falls
in that scene's text (a steady voice makes position in the text a fair guide to time).
When the real voice is recorded, put the takes in film/assets/vo/, correct the durations in vo/scenes.json, and run this again.

Run from video/:  python3 build_film.py   then   cd film && npm run check && npm run render
"""
import json, math, re

SC = json.load(open('vo/scenes.json'))
DUR = {int(k): v['dur'] for k, v in SC.items()}
TXT = {int(k): v['text'] for k, v in SC.items()}
LAST = max(DUR)

# ---- when each scene's voice starts. The film opens on three seconds of engine before a word is said.
GAP = {1: 0.6 + 5.0 + 0.6, 4: 1.3, 8: 1.4, 9: 2.6, 10: 2.2}      # after 1: the title card; after 4: the engine has just cut out; after 8: the near miss sinks in; after 9 and 10: silence round the turn
START, t = {}, 3.4
for n in range(1, LAST + 1):
    START[n] = round(t, 2); t += DUR[n] + GAP.get(n, 0.9)
TITLE = round(START[1] + DUR[1] + 0.6, 2)
END = round(START[LAST] + DUR[LAST] + 6.0, 2)
S = START

def at(n, phrase, off=0.0):
    """Time at which `phrase` is spoken in scene n."""
    i = TXT[n].index(phrase)
    return round(START[n] + DUR[n] * (i / len(TXT[n])) * 0.985 + 0.15 + off, 2)

# ---- picture: (start, clip, where in the clip, game sound level, playback rate). Each runs until the next one starts.
# Lap clip landmarks (seconds): 0 grid, 4 launch, 9 swoop, 15 climb, 19 long right, 30 esses, 35 city, 38-44 tunnel, 45 harbour, 52 long left, 60 slalom, 68 two rights, 73 banking, 77 main straight.
fx0 = round(at(3, 'Then it ran') - 6.5, 2)           # the filter switches on 6.5 s into that clip, on the word
shout, sorry = at(4, 'That engine', -0.5), at(4, 'Sorry.', -0.3)
PIC = [
    # the hook: three seconds that pass for tape, the filter dropped to show it is not, then the bet
    (0.0, 'lap', 39.3, 1.0, 1), (S[1] - 0.15, 'fx', 8.2, .3, 1), (at(1, "There's no car"), 'fx', 0.6, .3, 1), (at(1, 'I typed it', 0.25), 'fx', 6.15, .3, 1),
    (at(1, 'This is a racing game'), 'lap', 42.4, .36, 1), (at(1, 'No wheel.'), 'lap', 73.0, .34, 1), (at(1, 'I built it'), 'raintunnel', 6.0, .36, 1),
    (at(1, 'Now, the computer'), 'lap', 19.5, .34, 1), (at(1, "So here's the bet"), 'lap', 76.0, .44, 1),
    (TITLE, 'lap', 40.0, .3, 1),
    (TITLE + 5.0, 'lap', 7.0, .10, 1), (at(2, 'The camera sits'), 'lap', 9.5, .18, 1), (at(2, 'So I opened'), 'lap', 19.0, .10, 1),
    (S[3], 'lap', 14.0, .18, 1), (fx0, 'fx', 0.0, .18, 1), (fx0 + 13.6, 'lap', 0.6, .30, 1),
    (S[4], 'lap', 45.0, .18, 1), (at(4, 'The front wheel'), 'lap', 52.0, .16, 1), (at(4, "The driver's head"), 'lap', 11.5, .16, 1), (at(4, 'Then sound'), 'lap', 35.0, .3, 1),
    (shout, 'lap', 37.8, 1.0, 1), (sorry, 'lap', 46.5, 0, 1),                                  # the engine at full volume, shouted over; then it cuts dead
    (S[5], 'lap', 8.6, .22, 1), (at(5, 'A long right'), 'lap', 19.5, .22, 1), (at(5, 'The tunnel'), 'lap', 39.0, .3, 1), (at(5, 'And to test it'), 'lap', 60.0, .24, 1), (at(5, 'And it laps'), 'lap', 77.0, .3, 1),
    (S[6] - 0.5, 'lap', 14.5, .08, 1),
    (S[7], 'lap', 26.0, .18, 1), (at(7, 'We tried four'), 'lap', 53.0, .18, 1), (at(7, 'Then I had'), 'lap', 60.0, .1, 1),
    (S[8], 'lap', 40.0, .1, 1), (at(8, 'And because'), 'lap', 48.0, .1, 1), (at(8, 'And I got faster'), 'newcorners', 2.0, .3, 1),
    (S[9], 'lap', 34.0, .2, 1), (at(9, 'On the new lap'), 'lap', 76.5, .26, 1), (at(9, 'And me?'), 'lap', 72.2, .12, 1), (at(9, 'Fifty-three'), 'lap', 38.6, .5, 1),
    (S[10] - 1.6, 'newcorners', 14.0, 0, .3), (at(10, "Claude's first theory"), 'lap', 58.0, .07, 1), (at(10, 'I drove until'), 'lap', 5.0, .07, 1),
    (S[11], 'newcorners', 4.0, .24, 1), (at(11, 'Rain.'), 'raintunnel', 3.0, .28, 1), (at(11, 'Fog.'), 'weather', 5.2, .22, 1), (at(11, 'You can even'), 'lap', 30.0, .2, 1),
    (at(11, 'More than fifty'), 'lap', 39.0, .26, 1), (at(11, 'The lap is longer'), 'newcorners', 16.0, .24, 1), (at(11, "The link's below"), 'lap', 78.5, .16, 1),
]
# ---- darkening over the picture where words or stills need to read: (from, to, strength)
DIM = [(at(1, "So here's the bet"), TITLE, .3), (TITLE, TITLE + 5.0, .5), (TITLE + 5.0, at(2, 'The camera sits'), .58),
       (at(2, 'So I opened'), S[3], .52), (sorry, S[5] - 0.2, .45), (at(5, 'And it laps'), S[6] - 0.5, .4), (S[6] - 0.5, S[7] - 0.1, .86),
       (at(7, 'Then I had'), S[8], .52), (S[8], at(8, 'And I got faster'), .5), (at(9, 'On the new lap'), at(9, 'Fifty-three') + 0.4, .4), (S[10] - 1.6, S[11] - 0.3, .64), (at(11, 'The lap is longer'), END, .42)]
# ---- stills laid over the picture: (from, to, file, x, y, width)
STILL = [(at(1, 'No wheel.') + 0.3, at(1, 'I built it') - 0.2, 'helmet-live', 1010, 500, 720),
         (S[8] + 0.5, at(8, 'And because') - 0.3, 'helmet-painted', 830, 250, 900), (at(8, 'And because') + 0.2, at(8, 'And I got faster') - 0.3, 'helmet-live', 830, 250, 900),
         (at(10, 'I drove until') + 1.0, S[11] - 0.8, 'diagnostics', 80, 250, 1760)]

G = '#f3e36b'
# The two logos on the title card: Claude's spark (as used on the Golden Hour Ride title) and Spacefast's mark, from spacefast.com/favicon.svg.
_old = open('../../scratch-2026-11-12-bdd453/this-little-thing/compositions/title.html').read()
CLAUDE_LOGO = '<svg viewBox="0 0 24 24" width="62" height="62" style="vertical-align:-10px;margin:0 12px 0 14px"><path fill="#D97757" d="%s"/></svg>' % re.search(r'<path fill="#D97757" d="([^"]+)"', _old).group(1)
SPACEFAST_LOGO = '<svg viewBox="0 0 1024 1024" width="62" height="62" style="vertical-align:-10px;margin:0 14px 0 0"><rect width="1024" height="1024" rx="150" fill="#1EFE57"/><path fill="#000" transform="translate(21.6902 22.4527) scale(3.48975)" d="%s"/></svg>' % re.search(r' d="([^"]+)"', open('logo-src/favicon.svg').read()).group(1)

# ---- words on screen, by scene: (kind, from, to, text, extra style)
def shot(a, b, what, y=560): return ('shot', a, b, f'<b>To shoot</b>{what}', f'top:{y}px')
OV = {
 'cold': (0, TITLE, [
    ('kick', 0.5, S[1] - 0.3, 'Onboard camera', 'top:140px'),
    ('line', S[1] + 0.1, at(1, "There's no car") - 0.15, 'That isn&rsquo;t footage.', 'top:150px'),
    ('step', at(1, "There's no car"), at(1, 'This is a racing game') + 1.3, 'No car', 'top:150px'), ('step', at(1, 'No track.'), at(1, 'This is a racing game') + 1.3, 'No track', 'top:210px'),
    ('step', at(1, 'No engine.'), at(1, 'This is a racing game') + 1.3, 'No engine', 'top:270px'), ('cap', at(1, 'I typed it') + 0.1, at(1, 'This is a racing game') + 1.3, 'I typed it.', 'top:360px'),
    shot(at(1, 'This is a racing game') + 1.5, at(1, 'I built it') - 0.2, 'You at the webcam, hands up like a wheel, the game on screen behind', 600),
    ('kick', at(1, 'No wheel.') + 0.6, at(1, 'I built it') - 0.2, 'No wheel. No controller. A webcam.', 'top:140px'),
    ('kick', at(1, 'I built it') + 0.2, at(1, 'Now, the computer') - 0.2, 'One weekend. No code.', 'top:140px'),
    ('kick', at(1, 'Now, the computer') + 0.2, TITLE - 0.1, 'The computer&rsquo;s lap', 'top:330px'), ('big', at(1, 'one minute') - 0.1, TITLE - 0.1, '1:00', 'top:390px'),
    ('line', at(1, 'Can I beat it'), TITLE - 0.1, 'Can I beat it with my bare hands?', 'top:150px'),
    ('kick', at(1, 'Stay to the end') + 0.3, TITLE - 0.1, 'The link is at the end. So you can beat me.', 'top:880px'),
 ]),
 'title': (TITLE, TITLE + 5.0, [
    ('tk', TITLE + 0.5, TITLE + 5.0, 'This Little Thing.', ''), ('tov', TITLE + 0.9, TITLE + 5.0, 'How I built a racing game', ''),
    ('ts', TITLE + 1.7, TITLE + 5.0, f'with {CLAUDE_LOGO}Claude <span style="font-style:normal;opacity:.7;margin:0 18px">+</span> {SPACEFAST_LOGO}Spacefast', ''),
    ('tt', TITLE + 2.6, TITLE + 5.0, 'Bare hands. &nbsp;One weekend. &nbsp;No code.', ''),
 ]),
 'setup': (TITLE + 5.0, S[3], [
    ('kick', S[2] + 0.2, at(2, 'The camera sits') - 0.2, 'The start of the weekend', 'top:140px'),
    shot(S[2] + 0.9, at(2, 'The camera sits') - 0.2, 'The old onboard clip that started it, or you describing it to camera', 560),
    ('tag', at(2, 'You see the helmet') + 0.3, at(2, 'So I opened') - 0.3, 'the helmet', 'left:1380px;top:300px'),
    ('tag', at(2, 'the front tyre') + 0.2, at(2, 'So I opened') - 0.3, 'the front tyre', 'left:330px;top:470px'),
    ('tag', at(2, 'and two hands') + 0.2, at(2, 'So I opened') - 0.3, 'hands on the wheel', 'left:830px;top:880px'),
    ('typed', at(2, 'Could we make') - 1.2, S[3] - 0.3, '<b>What I typed</b>do you think we could make a browser based racing sim that looked like this?', 'top:420px'),
 ]),
 'look': (S[3], S[4], [
    ('line', at(3, 'It said most'), fx0 - 0.2, 'Most of the look is the camera, and the tape.', 'top:150px'),
    ('kick', fx0 + 0.4, fx0 + 6.3, 'Filter off', 'top:140px'), ('kick', fx0 + 6.7, fx0 + 13.4, 'Filter on', 'top:140px'),
    ('step', at(3, 'Bend the lens'), at(3, 'Twenty minutes') + 1.4, 'Bend the lens', 'top:760px'), ('step', at(3, 'Smear the colour'), at(3, 'Twenty minutes') + 1.4, 'Smear the colour', 'top:820px'),
    ('step', at(3, 'Blow out the sky'), at(3, 'Twenty minutes') + 1.4, 'Blow out the sky', 'top:880px'),
    ('kick', fx0 + 13.9, S[4] - 0.3, 'Twenty minutes in', 'top:140px'),
 ]),
 'looking': (S[4], S[5], [
    ('line', at(4, 'You look, and') - 0.1, at(4, 'The front wheel') - 0.3, 'You look. You say what&rsquo;s wrong.', 'top:150px'),
    ('step', at(4, 'The front wheel'), at(4, "The driver's head") - 0.3, 'A wheel hovering in the barrier', 'top:150px'),
    ('step', at(4, 'There was a black slab'), at(4, "The driver's head") - 0.3, 'A black slab for a shadow', 'top:210px'),
    ('step', at(4, 'The road had no'), at(4, "The driver's head") - 0.3, 'No tyre marks, so no speed', 'top:270px'),
    ('tag', at(4, "The driver's head") + 0.4, at(4, 'The one thing') - 0.2, 'the head bobs in the mirror', 'left:420px;top:560px'),
    ('cap', at(4, 'The helmet was perfect') - 0.1, at(4, 'Then sound') + 0.7, 'The helmet was perfect.', 'top:160px'),
    # shouted over the engine: the words go up big so they can be followed when the voice cannot
    ('kick', shout + 0.2, sorry - 0.1, '(shouting over the engine)', 'top:140px'),
    ('yell', at(4, 'That engine'), at(4, 'I described it') - 0.1, 'Not a recording of a real car!', ''), ('yell', at(4, 'I described it'), at(4, 'And ElevenLabs') - 0.1, 'I described it, in words!', ''),
    ('yell', at(4, 'And ElevenLabs'), at(4, 'Five loops') - 0.1, 'ElevenLabs made it!', ''), ('yell', at(4, 'Five loops'), sorry - 0.1, 'Five loops, blended as the revs climb!', ''),
    ('cap', sorry + 0.2, S[5] - 0.3, 'Sorry.', 'top:460px'),
 ]),
 'circuit': (S[5], S[6] - 0.5, [
    ('kick', S[5] + 0.3, at(5, 'A swoop') - 0.2, 'One lap. The best corners from the best circuits.', 'top:140px'),
    ('cap', at(5, 'A swoop'), at(5, 'And to test it') + 0.5, 'A swoop like Spa', 'top:150px'), ('cap', at(5, 'A long right'), at(5, 'And to test it') + 0.5, 'A long right like Monza', 'top:250px'),
    ('cap', at(5, 'The tunnel'), at(5, 'And to test it') + 0.5, 'The tunnel, from Monaco', 'top:350px'),
    ('kick', at(5, 'And to test it') + 0.9, at(5, 'And it laps') - 0.2, 'The game&rsquo;s own driver', 'top:140px'), ('step', at(5, 'It never misses'), at(5, 'And it laps') - 0.2, 'Never misses a braking point', 'top:204px'),
    ('kick', at(5, 'And it laps') + 0.2, S[6] - 0.8, 'The time to beat', 'top:330px'), ('big', at(5, 'one minute') - 0.1, S[6] - 0.8, '1:00', 'top:390px'),
 ]),
 'problem': (S[7], S[8], [
    ('kick', S[7] + 0.2, at(7, 'On a keyboard') - 0.2, 'My first lap', 'top:140px'), ('big', at(7, 'one minute forty-four') - 0.1, at(7, 'On a keyboard') - 0.2, '1:44.066', 'top:200px;font-size:176px'),
    ('line', at(7, 'Tap a key'), at(7, 'Then I had') - 0.3, 'Tap a key, and the car twitched.', 'top:470px'),
    ('kick', at(7, 'We tried four') + 0.1, at(7, 'Then I had') - 0.3, 'Four attempts to fix the steering', 'top:140px'), ('big', at(7, 'one minute six') - 0.1, at(7, 'Then I had') - 0.3, '1:06.592', 'top:200px;font-size:176px'),
    ('step', at(7, 'Still six seconds') - 0.5, at(7, 'Then I had') + 0.2, 'Still six seconds short', 'top:590px'),
    shot(at(7, 'Then I had') + 0.5, S[8] - 0.3, 'You, lifting your hands off the keyboard and holding them up like a wheel', 520),
    ('line', at(7, 'So what if') - 0.1, S[8] - 0.3, 'What if I just held my hands up?', 'top:150px'),
 ]),
 'hands': (S[8], S[9], [
    ('step', at(8, 'The tilt'), at(8, 'And because') - 0.3, 'Tilt = steering', 'top:330px;width:560px'), ('step', at(8, 'Squeeze'), at(8, 'And because') - 0.3, 'Squeeze = brake', 'top:400px;width:560px'),
    ('step', at(8, 'it puts me in the helmet'), at(8, 'And I got faster') - 0.3, 'In the helmet, in the car, on the track', 'top:330px;width:560px'),
    ('kick', at(8, 'And I got faster') + 0.3, S[9] - 0.3, 'With my hands', 'top:140px'), ('big', at(8, 'One minute, point') - 0.1, S[9] - 0.3, '1:00.340', 'top:200px;font-size:176px'),
    ('cap', at(8, 'A third of a second'), S[9] - 0.3, 'A third of a second over.', 'top:470px'),
 ]),
 'win': (S[9], S[10] - 1.6, [
    ('kick', S[9] + 0.2, at(9, 'And me?') - 0.2, 'Two slow corners before the tunnel', 'top:140px'), ('step', S[9] + 0.9, at(9, 'And me?') - 0.2, '78 and 103 km/h', 'top:204px'),
    ('step', at(9, 'So we opened'), at(9, 'And me?') - 0.2, 'Opened up: 134 km/h at the slowest', 'top:264px'),
    ('line', at(9, 'On the new lap') + 0.4, at(9, 'Fifty-three') + 0.5, 'The computer, on the new lap: 1:00.3', 'top:470px'),
    ('kick', at(9, 'Fifty-three') + 0.7, S[10] - 1.9, 'With my hands', 'top:140px'), ('big', at(9, 'Fifty-three') + 0.6, S[10] - 1.9, '0:53.513', 'top:200px;color:#8fe08a;font-size:176px'),
    ('cap', at(9, 'Nearly seven'), S[10] - 1.9, 'Nearly seven seconds quicker than the machine.', 'top:470px'),
 ]),
 'turn': (S[10] - 1.6, S[11] - 0.3, [
    ('big', S[10] + 0.1, at(10, 'After about') + 2.4, 'One more problem.', 'top:420px;font-size:140px;color:#f4efe6'),
    ('card', at(10, "Claude's first theory"), at(10, 'And it couldn') + 0.6, '<b>Theory 1</b>The laptop is overheating', 'left:192px'), ('stamp', at(10, 'Wrong.') + 0.1, at(10, 'And it couldn') + 0.6, 'Wrong', 'left:540px;top:560px'),
    ('card', at(10, 'Its second was'), at(10, 'And it couldn') + 0.6, '<b>Theory 2</b>Tired arms, dropping out of shot', 'left:1010px'), ('stamp', at(10, 'Also wrong') + 0.1, at(10, 'And it couldn') + 0.6, 'Also wrong', 'left:1290px;top:560px'),
    ('line', at(10, 'And it couldn') + 1.0, at(10, 'So it built') + 0.2, 'It has no camera. And no hands.', 'top:440px'),
    ('line', at(10, 'So it built') + 0.5, at(10, 'I drove until') + 0.8, 'So it built a black box.', 'top:440px'),
    ('kick', at(10, 'I drove until') + 1.2, S[11] - 1.0, 'The screenshot I sent back', 'top:170px'),
    ('ring', at(10, 'And there it was') + 0.2, S[11] - 1.0, '', 'left:100px;top:466px;width:1010px;height:44px'),
    ('line', at(10, 'reports a hand') - 0.1, at(10, 'It had been there') - 0.2, 'A hand with no fingers.', 'top:700px'),
    ('cap', at(10, 'It had been there'), S[11] - 0.9, 'There since the very first day.', 'top:700px'),
 ]),
 'payoff': (S[11] - 0.3, END, [
    ('kick', S[11] + 0.5, at(11, 'More than fifty') - 0.2, 'The corners F1 drivers say they love', 'top:140px'), ('kick', at(11, 'Rain.') + 0.1, at(11, 'More than fifty') - 0.2, 'Rain', 'top:204px'),
    ('kick', at(11, 'Fog.') + 0.1, at(11, 'More than fifty') - 0.2, 'Fog', 'top:268px'), ('kick', at(11, 'You can even') + 0.1, at(11, 'More than fifty') - 0.2, 'Your phone as the wheel', 'top:332px'),
    ('line', at(11, 'More than fifty') + 0.15, at(11, 'The lap is longer') - 0.3, '50+ versions. One weekend. No code.', 'top:150px'),
    ('cap', at(11, 'It needed an eye') + 0.1, at(11, 'The lap is longer') - 0.3, 'It needed an eye, and the patience to say: not quite.', 'top:240px'),
    ('kick', at(11, 'The lap is longer') + 0.2, at(11, "The link's below") - 0.2, 'A longer lap. A fresh leaderboard.', 'top:330px'), ('big', at(11, 'So first place') - 0.1, at(11, "The link's below") - 0.2, 'P1: ?', 'top:390px'),
    ('tk', at(11, "The link's below") + 0.2, END, 'Have a drive. And beat me, if you can.', 'top:380px'), ('tov', at(11, "The link's below") + 0.7, END, 'golden-lap.space.fast', 'top:450px;font-size:104px'),
 ]),
}

CSS = f"""#root{{position:absolute;inset:0;font-family:Inter,sans-serif;color:#f4efe6}}
.in{{display:block}}
.kick{{position:absolute;left:192px;width:1500px;font-size:30px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:{G}}}
.kick .in,.step .in,.tag .in{{display:inline-block;background:rgba(14,15,17,.72);padding:10px 18px}}
.line .in,.cap .in{{display:inline-block;background:rgba(14,15,17,.62);padding:10px 22px}}
.line{{position:absolute;left:192px;width:1500px;font-size:68px;line-height:1.12;font-weight:700;text-shadow:0 2px 18px rgba(0,0,0,.6)}}
.cap{{position:absolute;left:192px;width:1500px;font-family:'EB Garamond',serif;font-size:78px;font-style:italic;line-height:1.15;text-shadow:0 2px 18px rgba(0,0,0,.7)}}
.big{{position:absolute;left:192px;width:1560px;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:230px;line-height:1;color:{G};text-shadow:6px 0 0 rgba(255,0,80,.35),-6px 0 0 rgba(0,200,255,.3)}}
.yell{{position:absolute;left:192px;top:240px;width:1560px;font-weight:700;font-size:112px;line-height:1.02;text-transform:uppercase;color:#fff;text-shadow:0 4px 0 rgba(0,0,0,.55),6px 0 0 rgba(255,0,80,.4),-6px 0 0 rgba(0,200,255,.35)}}
.step{{position:absolute;left:192px;width:1300px;font-family:'JetBrains Mono',monospace;font-size:36px;font-weight:700}}
.tag{{position:absolute;font-family:'JetBrains Mono',monospace;font-size:30px;font-weight:700;color:{G}}}
.tag .in{{border-left:5px solid {G}}}
.typed{{position:absolute;left:192px;width:1400px;font-family:'JetBrains Mono',monospace;font-size:40px;line-height:1.35}}
.typed .in{{display:inline-block;background:rgba(14,15,17,.86);border:1px solid rgba(244,239,230,.3);padding:22px 28px}}
.typed b{{display:block;font-family:Inter,sans-serif;font-size:28px;letter-spacing:.16em;text-transform:uppercase;color:{G};margin-bottom:10px}}
.shot{{position:absolute;left:192px;width:900px;border:3px dashed rgba(244,239,230,.55);font-family:'EB Garamond',serif;font-size:40px;line-height:1.25}}
.shot .in{{padding:26px 30px;background:rgba(14,15,17,.55)}}
.shot b,.card b{{display:block;font-family:Inter,sans-serif;font-size:28px;letter-spacing:.18em;text-transform:uppercase;color:{G};margin-bottom:12px;font-weight:700}}
.card{{position:absolute;top:400px;width:720px;font-family:'EB Garamond',serif;font-size:58px;line-height:1.15}}
.card .in{{padding:32px 36px;border:2px solid rgba(244,239,230,.4);background:rgba(14,15,17,.6)}}
.stamp{{position:absolute;font-family:'JetBrains Mono',monospace;font-size:64px;font-weight:700;color:#ff5a3a;text-transform:uppercase;letter-spacing:.08em}}
.stamp .in{{display:inline-block;border:6px solid #ff5a3a;padding:6px 22px;background:rgba(14,15,17,.7)}}
.ring{{position:absolute}} .ring .in{{width:100%;height:100%;border:4px solid #ff5a3a;box-sizing:border-box}}
.tk,.tov,.ts,.tt{{position:absolute;left:160px;width:1600px;text-align:center}}
.tk{{top:300px;font-size:30px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:{G}}}
.tov{{top:372px;font-family:'EB Garamond',serif;font-size:132px;line-height:1.05}}
.ts{{top:548px;font-family:'EB Garamond',serif;font-size:72px;font-style:italic}}
.tt{{top:716px;font-size:30px;letter-spacing:.16em;text-transform:uppercase;opacity:.85}}"""

r2 = lambda x: round(x, 2)
def host(name, a, b):
    return f'      <div id="{name}" data-composition-id="{name}" data-composition-src="compositions/{name}.html" data-start="{r2(a)}" data-duration="{r2(b - a)}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080" style="z-index:5"></div>'
def write_comp(name, a, b, body, tweens, extra_css=''):
    open(f'film/compositions/{name}.html', 'w').write(f"""<template>
  <style>
{CSS}{extra_css}
  </style>
  <div id="root" data-composition-id="{name}" data-width="1920" data-height="1080">
{body}
  </div>
  <script>
    (() => {{
      const tl = gsap.timeline({{ paused: true }});
      {tweens}
      tl.to({{}}, {{ duration: 0.01 }}, {r2(b - a - 0.02)});
      window.__timelines["{name}"] = tl;
    }})();
  </script>
</template>
""")
def words(name, a, b, items):
    els, tw = [], []
    for k, (kind, t0, t1, text, style) in enumerate(items):
        t0, t1 = max(t0, a), min(t1, b); i = f'{name}-{kind}{k}'
        st = f' style="{style}"' if style else ''
        els.append(f'    <div id="{i}" class="clip {kind}"{st} data-start="{r2(t0 - a)}" data-duration="{r2(t1 - t0)}"><span class="in" id="{i}-in">{text}</span></div>')
        if kind == 'stamp': tw.append(f'tl.fromTo("#{i}-in", {{ opacity: 0, scale: 1.6, rotation: -8 }}, {{ opacity: 1, scale: 1, rotation: -8, duration: 0.25, ease: "power3.in" }}, {r2(t0 - a)});')
        elif kind == 'yell': tw.append(f'tl.fromTo("#{i}-in", {{ opacity: 0, scale: 1.25 }}, {{ opacity: 1, scale: 1, duration: 0.16, ease: "power3.out" }}, {r2(t0 - a)});')
        else: tw.append(f'tl.fromTo("#{i}-in", {{ opacity: 0, y: 14 }}, {{ opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }}, {r2(t0 - a)});')
        if t1 < b - 0.05 and kind != 'yell': tw.append(f'tl.to("#{i}-in", {{ opacity: 0, duration: 0.28, ease: "power1.in" }}, {r2(t1 - a - 0.3)});')
    return '\n'.join(els), tw

hosts = []
for n, (a, b, items) in OV.items():
    body, tw = words(n, a, b, items); write_comp(n, a, b, body, '\n      '.join(tw)); hosts.append(host(n, a, b))

# ---- scene 6: the circuit drawn from its sixty dots, using the game's real control points
src = open('../index.html').read(); blk = src[src.index('const CTRL = ['):]; blk = blk[:blk.index('];')]
CTRL = [(int(x) * 0.6, int(y), int(z) * 0.6) for x, y, z in re.findall(r'\[(-?\d+),(-?\d+),(-?\d+)\]', blk)]
def spline(pts, per=14):      # centripetal Catmull-Rom through every dot, closed, as the game does
    out, n = [], len(pts)
    for i in range(n):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        d = lambda a, b: max(1e-6, math.hypot(b[0] - a[0], b[2] - a[2]) ** 0.5)
        t0 = 0; t1 = t0 + d(p0, p1); t2 = t1 + d(p1, p2); t3 = t2 + d(p2, p3)
        for k in range(per):
            t = t1 + (t2 - t1) * k / per
            L = lambda a, b, ta, tb: tuple(a[j] * (tb - t) / (tb - ta) + b[j] * (t - ta) / (tb - ta) for j in range(3))
            a1, a2, a3 = L(p0, p1, t0, t1), L(p1, p2, t1, t2), L(p2, p3, t2, t3); b1, b2 = L(a1, a2, t0, t2), L(a2, a3, t1, t3)
            out.append(L(b1, b2, t1, t2))
    return out
PTS = spline(CTRL)
zs, xs = [p[2] for p in PTS], [p[0] for p in PTS]
k = min(1520 / (max(zs) - min(zs)), 500 / (max(xs) - min(xs)))
def XY(p): return (200 + (p[2] - min(zs)) * k, 470 + (p[0] - min(xs)) * k)      # the lap lies on its side so it fills the frame
sp = [XY(p) for p in PTS]; n = len(sp)
path = 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in sp) + ' Z'
plen = sum(math.hypot(sp[(i + 1) % n][0] - sp[i][0], sp[(i + 1) % n][1] - sp[i][1]) for i in range(n))
def tight(i):      # where the game would paint a kerb: radius under about 250 m
    a, b, c = PTS[i - 4], PTS[i], PTS[(i + 4) % n]; ab = math.hypot(b[0] - a[0], b[2] - a[2]); bc = math.hypot(c[0] - b[0], c[2] - b[2]); ac = math.hypot(c[0] - a[0], c[2] - a[2])
    area = abs((b[0] - a[0]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[0] - a[0])) / 2
    return area > 1e-6 and (ab * bc * ac) / (4 * area) < 250
kerb, run = '', False
for i in range(n + 1):
    j = i % n
    if tight(j): kerb += ('L' if run else 'M') + f'{sp[j][0]:.1f},{sp[j][1]:.1f} '; run = True
    else: run = False
ticks = ''
for i in range(0, n, 5):
    (x0, y0), (x1, y1) = sp[i], sp[(i + 1) % n]; L = math.hypot(x1 - x0, y1 - y0) or 1; nx, ny = -(y1 - y0) / L, (x1 - x0) / L
    ticks += f'<line class="tick" x1="{x0 - nx * 16:.1f}" y1="{y0 - ny * 16:.1f}" x2="{x0 + nx * 16:.1f}" y2="{y0 + ny * 16:.1f}"/>'
dots = ''.join(f'<circle class="dot" cx="{XY(p)[0]:.1f}" cy="{XY(p)[1]:.1f}" r="7"/>' for p in CTRL)
hs = [p[1] for p in PTS]; prof = 'M' + ' L'.join(f'{1080 + 660 * i / (n - 1):.1f},{330 - (h - min(hs)) / (max(hs) - min(hs)) * 120:.1f}' for i, h in enumerate(hs))
a6, b6 = S[6] - 0.5, S[7] - 0.1; T = lambda phrase, off=0: r2(at(6, phrase, off) - a6)
steps = [('It starts with dots', 'Sixty dots'), ('Then a smooth curve', 'A smooth curve through every dot'), ('Chop that curve', 'Every 3 m: which way is forward, which is right'),
         ('Go six metres', '6 m each side, joined with triangles: tarmac'), ('Where the curve is tight', 'Tight curve? Paint a kerb'), ('And every dot has a height', 'Every dot has a height')]
sb, stw = words('track', a6, b6, [('kick', S[6] + 0.2, b6 - 0.3, 'How do you make a race track?', 'top:120px')] +
                [('step', at(6, ph), b6 - 0.3, tx, f'top:{196 + 48 * i}px;font-size:30px') for i, (ph, tx) in enumerate(steps)] +
                [('big', at(6, 'Four kilometres') - 0.2, b6 - 0.3, '4,036 m', 'left:1080px;top:350px;font-size:96px;width:700px')])
svg = f"""    <div id="track-art" class="clip" data-start="0" data-duration="{r2(b6 - a6)}" style="position:absolute;inset:0">
      <svg id="track-svg" viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;left:0;top:0">
        <path id="tr-kerb" d="{kerb}" fill="none" stroke="#c8281e" stroke-width="36" stroke-dasharray="10 10" opacity="0"/>
        <path id="tr-road" d="{path}" fill="none" stroke="#8d8f8c" stroke-width="0.01" stroke-linejoin="round"/>
        <g id="tr-ticks" stroke="{G}" stroke-width="2">{ticks}</g>
        <path id="tr-line" d="{path}" fill="none" stroke="#f4efe6" stroke-width="3" stroke-dasharray="{plen:.0f}" stroke-dashoffset="{plen:.0f}"/>
        <g id="tr-dots" fill="{G}">{dots}</g>
        <path id="tr-prof" d="{prof}" fill="none" stroke="{G}" stroke-width="4" stroke-dasharray="1500" stroke-dashoffset="1500"/>
      </svg>
    </div>"""
stw += [
    f'tl.fromTo("#tr-dots .dot", {{ opacity: 0, scale: 0, transformOrigin: "50% 50%" }}, {{ opacity: 1, scale: 1, duration: 0.25, stagger: 0.045, ease: "back.out(3)" }}, {T("It starts with dots")});',
    f'tl.to("#tr-line", {{ strokeDashoffset: 0, duration: 4.2, ease: "power1.inOut" }}, {T("Then a smooth curve")});',
    f'tl.fromTo("#tr-ticks .tick", {{ opacity: 0 }}, {{ opacity: 0.9, duration: 0.12, stagger: 0.02 }}, {T("Chop that curve")});',
    f'tl.to("#tr-road", {{ attr: {{ "stroke-width": 22 }}, duration: 1.6, ease: "power2.out" }}, {T("Go six metres")});',
    f'tl.to("#tr-ticks", {{ opacity: 0, duration: 0.8 }}, {T("Go six metres", 1.0)});',
    f'tl.to("#tr-kerb", {{ opacity: 1, duration: 0.6 }}, {T("Where the curve is tight")});',
    f'tl.to("#tr-prof", {{ strokeDashoffset: 0, duration: 2.6, ease: "power1.inOut" }}, {T("And every dot has a height")});',
]
write_comp('track', a6, b6, svg + '\n' + sb, '\n      '.join(stw), '\n.dot{opacity:0} .tick{opacity:0}')
hosts.append(host('track', a6, b6))

# ---- the ladder: the computer's time and mine, in the corner, from my first lap until the bet is settled
la, lb = S[7], S[10] - 1.8
mine = [(at(7, 'one minute forty-four') + 0.6, '1:44.066', G), (at(7, 'one minute six') + 0.6, '1:06.592', G), (at(8, 'One minute, point') + 0.6, '1:00.340', G), (at(9, 'Fifty-three') + 0.6, '0:53.513', '#8fe08a')]
lad = [f'    <div id="lad-pc" class="clip lad" style="top:110px" data-start="0.4" data-duration="{r2(lb - la - 0.4)}"><span class="in" id="lad-pc-in"><b>The computer</b><i>1:00</i></span></div>']
ltw = ['tl.fromTo("#lad-pc-in", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 }, 0.4);']
for i, (t0, val, colr) in enumerate(mine):
    t1 = mine[i + 1][0] if i + 1 < len(mine) else lb
    lad.append(f'    <div id="lad-me{i}" class="clip lad" style="top:236px" data-start="{r2(t0 - la)}" data-duration="{r2(t1 - t0)}"><span class="in" id="lad-me{i}-in"><b>Me</b><i style="color:{colr}">{val}</i></span></div>')
    ltw.append(f'tl.fromTo("#lad-me{i}-in", {{ opacity: 0, y: -12 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }}, {r2(t0 - la)});')
write_comp('ladder', la, lb, '\n'.join(lad), '\n      '.join(ltw), """
.lad{position:absolute;left:1350px;width:380px}
.lad .in{background:rgba(14,15,17,.8);padding:12px 20px;border-left:6px solid #f3e36b}
.lad b{display:block;font-size:28px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#cfcfc8}
.lad i{display:block;font-style:normal;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:54px;line-height:1.1;color:#f4efe6}""")
hosts.append(host('ladder', la, lb).replace('z-index:5', 'z-index:6'))

FULL = 'position:absolute;left:0;top:0;width:1920px;height:1080px'
vids, tl = [], []
PIC.sort()
for i, (t0, clip, m0, vol, rate) in enumerate(PIC):
    t1 = PIC[i + 1][0] if i + 1 < len(PIC) else END
    sound = f'data-has-audio="true" data-volume="{vol}"' if vol and rate == 1 else 'muted'
    vids.append(f'      <video id="p{i}" class="clip" src="assets/clips/{clip}.mp4" {sound} playsinline data-start="{r2(t0)}" data-duration="{r2(t1 - t0)}" data-media-start="{m0}" data-playback-rate="{rate}" data-track-index="0" style="{FULL};object-fit:cover;z-index:1"></video>')
dims = [f'      <div id="dim{i}" class="clip" data-start="{r2(a)}" data-duration="{r2(b - a)}" data-track-index="2" style="{FULL};z-index:2"><div id="dim{i}-in" style="{FULL};background:rgb(8,8,10);opacity:0"></div></div>' for i, (a, b, s) in enumerate(DIM)]
for i, (a, b, s) in enumerate(DIM):
    tl.append(f'tl.fromTo("#dim{i}-in", {{ opacity: 0 }}, {{ opacity: {s}, duration: 0.4 }}, {r2(a)});'); tl.append(f'tl.to("#dim{i}-in", {{ opacity: 0, duration: 0.3 }}, {r2(b - 0.32)});')
stills = []
for i, (a, b, f, x, y, w) in enumerate(STILL):
    stills.append(f'      <div id="st{i}" class="clip" data-start="{r2(a)}" data-duration="{r2(b - a)}" data-track-index="3" style="position:absolute;left:{x}px;top:{y}px;width:{w}px;z-index:3"><img id="st{i}-in" src="assets/stills/{f}.png" style="display:block;width:{w}px;border:3px solid #f3e36b;box-shadow:0 20px 60px rgba(0,0,0,.6)" /></div>')
    tl.append(f'tl.fromTo("#st{i}-in", {{ opacity: 0, scale: 0.96 }}, {{ opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }}, {r2(a)});'); tl.append(f'tl.to("#st{i}-in", {{ scale: 1.03, duration: {r2(max(0.2, b - a - 0.75))}, ease: "none" }}, {r2(a + 0.4)});'); tl.append(f'tl.to("#st{i}-in", {{ opacity: 0, duration: 0.28 }}, {r2(b - 0.3)});')
vo = [f'      <audio id="vo{n}" class="clip" src="assets/vo/s{n}.mp3" data-start="{START[n]}" data-duration="{DUR[n]}" data-track-index="6" data-volume="1"></audio>' for n in range(1, LAST + 1)]
NL = '\n'
open('film/index.html', 'w').write(f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: 1920px; height: 1080px; overflow: hidden; background: #0e0f11; }}
      #root {{ position: relative; width: 1920px; height: 1080px; overflow: hidden; }}
    </style>
  </head>
  <body>
    <!-- Golden Lap film. Generated by ../build_film.py from the voiceover: edit that file and rebuild, or edit here by hand. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1920" data-height="1080">
{NL.join(vids)}
{NL.join(dims)}
{NL.join(stills)}
{NL.join(hosts)}
{NL.join(vo)}
      <audio id="music" class="clip" src="assets/music-placeholder.mp3" data-start="{TITLE}" data-duration="{r2(END - TITLE)}" data-track-index="4" data-volume="0.1" data-fade-in="1.5" data-fade-out="3"></audio>
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      (() => {{
      const tl = gsap.timeline({{ paused: true }});
      {(NL + '      ').join(tl)}
      tl.to({{}}, {{ duration: 0.01 }}, {r2(END - 0.02)});
      window.__timelines["main"] = tl;
      }})();
    </script>
  </body>
</html>
""")
print('length', END, 's =', f'{int(END // 60)}:{END % 60:04.1f}', '| title at', TITLE, '| scenes', START)
print('filter on at', r2(fx0 + 6.5), '| shout', shout, 'to', sorry, '| track build', r2(a6), '| win', START[9], '| turn', START[10], '| track points', n, 'path px', round(plen))

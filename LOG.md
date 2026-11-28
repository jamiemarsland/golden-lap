# Build log: onboard racing sim

A running record for the video. Newest entries at the bottom. Times are local.

> **The film's angle (James, 27 Nov):** lean into one question: *can I build a world-class F1 game in just one day?* The title and thumbnail should promise that, the way "129 hours to design a menu" (Enrico Tartarotti, with the Linear team) does: a huge bold headline, the object held up to camera, rough red hand-drawn arrows and circles over the top. The clock is the story, so every entry here has a time on it. To decide when cutting: which day counts as "the one day"? The first entry is 24 Nov 17:05 and the work has carried on since, so either the film covers the first day honestly and treats the rest as polish, or it is "one day of building" counted in hours.

> **Film section to include: "Why this camera angle looks so fast" (James, 28 Nov: "it should defo be a section").** See the 28 Nov entry at the bottom for the full breakdown.

## 2026-11-24

### 17:05 — The question
James shared a YouTube Short of early-90s Formula 1 onboard footage (three screenshots) and asked:
"do you think we could make a browser based racing sim that looked like this?"

### 17:06 — First answer: yes, because the look is mostly camera and tape
What the footage is made of:
- **Camera position:** by the driver's shoulder. Helmet fills the right third; front tyre, suspension, mirror and steering wheel are always in frame.
- **Lens:** very wide, with barrel distortion that bends the horizon.
- **Analogue video:** soft, low resolution, colour bleeding (purple and green fringes on the trees), blown-out white sky, crushed blacks.
- **Motion:** heavy blur on tarmac and kerbs, constant high-frequency vibration.

Claim worth testing on camera: "about 70% of the look is one post-processing shader."

Predicted hard parts:
- The driver's hands sawing at the wheel.
- Physics that drive like a sim (the look is days, the feel is the long tail).
- Staying original: own car, helmet design and circuit, no real liveries or sponsor logos.

### 17:10 — Go-ahead and plan
James: "yes, please build the prototype" and "log stuff as we go".

Plan for prototype v0.1, one HTML file:
- Three.js (r128 from cdnjs), no build step.
- Render the world and the cockpit separately at about 432 lines, then composite.
- Pass A: radial motion blur on the world only, cockpit laid over the top sharp.
- Pass B: lens distortion, colour fringing, chroma bleed, bloom, tape noise, scanlines, vignette.
- Bicycle-model physics with a simplified Pacejka tyre curve, downforce, and keyboard smoothing.
- Driver arms on two-bone IK so the hands follow the steering wheel.
- `V` toggles the tape filter on and off, for a before/after shot in the video.
- `T` toggles an autopilot, for B-roll without having to drive.

### 17:25 — First run: it rendered correctly first time
- No console errors. The very first screenshot already read as "onboard tape": bent horizon, helmet filling the right side, tyre and wishbones on the left, glove on the wheel, washed-out sky.
- Good moment for the video: `V` off shows a flat, low-poly scene with faceted trees; `V` on turns the same frame into footage. The low-poly trees stop mattering once the tape pass is on.
- Track is 3,985 m, original layout, flat (no elevation yet).

### 17:28 — Tweaks after looking at it
- Camera raised and tilted down (y 1.00 → 1.06, pitch −0.26 → −0.33) so the front tyre sits lower in frame, closer to the reference.
- Bodywork darkened (it read as bright blue once the tape pass lifted the shadows).
- Helmet highlight toned down; it was blowing out to a white blob.

### 17:32 — First real bug: the autopilot kept crashing
- Symptom: autopilot lap of 2:37 with the car going backwards at 126 km/h at one point and hitting the barrier.
- Cause 1: the speed profile assumed 3 g of cornering grip everywhere. At low speed there is no downforce, so the real limit is about 1.75 g. Fixed by making the profile speed-dependent: v²·κ = 0.8·μ·(g + downforce/m).
- Cause 2 (the interesting one): the car itself was spin-happy. Traced it to mid-corner at about 150 km/h on throttle, rear stepping out. Front and rear had the same tyre grip, and throttle took grip away from the rear, so the balance was oversteer.
- Fix: rear tyres get 14% more grip (as real wide rears do), aero balance moved to 40/60, and throttle steals less rear grip.
- Result: clean autopilot lap, **1:10.817**, never more than 3.6 m from the centreline, top speed 298 km/h, slowest corner 81 km/h.

### 17:36 — State of prototype v0.1
Working:
- Shoulder camera, cockpit with steering front wheels, suspension, mirrors, steering wheel, IK arms and gloves, helmet that leans and turns.
- Tape pass: lens distortion, colour fringing, chroma bleed, bloom, noise, scanlines, vignette, head-switch tear at the bottom edge.
- Speed-scaled radial motion blur on the world only.
- Physics, lap timing, two rival cars, engine/wind/tyre sound, gamepad support, minimap.

Not done or not verified:
- Keyboard handling has only been checked by script, not driven by a human. Expect it to need tuning.
- Sound has not been listened to (it only starts after a click).
- Rival cars follow the centreline and only have a crude bump collision.
- Track is flat; no elevation, no trackside objects beyond barriers and trees.

Ideas for the next pass:
- Elevation and camber, marshal posts, bridges and hoardings for speed cues.
- Temporal ghosting (frame blending) for more authentic video smear.
- A proper modelled nose and cockpit surround instead of boxes.
- Vertical 9:16 mode to match the Short.

### To capture for the video
- Before/after with `V` at speed on the main straight.
- Autopilot (`T`) lap with HUD hidden (`H`) as clean B-roll.
- The spin bug: the "going backwards at 126 km/h" number and the one-line fix.

### 17:20 — Look pass (v0.2), four more reference shots, and "the sound is incredibly important"
James chose "Push the look", then added four more reference frames mid-build (two open corners with tents and a grandstand, a pit straight with buildings, and a car alongside), and said: "the sound is incredibly important".

The v0.1 file is kept as `index-v0.1.html` for side-by-side comparison in the video.

What the new references showed that v0.1 got wrong:
- The horizon sits near the middle of the frame with a huge white sky. v0.1 pointed the camera too far down.
- The front tyre is big and close. Cars of that era put the driver just behind the front axle, so the wheel is about 1.3 m ahead of the camera, not 1.8 m.
- The road is pale, almost white. The car is black, not navy. The steering wheel rim is cream.
- Trackside is not just trees: pit buildings, grandstands, marquee tents.
- Some trees read purple, and there is a warm halo where trees meet sky.

Look changes:
- Camera lowered and levelled (pitch −0.33 → −0.16), field of view 80° → 92°, front axle moved 0.5 m closer, slightly bigger tyres.
- Nose is now a tapered rounded shape instead of a box, plus a cockpit lip.
- Black bodywork, cream wheel rim, darker gloves, paler tarmac.
- Frame ghosting: 32% of the previous frame bleeds into the next, like a tube camera.
- Trees are smooth blobs instead of faceted, and one in ten is purple-grey.
- Pit building, grandstand with crowd, six white tents, two footbridges, and plain coloured hoardings on the straights.
- `P` switches to a 9:16 portrait frame that matches the Short's composition (tyre left edge, helmet right edge).
- Overcorrection caught on the way: the first version of the warm halo turned the whole sky yellow. Pulled it back so the sky stays white.

Sound, rebuilt from scratch:
- v0.1 was four oscillators through a filter. It would have sounded like a synth, not an engine.
- v0.2 synthesises every sample in an AudioWorklet. Twelve cylinders each fire a decaying exhaust pulse; the firing rate at 13,000 rpm is 1,300 Hz, which is where the scream comes from.
- Each cylinder's strength is re-rolled every engine cycle, because real combustion never repeats exactly. That irregularity is what makes it rasp instead of whine.
- On throttle the pulses get sharper (brighter); off throttle they soften and random crackles appear on the overrun.
- Also in the mix: straight-cut gear whine tied to road speed, wind with buffeting, tyre squeal when sliding, kerb thump at stripe rate, grass rumble, impact thuds, a clunk and throttle cut on upshifts, and a throttle blip on downshifts.
- Everything then goes through an "onboard microphone" chain: thin, peaky around 950 Hz and 2.5 kHz, overdriven, cut off above 5 kHz, and heavily compressed. The distortion is the point; that is how those broadcasts sounded.

Checked:
- Autopilot lap still clean after the changes: 1:07.4, max 3.6 m off the centreline.
- Audio worklet loads and the audio context is running. **Nobody has listened to it yet.** I cannot hear it, so James's ears are the test.
- Small bug fixed: the renderer threw framebuffer warnings when the window had zero size during load.

Still short of the reference:
- Tyre is not yet as large in frame, and the cockpit lacks fine detail (dash, belts, mesh).
- Gloves are plain blobs; no fingers.
- No elevation changes.

### To capture for the video (additions)
- v0.1 vs v0.2 side by side on the pit straight.
- Portrait mode next to the original Short.
- Sound on its own: a full-throttle run through the gears, then a lift to hear the crackle.

### 17:30 — "Best bits of the best grands prix" becomes the Golden Lap (v0.3)
James's idea: "can we take the best bits from the best grand prixs, e.g. the swooping bit at Spa, the Monza fast corner, the tunnel and Monte Carlo, and any other?"

Then, in quick succession while the build was running:
- "I want there to be a leaderboard. The lap time should be about 1 min. And folks should see where they are on the leaderboard."
- "It will be a 1 lap challenge — maybe call it the golden lap."
- "The sound is a little too high pitched I think."
- "We're missing quite some detail of the car." (with a close-up reference of the tyre, wishbones and cockpit)
- "The helmet is perfect :)" — helmet is locked, do not touch.
- "Our trees are good, just a tiny bit more detail needed I think." (with a treeline reference)
- "We still don't have that film quality that's in the video. How do we get that?"

**The circuit.** One original lap that borrows corner shapes, not a copy of any real track:
1. Pit straight, then downhill.
2. The swoop: left at the bottom, right up a steep hill, left over a blind crest.
3. A long climbing straight.
4. A long, flat-out, opening right-hander.
5. Esses.
6. Downhill into a walled city, with a hairpin.
7. Two rights into a curved tunnel.
8. Out into daylight, a harbour chicane, the waterfront, a flick by the pool.
9. Last corner and a climb back to the pits.

What that forced technically:
- **Elevation.** The first two versions were flat. The old trick for the ground (paint layers in order, ignore depth) breaks on hills, so the ground is now built from strips that sit side by side and never overlap.
- **Hills change grip.** The car is pressed into the road at the bottom of the swoop and goes light over the crest. Gradient also pulls the car back uphill and pushes it downhill.
- **Tunnel.** The camera's auto-gain opens up inside, so the exit blows out to white and takes a moment to recover in daylight. Tunnel lights sweep over the cockpit. The engine echoes off the walls (three feedback delays), with a little echo between the city buildings too.
- **City.** Barriers move in from 15.5 m to 7.2 m from the centreline. No run-off, no kerbs, buildings hard against the armco, water and boats on the harbour side.

**Getting to a one-minute lap.**
- Full-size layout: 4,918 m, autopilot 1:42.9. Far too long.
- Scaled the plan to 60%: 2,955 m, autopilot 1:20.2.
- Scaled to 55%: 2,710 m, autopilot 1:16.6, never more than 2.4 m off the centreline.
- The autopilot is deliberately cautious (uses 80% of the grip, brakes early), so a good human lap should be faster, probably 1:05 to 1:10. **Not yet measured with a human.** If real laps come in long, the scale number is one constant to change.

**Golden Lap rules as built.**
- Standing start, 3-2-1-GO, one timed lap, then the board.
- The board shows the top eight plus your own row highlighted, your position ("P3 of 4") and the gap to P1.
- During the lap the HUD shows the P1 time and where you would be placed if you crossed the line right now.
- Type a name, press Enter, and you are straight back on the grid. `R` restarts at any time.
- A lap with autopilot switched on at any point is not recorded.
- Checked with test entries: a 1:08.123 against 1:04.2, 1:06.9 and 1:11.5 was placed P3 of 4, 3.923 s off P1. Test entries were removed afterwards.

**Open decision: the board is local for now.** Times are saved in the browser, so each person only sees laps set on their own machine. A shared board that everyone sees needs the game hosted somewhere with a small database behind it. That is the next real decision.
- Also not done: no track-limits rule, so cutting a corner is not penalised yet.

**Sound.** Pitch dropped by a third after James's note, and the microphone resonances moved down with it (950 Hz → 620 Hz, 2.5 kHz → 1.7 kHz). Still nobody but James has heard it.

**Car detail.** Rim lips and rounded shoulders on the tyres, uprights and brake ducts that steer with the wheels, damper links, brake lines, a pale cockpit edge, small gold marks on the tub, an aerial, a dash with three dials and a row of switches, shoulder belts, red cuffs, thumbs, and patterned gloves.

**Trees.** Dappled crowns (brighter tops, random patches), visible trunks, and undergrowth bushes along the forest edge.

**The "film quality" question.** Diagnosis: we had built a *CRT* look (scanlines, grain, hard pixel edges). The reference is not that. It is old tape that has been *upscaled*: smooth, slightly painterly, pastel, no visible scanlines.
Changes:
- Internal picture raised from 432 to 600 lines, with anti-aliasing, so edges are smooth instead of stair-stepped.
- A paint filter (Kuwahara): every pixel takes the average of its calmest neighbouring patch. Flat areas smear smooth, edges stay crisp. This is the single biggest step toward the reference.
- Scanlines, line jitter and the tape tear at the bottom removed. Grain cut by two thirds.
- Softer grade: lifted blacks, less contrast, colour faded by 16%, stronger lens bend.
- Soft shadows under the cars so they sit on the road.
- The scanline version is kept as `index-v0.3-crt.html` for a before/after.

What still separates us from the footage, honestly: real-world texture and lighting. Reflections on the helmet, tyre sheen, real foliage, real tarmac streaks. Procedural shapes only go so far; the next lever is photographic textures or a modelled car.

### To capture for the video (additions)
- The swoop from the bottom of the hill.
- Tunnel entry to exit in one take, sound on, for the echo and the white-out.
- CRT version next to the film version on the same corner.
- A full Golden Lap ending on the leaderboard.

### 17:39 — Golden Lap goes online with a shared leaderboard (v0.4)
James, on the film look: "the film has a kinda late 70s film look to me? agree or disagree". Answer: partly. The colour is late-70s film (faded pastels, milky highlights, warm horizon), but the footage is almost certainly early-90s broadcast video that has been upscaled. Target: "video that has aged into looking like 70s film".

James chose a shared board ("Yes, shared board") and picked Spacefast for hosting.

**Live: https://golden-lap.space.fast/** — public, anyone with the link can play, one board for everyone.

How it is built:
- A small server with one table, `laps` (name, time, who posted it), and two addresses: one returns the board, one accepts a lap.
- The game asks for the board when it loads. If a shared board answers, it uses it; if not (for example when opened as a local file), it falls back to saving times in the browser.
- A time is only posted when the player presses Enter on the result screen. Restarting without Enter discards it.
- Server-side checks: names are trimmed to 12 characters of A–Z, 0–9 and basic punctuation; laps under 35 seconds or over 10 minutes are refused.
- `index.html` is still the single source of the game. `build-space.py` repackages it for Spacefast, then `sf publish --remote` from the `golden-lap` folder puts it live.

Things that went wrong on the way (good for the video):
1. The Spacefast tool on this machine could not build locally (a missing package inside the tool itself), so local testing of the server was impossible. Switched to building on Spacefast's side.
2. First publish was rejected: Spacefast treats an HTML file in its pages folder as a document and would not accept a page that is mostly script. Fix: ship the game as a client-side page, with the 3D library bundled in instead of loaded from a CDN.
3. The cleanup call was refused until it was sent as JSON. Spacefast blocks plain cross-site style writes, which is a sensible default.

Checked on the live site:
- Page loads, the game runs, the attract lap plays behind the title.
- Sound engine starts after a click (audio running, engine model loaded). Still not judged by ear by anyone but James.
- A test lap posted from the result screen appeared on the shared board for a fresh request, then both test rows were removed. The board is empty and waiting for a first real lap.
- A 1-second "lap" was refused by the server.

Known gaps:
- **Times are trusted.** The browser reports its own lap time, so someone technical could post a fake one. Fine for friends; a public competition would need server-side replay checks.
- No profanity filter on names.
- No track-limits rule yet.
- Still no human lap time, so "about a minute" is unconfirmed.

**Speed blur.** James: "is it possible for the scenery to get more blurry the faster we go?" It already scaled with speed, but too gently. Now the curve is steep: almost nothing in the city, heavy smear flat out. The smear is stronger toward the edges of the frame, trees and buildings blur more than before, and the field of view widens by up to 9° with speed.

### 17:46 — First human laps, and a run of driver feedback (v0.5, live as version 7)
James drove it. First real times: **1:27.683** locally and **1:44.066** on the live board (name: JAMIE M). The autopilot was doing 1:17 on that layout, so the "a human will be faster than the cautious autopilot" prediction was wrong. The human was 10 to 27 seconds slower. Lesson: the autopilot never misjudges a braking point; people do.

Feedback, in order, and what changed:

1. **"Handling needs work."** I asked what specifically; the answers came as the notes below.

2. **"Would it be possible to show live position, i.e. sector times, as folks drive?"**
   - Three sectors: S1 ends over the crest of the swoop, S2 ends at the city limits, S3 ends at the line.
   - At each split a banner shows the sector time, your position at that point against every lap on the board, and the gap to the leader at that point. The splits stay listed under the lap timer.
   - Colours: gold = fastest anyone has done that sector, green = your own best, white = neither.
   - The server now stores both split times with every lap, which is what makes "position at this point" possible.

3. **"It would be cool for folks to have an easy way to see the leaderboard."**
   - The top ten is now on the title screen.
   - `L` shows or hides the board at any time, and it refreshes every 30 seconds while nobody is mid-lap.

4. **"The sharp Monte Carlo hairpin is kinda impossible to get around."**
   - Hairpin radius opened out by about half, barriers moved back from 7.2 m to 11 m there, and three braking boards added on the approach (three bars, two bars, one bar).
   - More steering lock at low speed.

5. **"When I crash it looks like the wheel is hovering in the barrier."** (with a screenshot)
   - Cause: contact was tested at the centre of the car, 0.9 m in from the wall, but the wheels stick out further than that, especially when the car is at an angle.
   - Fix: contact is now tested at all four corners of the car, and the wall turns the car parallel to it instead of letting the nose dig in.

6. **"The road in the video has these tyre tracks and it makes the sense of speed very real."** (with a screenshot)
   - Added a rubber layer: about 190 dark streaks in two wheel-track bands that follow the racing line, sweeping toward the inside of each corner and back out, so the lines converge and diverge ahead of you like the reference.
   - First attempt was too faint to survive the blur; doubled the darkness.

7. **"I think the road and trees should be a little sharper at low speed."**
   - Softness now scales with speed in three places: the paint filter, the horizontal smear and the frame ghosting are all light at a standstill and full strength flat out.

Also changed, to chase the one-minute lap after seeing real times:
- Tyre grip up 20%, downforce up 15%, slightly more power. Easier to drive and faster through corners.
- Circuit scaled from 55% to 50%: now 2,490 m. Autopilot lap 1:07.9.
- Because the circuit changed, local saved times were reset. **The 1:44.066 on the live board was set on the previous, longer layout** and is still there.

A bug of my own on the way: I added a comment to the end of a line that had more code after it, which silently commented out half the statement and broke the whole game. Caught by the browser console, and I now syntax-check before every publish.

### 17:49 — Mirror detail and a preview lap (live as version 10)
- James confirmed clearing his 1:44.066 from the live board (it was set on the old, longer layout). Removed with a one-off cleanup that was published, used once and taken down again. The board is empty.
- James, with a close-up of the mirror: "we can see the head popping up and down in the mirror — god lives in the details :)"
  - The orange shape in the reference mirror is the driver's own helmet. Ours was a fixed orange block painted on the glass.
  - Now each mirror carries a small helmet reflection in the helmet's colours that bobs, tilts and turns with the real head, including over kerbs and bumps.
- James: "there should be a way for folks to watch a lap to get an idea of what's coming, like a preview."
  - "Watch a preview lap first" on the title screen. The autopilot drives one lap with sound while captions name each of the twelve sections and give one line of advice (for example THE HAIRPIN: "Brake at the three boards. Slowest corner of the lap").
  - Click or press Enter at any point to go back and drive. It returns to the title screen by itself after one lap.
  - Checked: all twelve captions appear in order and the lap ends back at the title screen.

### 17:52 — "Still too twitchy — the tyre tracks too dark" (live as version 11)
- **Twitchy steering.** Four changes aimed at keyboard driving:
  - Steering lock winds on over about 0.9 s instead of 0.45 s, so a tap is a nudge, not a lunge.
  - Less lock is available at speed.
  - Tyres respond more progressively (they build grip over a wider angle instead of snapping to it).
  - A little yaw damping, so the car settles after an input instead of wagging.
  - Measured: a 0.15 s tap of the left key at 221 km/h now moves the car 0.41 m sideways and turns it 1.6°. Autopilot lap unchanged at 1:07.9.
- **Tyre tracks.** Darkness roughly halved and about a fifth fewer streaks.

### 17:57 — The front-left wheel, and rivals as scenery (live as version 12)
James, with a close-up of our wheel: "the detail on this front left wheel is really important — and where it meets the ground — this is where a lot of the sense of speed comes from."

What was wrong: the wheel was a flat-sided cylinder with hard edges, no rim, and its bottom faded into black bodywork, so you could not see it touching the road.

Changes:
- **Tyre shape.** Rebuilt from a rounded profile: bulging sidewalls, soft shoulders, a slightly crowned tread. It now catches a highlight along the top like the reference.
- **Two tyre surfaces.** Slow: scuffs and sidewall marks you can see turning. Above about 47 km/h they swap to a version where the marks have blurred into rings, which is what a camera sees on a fast wheel.
- **Inside the wheel.** Bright rim edge, dark barrel, brake disc, five wheel studs, a red caliper that stays still while the disc turns.
- **Contact with the road.** A tight, dark patch under each tyre, on top of a lighter overall shadow. The sidepods were shortened so they no longer hide where the tyre meets the tarmac.
- **Tarmac.** Texture doubled in resolution with coarse aggregate and fine lengthwise streaks. At speed the motion blur pulls that grain into lines streaming under the tyre.

James, with a screenshot of a rival car filling the frame during the preview lap: "let's not have close-ups of cars like this — let's just have them in the distance, and we never catch up to them."
- Rivals are now scenery. Each is held between a minimum and maximum distance ahead (about 135–360 m and 255–510 m). Close in and they pull away at your speed; drop back and they wait.
- Car-to-car contact was removed, since it can no longer happen.

Checked: autopilot lap still clean at 1:07.9.

### 17:58 — "This shadow to the left of the car looks wrong" (live as version 13)
James sent two crops of a black slab along the bottom-left of the frame.
- It was not one shadow but two things stacked: the sidepod, modelled as a flat black box with a ruler-straight edge, and a ground shadow under the car that was wider than the car and spilled onto the road beside it.
- Sidepods are now rounded, tapered and glossy with a pale pinstripe, so they read as bodywork and sit lower in frame.
- The ground shadow is trimmed to the car's footprint and lightened (the sky is overcast, so shadows should be faint). The dark patches under the tyres stay.
- Result: the bottom-left corner of the frame is now road streaming past under the front-left tyre, which is exactly where James said the sense of speed comes from.

### 18:07 — Hairpin removed, faster circuit, steering take three (live as version 14)
James posted a 1:28.275 on the live board (splits 11.991 / 31.891) on the hairpin layout, then: "still too twitchy — I think maybe we should remove the hairpin, it's kinda impossible — also I think it used to show which famous bit we were on as we rode through it — also is it showing my position during each sector?" And a moment later: "we probably want more high speed stuff, 'cause that's where the fun is."

- **Hairpin: gone.** The city is now one flowing downhill left between the walls and straight into the tunnel. Opening the hairpin out last time was not enough; a 50 km/h corner in a walled street on a keyboard is no fun.
- **More high speed.** The slow corners were opened up (the harbour chicane is now a fast flick, the pool flick and the esses are gentler, the last corner is a wider arc) and the whole circuit was scaled up by a fifth so every corner is faster.
  - Now 2,808 m. Slowest corner 76 km/h (it was 47 km/h with the hairpin). Autopilot lap 1:05.1 at an average of 160 km/h, with a fifth of the lap above 200 km/h.
- **Twitchy steering, third attempt, different idea.** The first two attempts slowed the steering down. This time the keyboard *eases in*: a tap gives a small correction and a held key winds on to full lock, building more slowly the faster you are going. Also, the steering can no longer ask for more lock than the tyres can use at the current speed, and the car has more yaw damping. Measured: holding left for half a second at 220 km/h turns the car 2.4°.
- **Section names while driving.** They only appeared in the preview lap before. Now each section's name and its one-line tip appear for a few seconds as you enter it during a real lap.
- **Position at each sector.** It was already there but easy to miss, and it showed nothing when the board was empty. Now every split banner reads like "S1 13.983  P2 OF 5  +0.412", and a "POSITION P2 OF 5" line stays under the timer until the next split.
- The local saved times were reset again because the circuit changed. The 1:28.275 on the live board is from the hairpin layout.

### 18:40 — Board cleared, and a better way to handle layout changes (live as version 15)
- James confirmed clearing his 1:28.275 (set on the hairpin layout).
- Instead of deleting rows by hand every time the circuit changes, each lap is now stamped with the circuit version it was set on, and the board only shows laps from the current version. Old laps stay in the database but drop off the board. Changing the circuit in future means bumping one number on the server.
- Checked: the live board is empty; a test lap posted and ranked P1, then was removed.

### 18:45 — ElevenLabs engine sound, "inspired by" captions, adjustable steering (live as version 17)
James: "can you see if 11labs can synthesise the sound".

**Yes.** ElevenLabs has a sound-effects generator that takes a text description. The trick is what to ask for.
- A game engine sound cannot be one recording of a car accelerating, because the player decides the revs. The standard method is a handful of *steady* loops at different revs, sped up and slowed down to follow the engine, and cross-faded into each other.
- So I asked for four five-second loops, each described as an onboard recording of a 1990 V12 held at a constant speed: low revs, medium revs, high revs on full throttle, and high revs off throttle with exhaust crackle. Each prompt says "no gear shifts, no revving up or down, no music, no voices".
- I cannot hear them, so I measured them instead: converted each to raw audio and tracked its pitch every quarter second.
  - Low: steady at about 125 Hz. Mid: about 154 Hz, drifting between 145 and 157. High: about 285 Hz. Off-throttle: steady at 123 Hz.
  - All four hold their pitch well enough to use.
- Each loop is assigned the engine speed its pitch stands for (5,040 / 6,130 / 11,500 rpm), so when two loops overlap during a cross-fade they are at the same pitch.
- In the game the recorded engine replaces the synthesised engine, while wind, tyres, kerbs, gear whine and the tunnel echo still come from the synth. `E` switches between recorded and synthesised engine on the fly, which is a ready-made comparison for the video.
- The loops are in `sounds/` and are embedded into the hosted game, so it still loads as one bundle.
- Known weak spots: the low and mid loops are close in pitch, so most of the rev range is the mid loop stretched; and the off-throttle loop is pitched up a long way at high revs. Both could be fixed by generating more loops. **Whether it sounds better than the synth is for James's ears.**

James: "we should say which track the famous bits are from when we drive through the preview."
- Each section caption now carries a gold line, in the preview and during a real lap: Eau Rouge and Raidillon and the Kemmel Straight (Spa-Francorchamps), the Curva Grande (Monza), the Esses (Suzuka), and the streets, Tunnel, harbour chicane, Tabac and Swimming Pool, and final corners of Monaco.

James: "the steering is not responsive enough now."
- Attempt three overshot: calm, but laggy. Rather than guess a fourth time, steering feel is now a setting from 1 (calm) to 9 (sharp), changed in the game with `[` and `]`, shown on screen and remembered. The default, 5, is noticeably quicker than attempt three.
- The plan: James finds the number that feels right, and that becomes the default for everyone.

Checked on the live site: all four recorded loops load, audio runs, and the steering setting changes and saves.

## 2026-11-25

### 06:02 — Recorded engine chosen, steering set to 4, and the hand-control idea (live as version 18)
- James picked the **recorded (ElevenLabs) engine** over the synth. It stays the default; `E` still switches for comparison.
- To fill the gaps I generated three more loops and measured them:
  - Mid-high: about 250 Hz, a little wobbly. **Used**, slotted between mid and high at 10,090 rpm. The engine now cross-fades through four on-throttle loops instead of three.
  - Flat-out: about 308 Hz but dips to 211 Hz in its first second, which would be heard as a sag every five seconds at top revs. **Not used.**
  - High-rev off-throttle: came back at 123 Hz, the same pitch as the existing off-throttle loop, so it adds nothing. **Not used.**
  - Lesson for the video: you can describe a sound to ElevenLabs but you cannot dial in its pitch. You generate, measure, and keep what fits. Both rejects are in `sounds/unused`.
- James on steering feel: "about 4". The default is now 4 for everyone; `[` and `]` still adjust it.
- **New idea from James:** "I've seen some music apps where folks control sound by their hands — I think it uses the Mac camera — I kinda feel like something like this would be amazing, so I didn't have to click little keys on my keyboard. What do you think?"
  - My answer: yes, and it suits this game unusually well. Hold your hands up as if gripping a wheel; the tilt of the line between them is the steering angle. That is true analogue steering, which is exactly what the keyboard cannot give and why handling has taken four attempts.
  - It also echoes the footage: the player ends up doing what the driver's gloves are doing on screen.
  - Open questions: what the hands do for throttle and brake, camera lag, and whether hand laps share a leaderboard with keyboard laps.

### 06:08 — Drive with your hands (live as version 19)
James: "Yes, build it."

**The one-minute lap is real.** While this was being built James posted three laps on the live board: **1:06.592, 1:07.507 and 1:09.575**, all on keyboard. The autopilot does 1:05.1. After the hairpin removal, the grip increase and four rounds of steering changes, a person and the autopilot are finally within two seconds of each other.

How hand steering works:
- A "Drive with your hands" button on the title screen asks for the camera. The video is analysed in the browser (Google's MediaPipe hand tracker) and never leaves the machine.
- It finds the centre of each palm. The **tilt of the line between the two hands is the steering angle**, like holding a wheel. Full lock is about 35° of tilt, with a small dead zone so you can hold it straight.
- **Throttle and brake are height.** Wherever you hold the wheel during the 3-2-1 countdown becomes "flat out". Let your hands drop a little and you coast; drop them further and you brake. So the resting position is full throttle, which suits a lap that is mostly flat out.
- A small mirrored camera view at the top of the screen shows the two tracked points, the line between them, and a red line marking where braking starts. It reads TILT TO STEER, COASTING, BRAKING or SHOW BOTH HANDS.
- If a hand leaves the frame the car coasts and the steering centres.
- `C` turns camera steering on and off mid-session.
- Laps are tagged with how they were driven, and hand laps show a HANDS label on the board. One board, but you can see who did what.

What I could and could not test (I have no camera and no hands):
- **Tested with simulated hand positions:** level hands give zero steering and full throttle; tilting gives proportional steering in the correct direction both ways; a steep tilt reaches full lock; a small drop coasts; a big drop gives full brake; one hand alone shows the warning and cuts the throttle. In a simulated drive the car accelerated to 156 km/h, turned 8.3° on a gentle left tilt, and braked to 11 km/h.
- **Tested on the live site:** the tracker library downloads, its model loads, and it processes an image.
- **Not tested:** the camera permission prompt, real hands, real lighting, and how the lag feels. That is James's job.

### 06:10 — More bass at speed (live as version 20)
James: "I really like the throbbing sound of the engine when we've stopped — can we have a little more bass when we are travelling at high speed."
- Why the throb disappears: at a standstill you hear the low-rev loop, which is deep and lumpy. As the revs climb, the game cross-fades to the higher loops and that low loop fades out completely.
- Two changes:
  - **The throb now follows you.** A second copy of the low-rev loop plays an octave below the engine's actual pitch and fades in as the revs rise, stronger on throttle. It sits under the scream instead of being replaced by it.
  - **A bass lift tied to road speed.** Up to +8 dB below 180 Hz at top speed, nothing at a standstill, so the idle sound James likes is unchanged.
- Measured at 242 km/h on the preview lap: the under-layer was playing and the bass lift was at +6.5 dB. How it sounds is for James to judge.

### 06:14 — Hand steering works; fixing where "flat out" sits (live as version 21)
James, after his first real try with the camera: **"works great"** — "but I have to hold my hands up quite high to go forward — my resting position has my hands much lower."
- So the untested part held up: camera permission, real hands and real lighting all worked first time.
- The flaw: "flat out" was fixed at wherever the hands were during the countdown. People hold their hands up to be seen, then relax, and relaxing read as lifting off.
- New rule: **flat out is wherever your hands naturally rest, and it keeps adjusting.**
  - Before the start, it follows your hands immediately.
  - During the lap, if your hands sag lower, it follows over a second or two.
  - A quick dip below your resting height is the brake. If you stay down there for more than 2.5 seconds, that becomes your new resting height.
  - Raising your hands is still flat out, and lowering them back to rest afterwards is not mistaken for braking.
- The camera view now shows a green line for flat out and a red line where braking starts, so you can see both move.
- Checked with simulated hands in real time: started high then dropped low before GO (full throttle at rest), quick dip (88% brake), back to rest (full throttle), slow sag (still full throttle).

### 06:17 — The white frame, and not losing the wheel in sharp turns (live as version 22)
**The white frame.** James: "I really like the white frame we have now — how have you done that? Or is that something to do with the camera being on?"
- It was not mine. It was almost certainly macOS's Edge Light, which puts a glowing white border round the screen while the camera is on to light your face. A happy accident: it showed up the moment hand steering switched the camera on.
- James: "yes, build the white frame into the game." Now the game draws its own: a solid white edge with a soft glow inside it and rounded corners, on for everyone whether or not the camera is in use. The HUD was nudged inward to clear it.
- Good line for the video: the best-looking design decision in the project came from the operating system by accident.

**Losing the yellow line.** James: "on sharp steers I tend to lose the yellow line and hence steering control."
- Why: on a big turn one hand swings in front of the other or out of the camera's view. The tracker then sees one hand or none, and the old code let go of the wheel after a quarter of a second.
- Three fixes:
  1. **Less tilt needed.** Full lock is now about 23° of tilt instead of 35°, so there is no reason to cross your arms.
  2. **One hand is enough.** If only one hand is visible, the game works out which hand it is and assumes the other is opposite it across the centre of the wheel, so steering continues. The line turns orange and the label reads ONE HAND.
  3. **Brief dropouts are ignored.** With no hands visible it holds your steering and throttle for 0.8 seconds, then eases off gently, and only gives up after 1.6 seconds.
- Also slightly more forgiving detection settings.
- Checked with simulated hands in real time: 23° tilt gives 71% lock; with only the right hand visible, and then only the left, steering stayed on full left; no hands for half a second held everything; no hands for two seconds released; hands back gave control back at once.

### 06:19 — "Is there any way to point the camera down?" (live as version 23)
James sent the camera's view: head and shoulders fill the frame, and the natural place to hold a steering wheel is well below the bottom edge.
- Honest answer: software cannot tilt a camera. The built-in one sees what it sees.
- What does work:
  1. **Tilt the screen toward you.** The camera is in the lid, so closing the lid a little points it down at your hands. Free and instant.
  2. **Sit further back**, so more of you is in frame.
  3. **Use a different camera.** New in this version: `K` cycles through every camera the Mac can see and remembers the choice. That covers an iPhone used as a webcam (Continuity Camera) propped low or pointed at your lap, an external webcam, and the desk-view camera on Macs that have one.
- Not tested: I have no cameras, so the switching code has only been syntax-checked and published. If only one camera is present it says so.

### 06:23 — Double-checking Desk View: James was right (live as version 24)
James: "can you double check there is no way — I know that Macs have a desk view now."

What I checked, on his actual machine:
- The Mac is a 2024 MacBook Pro (model Mac16,8). Apple lists 2024-and-later MacBook Pros as supporting Desk View with the built-in camera, and the Desk View app is installed.
- I opened Desk View and asked Chrome which cameras it could see. Answer: only "MacBook Pro Camera". **Desk View does not appear as a camera to the browser**, so the `K` camera switch I added last time cannot reach it. (I closed Desk View again afterwards.)
- So my earlier "no way" was wrong in spirit: the Mac can look down, the browser just cannot select that view as a camera.

The way round it:
- A browser can capture a *window*. So: open Desk View, press `J` in the game, and pick the Desk View window in Chrome's share dialog. The game then tracks hands in that picture instead of the normal camera.
- Desk View is not a mirror and is oriented differently from the face camera, so the game treats left/right and up/down differently for it. I worked the orientation out on paper, not from a real picture, so `F` flips it if steering or braking comes out backwards.
- If the shared window is closed, the game falls back to the normal camera.

Not tested, and stated plainly: I could not see a Desk View picture or try it with hands. Chrome may also ask macOS for screen-recording permission the first time. This one needs James.

Sources: Apple, "Use Desk View to show your face and desk on camera" (support.apple.com/121541); Apple Mac User Guide, "Use Desk View on Mac".

### 06:29 — It was Centre Stage all along; simple mode (live as version 25)
James: "ok I think my issue was that I had Centre Stage on! Can you remove the Desk View stuff (that's not going to work) and recalibrate now I have Centre Stage off — also is there any way of automatically turning this off for folks when the game starts?" And then: "we should have a simple mode where folks only have to steer and we take care of the speed."

- **The real culprit.** Centre Stage is the Mac feature that zooms in to keep your face framed. It was cropping the picture to head and shoulders, which is why the hands were "too low". With it off the camera sees much more. Desk View was a detour: built, published and removed inside an hour.
- **Recalibrating for the wide view.** James's screenshot showed his hands down at the bottom corners of the picture. Two problems followed from that, and both are fixed:
  - The game was asking the camera for a 4:3 picture, which on a widescreen camera throws away the left and right edges — exactly where the hands are. It now asks for the full 16:9 width.
  - "Drop your hands to brake" cannot work when your hands already rest at the bottom edge; they would leave the picture. New brake: **bring your hands together**, as if squeezing the wheel. It works wherever your hands sit. Dropping still brakes if there is room below. The tracked line turns red while braking.
- **Can the game turn Centre Stage off for people?** No. It is a macOS setting and a web page is not allowed to change it. What the game does instead: where the browser reports that auto-framing is on, it tries to switch it off and otherwise says so on screen; the instructions on the hand-steering button now tell Mac users to turn it off from the green camera icon in the menu bar; and if no hands are seen for four seconds the camera view says so.
- **Simple mode.** A toggle on the title screen (and `X` while driving): you only steer, and the car accelerates and brakes itself to a safe speed for each corner, about 10% under the autopilot's pace. It works with keys or hands. With hands it means the only gesture is tilting.
  - Simple-mode laps are labelled SIMPLE on the board (or HANDS, SIMPLE), so nobody mistakes them for full-control laps.
- Checked: with simulated hands at the bottom corners, level hands give full throttle, tilting steers, squeezing gives full brake, releasing restores throttle. In simple mode with no keys pressed the car launched and reached 241 km/h by itself.
- Not checked: any of this with a real camera.

### 11:53 Hands become the default; grid roll-back; dress the player as the driver (version 26)

User, after trying v25 with Centre Stage off: "its great. lets make hands the default". Also: "the car seems to roll backwards on the grid" and "is there a way to make me look like a racing driving in the camera? might be fun".

- **Hands are the default.** Title screen now has a "Steering: HANDS / KEYBOARD" toggle (remembered in `goldenlap.ctl`). Clicking to start asks for the camera; if there is no camera or it is refused, the game starts anyway on the keyboard and says so. `C` still switches mid-game.
- **Grid roll-back: a real bug, two causes.** The grid is on a hill, and the countdown holds the brake on, but in this physics the brake at a standstill doubles as reverse gear. So the "held" car was reversing itself. Fix: the car is pinned (zero speed) for the whole countdown. Test: 150 frames on the grid, moved 0.0000 m; then throttle after GO reached 112 km/h as normal.
- **Racing driver costume in the camera view.** Second tracker added (MediaPipe face detection, every fourth frame) to find the eyes. Drawn over the player: the same helmet as the car's mirrors (pale shell, red band, teal stripe), with the visor cut out so their own eyes show through; grey gloves with a red knuckle band drawn along every finger; a steering wheel between the hands whose rim colour shows the state (yellow driving, red braking). Camera view enlarged from 192 to 240 px wide.
- Tested with made-up face and hand positions only; face tracker loads and runs. Not tested on a real face. If the face tracker fails to load, there is simply no helmet and driving is unaffected.
- **Capture for the video:** the camera view with helmet and gloves; before/after of the grid creep.

### 13:04 Countdown beeps; the driver gets a circuit behind them (version 27)

User: "could we have a different background to the camera driver?" and "we need some sound on the countdown".

- **Countdown sound.** Broadcast-style timing tones: a short low beep (660 Hz) on 3, 2 and 1, then a long high one (1320 Hz, 0.7 s) on GO. They go through the master volume, so `M` mutes them. Test: one countdown produced exactly three low tones and one high one.
- **Backdrop.** A third tracker (MediaPipe selfie segmentation, every other frame) cuts the player out of their room. Behind them: a painted scene in the game's colours, with a hazy sky, hills, a tree line, a grandstand with a 900-dot crowd, advertising boards, a barrier and a red and white kerb. The helmet, gloves and wheel are drawn on top as before. If the tracker fails to load, the plain camera picture stays.
- That is now three trackers on the camera (hands every frame, face every fourth, cut-out every second). Not measured on a real machine: watch the frame rate.
- Tested with a made-up cut-out shape, not a real person.
- **Capture for the video:** the camera view going from bedroom to grandstand; the countdown with sound.

### 13:12 1:00.340 with hands; start screen stripped back; cockpit backdrop (version 28)

**Milestone for the video:** the user's screenshot shows their board. Best lap is now **1:00.340, set with hand steering**, ahead of 1:02.066, 1:05.981 and 1:06.305 (all hands). Their best keyboard lap is still 1:06.592. Waving your hands at a webcam is six seconds a lap faster than the keyboard. The one-minute target from day one is 0.34 s away.

User: "try the cars cockpit as background" and "we need to massively simplify the start screen :)" (the screenshot showed nine lines of instructions running off both edges).

- **Start screen.** Now: title, "One lap. One time.", a big START button, three toggles in a row (Steering, Simple mode, Preview lap), one line of how to drive that changes with the steering choice, and the top five times. Everything else (all the keys, the Centre Stage note) is behind a small "Help and keys" link. The full board is still on `L`.
- **Cockpit backdrop.** The grandstand behind the camera driver is replaced by the car itself, as seen from a camera on the nose: black engine cover and air intake behind the head with the gold pinstripe, headrest, rear wing with a red stripe, fat rear tyres, mirrors, cockpit sides, and the road falling away behind.
- Tested with a made-up cut-out shape; not seen with a real person.
- **Capture for the video:** old start screen vs new; the 1:00.340 board; the driver sitting in the car.

### 13:15 Rev it on the line (version 29)

User: "if i stretch the steering wheel before we start we should hear the revs".

- During the countdown, pulling your hands apart now revs the engine: idle 3,500 rpm up to about 12,300 at a full stretch (roughly 30% wider than your normal grip). Revs climb quickly and fall back more slowly, like a free-revving engine with the clutch in. The rev bar on screen follows. The car stays pinned.
- The catch was that the countdown is also when the game learns your normal grip width, so a stretch used to be absorbed as "that's just how they hold the wheel". After the first few frames on the grid, a stretch is now treated as a rev, not a recalibration.
- Keyboard players get the same thing with the throttle key.
- Test (simulated hands): idle, stretch to 12,284 rpm, release back toward idle, car did not move, launch after GO normal.
- **Capture for the video:** hands pulling apart on camera with the rev bar and sound rising, then the launch.

### 13:20 The camera view becomes part of the game (version 30)

User sent a screenshot of themselves in the helmet against the painted cockpit: "the graphics should match the rest of the game". Fair: a flat cartoon backdrop next to a soft, filmic 3D picture. Then, mid-build: "in simple mode we shouldn't show the steering wheel stretching".

- **The backdrop is now the real game.** A second camera sits on the nose of the car looking back at the driver, and renders the actual 3D world and car at 240 x 135 every other frame. So behind the player is the real track receding at speed, real trees, real kerbs, the tunnel when they are in it. The player's cut-out replaces the 3D driver (head, arms and wheel are hidden for this view only).
- **The car had no back half.** Only the front was ever modelled, because the onboard camera never looks behind. Added, for the nose camera only: engine cover, airbox and intake, roll hoop, two-element rear wing with endplates, rear tyres and rims.
- **Same look.** The cut-out and the car share a warm haze and a slight blur and desaturation, and the helmet is now shaded as a rounded object (lit from above, dark at the edges) instead of flat colour. The painted backdrop stays only as a fallback.
- **Simple mode wheel.** Grip width does nothing in simple mode, so the drawn wheel now keeps one size and only tilts; no red brake line or BRAKING label either. Test: hands moved from 0.30 to 0.56 of the picture apart, wheel radius stayed at 36 px.
- Tested with a made-up cut-out while the autopilot drove at 165 km/h. Not seen with a real person, and the cost of the extra render plus a pixel read-back each frame is not measured on a real machine.
- **Capture for the video:** painted backdrop vs live one; the player in the helmet with the track rushing away behind them; going through the tunnel in that view.

### 13:49 Faster run to the tunnel, real tunnel lights, an art deco city (version 31, circuit 5)

User, with a photo of the real Monaco tunnel and one of the Fairmont hairpin: "could we make the hairpins before the tunnel much faster corners, they kinda ruin the speed of the game - also we need to make the design of the buildings much nice - how about kinda more art deco? also check the tunnel lights position in the real tunnel".

- **The slow corners.** Measured first: the left between the walls dropped to 78 km/h and the tunnel entry to 103 km/h, on a lap where almost everything else is over 150. Both redrawn as wide sweeps: one fast left into the city, then the tunnel as a single long right, which is what the real tunnel is. Slowest point from the city entry to the tunnel exit is now about 134 km/h (autopilot).
- **Lap length and time.** 2,808 m down to 2,740 m. Autopilot lap 1:05.1 down to **1:00.3**. So the autopilot now does what the user did by hand an hour ago, and a sub-minute lap by a person is very likely.
- **New circuit means a new board.** Server track version 4 to 5; old times (including the 1:00.340) are no longer shown, as with every layout change.
- **Tunnel lights.** Ours were two rows of small lamps near the middle of the ceiling. The photo shows near-continuous rows of rectangular fittings right where the ceiling meets each wall, curving away with the tunnel. Moved to the edges, made longer and closer together, with a glow on the ceiling around them and light washing down the top of the walls.
- **Art deco city.** The buildings were plain boxes with a grid of windows. Now: tall windows with glazing bars between fluted piers, a chevron panel under each window, white cornices and a canopy line above street level, stepped ziggurat tops (one to three tiers, each smaller and set back), and on most buildings a white fin up the street front ending in a spire. Colours are Miami pastels: peach, mint, cream, pink, aqua, ivory, yellow.
- First attempt at the wall glow came out as vertical bars: the wall texture runs sideways, so "top" was the wrong axis. Fixed.
- **Capture for the video:** real tunnel photo next to ours; old boxes vs the deco street; the speed trace before and after (78 to 134 km/h).

### 13:54 A longer tunnel (version 32)

User: "can we make the tunnel longer - its lots of fun".

- The road is unchanged; the roof now covers more of it. The tunnel starts just after the city entry, so the fast left is underground too, and runs on almost to the braking point for the harbour chicane. **168 m to 291 m**, about 6.7 seconds inside at autopilot pace (it was under 4).
- Same layout, so the leaderboard carries over and the autopilot lap is still 1:00.3.
- The tunnel echo and the cockpit light sweep follow automatically, since both key off the same stretch of track.
- **Capture for the video:** the whole tunnel run in one take, with sound.

### 15:10 "What else could we do?" A proposals paper with mockups

User: "what else could we do to improve the game? could you write a paper with mockups?"

- Written as a page, `next-steps.html`, published privately at https://claude.ai/artifact/PutwP8GW7vnY8PQYhYQYAd. Nine ideas, eight drawn mockups in the game's colours, and a suggested build order.
- The argument: driving, look and sound are good; what is missing is a reason to come back, a reason to share, and a board that can be trusted.
- Ideas: ghost of your best lap; a daily lap with changing conditions; a finish card with your face in the helmet; challenge links; a ten-second hand check; phone as steering wheel; track limits and server-checked laps; a television replay; smaller touches (crowd sound, sparks, touch steering, low-power mode).
- Suggested order: hand check first (strangers must get through the first thirty seconds), then the ghost (three other ideas need its recording). If the video is the deadline: finish card, replay and challenge links make the best footage.
- Nothing in the paper is built. Effort sizes are guesses.
- **Capture for the video:** the mockups themselves, as "where this could go next".

### 15:16 First three ideas from the paper, built (version 33)

User, on the proposals paper: "love it , lets go". Built the first three in the suggested order.

- **Hand check.** The first time someone starts with hand steering, they get a checklist beside an enlarged camera view: both hands seen, tilt left, tilt right, squeeze to brake (the squeeze is skipped in simple mode). Each ticks with a beep; when all are done the lights start. If a step stalls for five or six seconds it says what to do (sit back, Centre Stage, which hand goes up). Skip and "Use keys instead" buttons. Shown once, then remembered. Test with simulated hands: all four steps ticked in order and the countdown began.
- **Ghost of your best lap.** Every lap is recorded 20 times a second (about 1,200 points, 55 KB, kept in the browser). Your best becomes a yellow car that drives that lap again. It fades out as you draw level, so it is never a close-up, per the earlier rule about other cars. A running gap at the top of the screen, green "AHEAD OF YOUR BEST" or red "BEHIND". The finish panel says when you have beaten it.
- First version of the ghost was there but invisible: 45% yellow on a pale, glowing road is nothing. Made it nearly solid and brighter.
- **Finish card.** At the line the game keeps that frame. "Save picture" on the finish panel downloads a 1080 x 1350 card: the frame, the camera view of you in the helmet inset if you drove with hands, the time in huge type, position and how you steered, sector times, circuit outline, your name, the date and the address.
- Test of the gap: sat on the line and it counted up correctly (+1.68, +4.93). Test of the card: rendered and looked right for a keyboard lap. Not tested: a real lap against a real ghost, the camera inset on the card, the download itself.
- Still to build from the paper: track limits and checked laps, challenge links, today's lap, replay, phone as wheel.
- **Capture for the video:** the hand check ticking off; chasing the yellow ghost with the gap flipping to green; the saved card.

### 15:51 A board you can trust: track limits, checked laps, name filter (version 35)

User: "Yes, carry on" (next on the paper's list).

**Milestone found while testing:** the live board for the new layout already has the user at **0:53.513 with hands** (and a 0:56.681). The autopilot does 1:00.3 on this layout. The one-minute target from day one is beaten by six and a half seconds, by someone waving their hands at a webcam.

- **Track limits.** Design decision: running wide already costs time, so it is not punished. Cutting the *inside* of a corner gains time, so that is the rule: all four wheels beyond the inside kerb for a third of a second deletes the lap. A red banner says "LAP TIME DELETED, TRACK LIMITS AT" and the corner's name, then you are back on the grid in under three seconds. Not applied between the city walls, where you cannot cut.
- Check that it will not catch honest laps: on a clean autopilot lap the car never gets more than 2.7 m inside the centre line on a corner; the limit is 9.1 m (6.9 m where there is no kerb). Deliberate cut: lap voided, corner named, back to grid.
- **Checked laps.** A lap is now posted with its recording (the same 20-a-second trace the ghost uses: time and distance, about 15 KB). The server refuses a time unless the recording starts on the grid at the lights, ends at the line at exactly the posted time, has a plausible number of points, and never moves faster than 100 m/s (the car reaches about 85). Tested against the live server: a plausible recording was accepted, no recording was refused, a 40-second lap was refused.
- Honest limit: this stops someone simply typing a time into a request. It does not stop someone who fabricates a believable recording. The full answer would be the server re-driving the lap from the player's inputs, which is a much bigger job.
- Minimum believable lap changed from 35 s to 42 s. I first set 50 s, then saw the user's 53.5 on the board and backed off: a guess about what humans can do had already been wrong once in this project.
- **Name filter.** The strongest swear words and slurs, including spelled with digits or dots, become "DRIVER". Short words only match as the whole name, so Cassie, Dickson, Hancock and Grape are untouched (tested).
- Anyone with an old copy of the page open cannot post until they reload, because their copy does not send a recording.
- **Capture for the video:** the 0:53.513 board; a deliberate corner cut and the red banner.

### 16:36 Challenge links, and the rev counter gets a number (version 40)

User: "Yes, challenge links". Then, with a close-up of the bottom-left of the screen: "i wonder if we should show revs down here?"

- **Challenge links.** The finish panel has a "Challenge a friend" button. It stores that lap on the server and copies a link like golden-lap.space.fast/?c=DU92Z4. Whoever opens it sees "JAMIE M SET 0:53.513 WITH THEIR HANDS, YOU WILL RACE THEIR GHOST" in place of the tagline, the button reads BEAT IT, and the yellow ghost on track is the challenger's lap, with the gap labelled with their name. At the finish: "You beat JAMIE M by 0.412. Send one back." or how far ahead they still are.
- **Making a lap small enough to send.** The ghost recording is about 55 KB. For a link it is stored as time, distance round the lap and distance from the centre line, ten times a second: 8 KB. The car's path is rebuilt from the circuit. Checked on a full lap: average error 8 cm, worst 27 cm.
- Challenge laps go through the same recording check as board times, and a link to an older layout stops working when the circuit changes.
- **Bug worth telling:** links were created fine but could never be opened: "not found", every time, while the row was plainly in the database. The lookup was reading a URL parameter called "code", and the hosting platform quietly replaces the value of any parameter with that name with the word REDACTED, presumably to keep sign-in codes out of logs. Renamed it to "lap". Four publishes to find.
- Tested on the live site in Chrome: created a challenge, opened its link, saw the dare and BEAT IT, ghost loaded with 751 points, then removed the test row.
- Not tested: the button itself after a real lap, and the clipboard copy.
- **Revs.** The bar under the gear was already the rev counter but nothing said so. It now reads "GEAR 3  9,400 RPM", and the bar turns red above 11,800. With revving on the grid this gives the number something to do before the lights go out.
- **Capture for the video:** sending a challenge link and opening it on a second machine; the REDACTED bug; the rev number climbing on the grid.

### 16:38 The gap readout moves out of the way (version 41)

User, with a screenshot of the big "+34.30 BEHIND YOUR BEST" box in the middle of the view: "this is a bit distraction here".

- It was a large boxed number at top centre, right where you look down the road. Now it is one small line under the lap time in the top-right corner ("-0.21 VS YOUR BEST"), in the same lettering as the rest of the timing, green or red.
- Once you are more than ten seconds off the ghost it disappears entirely: +34 seconds is not information, it is a taunt.
- **Capture for the video:** the before screenshot. A mockup that looked fine in the paper was wrong in the car.

### Track limits removed (version 42)

User: "lets remove track limites".

- The rule that deleted a lap for cutting the inside of a corner is gone, along with its red banner. It lasted seven versions. The game is about speed and flow, and a rule that stops the lap worked against that.
- What stays from that round: the server still checks each lap's recording, and the name filter is still on.
- Consequence: a lap that cuts across the grass on the inside of a corner now counts. Grass is slow and the barriers are close, so the gain should be small, but that has not been measured.
- Correction to the entry above ("The gap readout moves out of the way"): that entry was written before the change had actually applied. The first attempt failed on a pattern mismatch; it went live a few minutes later as version 41.

### Road a little sharper than the scenery (version 43)

User: "can we dial back the blur on the road just a little bit - i think that should be sharper than the trees etc".

- It was the wrong way round: the speed smear was set to be *stronger* below the horizon (road, grass, kerbs) than above it (trees, sky). That came from the early days of making the ground rush.
- Now the wedge of tarmac running to the vanishing point gets 60% of the smear everything else gets. Grass, kerbs, barriers and trees are unchanged, so the edges still streak and the road you are aiming down reads more clearly.
- Nothing else in the look changed (paint pass, softness with speed, ghosting).
- Checked that it renders; whether it is the right amount is for the driver's eye.

### "The steering seems to stop working after about 5 goes" (version 44)

User, with a screenshot of the camera view showing COASTING, a level wheel, and their gloves cut off by the bottom edge of the picture.

- **Not reproduced.** Hand steering can only be simulated here, and simulated hands do not tire or heat a laptop. So this is two likely causes treated, not a proven fix.
- **Suspect 1: the machine slowing down.** The camera now feeds three trackers (hands, face, cut-out) plus an extra render of the car for the backdrop, a cost flagged as unmeasured when each was added. After five minutes a laptop may be throttling, the hand tracker answers less often, and steering lags until it feels dead. Fix: the game now measures how often the hand tracker answers. Below about 17 a second for three seconds it sheds the decoration in two steps: first the face, cut-out and backdrop run a third as often; then the cut-out and backdrop stop altogether and the plain camera picture comes back. Steering is never the thing that gets cut. Below 9 a second the label says CAMERA TRACKING IS SLOW.
- **Suspect 2: tired arms.** In the screenshot the hands sit right at the bottom edge with the wrists out of frame. Once both hands are clipped by the same edge, the tracker cannot see one higher than the other, so there is no tilt to measure. Two changes: steering now follows the row of knuckles, not the midpoint of wrist and knuckle, which sits higher and stays in view longer; and when part of a hand is below the picture for more than a second the label says HANDS TOO LOW: LIFT THEM A LITTLE.
- Tests (simulated): fast tracking sheds nothing; tracking at 9 a second sheds both steps; hands below the edge raise the warning; tilt still steers with the knuckle-based position.
- **To find out which it was:** next time it happens, read the label under the camera picture.
- **Capture for the video:** this is the honest part of building with a camera. The demo works for one lap; the fifth lap is where it breaks.

### Road surface, borrowed from the cycling app (version 45)

User: "i wonder if we can improve the road textture a little - are you able to look at my golden ride cycling app to see how we did it there?"

- Found it: Real Ride, the user's browser cycling app (its lighting has a "golden hour" setting). Read its asphalt code only; nothing in that project was changed.
- **How Real Ride does it:** grain on every single pixel (a small random lift or drop, with about 2% of pixels as bright stones), paler repair patches, darker wheel tracks, painted lines, and the texture filtered at the highest quality so it stays readable seen edge-on.
- **What Golden Lap had:** a flat grey with about 6% of pixels dotted, some streaks, and half that filtering quality. From the cockpit it read as dots on a sheet.
- **Brought across:** per-pixel grain with the odd bright and dark stone; broad soft patches of older and newer surface; ten pale repair rectangles with a dark tar seal round the edge; wavy tar lines over old cracks; and the higher filtering quality. Kept from Golden Lap: the pale grey base that suits the film look, the long streaks, the dark rubber line down the middle and the separate tyre-mark layer.
- Seen standing on the grid: reads as coarse tarmac now, with the grain holding well down the road. At 166 km/h it smears into streaks as before.
- **Capture for the video:** grid shot before and after; the two apps side by side, since one borrowed from the other.

### Today's lap (version 46)

User: "lets build todays lap next".

- **What it is.** A "Today: FOG" toggle on the start screen. Switch it on and the same circuit is driven under today's condition, with a board of its own that starts empty at midnight UTC. The all-time dry board is untouched and remains the default.
- **Five conditions in rotation**, the same for everyone in the world on a given day: golden hour, rain, fog, dusk, rain at dusk. Today (25 November) is fog. The server's calendar decides, not the player's clock.
- **What each changes.** Sky and haze colour, how far you can see, the colour of the low sun on the car, a tint over the finished picture, the road's shade. Fog cuts visibility to a few hundred metres. Rain adds streaks across the lens, a flatter bluer picture, a hiss of rain and spray that rises with speed, and 20% less grip. The tunnel stays dry, quiet and grippy, so in the wet it is the one place you can relax.
- **Things that had to follow.** Simple mode and the autopilot slow down in the wet (their target speeds assumed a dry road). Each day's condition gets its own ghost, so nobody races a dry ghost in the rain. Challenge links are dry-only. The finish card names the condition.
- **Tests.** All six looks rendered side by side. Autopilot lap in the rain: 1:09.4, no barrier contact (dry is 1:00.3). Live server: a daily lap appeared on today's board and not on the all-time board; all-time still has 12 laps.
- Not tested: how any of it looks and sounds from the driver's seat, and the midnight rollover itself.
- Built from the paper so far: hand check, ghost, finish card, checked laps and name filter, challenge links, today's lap. Removed again: track limits. Left: television replay, phone as wheel.
- **Capture for the video:** the six conditions in a grid; a lap in the rain with sound, especially entering and leaving the tunnel.

### Television replay (version 47)

User: "Yes, the replay".

- **What it is.** "Watch replay" on the finish panel plays the lap you just drove from cameras beside the track, cut like a broadcast: a red REPLAY badge, and a caption bar with your name, the corner you are in, the speed and the running lap time. Click or Enter goes back to the finish panel. It ends by itself at the line.
- **How it works.** No second recording: it reuses the ghost trace (position 20 times a second). During the replay the physics is switched off and the car is simply placed along that trace, so engine sound, gear changes and the tunnel echo all follow for free.
- **The cameras.** Sixteen fixed positions: fourteen spread round the lap plus two inside the tunnel. The game cuts to whichever is nearest. Each one pans to follow the car and zooms in as it goes away, like a real operator, with a slight lag and a tiny wobble.
- **The car.** This is the first time the car is seen from outside. It is the same model as the cockpit view, plus the back half built for the nose camera. Nothing new had to be modelled.
- **Three things that went wrong on the way:**
  1. In the tunnel the car vanished from shot: at 60 m/s the operator's lag put it out of frame when it passed close. The pan now keeps up at close range.
  2. On the waterfront the car sat against flat dark water. Cameras there now stand on the quay looking back at the city.
  3. In a few city shots the car showed through a building that should have hidden it. The car is drawn as a separate layer over the world, so nothing in the world can cover it. Not fixed properly; avoided by putting every camera on the outside of its bend, where nothing stands between it and the car. Twelve sample shots round the lap were clean after that, but a wild line could still find a bad angle.
- Tested with a recorded autopilot lap: replay starts, cuts between cameras, caption updates, ends at 1:01.5 and returns to the panel. Not tested: a real lap with real mistakes in it, and how the cuts feel in motion (only stills were looked at).
- From the paper, built: hand check, ghost, finish card, checked laps and name filter, challenge links, today's lap, replay. Removed: track limits. Left: phone as wheel.
- **Capture for the video:** the whole replay of a good lap. These are the outside shots of the car the video did not have.

### Phone as the steering wheel (version 48)

User: "lets build the phone as a wheel". The last and largest idea from the paper.

- **How it feels to use.** "Phone wheel" on the start screen shows a square code to scan. The phone opens a page that is nothing but a wheel: tap to start, hold it sideways with the screen facing you, turn it to steer, touch the screen to brake (or, on the grid, to rev). The start screen says "Phone: CONNECTED" and you press START. Laps are labelled PHONE on the board, the card and in challenges.
- **How it works.** The phone and the computer talk directly to each other (WebRTC), not through the server. The server only introduces them: the computer leaves a note under a five-letter code, the phone picks it up and leaves its reply, and from then on about 30 steering messages a second go straight across. Messages are sent unreliably on purpose: a late steering reading is worse than a lost one.
- **Reading the wheel.** Not the compass, which drifts. The phone reports which way gravity pulls; the angle of that pull across the screen is how far the phone has been turned. Full lock is 35 degrees. If the phone is lying flat it cannot tell, and says so.
- **Why not the host's own realtime feature.** Asked its documentation; it does not describe browser-to-browser messaging or its limits. So this uses the browser's own peer-to-peer link, which depends on nothing from the host except storing two short notes.
- **Same page, two jobs.** The phone page is the game's own address with a code on the end. With the code present, none of the game loads: no 3D, no sound, just the wheel.
- **Tests on the live site, two browser tabs standing in for computer and phone:** code and square drawn; "phone" tab connected; fake tilt of 29 degrees arrived as 78% right lock within about 120 ms; car accelerated, steered and braked from those messages.
- A scare: in the first driving check the car reached 1 km/h. The test held half lock from the start line for two seconds and put the car in the barrier. Not a bug.
- **Not tested, and it matters:** no real phone has touched this. Unknown: whether steering direction is right on both iPhone and Android (there is a "Steering backwards? Tap here" switch in case), whether iPhone's motion permission prompt behaves, whether it connects when phone and computer are on different networks (there is no relay, so some networks will refuse), and how it feels.
- A public Google address is used to help the two devices find each other (standard for this kind of link). It sees their network addresses, not the game.
- From the paper, everything is now built except track limits, which was built and then removed.
- **Capture for the video:** scanning the code and the phone becoming a wheel; phone in hand with the car turning on the screen behind it.

### Research: which sections do F1 drivers love? (no building yet)

User: "could you research which are the most fun grand prix sections that f1 drivers love to drive - and could we add them in? just research at this point please."

- Done by a research helper while the phone wheel was being built. No single driver poll exists; this is a synthesis of driver quotes and two driver-designed "ultimate tracks" (Hamilton's, Ricciardo's). Some quotes were seen only as search summaries. Corner shapes and speeds are general knowledge, not measured.
- Already in the game: Eau Rouge and Raidillon, Kemmel, Curva Grande, the Suzuka Esses, Monaco's tunnel, chicane and pool section.
- **Named most often beyond those:** Maggotts-Becketts-Chapel (Silverstone); Pouhon (Spa); Turn 8 (Istanbul, off the calendar); 130R (Suzuka); the Arrabbiatas (Mugello, raced once); Copse (Silverstone); the COTA esses; Portimao's blind crests; Zandvoort's banked corners; Jeddah's fast sweeps.
- **Best fit for this lap:** Pouhon (a downhill, double-apex long left, unlike anything in the game); the Arrabbiata pair (two fast rights through a dip and over a crest); a Becketts-style slalom that tightens and bleeds speed (different from Suzuka's even rhythm); a banked final corner in the style of Zandvoort's last turn, slinging the car onto the start straight.
- Skip: COTA esses (a copy of what is already there), Jeddah (its thrill is the walls).
- Open questions before building: the lap is 2,740 m and about 55 s, so adding sections means either a longer lap or replacing something; and banking would be new for the physics.

### Four more sections drivers love (version 49, circuit 6)

User, on the research: "Your best four".

- **Added, in lap order, after the waterfront:**
  1. **The Long Left** (after Pouhon, Spa): the waterfront climbs to a gentle crest as the city ends, then a long downhill left with two apexes.
  2. **The Slalom** (after Maggotts and Becketts, Silverstone): left, right, left, right through the trees.
  3. **The Two Rights** (after the Arrabbiatas, Mugello): one fast right down into a dip, a second up over a crest.
  4. **The Banking** (after Zandvoort's last corner): a right-hander tilted about 13 degrees, outside edge 2.9 m higher than the inside, feeding a much longer main straight with one flat-out kink.
- **What went:** the pool flick and the old last corner. The slalom does the flick's job.
- **The lap is much longer.** 2,740 m to 4,036 m. Autopilot 1:00.3 to 1:20.5. This breaks the "about a minute" rule from day one; the four sections would not fit otherwise. If the user's hands are 11% quicker than the autopilot again, a good lap is about 1:12.
- **Banking is new for the game.** The road, kerbs, verges and barrier are all tilted; the car follows the surface and rolls with it (checked: the inside wheel sits 0.38 m lower than the outside over the car's width); the banking adds grip, so the corner is taken at over 200 km/h where a flat one of that radius would be about 150.
- **Getting the speed right took four passes.** First attempt: the slalom fell to 67 km/h and the two rights to 99, exactly the kind of corner the user had asked to be rid of. Causes: slalom swings too wide for their length; too few points on the curves, so the path wobbled between them; and a sharp dip and crest, since a crest takes grip away. Final: every new section stays above about 125 km/h. The right-hander onto the waterfront, a leftover slow spot at 94 km/h, was opened up at the same time.
- **Everything that follows the track followed by itself:** kerbs, sand, trees, replay cameras, captions (with "Inspired by" lines), sector splits (now after the long right and where the city ends), the map.
- **New circuit, new board.** Server track 5 to 6, so the 0:53.513 is history. Ghosts and challenge links from the old layout no longer apply.
- Tests: autopilot lap with no barrier contact; stills from nine points round the new part; banking direction measured. Not driven by a person. Not looked at: the join between the city and the countryside at the crest, and the new land against the water.
- A copy of the previous layout is kept as `index-v48-before-new-sections.html`.
- **Capture for the video:** the map before and after; the banking from the cockpit and from a replay camera; the research list next to the finished corners.

## 2026-11-26

### Decision: the longer lap stays

Asked whether to keep the 4.0 km lap (about 1:15 by hand) or shorten it back towards a minute, the user said: "Keep it". The "about a minute" rule from day one is retired; the lap is as long as its best corners need.

### Camera steering lost again: a watchdog and a black box (version 50)

User: "ok, it just lost steering controls via the camera again - can we debug". Then pasted their browser console: a 403 on one request, and the normal start-up lines of the three trackers.

- **Still not reproduced.** No real camera here. So the work was to read the code for ways steering can die silently, close them, and make the next failure explain itself.
- **A real hole, found by reading.** The loop that feeds the hand tracker caught every error and threw it away. If the tracker crashed, hung, or the camera stopped delivering pictures, nothing noticed: the game kept the last steering value for ever and the label under the camera never changed. That matches both reports (a level wheel, "COASTING", no response). Last round's fixes (load shedding, hands-too-low warning) both sat downstream of the tracker answering, so neither could fire if it stopped answering.
- **What the console paste shows.** Each tracker makes its own graphics context, so with the game that is four on one page. Browsers reclaim contexts under pressure, and a tracker whose context is taken away starts throwing. Not proven to be the cause, but it is the kind of failure that would take minutes to appear and was being swallowed.
- **Fixes:**
  1. Watchdog, every frame: if the tracker has been silent for 0.6 s, or the camera has not produced a new picture for 0.8 s, the wheel is released (steering eases to centre, no throttle) and the label says TRACKING STOPPED or CAMERA STOPPED: RESTARTING.
  2. After 2.5 s of silence the hand tracker is rebuilt from scratch. If the camera track has ended, been muted by the system, or frozen, the camera is reopened.
  3. Every call to a tracker now has a time limit. The helmet and cut-out trackers are switched off for good the first time either errors or hangs, so decoration can never block steering.
  4. A diagnostics panel (press I; it also opens by itself after any restart): tracker answers per second, time since the last answer, camera state, time since the last new picture, error count and text, restarts, frame rate, and a timestamped list of the last events.
- Test with a faked stall: steering released within about 0.9 s, label changed, restarts attempted and logged, panel opened. In the test environment the tracker really did abort ("native code called abort"), which was caught, logged and retried, where before it would have vanished.
- **The 403:** loaded the live page and listed every request: 17, none failed. So it is not something every visitor gets, and it appears before the trackers start. Probably unrelated to the steering; not identified.
- **Next time it happens:** the panel should be on screen. A screenshot of it is the evidence.
- **Capture for the video:** the diagnostics panel. Debugging something you cannot see, by making it report on itself.

### The red line goes, and so does what it stood for (version 51)

User, with a screenshot of the camera view: "we dont need this red line anymore right".

- Right. The red line marked "drop your hands below here to brake", the original brake gesture from before the squeeze. It was still switched on wherever there was room below the hands.
- Removing only the line would have left an invisible rule: let your hands sag a few centimetres and the car eased off the throttle, then braked. That is a plausible part of the "steering stops working after a few laps" reports, since the label in the first screenshot read COASTING.
- So both are gone. Braking is the squeeze and nothing else; throttle depends only on grip width. How high or low the hands are held no longer does anything.
- Checked that it builds and publishes; not tested with hands.

### The black box pays off: the steering fault is found (version 52)

User sent a screenshot of the diagnostics panel after losing steering again: "how does this look".

- **What the panel showed.** 45 errors, all the same: "Cannot read properties of undefined (reading 'x')". Three bursts, about two minutes apart (09:26:58, 09:29:01, 09:30:06), each ended 2.5 seconds later by the watchdog rebuilding the tracker. Camera live, new pictures arriving, 50 answers a second, nothing shed. So: not the camera, not overheating, not the helmet or cut-out.
- **The fault.** Every couple of minutes the hand tracker hands back a hand with no finger positions in it. The first line of the code that reads the result asked for a knuckle's x position, got nothing, and threw. It then threw on every picture until the tracker was rebuilt. Before version 50 nothing rebuilt it, and the error was thrown away, so steering simply died. This has been there since hand steering was first built; only the diagnostics made it visible.
- Both earlier guesses (the machine slowing down, hands sinking out of view) were wrong. They were reasonable and the fixes do no harm, but neither was the cause.
- **Fix.** Hands without a full set of positions are now ignored, and counted on the panel ("bad hands ignored"). The good hand carries on steering, as when one hand hides the other. And if the tracker errors three pictures in a row for any reason, it is rebuilt on the spot (a fraction of a second) and the panel records where the error came from.
- **Test.** Fed the reader six kinds of broken result (empty hand, missing hand, short hand, not-a-number positions, both hands broken, no result at all): none threw, steering held at its last value and the label read ONE HAND or HOLDING.
- Not certain: whether the error was raised in the game's reader or inside the tracker library itself. If the second, the fast rebuild is what helps, and the next panel will show the file it came from.
- **Capture for the video:** this panel screenshot. Three wrong theories, then one screenshot from an instrument built an hour earlier.

### First cut of the film

User: "can you do me a first cut video, like the one we did for the zwift game", "for my youtube", and "look back at the zwift thread to see how we did the storytelling - that was key".

- **Found the Zwift film.** It is "This Little Thing: Golden Hour Ride", a HyperFrames project in another session's folder, 5:13 long, with its voiceover script. Read the script for how the story was told: a hook with a promise and one odd detail, "we go back two days", how the thing is made in plain steps with real numbers, the author looking and saying "not quite", the one thing the rival does not do, a setback, and "you can too" with the link.
- **This film's story, same shape.** Hook: a racing game steered with bare hands, and a steering fault nobody could find. Plant: "remember one number, one minute". Setup: the old onboard footage and the one question. How the look is made (filter off, filter on). Looking and saying what is wrong; the helmet was perfect. The greatest-hits circuit. The problem: a 1:44 first lap and twitchy keys. The idea: hold your hands up. The turn: steering dies after five laps, two wrong theories, the black box, one screenshot, "a hand with no fingers". Payoff: 52 versions, 0:53.513 with hands against the one-minute target, the link.
- **Made:** a nine-scene voiceover script (`video/voiceover-script.md`); six clips of game footage with the game's own engine sound, recorded in headless Chrome while the autopilot drove (lap, filter off/on, five weather conditions, rain into the tunnel, the new corners, the television replay); a HyperFrames project (`video/film/`) built by `video/build_film.py`, which places every cut and caption from the voiceover timings.
- **Length:** 4:38 at 1080p.
- **Placeholders, plainly.** The voice is the Mac's built-in British voice, as a timing guide. The ElevenLabs account ran out of characters after three scenes (those three takes in the user's cloned voice are kept in `video/vo/elevenlabs/`). The music is the bed from the Zwift film. Five shots only the user can record are marked "TO SHOOT" on screen and listed in `video/SHOTS-TO-RECORD.md`.
- The original F1 clip is not used: it is someone else's footage.
- A first attempt to start a local server for recording from the shell was blocked; the footage was recorded against the app's own preview server instead.

### Second cut of the film: five notes

User, after the first cut: "lets add claude + spacefast to the intro screen - use logos"; "i think i should shout over the bit with the engine sound - would be funny"; "lets say how we made the track - like we did with the zwift one"; "lets say over a weekend with claude - cuz this isnt a work thing"; "the replay footage looks really bad - i really want the intro hook to show speed and excitement - it must blow people away".

- **Title card.** "How I built a racing game / with Claude + Spacefast", each with its logo (Claude's spark as on the Zwift title; Spacefast's green mark from its own site). I took "intro screen" to mean the film's title card, not the game's start screen.
- **"Over a weekend."** Script and captions now say a weekend, not two days. For the record, the log's dates are Tuesday 24 to Thursday 26 November; the framing is the author's choice.
- **Shouting over the engine.** In the sound section the engine comes up to full volume and the next four lines are to be shouted over it, with the words slammed up on screen so they can be followed; then the engine cuts dead and he says "Sorry." Measured: that passage is about 6 dB louder than normal narration.
- **How the track is made.** New scene, in the manner of the Zwift film's road. The real numbers: sixty dots, a smooth curve through every one, chopped every 3 m with "forward" and "right" worked out at each step, 6 m each side joined with triangles, a kerb where the curve is tight, a height on every dot; 4,036 m in all. Drawn from the game's actual control points: dots, curve, ticks, tarmac, kerbs, then the height profile.
- **The hook.** Rebuilt around speed. Opens on three seconds flat out in the tunnel with the engine at full volume before a word is said, then a new corner every two or three seconds: tunnel exit, banking, long right, rain in the tunnel, slalom, the swoop, golden hour, the two rights, the main straight.
- **Replay footage removed from the film entirely.** The user's verdict on it: "really bad". That is also a verdict on the replay feature in the game, which may need another look.
- Now ten scenes, 5:17. Guide voice, placeholder music and the "TO SHOOT" slots are unchanged.

### Is anyone else steering like this?

User: "are there any other racing sim games with the same steering mechanics that we have?"

- **Yes, and the idea is fifteen years old.** Kinect Joy Ride (2010) and Forza Motorsport 4's Kinect mode (2011) both had you hold an imaginary wheel. Both also handled the throttle and brake for you, which is exactly our simple mode. Reviews of the time complained about precisely that: no pedals.
- **Webcam versions exist, mostly as demos and hackathon projects:** Liquid AI's "hand voice racer" (browser, MediaPipe, steering from the angle between the two wrists); F1 Gesture Racer on Devpost (browser, in progress); Drivable on GitHub (a Python tool that turns the gesture into key presses for other games); assorted tutorials.
- **What seems to be ours:** squeeze-to-brake with full throttle as the resting state, so it is not pedal-less; a shared leaderboard; and the player dressed as the driver. Found nothing polished and public that combines them, on the strength of two searches, not an exhaustive survey.

### Diagnostics panel hidden for the beta tester (version 53)

User: "can you remove the diagnostics dialog - some is gonnna beta test it for me".

- The panel no longer opens by itself when the camera or tracker is restarted, and it is gone from the help text. A beta tester will never see it.
- It still exists behind the I key, unadvertised, because it is what found the steering fault. The watchdog and automatic restarts are unchanged.

### Third cut: the film is now about a bet

User, on the second cut: "i dont think the steering breaking is much of a hook tbh. what else could we use to get people to keep watching". I offered four hooks; the user chose the recut ("yea ok").

- **Why the old hook failed.** A bug is a problem the viewer does not have yet. Nothing to root for in the first ten seconds.
- **The new spine: a bet against a clock.** "The computer that built this can drive a lap in one minute. Can I beat it with my bare hands?" The times fall on screen all the way through: 1:44.066 (first lap, keyboard), 1:06.592 (keyboard after four steering fixes), 1:00.340 (hands, a third of a second over the minute), then 0:53.513 against the computer's 1:00.3. A scoreboard sits in the corner from the first lap until the bet is settled.
- **The new opening.** Three seconds that pass for tape, engine at full volume, captioned "ONBOARD CAMERA". Then: "That isn't footage. There's no car. No track. No engine. I typed it," and the filter drops away to show the flat world underneath, then snaps back.
- **Kept straight.** The jump from 1:00.340 to 0:53.513 was not all driver: the two slow corners before the tunnel were opened up in between (78 and 103 km/h to 134). The film says so, and compares 0:53.513 with the computer's 1:00.3 on the same layout. The ending admits the lap has since got longer and the board has started again: "first place is anyone's".
- **Where the steering fault went.** It is now "one more problem", after the win, told in the same way (two wrong theories, the black box, a hand with no fingers).
- **Promise in the hook, kept at the end:** "Stay to the end and I'll give you the link, so you can beat me."
- Eleven scenes, 5:37. Still a guide voice, placeholder music and "TO SHOOT" slots. The music now starts at the title card; the opening is engine only.

### A ten-second clip for Slack, with the HUD and a drawn pair of hands

User: "i need a short 10 sec video to share in slack - something beautiful and fast", then "can yuo put the rev counter back in to the vdeo and the lap time etc", then "if there's anyway to kinda show the yuo steer with yuor hands? but it needs to look beautiful".

- `golden-lap-10s.mp4`: four cuts with engine sound. Golden hour through the swoop at 249 km/h, the tunnel, dusk on the long right, the banking onto the main straight.
- **Why the HUD was missing.** The speed, revs and lap time are ordinary page text laid over the game, and the recorder only captured the game's picture. Fix: for these clips the picture and the HUD are redrawn together onto a second canvas every frame, reading the live values off the page, and that canvas is what gets recorded. So the numbers in the clip are the real ones from that lap.
- **Showing the hands without footage of them.** There is no film of the user steering. A panel at top centre, where the camera view sits in the game, shows two gloved hands on a yellow ring that tilt exactly as the car steers, captioned "STEERED BY HAND, ON A WEBCAM". It is a drawing driven by the real steering angle, not a person.
- Three full laps were re-recorded with both (dry, golden hour, dusk), so the film can use them too.

### First user test: three notes

Reported by the user: the tester found it "too abrupt"; wondered whether you could "squeeze fists to brake, like you would naturally"; and found it "too sensitive", struggling to keep the car on the track. Asked: "what do you think?"

- **My reading:** the three notes are one problem. Throttle and brake both hung off how far apart the hands were, so a newcomer whose hands drifted a few centimetres got an unexplained lift, then braking. That is "abrupt". And the steering was tuned to someone who had done thirty laps.
- User: "Yes, build both".

### Fists to brake, and calmer steering (version 54)

- **Brake by clenching.** The tracker gives every finger joint, so the game measures how open each hand is: fingertip distance from the wrist, in palm lengths (a flat hand is about 2, a tight fist about 1). It learns your normal grip during the countdown, since most people already hold an imaginary wheel half closed, and measures the clench from there. A slight clench lifts off the throttle; more brakes, progressively.
- **Hand distance no longer does anything while driving.** It only revs the engine on the grid. Drifting hands cannot lift or brake.
- **Steering.** Full lock was at about 23 degrees of tilt. It is now 34 by default, with a bigger dead zone round straight ahead, a softer centre and more smoothing, and it eases off a further 22% at speed. The `[` and `]` keys now set it for hands too: 46 degrees at 1, 16 at 9.
- **Simulated test, hands with fingers:**
  - resting grip: full throttle, no brake
  - half clench: throttle off, brake 4%
  - tight fist: throttle off, brake 86%
  - fist held two seconds: still 77% (the "normal" creeps a little toward the clench, by design slowly)
  - released: back to full throttle
  - hands moved closer together, then wider apart: no change at all
  - tilt 10 degrees: 11% lock (was about 35%); 20 degrees: 40% (was about 85%); 34 degrees: 98%
- A wrinkle in testing: every reading first came back zero. The watchdog from version 50 saw the fake camera as frozen and was, correctly, letting go of the wheel.
- The hand check's last step now reads "CLENCH YOUR FISTS TO BRAKE", and the start screen says so too.
- **Not tested with real hands.** The open question is whether a tracker can tell a loose grip from a tight one when the fingers are curled toward the camera. The diagnostics panel now shows the two numbers ("hands open", "normal") for exactly that.
- For the user: to get the old, sharper steering back, press `]` three times (feel 7 is about the old 23 degrees).

### "The braking is now back to front" (version 55)

User, on version 54: "the breaking is now back to front - it breaks when i spread my arms wider - is that intentional", then "i thought we were clenching to break now?"

- Not intentional. Clenching is the brake. The fault was in how the clench was measured.
- **Cause.** Version 54 judged how closed a hand was from the flat camera picture: fingertip distance from the wrist, in palm lengths. Spread your arms and your hands turn; turned fingers look shorter in a flat picture; the game read shorter fingers as a fist. The simulated hands in the version 54 test never turned, so the test passed and the real thing failed.
- **Fix.** The clench is now the bend at the middle knuckle of each finger, measured in three dimensions from the tracker's own model of the hand. A bend is the same whichever way the hand faces.
- **Second safeguard.** Both fists have to close. The brake follows the more open of the two hands, so one hand misread for a moment cannot brake the car.
- **Test, this time with hands that turn:**
  - resting grip: full throttle, no brake
  - arms spread wide: no change
  - hands turned 60 degrees: no change (with and without the tracker's 3D data)
  - slight clench: throttle eases to 69%
  - half clench: throttle off, brake 51%
  - tight fists: brake 100%
  - one fist only: nothing happens
  - released: full throttle
- Still simulated. The honest lesson from version 54 is that a simulated hand only tests the cases someone thought of.

### Steering that loads up with speed (version 56)

User: "do you think it would help if the steering got heavier the faster you go - like in real life - does this happen in real life?" Then, on my answer: "yea".

- **Real life.** Yes. A turned tyre tries to straighten itself and that force grows with cornering load; downforce multiplies it. Early-90s F1 cars mostly had no power steering, which is why drivers of that era describe wrestling the wheel through fast corners.
- **In the game there is nothing to push against**, so "heavy" has to be behaviour. Two ways: the same tilt turns the car less at speed (helpful), or the steering lags behind the hands (realistic, but lag makes people overcorrect and weave).
- **Built:** mostly the first, a touch of the second. The same tilt now gives 40% less steering at top speed (it was 22%), scaling smoothly from a standstill. The front wheels also follow the hands a little more slowly at speed: the catch-up rate falls by about 40% at top speed, enough to settle the car without real lag. Applies to hand and phone steering; the keyboard already had its own version of this.
- The steering wheel in the cockpit follows the weighted steering. The drawn wheel in the camera view still follows your actual hands, as it should.
- **Simulated, same 20-degree tilt:** front wheels turn 0.105 rad at 60 km/h, 0.026 at 150 and about 0.013 at 300, reaching nine-tenths of that within a tenth of a second at 60 and 150 and a little later at 300.
- Not tested with real hands: whether it feels planted or sluggish is for the driver.

### Simple mode that is worth driving (version 57)

User: "i wonder if we can make easy mode more fun? it's kinda too slow atm. I'm wondering if the default might be easy mode - but its kinda slow and not fun. Is there a balence we could find?"

- **Why it was dull.** Simple mode held the car at 90% of the grip limit everywhere, straights included, whoever was driving. Safe for a first lap, and exactly as exciting as that sounds.
- **The balance: the car's pace follows the driver.**
  - Straights are now flat out. There is nothing to get wrong on a straight.
  - In corners the car carries a share of the grip limit that starts at 92% and moves. Keep within 4.6 m of the middle, on the road and off the barriers, and it climbs (about 4.5 points every six seconds) up to 99%. Run wide, leave the road or touch a barrier and it drops fast, as low as 86%.
  - So a beginner gets a car that slows down for them, and someone steering well gets a car at the limit. Same mode.
  - The HUD shows it: "SIMPLE MODE · PACE 94%". A number to push up is a small game in itself.
- **Measured**, with the autopilot doing only the steering and simple mode setting the speed: lap 1:17.6, top speed 312 km/h, no barrier contact, pace at 99% for most of the lap. The full autopilot does 1:20.5 at 298 km/h. The old simple mode would have been about 1:24.
- So a tidy simple-mode lap is now quicker than the autopilot. Simple laps are still labelled SIMPLE on the board.
- Not decided: whether simple mode becomes the default for new players. Asked.
- Not tested with a person steering, which is the whole point of the adaptive part.

### Simple mode, take two: "it still feels too slow" (version 58)

User, on version 57: "it still feels too slow - any ideas?"

- **The real fault in version 57.** Its "99% pace" was 99% of the autopilot's speed profile, and that profile is deliberately cautious: it keeps a fifth of the tyres' grip in hand and brakes early. The user drives about 11% faster than the autopilot. So simple mode at full pace was still holding him back, by design.
- **Fix: a second speed profile near the car's real limit** (90% of the grip instead of 80%, braking a third later), and simple mode's pace now runs between the two. 88% is the autopilot's pace; 100% is the fast profile. It starts at 96%.
- **Less quick to slow you down.** "Tidy" was within 4.6 m of the middle of a 12 m road; it is now simply on the road and off the barriers. But each time you do overstep, the car stops a little short of that pace for the rest of the lap.
- **Finding the ceiling took three tries**, with the autopilot steering and simple mode setting the speed:
  - at 100% of the tyres' grip: 1:14.9, but four barrier hits and three seconds off the road
  - at 88%: still two hits, and every one of them in the same place, the exit of the banked corner. The fast profile was trusting the banking for more grip than it gives as it flattens out.
  - at 90% with less faith in the banking: **1:12.9, no hits, never off the road, top speed 313 km/h.**
- For comparison: autopilot 1:20.5; version 57 simple mode 1:17.6; the old one about 1:24. So a tidy simple-mode lap is now seven and a half seconds quicker than the autopilot.
- **A bug of mine, found in passing:** in version 57 a comment I added mid-line swallowed the code after it, so the game stopped remembering whether you had simple mode on. Second time in this project that exact mistake has happened. Fixed.
- Not tested with a person steering.

### The Spa swoop, opened up (version 59, circuit 7)

User: "yea simple mode is much better - i still think the spa section could be quicker?"

- Measured it: the swoop fell to **117 km/h** over the crest, with two kinks of about 50 m radius. The corner it is named after is taken nearly flat. The side-to-side kinks were too big for how short they were, and the hill ended in a sharp crest, which takes grip away just where the car is turning.
- Straightened the kinks (from 14 and 18 units of sideways movement to 6 and 11), stretched them out, and eased the top of the hill. Two passes: 174 km/h, then **232 km/h** at the slowest point.
- Autopilot lap 1:20.5 to **1:18.0**. Simple mode with tidy steering 1:12.9 to **1:10.8**. No barrier contact in either.
- A layout change, so circuit 6 becomes 7 and the board starts again. It only had a handful of laps on it.

### Ten-second clip: hands panel out

User, with a screenshot of the drawn hands panel: "lets remove this for the video - it's kinda distracting". Re-recorded the three HUD laps without it and recut the clip. The panel is still available in the recorder behind a switch.

### A trailer: "Lights out"

User: "could we turn our video into a mini trailer? that might be fun - no music - what ideas do you have?" I offered four; the user chose "Lights out".

- `golden-lap-trailer.mp4`, 23 seconds, no music. Sound is three beeps, the engine, and silence.
- **Structure.** Black and silent. Five start lights come on in three steps with a low beep each, and a word on each beep: NO WHEEL. NO CONTROLLER. JUST YOUR HANDS. On the long high tone the lights go out and it cuts to the car launching at full volume. Six fast cuts: the tunnel, golden hour on the long right, rain through the swoop at 238 km/h, dusk in the slalom, the banking, the main straight at 298 km/h. Hard cut to black and silence, then GOLDEN LAP, "One lap. Steered with your bare hands." and the address.
- All footage has the real HUD in it. A rain lap was recorded for this, which is also the first footage of the faster swoop.
- Built as its own small HyperFrames project (`video/trailer/`, from `video/build_trailer.py`).
- Checked by stills and loudness, not watched through.

### Rain, done the way the cycling game did it (version 60)

User, on the trailer: "the rain is bad, check out how we did weather on our zwift golden hour ride - that rain was perfect".

- **What mine was.** Bright slanted lines drawn across the finished picture, the same whether the car was parked or at 300 km/h, plus a grey tint. Flat, and stuck to the screen.
- **What the Golden Hour Ride does** (read from its source; nothing there was changed). Three separate things:
  1. **Streaks in the air.** Thousands of short lines in a 30 m box that travels with the camera. Each streak is drawn from where the drop is to where it was a moment ago *as seen from the moving vehicle*, so they fall straight when you are stopped and come at you almost flat at speed.
  2. **A wet road.** Darker, with rings where drops land.
  3. **Drops on the lens.** Each one lands, sits, slides a little and dries, and bends the picture behind it.
- **Ported all three.** The road needed adapting: the cycling game's road has real lighting, Golden Lap's does not, so the shine is done directly: looking along the road it mirrors the sky, looking down at it it is just dark and wet. First try made the whole road look like ice; reflection now only builds toward the horizon. The tunnel stays dry.
- Screen-space streaks removed.
- Rain lap re-recorded and the trailer re-rendered with it. The long film still contains the old rain in two shots and needs re-recording before its next render.
- **Capture for the video:** old rain against new, same corner.

### Trailer recut: open on the grid (James: "i dont like the start graphics - we need to show our beautiful first shot")
- Removed the black opening with five drawn start lights and the generated beeps.
- The trailer now starts on the live grid shot as one unbroken take: engine idling, the game's own countdown beeps, a throttle blip on each beep, launch at 3.8 s, cut to the tunnel at 6.2 s.
- New `gridrev` clip in `video/record.mjs` (key presses timed to the beeps, then the autopilot takes the launch).
- NO WHEEL. / NO CONTROLLER. / JUST YOUR HANDS. are now small yellow captions in the sky, one per beep. Rest of the cut and the silent end card unchanged. Still 23 s, no music.

### Trailer recut again: open flat out, not on the grid (James: "the grid is kinda slow"; "can we have the spa bit at the start"; "engine noise over the Golden Lap slide?")
- The grid opening lasted one cut. The trailer now starts mid-lap at 298 km/h on the pit straight and plunges into the Spa-style swoop: six seconds, one take, from a new flying-lap recording (`lapfly`, 102 s so the car reaches the swoop on its second lap at full speed).
- The three words sit on dark plates in the sky (yellow on the white sky measured 1.21:1, unreadable).
- End card: the engine no longer cuts dead. The last shot's sound carries on under GOLDEN LAP, muffled and fading out over five seconds, as if the car has driven off.
- Final loudness brought down from about -7.5 to -14 LUFS.
- End card now sells the leaderboard (James: "emphasise on the final screen that there is a leaderboard, in a nice way"): a timing-board row, yellow P1 tab, "YOUR NAME", an empty lap time, and under it "ONE WORLD LEADERBOARD. EVERY LAP COUNTS."
- Trailer, two more notes from James: "we dont need the text at the start - just the amazing visuals" (the three words are gone; the opening is picture and engine only) and "can we make this look more late 70s early 80s" (end card redrawn: chocolate background, fat slanted cream title with stacked mustard/orange/red/brown shadows, a five-band speed stripe in the helmet's colours wiping across, Playfair italic tagline, the leaderboard row as a cream pill with an orange number 1).
- Trailer, rain variant (James: "could we try one where it rains on this bit - just after the fast spa bit"): `golden-lap-trailer-rain.mp4`. Not a cut to a rain shot: the weather turns inside the opening take. The recorder blends every weather setting (sky, haze, fog, road colour, grade, rain amount, grip) from dry to rain over three seconds, starting as the car bottoms out of the plunge (`lapflyrain` clip). The opening shot runs 0.6 s longer to let the rain land. Built with `RAIN=1 python3 build_trailer.py`; the dry version is unchanged.
- Trailer, match cut (James: "when it cuts to the Monaco tunnel it should be turning right, cuz that follows the previous shot direction"): the tunnel shot started a second too early, while the tunnel still bent left ahead. It now starts once the car is in the long right-hander (one second later in the lap), in both the dry and rain versions.
- Trailer (James: "the tunnel bit kinda looks slow"): it was. The car does about 150 km/h in the tunnel and the shot comes straight after 298 on the straight. The tunnel shot is now played 35% fast (picture and engine pitch together; the recording is 30 fps, so the speed-up drops frames and may judder slightly). Trade-off noted to James: the speed readout in that shot still shows the real 135-165 km/h.

### Lens smudge trial, and the code goes to GitHub
- James: "even when it's dry we have the occasional smudge on the camera lens, something really subtle?" Tried on the trailer first, not in the game: `video/smudge.sh` blurs and lifts four soft patches of the finished picture, so they vanish over dark road and trees and glow where bright sky is behind them. Result: `golden-lap-trailer-smudge.mp4`. Not applied to the end card.
- The project is now in a private GitHub repository, jamiemarsland/golden-lap: the game, sounds, leaderboard server, this log and the video scripts. Footage, renders and voice takes are left out (over 2 GB).
- Smudge trial, second pass: James couldn't see the first one at all, so it is now roughly three times stronger (wider blur, more lift, full-strength mask). Visible as a milky streak where the trees meet the sky. Before/after frames in `smudge-before-after.jpg`.
- Repository made public at James's request. Before that: removed the Mac username path from the two recording scripts, dropped a saved copy of another site's home page from `video/logo-src`, and squashed to one clean commit.
- Smudge trial, third pass (James: "the smudge should only appear momentarily and then drift off the screen with the air pressure from the speed"): no more fixed marks. Three times in the trailer (1.3 s, 8.3 s, 13.9 s) a small soft smudge lands on the lens, sits for under half a second, then the airflow drags it to the edge of the picture in about 0.9 s, stretching into a streak and thinning as it goes. `video/smudge.py` replaces `smudge.sh`.

### v61: lens smudges in the game (James: "those smudges are great - lets add to the game")
- Ported the trailer trial into the lens shader (pass B). Every 9 to 23 seconds of dry running above about 125 km/h, something lands on the upper half of the lens: that patch goes soft and milky, sits for 0.45 s, then the airflow drags it outwards and upwards off the picture, stretching into a streak. Faster car, quicker exit.
- It is a blur and a lift of the picture, not a drawn mark, so it barely shows over dark road and glows against bright sky. Never in the tunnel, never in rain (rain has its own water on the lens), never on the grid.
- Checked in the preview by freezing one at full strength next to a clean frame: the trees behind it go pale and soft. Not judged in motion at speed.

### v62: the wheel is live on the grid (James, driving with the phone: "the steering doesnt work until the countdown has finished which is a bit weird")
- The grid code zeroed the steering along with the throttle, for every kind of control. Now only the throttle is held: turn the phone (or your hands, or press a key) during the countdown and the wheel and front tyres turn. The car itself is still pinned to its grid slot. Checked with a key held on the grid: wheel at 0.46 lock, car moved 0 m and turned 0 degrees.

### v63: phone panel centred (James, with a screenshot: "the qr code should be centered")
- In the "Steer with your phone" panel the QR code sat left of the heading and text. The panel's contents are now stacked and centred as a column.

### v64: the modes are now Beginner and Pro (James: "i think we should call our modes beginner and pro")
- "Simple mode: ON/OFF" became one button reading "Mode: BEGINNER" or "Mode: PRO". Same on the speed readout, the leaderboard tags (every row now says which, e.g. "PHONE, BEGINNER", "HANDS, PRO"), the finish card and the help text. The stored tags still say "simple", so old laps keep their place.
- James also asked whether Pro can post a faster lap, "ideally they should if they are really really good". Worked out from the speed profiles, as flying laps:
  - the computer's driver: 69.1 s
  - Beginner at its slowest (88% pace): 73.5 s
  - Beginner at its ceiling (100% pace): 64.6 s
  - the car's real limit (all the grip, late braking, full trust in the banking): about 60.6 to 61.2 s
  - a very good but not perfect Pro lap (97% of the grip): about 61.6 s
- So yes: Beginner tops out at 90% of the grip, brakes early and half-trusts the banking, which leaves Pro about three to four seconds. But a Pro driver only as good as the computer's is four and a half seconds slower than a tidy Beginner. Nothing changed in the handling.

### v65: a cleaner phone wheel page (James: "is it possible to open the steering wheel on the phone in a clean browser?")
- Answer given: Android yes, iPhone only partly. A web page cannot hide Safari's bars on an iPhone; the only bar-free route there is "Add to Home Screen", which a QR code cannot open.
- Android: the first tap (the one that starts the motion sensor) now also asks for full screen, so the address bar and buttons go.
- iPhone and everything else: the page no longer scrolls, bounces or zooms, runs under the notch with safe margins, and tells the browser to tint its bars the page's dark grey so they blend in.
- Checked at phone size in the preview (settings applied, nothing scrolls, no errors). Not tried on a real iPhone or Android phone.

### v66: a brake lamp in the steering wheel (James: "some user feedback when braking - maybe a cool little red light appears in the middle of the steering wheel?", then "it should look kinda ole school")
- Braking with a clenched fist or a touch on the phone gave nothing back. There is now a small warning lamp in the wheel's hub: chrome bezel, ruby lens, and a bulb that glows in proportion to how hard the brakes are on.
- Old school means it behaves like a filament, not a switch: quick to light, slower to die away, with a soft red halo and a hot spot off-centre at full brake.
- It shows whatever is braking the car, so it also lights on the grid (the car is held on the brake) and when Beginner mode brakes for you.

### v67: the phone wheel buzzes (James: "i dont suppose its possible to do any kind of haptic feedback is it?")
- The link between phone and game was one-way (steering in). It now carries three signals back: a gear change, a barrier hit, and running over a kerb or the grass (repeated about ten times a second while it lasts).
- Android: real vibration. A short pulse for a gear change, a slightly longer one for kerbs, a double thump for a barrier.
- iPhone: Apple gives web pages no vibration, so the page flips a hidden switch control, which makes recent iPhones give their small "tick". One strength only, three quick ticks for a barrier. Unofficial, and untested on a real iPhone.
- The phone gives one tick when you tap start so you know it works, and has a line to turn vibration off.
- Tested here only as far as possible without a phone: the game sends the gear-change signals during a lap, and the phone page loads and its switch flips. Whether it can be felt is for a real phone to say.

### v68: no haptics on iPhone, and the reason (James: "not working on iphon")
- Looked it up. The switch-control trick worked from iOS 17.4 to 26.4; the library that popularised it says Apple closed it in iOS 26.5, and WebKit has a bug titled "haptic feedback for switch should require user activation". Even where it survives, a tick that needs a finger on the screen cannot be fired by a kerb. So on a current iPhone there is no way for a web page to vibrate the phone.
- The "Vibration is on" line now only appears on phones that can really vibrate (Android). The old trick is left in for older iPhones, where it does no harm.
- Android haptics remain, still untested on a real Android phone.

### An iPhone app for the wheel, to find out if haptics are worth it (James: "lets build it for me so i can see if its worth it")
- Context: James asked whether an iPhone app would have to be on the App Store or could live on GitHub. Answer: the code can live on GitHub, but only people with a Mac and Xcode can install from there; for anyone else it is TestFlight or the App Store. For his own phone, GitHub plus Xcode is enough and free.
- Built the smallest thing that answers the question, in `ios-wheel/`: an app that shows the game's own phone-wheel web page in a web view, and adds what Safari withholds. No browser bars at all, the tilt sensor allowed without a prompt, the screen locked upright so it cannot flip while steering, the screen kept awake, and real haptics: a crisp tap for a gear change, a heavy tap ten times a second on kerbs and grass, a double thump for a barrier.
- The web page now checks whether it is inside the app and, if so, hands the gear/kerb/barrier signals to it (v69). Outside the app nothing changes.
- You type the game's code into the app, because a QR code always opens Safari.
- Honest state: this Mac has no Xcode, so the app has **not been built or run**. Only the Swift syntax is checked. Next step is James installing Xcode.

### Paper: a start screen that says "pick up your phone" (27 November)
- James: "we need to tidy this up. i want 99% of folks to use their phone, cuz that will be the best experience on a laptop - could you write a paper, with mockups, of how we redesign this start screen to push things that way. It also needs to be super clear to understand, quickly."
- `start-screen.html`: today's screen has five equal buttons with the phone last, and START launches a keyboard or camera lap. Proposal: the start screen becomes the scan screen (code shown on load, three numbered steps), then a "ready" screen with a live wheel and a Beginner/Pro switch, START on the phone, a sideways phone layout with the brake hint, and a "needs a bigger screen" message when opened on a phone. Phone lap goes from four actions to two.
- Flagged in the paper: the film and trailer say "steered with your bare hands", which no longer matches if the game leads with the phone.
- Also earlier today: mocked up three brake hints for the phone wheel (lamp in hub, thumb pads, red edge), upright and sideways. Recommendation: lamp plus thumb pads that fade after the first brake. Nothing built yet.

### v70: the start screen is now the scan screen (steps 1 and 2 of the paper; James: "Yes, build them")
- On load the screen shows "Your phone is the steering wheel", three numbered steps and the QR code, made automatically. No START button until there is something to start. Codes last four minutes and renew themselves while the screen is up; click the code for a new one.
- When a phone connects the screen switches to "Phone connected": a wheel that turns as you tilt the phone (and its hub lamp lights when you touch the screen), a Beginner / Pro switch with a line under each, and START.
- Hands and keyboard are one quiet line, "No phone to hand?", leading to the same mode switch and START. "Preview lap" is now "Watch a lap first"; weather is a small link; the five-button row is gone.
- Only the START button (or Enter) starts a lap now. Before, a click anywhere on the screen did.
- A first visit starts in Beginner; the choice is remembered. (Browsers that already chose Pro stay in Pro.)
- Decisions taken without James, as recommended in the paper: Beginner by default, and a code made on every visit.
- Checked: all three states in the preview, START and the blank-click change, and on the live site that a real QR code appears on load. Not checked: a real phone connecting through the new screen.
- The old screen is kept as `index-v69-before-new-start-screen.html`.

### v71: today's lap is the default, with two boards (James: "i wonder if the leaderboard should start anew every day? ... or maybe an all time leaderboard, and a daily leaderboard? ... do the weather conditions change every day?")
- Answer first: both already existed. Five conditions rotate by UTC day (golden hour, rain, fog, dusk, rain at dusk) and "Today's lap" had its own board, but it was off by default behind a small link, so nobody would find it.
- Now pressing START drives today's lap. Under the title: "TODAY: RAIN AT DUSK · new conditions in 15 h 23 m", refreshed every minute.
- The start screen shows two boards side by side: TODAY (starts empty each midnight UTC) and ALL TIME, DRY. The one you are about to drive on is bright, the other dimmed.
- The dry lap is now "Practice in the dry" in the quiet row. It is the only thing that feeds the all-time board, so that record is always set in the same conditions.
- A challenge link still opens in the dry, because a challenge lap carries no weather.
- Checked live: today's board was empty ("Nobody yet today. Be first."), the all-time board showed James's five laps. Not checked: a lap posted to today's board from the new default.

### v72: three small clarity fixes (James)
- "rain at dusk is a little confusing - in my brain im thinking its going to start raining later": the condition is now called RAINY DUSK and the line reads "TODAY'S LAP: RAINY DUSK", so it describes the lap rather than sounding like a forecast.
- "some subtle user feedback when they first see the ghost car, so they know what it is": for the first three laps with a ghost, a small label rides above it for the opening nine seconds: "YOUR BEST LAP: BEAT IT" (or the challenger's name). Its position is bent the same way the tape filter bends the picture, so it stays over the car.
- "telling folks to hold brake to reverse if they ever get stuck": after about two seconds going nowhere, the screen says "STUCK? HOLD THE PHONE SCREEN TO REVERSE" (or "CLENCH BOTH FISTS", or "HOLD SPACE", whichever you are using). Found while doing it: in Beginner the car ignored the brake entirely, so a Beginner nose-first in a barrier could not get out at all. Now, when nearly stopped, holding the brake reverses in Beginner too.
- Checked in the preview with a made-up ghost: label appeared over the ghost at 1.5 s; car stopped against a barrier showed the hint; holding Space in Beginner backed it out at 4 m/s.

### v73: standing water in the rain (James: "when it really rains is there any way to have beautiful reflective puddles in certain sections of the track - see the bike app for how we've done it there")
- Looked at the cycling game first. Its wet lanes get their puddles from a roughness map: mostly damp, with glassy patches in the ruts and at the edges that mirror the surroundings. Golden Lap's road has no such material (it is flat-lit, with a hand-written wet layer), so the idea was ported rather than the code.
- In RAIN and RAINY DUSK, about a third of the lap now holds water, in stretches chosen by a slow noise pattern over the map, so the same places are wet for everyone, every time. Within a stretch, pools a few metres across form, each with a darker soaked margin.
- A pool is a mirror: looking down into the near ones you see bright sky; looking along at the far ones you see a dark, jagged treeline; rain rings wobble the reflection. The treeline is invented from the viewing direction, not a true reflection of the scenery.
- Picture only. Pools do not change grip.
- Judged in still frames from the preview, with pools forced on everywhere to see them. Through the tape filter and the speed blur they read as glassy patches rather than crisp puddles. Not judged in motion.

### v74: wet road rebuilt the cycling game's way (James, with a screenshot of the cycling game in rain: "those puddles arent very good tbh - did you check out the hyper realistic cycling game for details on how we did them there?")
- I had looked at it, but copied the wrong idea (pools). What actually makes that road look wet: a finely grained tarmac surface whose tiny tilts, plus the rain rings, bounce the sky back at you. The wet look is reflection, not paint.
- Ported that: a tileable "grain" slope map made in code, a reflection worked out per pixel (Fresnel: dark looking down, mirror-bright looking along), a soft sheen everywhere, and a mirror that stays blurred on damp tarmac and sharp where water stands. Standing water is now a calmer, smaller part of it.
- The limit, found while testing: Golden Lap draws the world at 600 lines and then blurs it for the tape look. A real-size rain ring a few metres ahead is under half a pixel, so the crisp rings in the cycling game cannot show here. Added fatter rings near the car to try; in the narrow preview I could not see them. The road reads as dark, glossy wet tarmac reflecting the sky, which is the main gain.
- Possible next step, not done: draw the road sharper than the rest in the rain. That trades away some of the tape look.

### v76: real reflections, and a message when you pass the ghost (James: "honestly they dont look like puddles, there's no reflection at all?" and "when users overtake the ghost car, give them a little feedback")
- He was right again: the puddles only ever showed a flat sky colour, so nothing could look like a reflection. Now, whenever it is properly raining, the world is drawn a second time from a camera mirrored under the road (half resolution, road hidden, everything below the road clipped away), and the road shader looks up each pixel's reflection in that picture: sharp in standing water, smeared on damp tarmac, wobbled by the grain and the rain rings.
- Result (`puddles-v76.jpg`): the yellow bridge in the swoop shows upside down in the wet road beneath it, the trees reflect dark green in the damp tarmac with sky-bright puddles between, the harbour buildings show faintly in the water.
- Cost: the world is drawn twice in the rain. The headless test showed the same frame rate wet and dry, but that test is probably not limited by the graphics card, so a slower laptop may drop frames in the rain. Hills: the mirror is the road height under the car, so reflections on stretches higher or lower than you are slightly misplaced.
- Ghost: the moment you get ahead of it after the first four seconds, a green "AHEAD OF YOUR BEST" (or "AHEAD OF <name>" on a challenge) flashes up. If you drop behind and pass it again, it says so again, at most every eight seconds. Tested with a slow fake ghost: it fired at 6.2 s with the gap at -0.28.
- Old version kept as `index-v75-before-real-reflections.html`.

### v78: half as many puddles (James: "still too many puddles")
- Measured this time instead of eyeballing: across the road surface (outside the tunnel), puddles covered 14.2% in v77 and now cover 6.8%. Fewer stretches hold water at all, and in those only the deepest dips do. `puddles-v78.jpg` is the three wettest spots on the lap: a few puddles each; the rest of the lap is damp tarmac with blurred reflections.
- `video/puddle-shots.mjs` now prints the coverage figure, so further tuning can be done by number.

### v79: it keeps raining outside while you're in the tunnel (James: "much better" on the puddles; "when its raining and im in the tunnel it looks like its not raining until i actually leave the tunnel, which is a bit weird")
- Cause: entering the tunnel turned the whole rain effect off, so through the exit the world outside looked dry until you left.
- Now the rain stays on. The wet road, its reflections and the rain streaks carry on outside; the tunnel stays dry because the streak shader simply skips any drop that falls between the tunnel's two mouths (each mouth is a line across the track, facing along it). The tunnel road was always a separate, dry surface. Lens drops and the rain hiss still fade in the tunnel, as before.
- Checked with frames approaching the exit: dry inside, wet tarmac beyond the mouth. The exit glare makes the falling rain itself hard to see in stills, and streaks are only drawn within about 15 m of the car, so they appear as you reach the mouth.

## Trailer re-shot in the new rain (27 Nov)
- James: "update the trailer with new rain". Re-recorded the two rain shots (the swoop where the weather turns, and the wet lap) on the current game, so the trailer now shows the shiny wet road with real reflections and the puddles.
- The recorder had stopped working after the new start screen hid START until you choose a controller; it now picks keyboard first.
- Re-rendered all three: golden-lap-trailer.mp4, golden-lap-trailer-rain.mp4, golden-lap-trailer-smudge.mp4.

## Weather forecast on the start screen (v80, 27 Nov)
- James: "how we do something like this on the start screen? might be nice to show the actual date and the forecast?" (a screenshot of a TV-style 7-day forecast).
- A forecast strip under the title: Today in a yellow box, then the next six days with the date ("Sat 28th"), a small drawn weather picture and the conditions. In practice mode Today is greyed out.
- The game can do this because the weather is worked out from the date, the same for everyone. But it went round five conditions in a fixed loop, which a forecast would give away (rain every fifth day). From 28 Nov each day steps on by a hashed 1–4 places instead: never the same two days running, all five equally common over a year. Today (Rainy dusk) is unchanged, so today's board stays fair.

## Forecast says the weather only (v81, 27 Nov)
- James: "we dont need to say dusk - just the weather", "golden should say sunny". Forecast labels now read Sunny, Rain, Fog, Clear (dusk), Rain (rainy dusk), and the line under it says TODAY'S LAP: RAIN.

## "Coming soon" trailer with a Brazilian voice (27 Nov)
- James: a version that says COMING SOON instead of the address, with a breathless young Brazilian man over the end card.
- Line (Portuguese): "Uma volta... Só uma. Perfeita. Você consegue?" — "One lap. Just one. Perfect. Can you?" Three ElevenLabs v3 takes (Davi Andrei, Gustavo Barros, Matheus Moretti); Gustavo's, slightly hoarse and ending as a real question, is used. The end card holds 2 s longer (25.2 s) to let him finish.
- Built with SOON=1 python3 build_trailer.py → golden-lap-trailer-soon.mp4.
- James: "he sounds a bit weird, maybe we need some crowd noise ... like he's in the middle of a crowd, F1 vibe". New take of the same line without the whisper (excited, breathless, 5.8 s), placed over an ElevenLabs-generated grandstand crowd (cheering, air horns, a car going past), which fades in with the end card and dips slightly whenever he speaks. Mixed to video/trailer/assets/vo-crowd.wav.
- James: "the crowd needs to be louder - and we need real emphasis on the final word", then "we're using the wrong clip - we need the one where it starts raining as we climb up Spa".
  - The first crowd sound faded out by itself after 4 s, so it had gone by the end of his line. Now a steady generated crowd bed under the whole card, only a few dB under him, plus a big roar that swells right after the last word.
  - New takes with the last word shouted ("Você... CONSEGUE?!"); picked the one where "consegue" is loudest against the rest (+4.4 dB) and lifted that word another 4 dB. Card is 27.5 s long.
  - Opening now the rain version (weather turns on the climb at Spa): RAIN=1 SOON=1 python3 build_trailer.py.
- James: "add english subtitles - and make it a little bit louder". Italic subtitles at the foot of the end card, timed to his words: "One lap..." / "Just one." / "Perfect." / "Can you DO IT?", with DO IT? popping in yellow on the shouted "consegue". Voice and crowd up about 2 dB.
- James: "add a subtle 'real gameplay' or smth near the start". A small REAL GAMEPLAY tag, with a red recording dot, top centre over the first 4 seconds of the Spa swoop, fading in and out. It's in the builder, so every trailer version gets it.
- James: "remove the real gameplay - kinda distracting" (gone), and "the voice at the end sounds a little janky - can we put it into one clip so it sounds like one sentence". The old take had a 2-second gap in the middle. Five new takes with the line written as one run ("Uma volta, só uma, perfeita... você CONSEGUE?!"); picked f3: 3.7 s, no gap over a quarter of a second, still a question, last word on top (+2.2 dB, then lifted 4 dB more). Card back down to 25.1 s; subtitles retimed to the new words.

## Earlier days' leaderboards (v82, 27 Nov)
- James: "we're gonna need a subtle way to show previous leaderboards".
- The server already kept each day's laps apart but only served today's. /api/board?day=N now serves any of the last 60 days (read only; you can't post to a past day).
- On the start screen the TODAY heading has faint ‹ › arrows. ‹ steps back a day: the heading becomes e.g. "THU 26TH · CLEAR" with that day's times, slightly dimmed; › steps forward and back to TODAY. Days before the daily boards began say "No laps that day."

## Front suspension meets the nose (v83, 27 Nov)
- James sent two close-ups: "looks like we got a little issue with the front nose cone and the right suspension?"
- The nose is a tapered cone, and the inner ends of the wishbones and pushrods were placed for a fatter nose, so they sat a few centimetres off it: the upper arms and pushrod hovered above it and the front lower arm hung below. Same on both sides; from the driver's seat it showed most on the right. Moved every inner mount just inside the nose surface. Before/after: video/raw/nose-cmp.png.
- James: "can you update the trailer as well". Re-recorded all six laps the trailers use (with the fixed arms) and re-rendered all four: dry, rain, smudge and coming-soon.
- James asked whether the nose should sit further right. It is centred; the camera sits 30 cm left of the centre line, beside the helmet, so the near steering wheel appears further right than the far nose. Left as it is.

## v84 · GO AGAIN on the phone (27 Nov)
James plays on a projector with the laptop across the room, so after a lap he had to walk over to press Enter. Now the phone wheel does it.
- Twice a second the game tells the phone whether the lap is over, under way or neither.
- Lap over: a big orange **GO AGAIN** on the phone. It posts the time under your saved name (as Enter does) and puts you back on the grid.
- Mid-lap: a small "Restart the lap" link, the same as R.
- The link between phone and computer drops lost messages rather than resend them, so the phone sends the request three times; the game acts on each one once.
- The finish panel says "Enter, or GO AGAIN on your phone" when a phone is connected.
- Tested with a game page and a phone page paired in headless Chrome.

## v85 · Start from the phone; forecast and board after the lap (27 Nov)
Playing on the projector, James still had to walk to the laptop for the first START.
- The phone's TAP TO START now also presses START on the computer. Step 3 on the start screen reads "Tap START on your phone".
- If the phone is already going when you come back to the start screen, it shows a big START.
- Browsers can hold sound back until someone clicks the page. If that happens after a phone start, the screen says CLICK OR PRESS ANY KEY FOR SOUND.
- The finish panel now shows the week's forecast and today's line ("TODAY'S LAP: RAIN · new weather in…") at the top, and the board has a caption ("TODAY'S BOARD · RAIN" or "ALL TIME · DRY").

## The film's angle (27 Nov)
James: "when we make the youtube video - i'd like to lean into the idea - can i build a world class F1 game in just 1 day". He shared a reference thumbnail for the style: "129 hours to design a menu" (The Ridiculous Engineering Of Boring Software, Enrico Tartarotti with the Linear team). It has a huge red headline, the thing held to camera, and red marker scribbles. Noted at the top of this log too.

## Spacefast banner: mockup (27 Nov, not live yet)
James asked for spacefast.com as the advertiser on the first banner across the track after the Spa section. That is the blue footbridge on THE CLIMB, the Kemmel-style straight after Eau Rouge. The yellow bridge comes before it.
- Mocked up in `index-mock.html` only. Two versions: (a) the bridge's own blue with white heavy italic SPACEFAST.COM and yellow pinstripes, like a period sponsor board; (b) cream with black lower-case spacefast.com and red pinstripes.
- The ad panel is 2.4 m tall instead of 1.5 m so the lettering reads at speed.
- Box faces put the lettering on backwards. It took three tries to find the right flip: first mirrored, then upside down, then right. A good small "not quite" moment.

## v86 · The front wheels stay on the road at Eau Rouge (28 Nov)
James: "on eu rouge the front left tyre kinda looks like its floating in mid air". There were two causes.
- **The car trailed the road.** Its height was smoothed, and at 280 km/h on Raidillon that left it up to 20 cm behind the road: sunk in on the climb, hanging above it over the crest. The tyre's dark contact shadow sits under the car, so on the climb it was buried under the tarmac, and the tyre had nothing under it. Now the car follows the hill as it comes, and only the small leftover is smoothed.
- **The car is one rigid block.** It tips and leans as a whole, so over a twisting crest, or leaning hard in a fast corner, the road under a front wheel falls away from it. Each front wheel now finds the road under itself and moves up or down to meet it, up to 9 cm up and 11 cm down. All six suspension pieces on each side and the contact shadow move with it. Through the swoop the wheels now move about ±4 cm, which is believable suspension. With the old code they would have needed the full 9 cm.

## Trailers re-shot with v86 (28 Nov)
All six laps were re-recorded from the live game, so the front wheels stay planted through Eau Rouge. Then the dry, rain, coming-soon and smudge trailers were rendered again. The live game has no Spacefast banner yet, so neither do these trailers: the bridge on the climb is still plain blue. The banner version, `golden-lap-trailer-soon-spacefast.mp4`, is the old take, from before the fix.

## Film section: why this camera angle looks so fast (28 Nov)
James sent two shots from the preview lap, THE TUNNEL and INTO THE CITY, and asked: "is there any science behind why this angle is so good - is it using the golden ratio or anything like that? and why is it so great and showing speed". Then: "please log this for the youtube video - it should defo be a section".

**The honest answer first: no golden ratio.** The whole camera is five numbers, tuned by eye until it looked like the footage from the very first message (`CAM` in index.html):
`pos: 0.30 m left of centre, 0.95 m up, 0.20 m back · looks 7° right, 9° down · tilted 3° · field of view 92°`

**The happy accident, worth a graphic:**
- Tipping the camera 9° down puts the horizon about 40% of the way down the screen, in the thirds/golden-section band.
- In the tunnel shot the vanishing point sits about 64% across, near 0.618. That is mostly the tunnel bending right; on a straight it sits near the middle.
- So nobody designed it with the golden ratio. Tuning by eye wandered into the same zone painters use. That makes a good on-screen reveal: draw the golden spiral over the frame, and it nearly fits.

**Why it reads as speed (one point per beat):**
1. **The eye is low.** At 0.95 m the camera is lower than your eyes in an ordinary car, nearly at helmet height in a single-seater. How fast the road seems to stream past depends on speed divided by eye height. So the same 180 km/h looks faster here than from a road car, and much faster than from a TV camera on a pole.
2. **The lens is very wide.** 92° is the vertical field of view, about 120° across a 16:9 screen, roughly GoPro wide. Wide lenses stretch the edges, so walls, barriers and tunnel lights speed up and smear as they reach the sides. Peripheral vision is what judges speed, and this angle fills it with movement.
3. **Fixed things up close.** The tyre, suspension arms, mirror and helmet never move in frame, while everything behind them rushes past. The brain reads speed from that contrast. It ties in with the v86 fix: the floating tyre bothered James because the tyre is the thing that ties the car to the road.
4. **Repeating patterns.** Tunnel lights, kerb stripes and armco posts pass at a steady beat, and how often they flick by tells you your speed. The tunnel works so well because its lights do that and also all point into the vanishing point.
5. **Off-centre and tilted.** Sitting behind and to the left of the helmet, slightly tilted, frames the shot like a camera mounted on the car rather than a player's eyes. The 3° tilt is a mild Dutch angle, which adds unease and energy.
6. **Effects that grow with speed.** The blur streaks outward from the vanishing point: gentle at town speeds, heavy near top speed (`blur = 0.03·s + 0.3·s^2.2`). Add shake from the road surface and kerbs, plus the tape smear and ghosting. All of them grow with speed, so you feel it before you read the number on screen.

**The line to land it:** it wasn't designed with a formula. It copies the low, wide, off-centre spot where 90s teams bolted their onboard cameras, which is the one place on a car where speed looks its most frightening.

**Shots to get for this section:**
- The same stretch with the camera at 0.95 m and at 1.7 m (head height).
- FOV 92 against FOV 60 (road and walls suddenly look slow).
- The golden-section overlay on the tunnel frame.
- Blur on and off at 280 km/h.
- The tyre-and-helmet frame held still while the world streams past.
`G.CAM` is live in the page, so all of these can be captured with the recorder.

### Camera section: shots recorded (28 Nov)
Everything is in `video/raw/camera/`. Each pair is the same stretch at the same speed on autopilot, with one setting changed.
- `cmp-height.mp4`: eye at 0.95 m vs 1.70 m. At head height the helmet drops out of frame and the road stops rushing; it turns into a TV camera.
- `cmp-lens.mp4`: 92° vs 60°, in the tunnel. At 60° the walls and lights slow down, and the tyre and mirror fill the frame.
- `cmp-blur.mp4`: blur on vs off on the run down to the swoop. The difference shows best in motion, not in a still.
- Single full-frame clips of each (`h095`, `h170`, `fov92`, `fov60`, `blur-on`, `blur-off`), plus `locked.mp4`, the normal view, for the "frame held still while the world streams past" beat.
- `golden-clean.png`, `golden-lines.png`, `golden-overlay.png`: the tunnel frame clean, with golden-section lines, and with lines plus a golden spiral. **The finding for the reveal:** the horizon sits right on the upper golden line, and the tunnel's vanishing point lands almost exactly on the top-right golden intersection. The spiral is a looser fit, with its eye up in the wall rather than on the vanishing point, so lead with the lines.
Recorded from a temporary copy of the game that exposed the blur setting, then deleted. The live game is unchanged.

## Spacefast banner: dropped (28 Nov)
James: "not sure about the banner idea - we cant really read it, so at this point im minded to remove it". It never went live. The mockup page (`index-mock.html`) and the recorder's mockup switch are gone, and so is the backup of the pre-banner clips (old takes, from before the Eau Rouge fix). The footbridge on the climb stays plain blue.

Kept as film material, as a small "idea that didn't make it" beat: the mockups in `video/raw/spacefast/`, and `golden-lap-trailer-soon-spacefast.mp4`, where the bridge goes by as a blur in about a second. That blur is the reason it was cut: at 280 km/h on tape, a sponsor board can't be read.

## The film's storyboard (28 Nov)
James: "could you do a storyboard of the youtube film we are going to make", with these notes: the hook is the trailer; "the concept is - can i build a pro f1 game in 1 day, thats the story"; like the Golden Hour film, "show inside the black box"; "the key decisions we made"; the title card is the Golden Hour one plus Claude and Spacefast; "hook, and a loop that we close later, and maybe we open another loop mid way through"; "the action is incredible, so we should really lean into that"; the golden-ratio question ("why is the video so watchable"); and the original YouTube Short in the film, with James on camera pointing at it.

Published as an artifact: https://claude.ai/artifact/TUc9omryf1dx8JgmhwJ8Te (source: `video/storyboard/`, built by `build.py` from `template.html` and `stills/`).
- **Shape:** 19 panels, about 7:24.
  - Hook: the trailer.
  - Loop 1, opened at 0:20 with a 24-hour clock on screen: can I build it in one day? It closes when the clock hits zero at Wed 17:05.
  - Loop 2, opened at the midpoint (Wed 06:02, hands): can I beat the computer's lap with my bare hands? It closes at 0:53.513.
  - A small loop 3, "then a stranger played it, and it broke", carries the black-box story into the days after, then the payoff and the link.
- **Six "inside the black box" sections:** the look, why it's so watchable (the camera science and golden lines), the circuit, the sound, the hands, and the literal black box.
- **Rules:** every explanation plays over full-speed driving, with no more than about 30 s between flat-out shots; the clock stays on screen; each decision gets a numbered marker.
- **Twelve key decisions**, with times, listed on the page.
- **Day one checks out against the log:** first frame 17:25 (20 min), online 17:39 (34 min), hands 06:08, 1:00.340 at 13:12, 0:53.513 after the corners were opened (v31, 13:49), challenge links 16:36. All inside 24 hours.

### Storyboard v2: the box of tricks (28 Nov)
James: "what about the stuff claude did that we have no idea how it did it - like recreating the world, building the tracks... the wire underneath (if this is really how claude did it). I think thats the gold".

All of it is really how it's built (read from index.html), and now filmed in `video/raw/tricks/`:
- `layers.mp4`: one continuous shot at speed. The whole world in wireframe, then flat colour, then the tape. Golden Hour's "underneath it looks like this", for real.
- `climb-wire.mp4`, `climb-tape.mp4`: from the cockpit straight up until the whole circuit lies below like a model.
- The numbers, counted from the running game:
  - 60 control points.
  - 4,035 m of road, chopped every 3 m into 1,345 slices.
  - 161 objects in the world.
  - 9,903 copies of a handful of shapes. Every tree is one lumpy ball wobbled by a sine wave, copied 3,301 times with a trunk and a bush each, and one in ten is tinted purple like the footage.
  - The forest behind is one flat dark-green wall, 62 m out and 15 m tall.
  - The city is one painted art deco window bay, repeated.
  - The car is 113 simple parts.
  - 23 textures, all painted in code; not one photograph, the tarmac included.
  - Puddles are a second camera, upside down under the road.
- Storyboard now 20 panels, about 8:02, with seven black-box sections. Box 01 is "Underneath, it's wire", box 03 is "Sixty dots make a circuit" (with the climb), and box 04 is new: "The box of tricks".
- Still to film for the tricks: the car taken apart, the single tree ball, one window tile, and the upside-down puddle camera.
- Recorded from a temporary copy of the game that exposed the scenes (since deleted). Gotcha for next time: in this version of Three.js, wireframe needs one material per object. A single shared one, or a scene-wide override, stops the renderer.

### Box of tricks filmed, and storyboard v3: the clock is the enemy (28 Nov)
**Filmed** (`video/raw/tricks/`), from a temporary copy of the game that exposed the scenes (since deleted):
- `car-apart.mp4`, `car-apart-wire.mp4`: the car flies apart into its 113 pieces and back together, solid on a grey stage, then in wire on black.
- `tree-ball.mp4`: the game's one tree shape, turning, wire then lit.
- `forest-grows.mp4`: the real forest filling in around the stopped car, from 1 copy to 3,301.
- `textures-sheet.png` (and `textures/`): all 21 textures, saved straight from the game. Every one is painted in code: grass, kerbs, armco, the tarmac, the art deco window, the pit building, the grandstand crowd (coloured confetti), the helmet stripes, the dials.
- `puddle-camera.mp4`, `puddle-compare.png`: what the second, upside-down camera under the road sees in the rain, beside the road it is reflected in.
- Gotchas: setting the fog to null stops the game's loop, so set its density to zero instead; a black car on a black stage disappears, hence the grey stage; once the countdown ends the car drives off, so pin it in place for staged shots.

**James's notes on the story:** "this isnt very interesting to folks i think - ...can I beat the computer's lap with my bare hands"; "i think we could lean into time jeopardy more"; "like the can i build in 1 day idea (even though we didnt). thats a good story - cuz we spent less than a day on the whole thing in actual time, but we present as one day to make it more interesting".

**Storyboard v3** (same link). The bet is gone. The 24-hour clock is the story, counting down the whole build as one day of work. A small caption at the end says plainly that it was 24 hours of work over a few evenings. The danger points:
- **12:00 left: "Halfway, and nobody can drive it".** Loop 2 opens: a racing game you can't drive is a screensaver. The ticking starts.
- **10:40: the hands gamble.** "If this didn't work, I'd just thrown away hours I didn't have."
- **08:20: "It drives".** Loop 2 closes and the ticking stops.
- **04:00: "Four hours left, and it breaks".** Loop 3 opens, and the black box closes it at 03:10.
- **02:00: "The last two hours".** The montage, with the clock spinning down.
- **00:00: the clock runs out.** Loop 1 closes.

20 panels, about 8:00.

### Storyboard v4: but, so, but, so (28 Nov)
James: "do we have the whole - i could race with my hands - so clever, but kinda unusable - i got my brother to beta test the idea, and it was kinda horrible to watch it fail. These feels like a good beat. We are kinda following the idea of story, of but the, but then this happened, but then this happened."

The second half is now a chain where each fix causes the next problem. The beat word is marked in red on each panel:
- **But** nobody can drive it (12:00 left; keyboard, 1:44).
- **So** I raced with my bare hands (10:40).
- **And** it drives: 1:00.340, "so clever, for about an hour" (08:20).
- **But** then it breaks: the steering dies (05:00).
- **So** Claude built a black box: a hand with no fingers (04:20).
- **But** then my brother tried it (03:00). His three notes were the first user test in the log: "too abrupt", "too sensitive", and "can I squeeze to brake?". So we built squeeze to brake, calmer steering and Beginner mode. Better, but still not usable by most people.
- **So** your phone is the wheel (01:40). Loop 2, "can anyone drive it?", closes here.
- **And** the last fifty minutes: rain, puddles, Eau Rouge, the banner cut.
- The clock runs out, then the payoff: "...and a brother willing to crash a lot."

22 panels, about 8:40. To shoot: the brother's test (or James telling it on camera), and the phone wheel being scanned and driven on the projector.

### Rough animatic (28 Nov)
James: "can you cut the rough animatic".

`golden-lap-animatic.mp4`, 6:52, built as a HyperFrames project (`video/animatic/`) by `video/build_animatic.py`, straight from the storyboard's panel data (`video/storyboard/panels.json`). Change the storyboard, run both builders, and the animatic follows.
- **Guide voice:** the Mac's Daniel reads each panel's draft line, so the timing is roughly real. A panel is as long as its line plus a breath, so the plan of about 8:40 tightened to 6:52. James's own takes replace these, as in the first cut.
- **On screen:** each panel's number, title and kind; the 24-hour clock, ticking down from one danger point to the next; the BUT / SO beat words slammed up; the voice lines as captions; red TO SHOOT slates over the four shots still to film (James with the Short, the steering dying, the brother's test, the phone wheel).
- **Footage:** everything that exists is cut in, including the trailer as the hook, wire to tape, the camera comparisons, the climb, and the box of tricks.
- **Sound:** footage drops under the voice and goes full volume where there is no voice. Loudness is normalised to -16 LUFS.
- Check: 0 errors. The remaining warnings are a few captions that follow the guide voice too quickly, which is fine for a rough cut.

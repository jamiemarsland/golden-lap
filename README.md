# Golden Lap

A one-lap racing game in a web page that looks like old Formula One onboard footage, steered with your bare hands through a webcam. Built over a weekend with Claude, without writing code by hand.

Play it: https://golden-lap.space.fast/

## What's here

- `index.html` — the whole game in one file. This is the source.
- `sounds/` — the engine loops.
- `build-space.py` — turns `index.html` into the published app in `golden-lap/`.
- `golden-lap/` — the published app (Spacefast): generated client, plus the leaderboard server in `server/index.ts`.
- `LOG.md` — the build log, written as the game was made.
- `next-steps.html` — a paper of ideas with mock-ups, most of them now built.
- `index-v*.html` — earlier versions kept for reference.
- `video/` — scripts that record footage from the game and build the film and the trailer. The footage, renders and voice recordings are not in the repository.

## Run it

Serve this folder with any static web server and open `index.html`. The camera needs `localhost` or https.

## Note on `golden-lap/`

That folder has its own local Git history from the publishing tool. Its files are committed here as ordinary files; add changes to them by path, not with `git add -A`.

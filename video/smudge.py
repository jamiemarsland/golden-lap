#!/usr/bin/env python3
"""Trial only: a smudge lands on the camera lens, sits for a moment, then the airflow drags it off the edge of the picture.
Faked over a finished trailer to judge the idea before building it into the game.
A smudge = that patch of the picture blurred and lifted, so it barely shows over dark road and glows where bright sky is behind it.
usage: python3 video/smudge.py in.mp4 out.mp4"""
import subprocess, sys, math
# when it lands (s), where (x, y in a 1920x1080 picture), which way the air takes it, how far (px), size (px), how long it sits, how long it takes to leave
EVENTS = [(1.3, 1000, 330, (-0.81, -0.58), 900, 60, 0.45, 0.9),
          (8.3, 1130, 340, (0.86, -0.5), 1000, 68, 0.4, 0.85),
          (13.9, 720, 400, (-0.9, -0.44), 950, 52, 0.45, 0.9)]
S = 4   # the mask is drawn at quarter size and scaled up: it is all soft blobs, and this is 16 times quicker
terms = []
for t0, x, y, (ux, uy), far, r, hold, dur in EVENTS:
    n = math.hypot(ux, uy); ux, uy = ux / n, uy / n
    u = f"clip((T-{t0 + hold})/{dur},0,1)"
    e = f"pow({u},2)"                                             # slow to start, then it goes
    cx, cy = f"({x / S}+{ux * far / S}*{e})", f"({y / S}+{uy * far / S}*{e})"
    along, across = f"({r / S}*(1+3.5*{e}))", f"({r / S}*(1-0.45*{e}))"   # it stretches into a streak as it speeds up
    a, b = f"((X-{cx})*{ux}+(Y-{cy})*{uy})", f"(-(X-{cx})*{uy}+(Y-{cy})*{ux})"
    amp = f"clip((T-{t0})/0.12,0,1)*(1-pow({u},3))"
    terms.append(f"{amp}*exp(-(pow({a}/{along},2)+pow({b}/{across},2))/2)")
expr = "255*min(1," + "+".join(terms) + ")"
fc = (f"color=black:s={1920 // S}x{1080 // S}:r=30:d=40,format=gray,geq=lum='{expr}',scale=1920:1080:flags=bicubic,format=gbrp[m];"
      "[0:v]format=gbrp,split=2[a][b];[b]gblur=sigma=24,eq=brightness=0.10:contrast=0.78,format=gbrp[bl];"
      "[a][bl][m]maskedmerge,format=yuv420p[v]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", sys.argv[1], "-filter_complex", fc, "-map", "[v]", "-map", "0:a", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-c:a", "copy", "-shortest", sys.argv[2]], check=True)

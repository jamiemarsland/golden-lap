#!/usr/bin/env python3
"""Guide voice for the animatic, from voiceover-script.md, using the Mac's built-in British voice. One take per scene.
Lines starting with ">" are directions and are not spoken. Writes vo/sN.mp3 and vo/scenes.json (durations and spoken text).
Replace these files with the real recording, keep scenes.json's durations true, and build_film.py re-times the whole film."""
import json, re, subprocess
md = open('voiceover-script.md').read()
out = {}
for n, body in re.findall(r'^## (\d+)\.[^\n]*\n\n(.*?)(?=\n## |\Z)', md, re.S | re.M):
    text = ' '.join(l.strip() for l in body.strip().split('\n') if l.strip() and not l.startswith('>'))
    subprocess.run(['say', '-v', 'Daniel', '-r', '168', '-o', f'vo/s{n}.aiff', text], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'vo/s{n}.aiff', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', '-b:a', '192k', f'vo/s{n}.mp3'], check=True)
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'vo/s{n}.mp3']).decode())
    out[n] = {'dur': round(d, 2), 'text': text}; print(n, len(text.split()), 'words', round(d, 2), 's')
json.dump(out, open('vo/scenes.json', 'w'), indent=1)
print('total', round(sum(v['dur'] for v in out.values()), 1), 's')

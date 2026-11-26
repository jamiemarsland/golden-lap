#!/usr/bin/env python3
"""Turn index.html (the single source of the game) into the files Spacefast wants in golden-lap/.
Run from this folder:  python3 build-space.py   then   cd golden-lap && sf publish --remote"""
import json, os, re
src = open('index.html').read()
css = re.search(r'<style>(.*?)</style>', src, re.S).group(1)
markup = re.search(r'<body>(.*?)<script src=', src, re.S).group(1)
js = re.search(r'<script>\n(.*)</script>\s*</body>', src, re.S).group(1).replace("'use strict';\n", '', 1)
os.makedirs('golden-lap/client', exist_ok=True); os.makedirs('golden-lap/pages', exist_ok=True)
open('golden-lap/client/markup.ts', 'w').write('export const CSS = %s;\nexport const MARKUP = %s;\n' % (json.dumps(css), json.dumps(markup)))
import base64
snd = {k: base64.b64encode(open('sounds/%s.mp3' % k, 'rb').read()).decode() for k in ('low', 'mid', 'midhigh', 'high', 'coast')}
open('golden-lap/client/sounds.ts', 'w').write('// Engine loops generated with ElevenLabs sound effects, embedded so the hosted game needs no extra files.\nexport const SOUNDS: Record<string, string> = %s;\n' % json.dumps(snd))
open('golden-lap/client/game.ts', 'w').write('// @ts-nocheck\n// Generated from ../index.html by build-space.py. Edit index.html, not this file.\nimport * as THREE from "three";\nimport qrcode from "qrcode-generator";\nimport { SOUNDS } from "./sounds";\n\nexport function boot() {\n(window as any).GL_SOUNDS = SOUNDS;\n' + js + '\n}\n')
open('golden-lap/pages/index.tsx', 'w').write('''"use client";

import { useEffect } from "preact/hooks";

import { boot } from "../client/game";
import { CSS, MARKUP } from "../client/markup";

export default function GoldenLap() {
  useEffect(() => {
    const w = window as any;
    if (w.__goldenLapBooted) return;
    w.__goldenLapBooted = true;
    document.title = "Golden Lap";
    boot();
  }, []);
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </div>
  );
}
''')
print('built golden-lap/ from index.html:', len(js), 'chars of game code')

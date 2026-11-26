"use client";

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

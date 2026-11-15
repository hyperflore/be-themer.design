import { memo, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import Topography from "./Topography";
import { LOW_SPEC } from "../lowEnd";

const QUALITY = LOW_SPEC
  ? { lineCount: 8, dpr: 0.5, maxFps: 12 }
  : { lineCount: 18, dpr: 1.5, maxFps: 31 };

const STOPS = ["#e11d48", "#8b5cf6", "#9aa0ac"];
const CYCLE = 36;
const hex = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const RGB = STOPS.map(hex);

function colourAt(t: number) {
  const pos = ((t % CYCLE) / CYCLE) * RGB.length;
  const i = Math.floor(pos), f = pos - i;
  const e = f * f * (3 - 2 * f);
  const a = RGB[i], b = RGB[(i + 1) % RGB.length];
  return "#" + a.map((v, k) => Math.round(v + (b[k] - v) * e).toString(16).padStart(2, "0")).join("");
}

export const Contours = memo(function Contours() {
  const reduce = useReducedMotion();
  const [color, setColor] = useState(STOPS[0]);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t0 = performance.now();
    const id = setInterval(() => setColor(colourAt((performance.now() - t0) / 1000)), 600);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    let a = 0, b = 0;
    a = requestAnimationFrame(() => { b = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); };
  }, []);

  return (
    <div aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1100px] transition-opacity duration-[1600ms] ease-out"
      style={{
        opacity: shown ? 0.6 : 0,
        maskImage: "linear-gradient(to bottom, #000 0%, #000 45%, transparent 92%), linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
        maskComposite: "intersect",
        WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 45%, transparent 92%), linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskComposite: "source-in",
      }}>
      <Topography color={color} elevation={1.1} speed={0.18} glow={0} depthOfField={0} fog={0.45} tilt={34} intro={false} {...QUALITY} />
    </div>
  );
});

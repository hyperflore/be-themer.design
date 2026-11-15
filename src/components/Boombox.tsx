import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Reveal } from "./ui";
import { useMusic } from "./Music";
import { Lyrics } from "./Lyrics";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;
    }
  }
}

export function Boombox() {
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, { once: true, margin: "200px" });
  const [ready, setReady] = useState(false);
  const music = useMusic();
  const [lyrics, setLyrics] = useState(false);
  const clickTimer = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (near) import("@google/model-viewer").then(() => setReady(true)).catch(() => {});
  }, [near]);

  const viewer = useRef<HTMLElement>(null);
  useEffect(() => {
    const mv = viewer.current as (HTMLElement & { model?: { materials: { name: string; pbrMetallicRoughness: { setBaseColorFactor(c: number[]): void; setRoughnessFactor(r: number): void } }[] } }) | null;
    if (!mv) return;
    const paint = () => {
      for (const m of mv.model?.materials ?? []) {
        if (m.name === "boombox") { m.pbrMetallicRoughness.setBaseColorFactor([0.62, 0.03, 0.07, 1]); m.pbrMetallicRoughness.setRoughnessFactor(0.45); }
      }
    };
    mv.addEventListener("load", paint);
    return () => mv.removeEventListener("load", paint);
  }, [ready]);

  const pulse = useMotionValue(1);
  const scale = useSpring(pulse, { stiffness: 500, damping: 20 });
  const onScreen = useInView(box, { margin: "100px" });
  const bass = useRef(music.bass);
  bass.current = music.bass;
  useEffect(() => {
    if (reduce || !music.playing || !onScreen) { pulse.set(1); return; }
    let raf = 0;
    const tick = () => { pulse.set(1 + bass.current() * 0.07); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, music.playing, onScreen, pulse]);

  const down = useRef({ x: 0, y: 0 });
  const onDown = (e: PointerEvent) => { down.current = { x: e.clientX, y: e.clientY }; };
  const onUp = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y) >= 6) return;
    if (clickTimer.current) { clearTimeout(clickTimer.current); clickTimer.current = 0; if (lyrics) setLyrics(false); else { setLyrics(true); music.start(); } return; }
    clickTimer.current = window.setTimeout(() => { clickTimer.current = 0; music.toggle(); }, 280);
  };

  return (
    <>
    <section className="mx-auto mt-36 grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-8">
      <Reveal>
        <h2 className="max-w-md text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[2.5rem]">Your music, right inside Discord.</h2>
        <p className="mt-4 max-w-md leading-relaxed text-muted">
          The Spotify widget sits above your user panel with search, lyrics, your library and device switching.
        </p>
      </Reveal>

      <Reveal>
        <div ref={box} onPointerDown={onDown} onPointerUp={onUp}
          className="relative mx-auto aspect-square w-full max-w-[620px] cursor-grab active:cursor-grabbing">
          {ready ? (
            <motion.div style={{ scale }} className="absolute inset-0">
              <model-viewer
                ref={viewer}
                src="/models/boombox/boombox.gltf"
                alt="A 3D boombox. Drag to turn it; click to play or pause music."
                camera-controls=""
                disable-zoom=""
                disable-pan=""
                auto-rotate={reduce ? undefined : ""}
                auto-rotate-delay="0"
                rotation-per-second="14deg"
                camera-orbit="-25deg 76deg auto"
                field-of-view="auto"
                bounds="tight"
                interaction-prompt="none"
                shadow-intensity="1.1"
                shadow-softness="0.8"
                exposure="1.05"
                environment-image="neutral"
                touch-action="pan-y"
                style={{ width: "100%", height: "100%", background: "transparent", "--poster-color": "transparent" } as React.CSSProperties}
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-faint">Loading 3D model…</div>
          )}
        </div>
      </Reveal>
    </section>
    <Lyrics open={lyrics} onClose={() => setLyrics(false)} />
    </>
  );
}

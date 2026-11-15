import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import clsx from "clsx";
import { DiscordWindow, MESSAGES_LATER, type Layer, type Look } from "./DiscordMock";
import { useMusic } from "./Music";

const LAYERS: { layer: Layer; title: string; text: string }[] = [
  { layer: "wallpaper", title: "Wallpaper", text: "Any image under everything, or a colour wash. Set its position, tint and strength." },
  { layer: "glass", title: "Glass", text: "Every panel turns translucent and blurs what's behind it. Opacity and blur are one slider." },
  { layer: "ui", title: "Discord's interface", text: "Channels, members and controls stay where Discord puts them. Be Themer patches the client you already have." },
  { layer: "widgets", title: "Widgets", text: "Spotify, YouTube, Twitch and Kick dock above your user panel and fold away to a single row." },
  { layer: "chat", title: "Your chat", text: "Messages, stickers and embeds are untouched. Only the look around them changes." },
];

const W = 1200, H = 750;

export function Exploded({ look, gradient, glass }: { look: Look; gradient: number; glass: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const music = useMusic();
  const near = useInView(ref, { once: true, margin: "600px" });
  const [k, setK] = useState(0.6);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 20, mass: 0.5 });
  const rotateX = useTransform(p, [0, 0.3], [0, 56]);
  const rotateZ = useTransform(p, [0, 0.3, 1], [0, -36, -28]);
  const scale = useTransform(p, [0, 0.3], [1, 0.8]);
  const spread = useTransform(p, [0.18, 0.62], [0, 1]);
  const [active, setActive] = useState(-1);
  useMotionValueEvent(p, "change", v => setActive(v < 0.16 ? -1 : Math.min(4, Math.floor(((v - 0.16) / 0.66) * 5))));

  return (
    <section ref={ref} aria-label="How a theme is built" className={clsx("relative mt-36", reduce ? "" : "h-[340vh]")}>
      <div className={clsx("top-0 flex h-screen min-h-[640px] items-center overflow-hidden", !reduce && "sticky")}>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 px-5 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10">
          <div className="relative z-10">
            <h2 className="text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[2.5rem]">Five layers. One window.</h2>
            <ol className="mt-8 hidden space-y-1 lg:block">
              {near && LAYERS.map((l, i) => (
                <li key={l.title} className={clsx("border-l-2 py-2 pl-4 transition-colors duration-300", active === i ? "border-fg" : "border-line")}>
                  <p className={clsx("text-[15px] font-medium transition-colors duration-300", active === i ? "text-fg" : "text-faint")}>
                    <span className="mr-2 font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>{l.title}
                  </p>
                  <motion.p initial={false} animate={{ height: active === i ? "auto" : 0, opacity: active === i ? 1 : 0 }} className="overflow-hidden text-sm leading-relaxed text-muted">
                    <span className="block pt-1">{l.text}</span>
                  </motion.p>
                </li>
              ))}
            </ol>
          </div>

          <div role="button" tabIndex={0} aria-label="Play Dracula" onClick={music.start}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); music.start(); } }}
            className="relative mt-32 grid cursor-pointer place-items-center rounded-xl outline-none [perspective:2400px] focus-visible:ring-2 focus-visible:ring-[#e11d48] sm:mt-24 lg:mt-0">
            <motion.div style={reduce ? { rotateX: 50, rotateZ: -30, scale: 0.8 } : { rotateX, rotateZ, scale }}
              className="relative w-[min(760px,82vw)] [transform-style:preserve-3d]">
              <div ref={stage} style={{ aspectRatio: `${W} / ${H}` }} />
              {LAYERS.map((l, i) => (
                <Plate key={l.layer} i={i} spread={spread} active={active === i} label={l.layer === "wallpaper" ? "Wallpaper" : l.layer === "glass" ? `Glass · ${glass}%` : l.title}>
                  <div style={{ width: W, height: H, transform: `scale(${k})`, transformOrigin: "0 0" }}>
                    <DiscordWindow look={look} gradient={gradient} glass={glass} messages={MESSAGES_LATER} still lite only={l.layer} wallpaper="/wallpapers/shards.jpg" />
                  </div>
                </Plate>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Plate({ i, spread, label, active, children }: { i: number; spread: MotionValue<number>; label: string; active: boolean; children: React.ReactNode }) {
  const z = useTransform(spread, v => v * i * 80);
  const edge = useTransform(spread, [0, 0.25], [0, 1]);
  return (
    <motion.div style={{ z }} className="absolute inset-0 [transform-style:preserve-3d]">
      <div className="absolute inset-0 overflow-hidden rounded-xl">{children}</div>
      <motion.div style={{ opacity: edge }} className={clsx("pointer-events-none absolute inset-0 rounded-xl transition-shadow duration-300",
        active ? "shadow-[0_0_0_2px_rgb(255_255_255/.75),0_30px_60px_-20px_rgb(0_0_0/.7)]" : "shadow-[0_0_0_1px_rgb(255_255_255/.14)]",
        i > 0 && "bg-[#0d0d12]/45 dark:bg-white/[.015]")} />
      <motion.div style={{ opacity: edge }} className="absolute top-1/2 -right-3 hidden translate-x-full items-center gap-2 whitespace-nowrap sm:flex">
        <span className="h-px w-8 bg-line-strong" />
        <span className={clsx("rounded-md border px-2 py-1 font-mono text-[13px] transition-colors", active ? "border-fg bg-fg text-bg" : "border-line-strong bg-panel text-muted")}>{label}</span>
      </motion.div>
    </motion.div>
  );
}

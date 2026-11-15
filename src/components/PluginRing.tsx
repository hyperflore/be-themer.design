import { useRef } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { PLUGINS, type Plugin } from "../data";
import { BRAND, Mark, TINT } from "./PluginMarks";

const PICK = [
  "Spotify Controls", "YouTube", "Twitch", "Kick", "Lazy", "Owlie", "Calculate", "Message Logger", "Fake Nitro", "Silent Typing",
  "No Track", "Meow", "Call Timer", "Voice Narrator", "Screen Effects", "Cursor Pet", "Sakura Petals", "Macmize", "Translate Selection", "Who Reacted",
];

export function PluginRing() {
  const list = PICK.map(n => PLUGINS.find(p => p.name === n)).filter((p): p is Plugin => !!p);
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const radius = Math.round(((220 + 20) * list.length) / (2 * Math.PI));

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end start"] });
  const angle = useMotionValue(0);
  const drag = useRef({ on: false, x: 0, offset: 0 });
  const onScreen = useInView(wrap);
  const auto = useRef(0);

  useAnimationFrame((_, dt) => {
    if (!onScreen) return;
    if (!reduce && !drag.current.on) auto.current += dt * 0.006;
    angle.set(auto.current + drag.current.offset + scrollYProgress.get() * -140);
  });

  const step = 360 / list.length;
  const lift = Math.round(radius * Math.sin((6 * Math.PI) / 180));
  const ringRotate = useTransform(angle, a => `translateY(${-lift}px) translateZ(${-radius}px) rotateX(-6deg) rotateY(${a}deg)`);

  return (
    <div ref={wrap} className="relative h-[340px] overflow-x-clip cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[340px]"
      onPointerDown={e => { drag.current.on = true; drag.current.x = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={e => { if (!drag.current.on) return; drag.current.offset += (e.clientX - drag.current.x) * 0.18; drag.current.x = e.clientX; }}
      onPointerUp={() => { drag.current.on = false; }} onPointerCancel={() => { drag.current.on = false; }}
      aria-hidden
    >
      <div className="absolute inset-0 [perspective:1800px] [mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)]">
        <div className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]">
          <motion.div style={{ transform: ringRotate }} className="[transform-style:preserve-3d]">
            {list.map((p, i) => <Card key={p.name} p={p} rot={i * step} radius={radius} angle={angle} />)}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Card({ p, rot, radius, angle }: { p: Plugin; rot: number; radius: number; angle: MotionValue<number> }) {
  const opacity = useTransform(angle, a => {
    const d = Math.abs(((((rot + a) % 360) + 540) % 360) - 180);
    return Math.max(0, Math.min(1, (110 - d) / 75));
  });
  const brand = BRAND[p.name];
  const c = brand ? `#${brand.icon.hex}` : TINT[p.category];
  return (
    <motion.div style={{ opacity, transform: `rotateY(${rot}deg) translateZ(${radius}px)` }}
      className="absolute -top-[95px] -left-[110px] h-[190px] w-[220px] [backface-visibility:hidden]">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border p-4"
        style={{ borderColor: `color-mix(in srgb, ${c} 28%, var(--line))`, background: `color-mix(in srgb, ${c} 7%, var(--panel))` }}>
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: c }} />
        <div className="flex items-start justify-between">
          <Mark p={p} size={38} />
          <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-faint">{p.category}</span>
        </div>
        <p className="mt-3 font-semibold tracking-tight">{p.name}</p>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-muted">{p.desc}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          {p.isNew ? <span className="rounded-full bg-pink/15 px-2 py-0.5 text-[10px] font-medium text-pink">New</span> : <span />}
          <span className="relative h-[18px] w-8 rounded-full transition-colors" style={{ background: p.on ? c : "var(--line-strong)" }}>
            <span className="absolute top-[2px] size-[14px] rounded-full bg-white shadow" style={{ left: p.on ? 16 : 2 }} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

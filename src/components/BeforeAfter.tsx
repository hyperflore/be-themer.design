import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "./ui";
import { useMusic } from "./Music";
import { KothaMembers } from "./KothaMembers";
import { DiscordWindow, KOTHA, LOOKS, MESSAGES_KOTHA, REDD, type Look } from "./DiscordMock";

const STOCK: Look = { name: "Stock", g1: "#313338", g2: "#313338", g3: "#313338", base: "49 51 56", accent: "#5865f2", text: "#dbdee1", sub: "#949ba4", roleA: "#dbdee1", roleB: "#dbdee1" };
const W = 1200, H = 750;

export function BeforeAfter() {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.8);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const reduce = useReducedMotion();
  const [hinted, setHinted] = useState(false);
  const near = useInView(box, { once: true, margin: "600px" });
  const music = useMusic();
  const start = useRef({ x: 0, moved: false });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const at = (x: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => { start.current = { x: e.clientX, moved: false }; setDragging(true); e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    if (!start.current.moved && Math.abs(e.clientX - start.current.x) < 5) return;
    start.current.moved = true;
    setHinted(true);
    at(e.clientX);
  };
  const onUp = () => { setDragging(false); if (!start.current.moved) music.toggle(); };
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") { e.preventDefault(); setPos(p => Math.max(0, p - step)); }
    if (e.key === "ArrowRight") { e.preventDefault(); setPos(p => Math.min(100, p + step)); }
  };

  const themed = LOOKS[0];
  const win = (look: Look, wallpaper?: string) => (
    <div style={{ width: W, height: H, transform: `scale(${k})`, transformOrigin: "0 0" }}>
      <DiscordWindow look={look} gradient={look === STOCK ? 0 : 60} glass={look === STOCK ? 0 : 60} wallpaper={wallpaper} server={KOTHA} messages={MESSAGES_KOTHA} voice={[REDD]} members={<KothaMembers />} />
    </div>
  );

  return (
    <section className="mx-auto mt-36 max-w-6xl px-5">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="max-w-xl text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[2.5rem]">Same Discord. Same messages. Different evening.</h2>
        <p className="max-w-xs text-sm leading-relaxed text-muted">Nothing moves but the look. Every channel, message and button stays where you know it.</p>
      </Reveal>

      <Reveal className="mt-10">
        <div ref={box} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => setDragging(false)}
          className="relative cursor-ew-resize touch-pan-y overflow-hidden rounded-2xl border border-line select-none" style={{ aspectRatio: `${W} / ${H}` }}>
          {near && <div className="absolute inset-0">{win(themed)}</div>}
          {near && <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{win(STOCK)}</div>}

          <div className="pointer-events-none absolute inset-y-0 w-px bg-white/80" style={{ left: `${pos}%` }}>
            <motion.div role="slider" tabIndex={0} aria-label="Compare stock Discord with Be Themer" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
              onKeyDown={onKey}
              animate={!hinted && !reduce ? { x: [0, -8, 8, 0] } : { x: 0 }}
              transition={!hinted && !reduce ? { duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" } : { duration: 0.2 }}
              className="pointer-events-auto absolute top-1/2 left-1/2 -ml-5 -mt-5 grid size-10 place-items-center rounded-full border border-white/30 bg-[#111114] text-white shadow-[0_6px_20px_rgb(0_0_0/.5)] outline-none focus-visible:ring-2 focus-visible:ring-white">
              <span className="flex"><ChevronLeft className="-mr-1 size-4" /><ChevronRight className="-ml-1 size-4" /></span>
            </motion.div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

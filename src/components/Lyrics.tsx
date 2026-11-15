import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import clsx from "clsx";
import { useMusic } from "./Music";
import { SONG } from "./DiscordMock";

const SRC = "/music/dracula-lyrics.json";
type Word = { word: string; start: number; end: number; line_index: number };
type Line = { text: string; start: number; end: number };

function toLines(words: Word[]): Line[] {
  const by = new Map<number, Word[]>();
  for (const w of words) by.set(w.line_index, [...(by.get(w.line_index) ?? []), w]);
  return [...by.keys()].sort((a, b) => a - b).map(k => {
    const ws = by.get(k)!.sort((a, b) => a.start - b.start);
    return { text: ws.map(w => w.word).join(" ").replace(/\s+([,.!?'])/g, "$1"), start: ws[0].start, end: ws[ws.length - 1].end };
  });
}

export function Lyrics({ open, onClose }: { open: boolean; onClose: () => void }) {
  const music = useMusic();
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<Line[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(-1);
  const scroller = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    if (failed) { onClose(); return; }
    if (lines) return;
    fetch(SRC).then(r => (r.ok ? r.json() : Promise.reject())).then((w: Word[]) => setLines(toLines(w))).catch(() => { setFailed(true); onClose(); });
  }, [open, lines, failed, onClose]);

  const clock = useRef(music.time);
  clock.current = music.time;
  useEffect(() => {
    if (!open || !lines) return;
    const id = setInterval(() => {
      const t = clock.current();
      let i = -1;
      for (let n = 0; n < lines.length; n++) { if (lines[n].start <= t + 0.15) i = n; else break; }
      setActive(a => (a === i ? a : i));
    }, 100);
    return () => clearInterval(id);
  }, [open, lines]);

  useEffect(() => {
    const el = items.current[active], box = scroller.current;
    if (!el || !box) return;
    box.scrollTo({ top: el.offsetTop - box.clientHeight / 3, behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="sheet" className="mx-auto max-w-[92rem] overflow-hidden px-3 [perspective:1600px] sm:px-6"
          initial={{ height: 0 }} animate={{ height: "auto", transition: { duration: 0.7, ease: EASE } }}
          exit={{ height: 0, transition: { duration: 0.55, ease: EASE, delay: 0.1 } }}>
          <motion.section aria-label="Lyrics" onDoubleClick={onClose} title="Double-click to close"
            style={{ transformOrigin: "50% 0%", willChange: "transform" }}
            initial={reduce ? { opacity: 0 } : { rotateX: -14, y: -12 }}
            animate={reduce ? { opacity: 1 } : { rotateX: 0, y: 0, transition: { duration: 0.8, ease: EASE } }}
            exit={reduce ? { opacity: 0 } : { rotateX: -14, y: -12, opacity: 0, transition: { duration: 0.6, ease: EASE, opacity: { duration: 0.45, ease: "easeOut" } } }}
            className="relative mt-12 mb-10 select-none">
            <span aria-hidden className="absolute inset-x-6 top-6 bottom-4 rounded-[40px] bg-black/50 blur-2xl" />

            <div className="paper relative overflow-hidden pt-10 pb-12" style={{ clipPath: TORN }}>

              <header className="relative flex items-center gap-4 pr-6 pl-[88px] sm:pr-12 sm:pl-[112px]">
                <img src={SONG.cover} alt="" className="size-14 rotate-[-3deg] object-cover shadow-[0_3px_8px_rgb(0_0_0/.35)] ring-4 ring-[#f1dcd6]" />
                <div className="min-w-0 font-[Special_Elite] text-[#fbe9e4]">
                  <p className="truncate text-xl">{SONG.title}</p>
                  <p className="truncate text-sm text-[#fbe9e4]/65">{SONG.artist}</p>
                </div>
                <button type="button" onClick={onClose} onDoubleClick={e => e.stopPropagation()} aria-label="Close lyrics"
                  className="ml-auto grid size-10 place-items-center rounded-full border border-[#fbe9e4]/30 text-[#fbe9e4]/80 transition-colors hover:bg-black/15 hover:text-[#fbe9e4]"><X className="size-5" /></button>
              </header>

              <div ref={scroller} data-lenis-prevent className="relative mt-6 h-[min(64vh,600px)] overflow-y-auto overscroll-contain pr-6 pb-[30vh] pl-[88px] font-[Special_Elite] [scrollbar-width:none] sm:pr-12 sm:pl-[112px]">
                <div className="rules relative">
                  {!lines && !failed && <p className="text-2xl leading-[48px] text-[#fbe9e4]/50">Loading…</p>}
                  {lines?.map((l, i) => (
                    <button key={i} ref={el => { items.current[i] = el; }} type="button" onClick={() => music.seek(l.start)}
                      className={clsx("block w-full text-left text-[clamp(1.25rem,2.4vw,1.9rem)] leading-[48px] transition-colors duration-300",
                        i === active ? "text-[#fff7f4]" : i < active ? "text-[#f3c9c0] hover:text-[#fff7f4]" : "text-[#fbe9e4]/35 hover:text-[#fbe9e4]/60")}>
                      <span className={clsx(i === active && "underline decoration-[#ffd2c7] decoration-2 underline-offset-[10px]")}>{l.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const EASE = [0.65, 0, 0.35, 1] as const;

const TORN = (() => {
  const top: string[] = [], bottom: string[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let x = 0; x <= 100; x += 1.25) top.push(`${x}% ${(rnd() * 9).toFixed(1)}px`);
  for (let x = 100; x >= 0; x -= 1.25) bottom.push(`${x}% calc(100% - ${(rnd() * 10).toFixed(1)}px)`);
  return `polygon(${[...top, ...bottom].join(", ")})`;
})();

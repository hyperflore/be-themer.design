import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import clsx from "clsx";
import { Reveal } from "../components/ui";
import { SONG } from "../components/DiscordMock";
import { BLURB, Mark, TINT } from "../components/PluginMarks";
import { CATEGORIES, PLUGINS, REPO, type Category, type Plugin } from "../data";

type Filter = Category | "All";

export function Plugins() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Filter>("All");
  const [onOnly, setOnOnly] = useState(false);
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.tagName === "INPUT";
      if (e.key === "/" && !typing) { e.preventDefault(); search.current?.focus(); }
      if (e.key === "Escape" && document.activeElement === search.current) { setQ(""); search.current?.blur(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return PLUGINS.filter(p => (cat === "All" || p.category === cat) && (!onOnly || p.on) && (!n || `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(n)));
  }, [q, cat, onOnly]);
  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map(c => [c, c === "All" ? PLUGINS.length : PLUGINS.filter(p => p.category === c).length])), []);
  const grouped = !q && !onOnly;
  const groups = CATEGORIES.filter((c): c is Category => c !== "All" && (cat === "All" || c === cat));

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 sm:pt-24">
        <Reveal now className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="text-[clamp(2.75rem,6.5vw,5.25rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
              {PLUGINS.length} plugins.<br /><span className="hand text-faint">All optional.</span>
            </h1>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-muted">
              Players, privacy, voice and small fixes. Switch any of them on under Be Themer → Plugins in Discord's settings.
            </p>
          </div>
          <dl className="grid grid-cols-3 divide-x divide-line border-y border-line">
            {[[PLUGINS.length, "Built in"], [PLUGINS.filter(p => p.isNew).length, "New in 2.2"], [PLUGINS.filter(p => p.on).length, "On by default"]].map(([n, l]) => (
              <div key={l as string} className="px-4 py-5 first:pl-0">
                <dd className="text-3xl font-semibold tracking-tight tabular-nums">{n}</dd>
                <dt className="mt-1 text-xs text-faint">{l}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <Featured />

      <div className="sticky top-16 z-30 mt-24 border-y border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center">
          <label className="relative lg:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" />
            <input ref={search} value={q} onChange={e => setQ(e.target.value)} placeholder="Search plugins" aria-label="Search plugins"
              className="h-10 w-full rounded-xl border border-line bg-panel pr-10 pl-10 text-sm outline-none placeholder:text-faint focus:border-line-strong" />
            {q ? (
              <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-faint hover:text-fg"><X className="size-4" /></button>
            ) : (
              <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md border border-line px-1.5 font-mono text-[11px] text-faint">/</kbd>
            )}
          </label>
          <div role="tablist" aria-label="Category" className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
            {CATEGORIES.map(c => (
              <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
                className={clsx("relative flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm transition-colors", cat === c ? "text-fg" : "text-muted hover:text-fg")}>
                {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-lg border border-line-strong bg-panel-2" transition={{ type: "spring", bounce: 0.15, duration: 0.45 }} />}
                {c !== "All" && <span className="relative size-1.5 rounded-full" style={{ background: TINT[c as Category] }} />}
                <span className="relative">{c}</span>
                <span className="relative font-mono text-[11px] text-faint tabular-nums">{counts[c]}</span>
              </button>
            ))}
          </div>
          <button type="button" role="switch" aria-checked={onOnly} onClick={() => setOnOnly(v => !v)}
            className="flex shrink-0 items-center gap-2.5 text-sm text-muted hover:text-fg lg:ml-auto">
            <span className={clsx("relative h-5 w-9 rounded-full transition-colors", onOnly ? "bg-[#23a55a]" : "bg-line-strong")}>
              <motion.span className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow" animate={{ x: onOnly ? 16 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            </span>
            On by default
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 pt-12">
        {grouped ? (
          <div className="space-y-20">
            {groups.map(c => (
              <div key={c} className="grid gap-x-12 gap-y-6 lg:grid-cols-[14rem_1fr]">
                <div className="lg:sticky lg:top-40 lg:self-start">
                  <h2 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight"><span className="size-2.5 rounded-full" style={{ background: TINT[c] }} />{c}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{BLURB[c]}</p>
                  <p className="mt-3 font-mono text-xs text-faint">{String(counts[c]).padStart(2, "0")} plugins</p>
                </div>
                <Rows items={PLUGINS.filter(p => p.category === c)} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted" aria-live="polite">{list.length} {list.length === 1 ? "plugin" : "plugins"}{q && <> for “{q}”</>}</p>
            <div className="mt-4"><Rows items={list} /></div>
            {!list.length && (
              <div className="mt-6 grid place-items-center rounded-3xl border border-dashed border-line py-20 text-center">
                <p className="text-lg font-medium">Nothing matches.</p>
                <button type="button" onClick={() => { setQ(""); setCat("All"); setOnOnly(false); }} className="mt-3 text-sm text-muted underline underline-offset-4 hover:text-fg">Clear filters</button>
              </div>
            )}
          </>
        )}
      </section>

      <Contributors />
    </>
  );
}

function Rows({ items }: { items: Plugin[] }) {
  return (
    <motion.ul layout className="grid border-t border-line md:grid-cols-2 md:gap-x-10">
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map(p => (
          <motion.li key={p.name} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="group flex gap-4 border-b border-line py-4">
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5"><Mark p={p} /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium tracking-tight">{p.name}</h3>
                {p.isNew && <span className="rounded-full bg-pink/15 px-1.5 py-px text-[10px] font-medium text-pink">New</span>}
                {p.on && <span className="rounded-full border border-line-strong px-1.5 py-px text-[10px] text-muted">On</span>}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

const byName = (n: string) => PLUGINS.find(p => p.name === n)!;

function Featured() {
  return (
    <section aria-label="New in 2.2" className="mx-auto mt-20 max-w-6xl px-5">
      <Reveal className="flex items-end justify-between gap-6">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">New in 2.2</h2>
        <a href={`${REPO}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">Changelog <ArrowUpRight className="size-3.5" /></a>
      </Reveal>
      <div className="mt-6 grid auto-rows-[minmax(190px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile p={byName("Spotify Controls")} brand="#1ed760" className="sm:col-span-2 lg:row-span-2"><SpotifyArt /></Tile>
        <Tile p={byName("YouTube")} brand="#ff0033" className="sm:col-span-2"><YouTubeArt /></Tile>
        <Tile p={byName("Twitch")} brand="#9146ff"><LiveArt color="#bf94ff" /></Tile>
        <Tile p={byName("Kick")} brand="#53fc18"><LiveArt color="#53fc18" /></Tile>
        <Tile p={byName("Lazy")} brand="#7dd3fc"><BrowserArt /></Tile>
        <Tile p={byName("Owlie")} brand="#f43f5e"><RecArt /></Tile>
        <Tile p={byName("Calculate")} brand="#fdba74"><CalcArt /></Tile>
        <Tile p={byName("DMS Saaf")} brand="#7dd3fc"><SweepArt /></Tile>
      </div>
    </section>
  );
}

function Tile({ p, brand, className, children }: { p: Plugin; brand: string; className?: string; children: ReactNode }) {
  return (
    <Reveal className={clsx("h-full", className)}>
      <Tilt className="h-full">
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-colors"
          style={{ borderColor: `color-mix(in srgb, ${brand} 22%, var(--line))`, background: `color-mix(in srgb, ${brand} 6%, var(--panel))` }}>
          <div className="flex items-center gap-3">
            <Mark p={p} size={32} />
            <div className="min-w-0">
              <h3 className="font-semibold tracking-tight">{p.name}</h3>
              <p className="text-xs text-faint">{p.category}</p>
            </div>
          </div>
          <div className="relative my-5 min-h-[88px] flex-1">{children}</div>
          <p className="text-sm leading-relaxed text-muted">{p.desc}</p>
          <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: brand }} />
        </article>
      </Tilt>
    </Reveal>
  );
}

function SpotifyArt() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="flex items-center gap-4">
        <img src={SONG.cover} alt="" className="size-20 rounded-lg object-cover shadow-lg" />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{SONG.title}</p>
          <p className="truncate text-sm text-muted">{SONG.artist}</p>
          <div className="mt-2 flex h-4 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2, 3, 4].map(i => (
              <motion.span key={i} className="w-[3px] rounded-full bg-[#1ed760]" animate={reduce ? { height: 8 } : { height: [4, 14, 6, 12, 4] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 font-mono text-[11px] text-faint">
        1:24
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-line-strong">
          <motion.div className="h-full rounded-full bg-[#1ed760]" initial={{ width: "40%" }} animate={reduce ? undefined : { width: ["40%", "70%"] }} transition={{ duration: 30, ease: "linear", repeat: Infinity }} />
        </div>
        3:29
      </div>
      <div className="flex items-center justify-center gap-6 text-muted">
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden><path d="M18.5 5.2v13.6a.8.8 0 0 1-1.25.66L8.6 12.66a.8.8 0 0 1 0-1.32l8.65-6.8a.8.8 0 0 1 1.25.66Z" /><rect x="4.5" y="5" width="2.6" height="14" rx="1.3" /></svg>
        <span className="grid size-10 place-items-center rounded-full bg-[#1ed760] text-black"><svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden><rect x="6" y="4.5" width="4" height="15" rx="1.2" /><rect x="14" y="4.5" width="4" height="15" rx="1.2" /></svg></span>
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden><path d="M5.5 5.2v13.6a.8.8 0 0 0 1.25.66l8.65-6.8a.8.8 0 0 0 0-1.32L6.75 4.54a.8.8 0 0 0-1.25.66Z" /><rect x="16.9" y="5" width="2.6" height="14" rx="1.3" /></svg>
      </div>
    </div>
  );
}

function YouTubeArt() {
  return (
    <div className="grid h-full grid-cols-[1.4fr_1fr] gap-3">
      <div className="relative overflow-hidden rounded-lg bg-[#0f0f0f]">
        <span className="absolute top-1/2 left-1/2 grid h-8 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[10px] bg-[#ff0033]">
          <span className="ml-0.5 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
        </span>
        <span className="absolute inset-x-0 bottom-0 h-1 bg-white/15"><span className="block h-full w-2/5 bg-[#ff0033]" /></span>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-2">
            <span className="h-8 w-12 shrink-0 rounded bg-white/[.08]" />
            <span className="flex-1 space-y-1 pt-1"><span className="block h-1.5 rounded bg-white/15" /><span className="block h-1.5 w-2/3 rounded bg-white/[.08]" /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveArt({ color }: { color: string }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <span className="inline-flex w-fit items-center gap-1.5 rounded bg-[#eb0400] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
        <motion.span className="size-1.5 rounded-full bg-white" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />LIVE
      </span>
      <div className="space-y-1.5 text-[12px]">
        {[["nyx", "w"], ["kai", "clip that"], ["mo", "gg"]].map(([u, t]) => (
          <p key={u} className="truncate"><span className="font-semibold" style={{ color }}>{u}</span> <span className="text-muted">{t}</span></p>
        ))}
      </div>
    </div>
  );
}

function BrowserArt() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg">
      <div className="flex gap-1 border-b border-line px-2 pt-1.5">
        <span className="rounded-t-md bg-panel-2 px-2 py-1 text-[10px]">Search</span>
        <span className="px-2 py-1 text-[10px] text-faint">github</span>
      </div>
      <div className="flex flex-1 items-center gap-2 px-3">
        <Search className="size-3 text-faint" /><span className="h-1.5 flex-1 rounded bg-line-strong" />
        <span className="rounded bg-[#23a55a]/15 px-1.5 text-[10px] font-medium text-[#3ba55d]">12 blocked</span>
      </div>
    </div>
  );
}

function RecArt() {
  const [s, setS] = useState(7);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  useEffect(() => { if (!seen) return; const id = setInterval(() => setS(x => x + 1), 1000); return () => clearInterval(id); }, [seen]);
  return (
    <div ref={ref} className="relative grid h-full place-items-center rounded-lg border-2 border-dashed border-[#f43f5e]/60">
      <span className="flex items-center gap-1.5 rounded-md bg-[#f43f5e] px-2 py-0.5 font-mono text-[11px] font-semibold text-white">
        <motion.span className="size-1.5 rounded-full bg-white" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
        REC {String(Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}
      </span>
      <span className="absolute right-2 bottom-1.5 font-mono text-[10px] text-faint">4K · 60</span>
    </div>
  );
}

function CalcArt() {
  return (
    <div className="mx-auto grid h-full max-w-[150px] grid-cols-4 gap-1">
      <span className="col-span-4 rounded-md bg-bg px-2 py-1 text-right font-mono text-sm">1,337</span>
      {["7", "8", "9", "÷", "4", "5", "6", "×"].map(k => (
        <span key={k} className={clsx("grid place-items-center rounded-md text-xs", "÷×".includes(k) ? "bg-[#fdba74] font-semibold text-black" : "bg-panel-2")}>{k}</span>
      ))}
    </div>
  );
}

function SweepArt() {
  return (
    <div className="flex h-full flex-col justify-center gap-1.5">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="flex items-center gap-2" animate={{ opacity: [1, 1, 0.15, 0.15, 1], x: [0, 0, 16, 16, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.25, times: [0, 0.35, 0.5, 0.85, 1] }}>
          <span className="size-5 shrink-0 rounded-full bg-panel-2" />
          <span className="h-1.5 flex-1 rounded bg-line-strong" style={{ maxWidth: `${70 - i * 15}%` }} />
        </motion.div>
      ))}
    </div>
  );
}

function Contributors() {
  const people = [
    { name: "70ne", avatar: "/avatars/70ne.jpg", href: "https://github.com/70nee" },
    { name: "hyperflora", avatar: "https://github.com/hyperflore.png?size=96", href: "https://github.com/hyperflore" },
  ];
  return (
    <section className="mx-auto mt-28 max-w-6xl px-5">
      <Reveal className="grid gap-10 border-t border-line pt-12 lg:grid-cols-[14rem_1fr] lg:gap-12">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Contributors</h2>
          <p className="mt-2 text-sm text-muted">The people who build and ship these plugins.</p>
        </div>
        <div className="flex flex-col gap-8">
          <ul className="flex flex-wrap gap-4">
            {people.map(p => {
              const body = (
                <>
                  <img src={p.avatar} alt="" className="size-12 rounded-full object-cover ring-1 ring-line-strong" />
                  <span className="text-[15px] font-medium">{p.name}</span>
                  {p.href && <ArrowUpRight className="size-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                </>
              );
              return (
                <li key={p.name}>
                  {p.href
                    ? <a href={p.href} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-2xl border border-line py-2 pr-5 pl-2 transition-colors hover:border-line-strong">{body}</a>
                    : <span className="flex items-center gap-3 rounded-2xl border border-line py-2 pr-5 pl-2">{body}</span>}
                </li>
              );
            })}
          </ul>
          <a href={`${REPO}/blob/main/docs/plugin-api.md`} target="_blank" rel="noreferrer"
            className="group flex flex-col gap-4 rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-line-strong sm:flex-row sm:items-center sm:p-8">
            <div className="flex-1">
              <p className="text-xl font-semibold tracking-tight">Write the 57th.</p>
              <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted">Plugins are plain JavaScript with a small API for settings, CSS, Discord's stores and events, menus and shortcuts. Save the file and it reloads.</p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium">Plugin guide <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Tilt({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5), y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 200, damping: 18 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  return (
    <div className={clsx("[perspective:1000px]", className)} onPointerMove={onMove} onPointerLeave={() => { x.set(0.5); y.set(0.5); }}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative h-full">{children}</motion.div>
    </div>
  );
}

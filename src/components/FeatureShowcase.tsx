import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Lock, RotateCw, Search, ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { Reveal } from "./ui";
import { SONG } from "./DiscordMock";

const FEATURES = [
  { title: "Live theming", text: "Gradients, glass blur, accent colours, fonts, corner roundness, message bubbles and role colour styles. Every change shows up as you make it.", art: ThemingArt },
  { title: "Theme Maker", text: "Build your own theme from nodes, give each server its own look, or drop in a wallpaper or custom CSS.", art: NodesArt },
  { title: "Widgets", text: "Spotify, YouTube, Twitch and Kick players live above your user panel, each collapsible to a single row.", art: WidgetArt },
  { title: "Lazy, a browser inside Discord", text: "Tabs, its own search with images and summaries, and ads and trackers blocked with the standard filter lists.", art: BrowserArt },
  { title: "Owlie screen recorder", text: "A screen or a window, with your PC's sound and microphone or without, from 720p up to 4K at 60 fps.", art: RecorderArt },
  { title: "Private by default", text: "No telemetry and no accounts. No Track blocks Discord's own analytics. Settings and recordings stay on your PC.", art: PrivacyArt },
  { title: "An installer you can check", text: "Every release ships SHA-256 checksums, and the terminal installer refuses a download that doesn't match. No administrator rights needed.", art: InstallerArt },
  { title: "Your own plugins", text: "A small API covers settings, CSS, Discord's stores and events, context menus and shortcuts. Save the file and it reloads.", art: CodeArt },
];

export function FeatureShowcase() {
  const [active, setActive] = useState(0);
  return (
    <section className="mx-auto mt-36 max-w-6xl px-5">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <h2 className="max-w-md text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[2.5rem]">Theming first. Everything else is optional.</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted">No restarts, and no CSS unless you want to write some. The rest is a plugin you switch on when you want it.</p>
          </Reveal>
          <div className="mt-10 hidden lg:block"><Stage active={active} /></div>
        </div>

        <ol className="border-t border-line">
          {FEATURES.map((f, i) => <Row key={f.title} i={i} f={f} active={active === i} onActive={setActive} />)}
        </ol>
      </div>
    </section>
  );
}

function useNarrow() {
  const q = "(max-width: 1023px)";
  const [narrow, setNarrow] = useState(() => matchMedia(q).matches);
  useEffect(() => {
    const m = matchMedia(q);
    const on = () => setNarrow(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return narrow;
}

function Row({ i, f, active, onActive }: { i: number; f: (typeof FEATURES)[number]; active: boolean; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const centred = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const narrow = useNarrow();
  useEffect(() => { if (centred) onActive(i); }, [centred, i, onActive]);
  const Art = f.art;
  return (
    <li ref={ref} onPointerEnter={() => onActive(i)} className="relative border-b border-line py-7">
      <motion.span aria-hidden className="absolute top-0 -left-px hidden h-full w-0.5 origin-top bg-fg lg:block" animate={{ scaleY: active ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} />
      <div className="grid gap-x-6 gap-y-1 sm:grid-cols-[2.5rem_1fr] lg:pl-6">
        <span className={clsx("font-mono text-sm tabular-nums transition-colors duration-300", active ? "text-fg" : "text-faint")}>{String(i + 1).padStart(2, "0")}</span>
        <div>
          <h3 className={clsx("text-[19px] font-medium tracking-tight transition-colors duration-300", active ? "text-fg" : "text-muted")}>{f.title}</h3>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{f.text}</p>
          {narrow && <div className="relative mt-5 h-56 overflow-hidden rounded-2xl border border-line bg-[#0e0d12]"><Art /></div>}
        </div>
      </div>
    </li>
  );
}

function Stage({ active }: { active: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0), py = useMotionValue(0);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), { stiffness: 140, damping: 16 });
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), { stiffness: 140, damping: 16 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const Art = FEATURES[active].art;

  return (
    <div className="[perspective:1400px]" onPointerMove={onMove} onPointerLeave={() => { px.set(0); py.set(0); }}>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative aspect-[5/4] w-full">
        {[2, 1].map(n => (
          <div key={n} aria-hidden className="absolute inset-0 rounded-3xl border border-line bg-panel" style={{ transform: `translateZ(${-n * 26}px) translateY(${n * 10}px) scale(${1 - n * 0.04})`, opacity: 1 - n * 0.3 }} />
        ))}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={active}
            initial={reduce ? { opacity: 0 } : { rotateY: -70, opacity: 0, z: -80 }}
            animate={{ rotateY: 0, opacity: 1, z: 0 }}
            exit={reduce ? { opacity: 0 } : { rotateY: 70, opacity: 0, z: -80 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0e0d12]"
            style={{ transformStyle: "preserve-3d" }}>
            <Art />
          </motion.div>
        </AnimatePresence>
        <div className="absolute -top-4 -right-4 grid size-14 place-items-center rounded-2xl border border-line-strong bg-panel font-mono text-sm" style={{ transform: "translateZ(60px)" }}>
          {String(active + 1).padStart(2, "0")}
        </div>
      </motion.div>
    </div>
  );
}

function ThemingArt() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const [v, setV] = useState(60);
  useEffect(() => {
    if (!seen) return;
    const id = setInterval(() => setV(x => (x >= 85 ? 35 : x + 2)), 140);
    return () => clearInterval(id);
  }, [seen]);
  return (
    <div ref={ref} className="absolute inset-0 p-7 text-white">
      <p className="text-xs tracking-wide text-white/50 uppercase">Appearance</p>
      {[["Gradient", v], ["Glass", 60], ["Corner roundness", 42]].map(([l, n]) => (
        <div key={l as string} className="mt-5">
          <div className="flex justify-between text-sm"><span className="text-white/75">{l}</span><span className="font-mono text-white/90 tabular-nums">{n}%</span></div>
          <div className="mt-2 h-1.5 rounded-full bg-white/15"><div className="h-full rounded-full bg-white" style={{ width: `${n}%` }} /></div>
        </div>
      ))}
      <div className="mt-6 flex gap-2">
        {["#ff5fa2", "#818cf8", "#34d399", "#fb923c", "#e4e4e7"].map((c, i) => (
          <span key={c} className={clsx("size-7 rounded-lg", i === 0 && "ring-2 ring-white ring-offset-2 ring-offset-[#1a1020]")} style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}

function NodesArt() {
  const nodes = [
    { x: 8, y: 16, t: "Colour", c: "#ff5fa2", rows: ["#ff5fa2"] },
    { x: 8, y: 58, t: "Image", c: "#7dd3fc", rows: ["wallpaper.jpg"] },
    { x: 40, y: 34, t: "Blend", c: "#a78bfa", rows: ["mode: soft-light", "60%"] },
    { x: 70, y: 40, t: "Background", c: "#34d399", rows: ["→ app"] },
  ];
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/.08)_1px,transparent_0)] [background-size:18px_18px] text-white">
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden>
        {[["M30 22 C 36 22, 34 40, 40 40", "#ff5fa2"], ["M30 64 C 36 64, 34 44, 40 44", "#7dd3fc"], ["M62 42 C 66 42, 66 46, 70 46", "#a78bfa"]].map(([d, c], i) => (
          <motion.path key={i} d={d} fill="none" stroke={c} strokeWidth="0.6" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 2 }}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 + i * 0.2 }} />
        ))}
      </svg>
      {nodes.map(n => (
        <div key={n.t} className="absolute w-[24%] rounded-lg border border-white/10 bg-[#17161d] text-[11px] shadow-lg" style={{ left: `${n.x}%`, top: `${n.y}%` }}>
          <div className="flex items-center gap-1.5 rounded-t-lg border-b border-white/10 px-2 py-1.5 font-semibold"><span className="size-2 rounded-full" style={{ background: n.c }} />{n.t}</div>
          {n.rows.map(r => <div key={r} className="truncate px-2 py-1 text-white/60">{r}</div>)}
        </div>
      ))}
    </div>
  );
}

function WidgetArt() {
  return (
    <div className="absolute inset-0 grid place-items-center p-8">
      <div className="w-full max-w-[300px] rounded-xl border border-white/10 bg-[#111214]/90 p-3.5 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <img src={SONG.cover} alt="" className="size-14 rounded-md object-cover" />
          <div className="min-w-0">
            <p className="truncate font-semibold">{SONG.title}</p>
            <p className="truncate text-sm text-[#949ba4]">{SONG.artist}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-[#949ba4]">
          1:24<div className="h-1 flex-1 rounded-full bg-white/15"><motion.div className="h-full rounded-full bg-[#1ed760]" initial={{ width: "30%" }} animate={{ width: "75%" }} transition={{ duration: 12, ease: "linear", repeat: Infinity }} /></div>3:29
        </div>
        <div className="mt-2 flex justify-center gap-6 text-sm">
          <span className="text-white/70">⏮</span><span className="grid size-8 place-items-center rounded-full bg-white text-black">❚❚</span><span className="text-white/70">⏭</span>
        </div>
      </div>
    </div>
  );
}

function BrowserArt() {
  return (
    <div className="absolute inset-0 flex flex-col text-white">
      <div className="flex items-end gap-1 bg-[#17161d] px-3 pt-3">
        {["Search", "github.com", "youtube.com"].map((t, i) => (
          <span key={t} className={clsx("rounded-t-lg px-3 py-1.5 text-[11px]", i === 0 ? "bg-[#0e0d12] text-white" : "text-white/50")}>{t}</span>
        ))}
      </div>
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-white/50">
        <ArrowLeft className="size-3.5" /><ArrowRight className="size-3.5" /><RotateCw className="size-3.5" />
        <div className="flex h-7 flex-1 items-center gap-2 rounded-md bg-white/[.06] px-2.5 text-[12px] text-white/80"><Lock className="size-3" /> lazy://search?q=be themer</div>
        <span className="rounded-md bg-[#34d399]/15 px-2 py-1 text-[10px] font-semibold text-[#34d399]">23 blocked</span>
      </div>
      <div className="flex-1 space-y-3 p-4">
        <div className="flex h-9 items-center gap-2 rounded-full border border-white/10 px-3 text-[12px] text-white/70"><Search className="size-3.5" /> be themer</div>
        {[80, 64, 72].map((w, i) => (
          <div key={i} className="space-y-1.5"><div className="h-2 rounded-full bg-[#7dd3fc]/60" style={{ width: `${w * 0.6}%` }} /><div className="h-1.5 rounded-full bg-white/15" style={{ width: `${w}%` }} /></div>
        ))}
      </div>
    </div>
  );
}

function RecorderArt() {
  const [s, setS] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  useEffect(() => { if (!seen) return; const id = setInterval(() => setS(x => x + 1), 1000); return () => clearInterval(id); }, [seen]);
  return (
    <div ref={ref} className="absolute inset-0 p-6 text-white">
      <div className="relative h-[62%] rounded-xl border border-white/10 bg-[#17161d]">
        <div className="absolute inset-3 rounded-lg border-2 border-dashed border-[#f43f5e]/70" />
        <span className="absolute top-5 left-5 flex items-center gap-1.5 rounded-md bg-[#f43f5e] px-2 py-0.5 font-mono text-[11px] font-semibold">
          <motion.span className="size-1.5 rounded-full bg-white" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
          REC {String(Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
        {["Screen 1", "4K", "60 fps", "PC sound", "Mic"].map((t, i) => (
          <span key={t} className={clsx("rounded-full border px-2.5 py-1", i < 3 ? "border-white/30 bg-white/10" : "border-white/10 text-white/60")}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function PrivacyArt() {
  const rows = [["Telemetry", "None"], ["Accounts", "None"], ["No Track", "On"], ["Where settings live", "%APPDATA%"]];
  return (
    <div className="absolute inset-0 p-7 text-white">
      <ShieldCheck className="size-10 text-[#7dd3fc]" strokeWidth={1.5} />
      <div className="mt-5 divide-y divide-white/10 rounded-xl border border-white/10 bg-black/30">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span className="text-white/65">{k}</span><span className="font-mono text-white">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InstallerArt() {
  const lines = [
    ["Downloading BeThemerInstallerCli.exe", ""],
    ["Expected  ", "7f3a…c91e"],
    ["Got       ", "7f3a…c91e"],
    ["SHA-256 matches", "ok"],
    ["Installing for Discord Stable", "ok"],
  ];
  return (
    <div className="absolute inset-0 bg-[#0c0c10] p-6 font-mono text-[12.5px] leading-7 text-[#cdd6f4]">
      {lines.map(([t, v], i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.22 }} className="flex items-center gap-2">
          <span className="text-[#6c7086]">PS&gt;</span>
          <span className={v === "ok" ? "text-white" : "text-[#bac2de]"}>{t}</span>
          {v === "ok" ? <Check className="size-3.5 text-[#a6e3a1]" /> : <span className="text-[#a6e3a1]">{v}</span>}
        </motion.div>
      ))}
    </div>
  );
}

function CodeArt() {
  const S = "text-[#a6e3a1]", F = "text-[#89b4fa]", K = "text-[#cba6f7]";
  const lines: [string, string?][][] = [
    [["BThemer."], ["definePlugin", F], ["({"]],
    [["  id: "], ['"roundAvatars"', S], [","]],
    [["  name: "], ['"Square-ish Avatars"', S], [","]],
    [["  settings: { radius: { type: "], ['"range"', S], [", "], ["default", K], [": 30 } },"]],
    [["  css: s => "], ['`[class*="avatar_"] img {', S]],
    [["    "], ["border-radius: ${s.radius}% }`", S], [","]],
    [["  "], ["start", F], ["(api) {"]],
    [["    api."], ["onKey", F], ["("], ['"Ctrl+Alt+K"', S], [", () => api."], ["toast", F], ["("], ['"hi"', S], ["));"]],
    [["  },"]],
    [["});"]],
  ];
  return (
    <pre className="absolute inset-0 overflow-hidden bg-[#0c0c10] p-6 font-mono text-[12.5px] leading-6 text-[#cdd6f4]">
      {lines.map((line, n) => (
        <div key={n} className="whitespace-pre">
          <span className="mr-4 inline-block w-4 text-right text-[#45475a] select-none">{n + 1}</span>
          {line.map(([t, c], i) => <span key={i} className={c}>{t}</span>)}
          {n === lines.length - 1 && <motion.span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-[#cdd6f4]" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
        </div>
      ))}
    </pre>
  );
}

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, LifeBuoy, Search, X } from "lucide-react";
import { GithubIcon } from "../components/icons";
import clsx from "clsx";
import { Reveal } from "../components/ui";
import { Link } from "../router";
import { REPO } from "../data";
import { FaqScene } from "../components/FaqScenes";

type Group = "Safety" | "Using it" | "Installing";
type Q = { q: string; a: React.ReactNode; group: Group };

const K = ({ children }: { children: React.ReactNode }) => (
  <kbd className="rounded-md border border-line-strong bg-panel-2 px-1.5 py-0.5 font-mono text-[0.85em] text-fg">{children}</kbd>
);
const P = ({ children }: { children: React.ReactNode }) => <code className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-[0.85em] text-fg">{children}</code>;

const QUESTIONS: Q[] = [
  { group: "Safety", q: "Can it get my account banned?", a: <>Discord's Terms of Service don't allow modifying the client, and that includes client mods like Be Themer. Using one is a breach of the Terms and Discord can act on accounts that do. Purely visual changes are the least visible; features that post on your behalf (Custom Activity, Emoji links, Meow's recording notice) are the most visible. The risk is yours to take.</> },
  { group: "Safety", q: "Is my Discord token safe?", a: <>Your token never leaves Discord. The few plugin features that call Discord's API use Discord's own request code, or send the token only to <P>discord.com</P>, exactly as the app does. Every line is on GitHub to check.</> },
  { group: "Safety", q: "Does Be Themer collect any data?", a: <>No. There's no telemetry, no accounts and no crash reporting. The installer only contacts GitHub, to find and download the release. Things you switch on can make requests: a wallpaper set by link is downloaded from that link, and Translate Selection sends the text you select to Google Translate.</> },
  { group: "Safety", q: "Are plugins from other people safe?", a: <>Only add code from people you trust. A theme or plugin you add yourself runs with the same access as Be Themer inside Discord, so a malicious one could read anything in your Discord app. The built-in plugins all live in the repository for anyone to review.</> },
  { group: "Using it", q: "Which build should I install?", a: <>There are four, all from the same code base. <span className="text-fg">Be Themer</span> is everything. <span className="text-fg">Be Func</span> is the plugins without the theme, and keeps Meow and Owlie. <span className="text-fg">Be Styler</span> is the theme plus the plugins that change how Discord looks, without Meow and Owlie. <span className="text-fg">Be Core</span> is just Fake Nitro, DMS Saaf, Meow and Owlie. Each one has its own installer on the Download page, and installing one replaces another.</> },
  { group: "Using it", q: "Does it give me real Nitro?", a: <>No. Fake Nitro's extras (emoji and sticker links, client themes, app icons) only change what you see on your own client. Nothing is unlocked on your account, and Be Themer never automates your account.</> },
  { group: "Using it", q: "Is it free?", a: <>Yes. Be Themer is free and open source under the MIT License. There are no accounts, subscriptions or paid features.</> },
  { group: "Using it", q: "A theme broke how Discord looks. Now what?", a: <>Press <K>Ctrl</K> <K>Alt</K> <K>A</K> to turn Be Themer off, then fix or remove the theme. <K>Ctrl</K> <K>Alt</K> <K>B</K> always opens the Be Themer window, even if the settings entry is missing.</> },
  { group: "Using it", q: "My changes didn't apply.", a: <>Press <K>Ctrl</K> <K>R</K> to reload Discord. A few changes, marked in the app, need a full restart: right-click the tray icon, choose Quit, then open Discord again.</> },
  { group: "Using it", q: "Where are my settings and files?", a: <>Everything lives in <P>%APPDATA%\B-Themer</P>. Recordings go to <P>Documents\Meow Recordings</P> unless you choose another folder. To keep data somewhere else, set <P>BTHEMER_DATA_DIR</P> before starting Discord and the installer.</> },
  { group: "Using it", q: "Is recording calls with Meow legal?", a: <>It depends on where you and the others are: some places require everyone in a call to agree. By default Meow posts a notice in the channel when you start and stop recording, and a red bar stays on screen while it records. Keep the notice on and ask first.</> },
  { group: "Installing", q: "Does it work on macOS or Linux?", a: <>Not yet. Be Themer and its installer are Windows only. You can build it from source elsewhere, but only Windows 10 and 11 are tested.</> },
  { group: "Installing", q: "What happens when Discord updates?", a: <>Discord's own files are never edited in place; the original <P>app.asar</P> is only renamed. When Discord updates itself, Be Themer puts its loader back on the next start. If it ever doesn't, run the installer's Repair.</> },
  { group: "Installing", q: "Do I need administrator rights?", a: <>No. Be Themer installs into your own user folder. Running the installer as administrator isn't needed and can install it for the wrong user.</> },
  { group: "Installing", q: "How do I remove it?", a: <>Run the installer and press Uninstall, or use the command-line installer with <P>--uninstall</P>. That puts Discord's original file back. Your settings stay in <P>%APPDATA%\B-Themer</P> in case you return; delete that folder to remove them too.</> },
];

const GROUPS: Group[] = ["Safety", "Using it", "Installing"];
const TINT: Record<Group, string> = { Safety: "#7dd3fc", "Using it": "#ff5fa2", Installing: "#a78bfa" };
const textOf = (n: React.ReactNode): string =>
  typeof n === "string" ? n : Array.isArray(n) ? n.map(textOf).join("") : n && typeof n === "object" && "props" in n ? textOf((n as { props: { children?: React.ReactNode } }).props.children) : "";

export function Faq() {
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const n = query.trim().toLowerCase();
    return n ? QUESTIONS.filter(x => `${x.q} ${textOf(x.a)}`.toLowerCase().includes(n)) : QUESTIONS;
  }, [query]);
  const [at, setAt] = useState(0);
  const [dir, setDir] = useState(1);
  const i = Math.min(at, Math.max(0, list.length - 1));
  const go = (to: number) => {
    if (!list.length) return;
    const next = (to + list.length) % list.length;
    setDir(next > i || (i === list.length - 1 && next === 0) ? 1 : -1);
    setAt(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(i + 1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(i - 1); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  return (
    <>
      <section className="relative mx-auto max-w-6xl px-5 pt-16 sm:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <Reveal now>
            <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.045em]">Questions,<br /><span className="hand">answered straight.</span></h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
              Bans, tokens, updates and removal.
            </p>
          </Reveal>
          <Reveal now delay={0.1} className="hidden lg:block"><Glyph /></Reveal>
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-6xl gap-10 px-5 lg:grid-cols-[20rem_1fr] lg:gap-14">
        <aside className="order-2 lg:order-1">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" />
            <input value={query} onChange={e => { setQuery(e.target.value); setAt(0); }} placeholder="Search questions"
              className="h-11 w-full rounded-xl border border-line bg-panel pr-10 pl-10 text-sm outline-none placeholder:text-faint focus:border-line-strong" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-2.5 grid size-7 -translate-y-1/2 place-items-center rounded-md text-faint hover:text-fg"><X className="size-4" /></button>}
          </label>
          <nav aria-label="Questions" className="mt-6 space-y-6">
            {GROUPS.map(g => {
              const items = list.map((x, n) => ({ x, n })).filter(({ x }) => x.group === g);
              if (!items.length) return null;
              return (
                <div key={g}>
                  <p className="flex items-center gap-2 px-3 text-xs font-medium text-faint"><span className="size-1.5 rounded-full" style={{ background: TINT[g] }} />{g}</p>
                  <ul className="mt-2 space-y-0.5">
                    {items.map(({ x, n }) => (
                      <li key={x.q}>
                        <button type="button" onClick={() => go(n)} aria-current={n === i}
                          className={clsx("relative w-full rounded-lg px-3 py-2 text-left text-sm transition-colors", n === i ? "text-fg" : "text-muted hover:text-fg")}>
                          {n === i && <motion.span layoutId="faq-pill" className="absolute inset-0 rounded-lg bg-panel-2" transition={{ type: "spring", bounce: 0.15, duration: 0.45 }} />}
                          <span className="relative">{x.q}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {!list.length && <p className="px-3 text-sm text-muted">Nothing matches “{query}”.</p>}
          </nav>
        </aside>

        <div className="order-1 lg:order-2">
          {list.length ? <Deck list={list} i={i} dir={dir} go={go} /> : <div className="grid h-80 place-items-center rounded-3xl border border-dashed border-line text-muted">No questions match your search.</div>}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5">
        <Reveal className="grid gap-4 md:grid-cols-2">
          <a href={`${REPO}/issues`} target="_blank" rel="noreferrer" className="group flex items-start gap-4 rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-line-strong">
            <GithubIcon className="mt-0.5 size-5 text-muted" />
            <span><span className="block font-medium">Still stuck?</span><span className="mt-1 block text-sm text-muted">Open an issue. Include the output of <P>BThemer.debug()</P> from DevTools (<K>F12</K>).</span></span>
            <ArrowRight className="ml-auto size-4 shrink-0 self-center text-faint transition-transform group-hover:translate-x-1" />
          </a>
          <Link to="/download" className="group flex items-start gap-4 rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-line-strong">
            <LifeBuoy className="mt-0.5 size-5 text-muted" />
            <span><span className="block font-medium">Repair or reinstall</span><span className="mt-1 block text-sm text-muted">Every way to install, repair and uninstall, with checksums.</span></span>
            <ArrowRight className="ml-auto size-4 shrink-0 self-center text-faint transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}

function Deck({ list, i, dir, go }: { list: Q[]; i: number; dir: number; go: (n: number) => void }) {
  const reduce = useReducedMotion();
  const depth = 3;
  const visible = Array.from({ length: Math.min(depth + 1, list.length) }, (_, d) => ({ d, n: (i + d) % list.length }));

  return (
    <div>
      <div className="relative h-[710px] [perspective:1600px] sm:h-[630px]">
        <AnimatePresence initial={false} custom={dir}>
          {visible.slice().reverse().map(({ d, n }) => {
            const item = list[n];
            const front = d === 0;
            return (
              <motion.article key={item.q} custom={dir} aria-hidden={!front}
                initial={reduce ? { opacity: 0 } : dir > 0 ? { y: -(depth + 1) * 34, z: -(depth + 1) * 90, opacity: 0, scale: 0.84 } : { y: 120, z: 160, rotateX: -24, opacity: 0 }}
                animate={reduce ? { opacity: front ? 1 : 0 } : { y: -d * 34, z: -d * 90, scale: 1 - d * 0.05, rotateX: 0, opacity: front ? 1 : 1 - d * 0.25 }}
                variants={{
                  leave: (c: number) => reduce ? { opacity: 0 } : c > 0
                    ? { y: 140, z: 200, rotateX: -28, opacity: 0, transition: { duration: 0.45 } }
                    : { y: -(depth + 1) * 34, z: -(depth + 1) * 90, opacity: 0 },
                }}
                exit="leave"
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                drag={front ? "x" : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.6}
                onDragEnd={(_, info) => { if (info.offset.x < -90) go(i + 1); else if (info.offset.x > 90) go(i - 1); }}
                style={{ zIndex: 10 - d, transformStyle: "preserve-3d" }}
                className={clsx("absolute inset-x-0 bottom-0 flex h-[600px] flex-col rounded-3xl border bg-panel p-7 sm:h-[520px] sm:p-10",
                  front ? "cursor-grab border-line-strong shadow-[0_40px_80px_-40px_rgb(0_0_0/.55)] active:cursor-grabbing" : "pointer-events-none border-line-strong bg-panel-2")}>
                <div className="flex items-center gap-2 text-xs text-faint">
                  <span className="size-1.5 rounded-full" style={{ background: TINT[item.group] }} />{item.group}
                  <span className="ml-auto font-mono tabular-nums">{String(n + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}</span>
                </div>
                <h2 className="mt-6 text-2xl leading-tight font-semibold tracking-[-0.02em] text-balance sm:text-[2rem]">{item.q}</h2>
                <div className={clsx("mt-5 text-[16px] leading-relaxed text-muted transition-opacity duration-300", !front && "opacity-0")}>{item.a}</div>
                <div className="mt-auto h-[112px] pt-5">{front && <FaqScene i={QUESTIONS.indexOf(item)} />}</div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button type="button" onClick={() => go(i - 1)} aria-label="Previous question" className="grid size-11 place-items-center rounded-full border border-line-strong transition-colors hover:bg-panel-2"><ArrowLeft className="size-4" /></button>
        <button type="button" onClick={() => go(i + 1)} aria-label="Next question" className="grid size-11 place-items-center rounded-full bg-fg text-bg transition-opacity hover:opacity-90"><ArrowRight className="size-4" /></button>
        <div className="ml-3 flex flex-1 gap-1" aria-hidden>
          {list.map((x, n) => (
            <button key={x.q} type="button" tabIndex={-1} onClick={() => go(n)} className="group h-6 flex-1">
              <span className={clsx("block h-1 rounded-full transition-colors", n === i ? "bg-fg" : "bg-line-strong group-hover:bg-faint")} />
            </button>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{list[i]?.q}</p>
    </div>
  );
}

function Glyph() {
  const reduce = useReducedMotion();
  const layers = 30;
  return (
    <div className="grid size-72 place-items-center [perspective:900px]" aria-hidden>
      <motion.div className="relative [transform-style:preserve-3d]" animate={reduce ? undefined : { rotateY: [-35, 35, -35], rotateX: [8, -6, 8] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}>
        {Array.from({ length: layers }, (_, n) => (
          <span key={n} className="absolute inset-0 grid place-items-center text-[15rem] leading-none font-semibold tracking-tighter select-none"
            style={{ transform: `translateZ(${(layers / 2 - n) * 1.6}px)`, color: n === 0 ? "transparent" : `hsl(350 8% ${26 - n * 0.5}%)` }}>
            ?
          </span>
        ))}
        <span className="relative block text-[15rem] leading-none font-semibold tracking-tighter text-fg select-none"
          style={{ transform: `translateZ(${(layers / 2) * 1.6 + 0.5}px)` }}>?</span>
      </motion.div>
    </div>
  );
}

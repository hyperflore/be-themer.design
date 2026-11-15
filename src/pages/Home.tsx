import { lazy, Suspense, useEffect, useState } from "react";

const Contours = lazy(() => import("../components/Contours").then(m => ({ default: m.Contours })));
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import { Button, CopyCommand, Reveal } from "../components/ui";
import { DiscordWindow, LOOKS, type Look } from "../components/DiscordMock";
import { Exploded } from "../components/Exploded";
import { FeatureShowcase } from "../components/FeatureShowcase";
import { Boombox } from "../components/Boombox";
import { BeforeAfter } from "../components/BeforeAfter";
import { Shortcuts } from "../components/Shortcuts";
import { Releases } from "../components/Releases";
import { PluginRing } from "../components/PluginRing";
import { Tablet } from "../components/Tablet";

import { LOW_END } from "../lowEnd";
import { useTheme } from "../components/useTheme";
import { useMusic } from "../components/Music";
import { ThemeControls } from "../components/ThemeControls";
import { GithubIcon, WindowsIcon } from "../components/icons";
import { Link } from "../router";
import { CATEGORIES, CMD, DL, PLUGINS, REPO, VERSION, type Category } from "../data";

export function Home() {
  const [look, setLook] = useState(LOOKS[0]);
  const [gradient, setGradient] = useState(60);
  const [glass, setGlass] = useState(60);
  const theme = { look, setLook, gradient, setGradient, glass, setGlass };
  return (
    <>
      <Hero {...theme} />
      <BeforeAfter />
      <Exploded look={look} gradient={gradient} glass={glass} />
      <FeatureShowcase />
      <Boombox />
      <Shortcuts />
      <PluginIndex />
      <Install />
      <FaqTeaser />
      <Closing />
    </>
  );
}

type Theme = { look: Look; setLook: (l: Look) => void; gradient: number; setGradient: (n: number) => void; glass: number; setGlass: (n: number) => void };

function Hero({ look, setLook, gradient, setGradient, glass, setGlass }: Theme) {
  const music = useMusic();
  const theme = useTheme();
  const [contours, setContours] = useState(false);
  useEffect(() => {
    const go = () => setContours(true);
    const t = window.setTimeout(() => ("requestIdleCallback" in window ? requestIdleCallback(go, { timeout: 1500 }) : go()), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      {theme === "dark" && contours && !LOW_END && <Suspense fallback={null}><Contours /></Suspense>}
      <section className="mx-auto max-w-6xl px-5 pt-16 sm:pt-24">
        <Reveal now>
          <h1 className="max-w-[14ch] text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance">
            Make Discord look like it's yours.
          </h1>
        </Reveal>
        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <Reveal now delay={0.08}>
            <p className="max-w-md text-[20px] text-pretty text-muted">
              <span className="script leading-[1.25]">Be Themer restyles Discord live (gradients, glass, colours, fonts) and adds {PLUGINS.length} optional plugins. Free and open source, for Windows.</span>
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href={DL.installer} size="lg"><WindowsIcon className="size-4" /> Download for Windows</Button>
              <Button href={REPO} external variant="ghost" size="lg" className="logo-ring"><GithubIcon className="size-4" /> Source Code</Button>
            </div>
          </Reveal>
          <Reveal now delay={0.12}>
            <p className="mb-3 text-xs text-faint">Or install from PowerShell</p>
            <CopyCommand command={CMD.powershell} />
          </Reveal>
        </div>
        <Reveal now delay={0.14}>
          <p className="mt-10 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-4 text-sm text-faint">
            <a href={`${REPO}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer" className="font-mono text-muted hover:text-fg">v{VERSION}</a>
            <span>Windows 10 and 11</span>
            <span>MIT licensed</span>
            <span>No telemetry, no accounts</span>
          </p>
        </Reveal>
      </section>

      <section aria-label="Preview" className="mx-auto mt-16 max-w-[1240px] px-3 sm:mt-20 sm:px-5">
        <Reveal now delay={0.2}>
          <div role="button" tabIndex={0} aria-label="Play Dracula" onClick={music.start}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); music.start(); } }}
            className="group relative cursor-pointer rounded-[40px] outline-none focus-visible:ring-2 focus-visible:ring-[#ff4d6d]">
            <Tablet><DiscordWindow look={look} gradient={gradient} glass={glass} /></Tablet>
          </div>
        </Reveal>
        <div className="mx-auto mt-16 max-w-6xl sm:px-0">
          <ThemeControls look={look} setLook={setLook} gradient={gradient} setGradient={setGradient} glass={glass} setGlass={setGlass} />
        </div>
      </section>
    </>
  );
}

function SectionHead({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Reveal>
      <h2 className="max-w-xl text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[2.5rem]">{title}</h2>
      {children && <p className="mt-4 max-w-md leading-relaxed text-muted">{children}</p>}
    </Reveal>
  );
}

function PluginIndex() {
  const groups = CATEGORIES.filter((c): c is Category => c !== "All").map(c => ({ c, list: PLUGINS.filter(p => p.category === c) }));
  return (
    <section className="mx-auto mt-36 max-w-6xl px-5">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead title={<>{PLUGINS.length} plugins, all off <span className="kalam">until you want them.</span></>} />
        <Reveal><Link to="/plugins" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">Browse all plugins <ArrowRight className="size-3.5" /></Link></Reveal>
      </div>
      <div className="-mx-5 mt-6 sm:mx-0"><PluginRing /></div>
      <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(({ c, list }, n) => (
          <Reveal key={c} delay={(n % 3) * 0.04}>
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <h3 className="font-medium">{c}</h3>
              <span className="font-mono text-sm text-faint tabular-nums">{list.length}</span>
            </div>
            <ul className="mt-4 space-y-2 text-[15px] text-muted">
              {list.slice(0, 7).map(p => (
                <li key={p.name} className="flex items-center gap-2">
                  {p.name}
                  {p.isNew && <span className="text-xs text-pink">new</span>}
                </li>
              ))}
              {list.length > 7 && <li className="text-faint"><Link to="/plugins" className="hover:text-fg">and {list.length - 7} more</Link></li>}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Install() {
  const steps = [
    ["Download the installer", "BeThemerInstaller.exe from the latest GitHub release, or run the one-line command below."],
    ["Pick your Discord", "It lists every Discord it finds (Stable, PTB, Canary) and whether Be Themer is installed. Press Install."],
    ["Open the settings", "Discord restarts. Open User Settings → Be Themer, or press Ctrl+Alt+B, and start changing things."],
  ];
  return (
    <section className="mx-auto mt-36 max-w-6xl px-5">
      <SectionHead title="Installed in about a minute." />
      <ol className="mt-12 grid gap-px overflow-hidden border-y border-line md:grid-cols-3">
        {steps.map(([title, text], i) => (
          <Reveal key={title} delay={i * 0.05}>
            <li className={clsx("h-full py-7 md:px-7", i > 0 && "border-t border-line md:border-t-0 md:border-l", i === 0 && "md:pl-0")}>
              <span className="grid size-7 place-items-center rounded-full border border-line-strong font-mono text-xs">{i + 1}</span>
              <h3 className="mt-5 font-medium tracking-tight">{title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{text}</p>
            </li>
          </Reveal>
        ))}
      </ol>
      <Reveal className="mt-6">
        <Link to="/download" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">All download options <ArrowRight className="size-3.5" /></Link>
      </Reveal>
      <Releases />
    </section>
  );
}

function FaqTeaser() {
  const qs = ["Can it get my account banned?", "Is my Discord token safe?", "Does it give me real Nitro?", "What happens when Discord updates?"];
  return (
    <section className="mx-auto mt-36 max-w-6xl px-5">
      <Reveal>
        <Link to="/faq" className="group relative block overflow-hidden rounded-3xl border border-line bg-panel p-8 transition-colors hover:border-line-strong sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-3xl leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.5rem]">Questions people ask.</h2>
              <p className="mt-4 max-w-sm leading-relaxed text-muted">Bans, tokens, updates, Nitro and how to remove it, answered straight.</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">Read the FAQ <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </div>
            <div className="relative h-56 [perspective:1200px]" aria-hidden>
              {qs.map((q, i) => (
                <div key={q} className="absolute inset-x-0 mx-auto flex h-16 w-[92%] items-center gap-3 rounded-2xl border border-line-strong bg-bg px-5 text-[15px] font-medium shadow-lg transition-transform duration-500 ease-out group-hover:[transform:var(--to)]"
                  style={{ top: i * 44, zIndex: 10 - i, transform: `translateZ(${-i * 40}px) rotateX(18deg)`, ["--to" as string]: `translateZ(${-i * 20}px) rotateX(8deg) translateY(${i * 6}px)`, opacity: 1 - i * 0.18 }}>
                  <span className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>{q}
                </div>
              ))}
            </div>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}

function Closing() {
  return (
    <section className="mx-auto mt-40 max-w-6xl px-5">
      <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-2xl text-[clamp(2.25rem,5vw,4rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance">
          Your Discord, your way.
          <span className="block text-faint">Remove it just as fast.</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button href={DL.installer} size="lg"><WindowsIcon className="size-4" /> Download for Windows</Button>
          <Link to="/download" className="inline-flex h-12 items-center rounded-xl border border-line-strong px-5 text-[15px] font-medium transition-colors hover:bg-panel-2">Other ways to install</Link>
        </div>
      </Reveal>
    </section>
  );
}

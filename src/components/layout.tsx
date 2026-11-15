import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, Mail, Menu, Moon, Sun, X } from "lucide-react";
import { siDiscord } from "simple-icons";
import { GithubIcon } from "./icons";
import { HoverMenu } from "./HoverMenu";
import clsx from "clsx";
import { Link, useRoute } from "../router";
import { BUILDS, DISCORD, EMAIL, REPO } from "../data";

const NAV = [
  { to: "/download", label: "Download" },
  { to: "/plugins", label: "Plugins" },
  { to: "/faq", label: "FAQ" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;
    root.classList.add("theme-switching");
    root.classList.toggle("dark", next);
    setDark(next);
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <button type="button" onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-panel-2 hover:text-fg">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={dark ? "d" : "l"} initial={{ rotate: -40, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 40, opacity: 0 }} transition={{ duration: 0.18 }}>
          {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

const REPO_ITEMS = BUILDS.map(b => ({ label: b.name, sub: b.repo.replace("https://github.com/", ""), href: b.repo }));

export function Nav() {
  const { path } = useRoute();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 8);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [path]);

  return (
    <header className="sticky top-0 z-50">
      <div aria-hidden className={clsx("absolute inset-0 border-b border-line bg-bg/80 backdrop-blur-xl transition-opacity duration-300", scrolled ? "opacity-100" : "opacity-0")} />
      <nav className="relative mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Be Themer home">
          <img src="/logo-64.png" alt="" className="size-7 rounded-lg" />
          <span className="font-semibold tracking-tight">Be Themer</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {NAV.map(n => (
            <Link key={n.to} to={n.to}
              className={clsx("rounded-lg px-3 py-1.5 text-sm transition-colors", path === n.to ? "text-fg" : "text-muted hover:text-fg")}>
              {n.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <HoverMenu title="Pick a repository" items={REPO_ITEMS} align="right">
            <a href={REPO} target="_blank" rel="noreferrer" aria-label="Be Themer on GitHub" className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-panel-2 hover:text-fg">
              <GithubIcon className="size-4" />
            </a>
          </HoverMenu>
          <ThemeToggle />
          <Link to="/download" className="ml-2 hidden h-9 items-center gap-2 rounded-lg bg-fg px-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 sm:inline-flex">
            <Download className="size-4" /> Download
          </Link>
          <button type="button" onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}
            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-panel-2 hover:text-fg md:hidden">
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-bg md:hidden">
            <div className="flex flex-col p-3">
              {[...NAV, { to: "/download", label: "Download Be Themer" }].map(n => (
                <Link key={n.label} to={n.to} className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-panel-2 hover:text-fg">{n.label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.6fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <img src="/logo-64.png" alt="" className="size-7 rounded-lg" />
            <span className="font-semibold tracking-tight">Be Themer</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            A free, premium Discord client that gives you the best features ever existed.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a href={DISCORD} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#5865f2] px-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden><path d={siDiscord.path} /></svg> Join the Discord
            </a>
            <a href={`mailto:${EMAIL}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line-strong px-3 text-sm text-muted transition-colors hover:text-fg">
              <Mail className="size-4" /> {EMAIL}
            </a>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-faint">
            Not affiliated with Discord Inc.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium">Get it</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/download" className="hover:text-fg">Download</Link></li>
            <li><a href={`${REPO}/releases`} target="_blank" rel="noreferrer" className="hover:text-fg">Releases</a></li>
            <li><a href={`${REPO}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer" className="hover:text-fg">Changelog</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-medium">Project</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><a href={REPO} target="_blank" rel="noreferrer" className="hover:text-fg">Source code</a></li>
            <li><a href={`${REPO}/blob/main/docs/plugin-api.md`} target="_blank" rel="noreferrer" className="hover:text-fg">Write a plugin</a></li>
            <li><Link to="/faq" className="hover:text-fg">FAQ</Link></li>
            <li><a href={`${REPO}/issues`} target="_blank" rel="noreferrer" className="hover:text-fg">Report a problem</a></li>
            <li><a href={DISCORD} target="_blank" rel="noreferrer" className="hover:text-fg">Discord server</a></li>
            <li><a href={`mailto:${EMAIL}`} className="hover:text-fg">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

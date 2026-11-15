import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Code2, FileCheck2, Info, SquareTerminal, TerminalSquare } from "lucide-react";
import { Button, CopyCommand, Reveal, Tabs } from "../components/ui";
import { GithubIcon, WindowsIcon } from "../components/icons";
import { Link } from "../router";
import { BUILD_PAGES, BUILDS, CMD, DL, LATEST, REPO, VERSION } from "../data";

type Platform = "windows" | "terminal" | "source";

export function Download() {
  const [tab, setTab] = useState<Platform>(() => {
    const h = location.hash.slice(1);
    return h === "terminal" || h === "source" ? h : "windows";
  });
  useEffect(() => { history.replaceState(null, "", `#${tab}`); }, [tab]);

  return (
    <section className="mx-auto max-w-3xl px-5 pt-16 sm:pt-24">
      <Reveal className="text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Download Be Themer</h1>
        <p className="mt-4 text-muted">Version {VERSION} for Windows. Four builds, one app: pick the one you want.</p>
      </Reveal>

      <BuildPicker />

      <Reveal delay={0.05} className="mt-14 flex justify-center">
        <Tabs id="platform" value={tab} onChange={setTab} tabs={[
          { value: "windows", label: <><WindowsIcon className="size-3.5" /> Windows</> },
          { value: "terminal", label: <><TerminalSquare className="size-4" /> Terminal</> },
          { value: "source", label: <><Code2 className="size-4" /> From source</> },
        ]} />
      </Reveal>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            {tab === "windows" && <WindowsPanel />}
            {tab === "terminal" && <TerminalPanel />}
            {tab === "source" && <SourcePanel />}
          </motion.div>
        </AnimatePresence>
      </div>

      <Reveal className="mt-14">
        <div className="flex gap-4 rounded-2xl border border-line bg-panel p-6">
          <FileCheck2 className="mt-0.5 size-5 shrink-0 text-mint" />
          <div className="text-sm leading-relaxed text-muted">
            <p className="font-medium text-fg">Verify your download</p>
            <p className="mt-1">
              Each release lists the SHA-256 of every file in <a className="text-fg underline underline-offset-4" href={DL.sums}>SHA256SUMS.txt</a>. Compare it with:
            </p>
            <div className="mt-3"><CopyCommand command="Get-FileHash .\BeThemerInstaller.exe -Algorithm SHA256" /></div>
            <p className="mt-3">
              Each build is only published at its own GitHub repo: {BUILDS.map((b, i) => (
                <span key={b.id}>{i > 0 && (i === BUILDS.length - 1 ? " and " : ", ")}<a className="text-fg underline underline-offset-4" href={b.repo} target="_blank" rel="noreferrer">{b.name}</a></span>
              ))}. If you got one anywhere else, delete it.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function BuildPicker() {
  return (
    <Reveal delay={0.04} className="mt-12">
      <h2 className="text-lg font-semibold tracking-tight">Which build?</h2>
      <p className="mt-1 text-sm text-muted">Each build is its own installer with its own release notes. Installing one replaces another in Discord, so pick one.</p>
      <div className="mt-5 grid gap-4">
        {BUILDS.map(b => (
          <div key={b.id} className="rounded-2xl border border-line bg-panel p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold tracking-tight">
                {b.id in BUILD_PAGES ? <Link to={BUILD_PAGES[b.id]} className="underline-offset-4 hover:underline">{b.name}</Link> : b.name}
              </h3>
              <a href={b.repo} target="_blank" rel="noreferrer" className="text-sm text-muted underline underline-offset-4 hover:text-fg">{b.repo.replace("https://github.com/", "")}</a>
            </div>
            <p className="mt-2 text-sm text-muted">{b.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {b.includes.map(item => (
                <li key={item} className="flex gap-3"><span className="mt-2 size-1 shrink-0 rounded-full bg-faint" />{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-fg">{b.pick}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href={`${b.repo}/releases/latest/download/${b.installer}`}><WindowsIcon className="size-4" /> Download {b.name}</Button>
              <Button href={`${b.repo}/releases/latest`} external variant="ghost">Release notes</Button>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">{children}</div>;
}

function Note({ tone = "info", title, children }: { tone?: "info" | "warn"; title: string; children: React.ReactNode }) {
  const Icon = tone === "warn" ? AlertTriangle : Info;
  return (
    <div className="mt-6 flex gap-3 rounded-xl border border-line bg-panel-2 p-4 text-sm">
      <Icon className={tone === "warn" ? "mt-0.5 size-4 shrink-0 text-peach" : "mt-0.5 size-4 shrink-0 text-sky"} />
      <div className="leading-relaxed text-muted"><p className="font-medium text-fg">{title}</p><div className="mt-1">{children}</div></div>
    </div>
  );
}

function WindowsPanel() {
  return (
    <Panel>
      <div className="flex flex-wrap gap-3">
        <Button href={DL.installer} size="lg"><WindowsIcon className="size-4" /> Download for Windows</Button>
        <Button href={DL.cli} variant="ghost" size="lg"><SquareTerminal className="size-4" /> Command-line installer</Button>
      </div>
      <ol className="mt-8 space-y-4 text-sm leading-relaxed text-muted">
        {[
          "Run BeThemerInstaller.exe. It lists every Discord it finds (Stable, PTB, Canary, Development) and whether Be Themer is installed there.",
          "Pick one and press Install. Discord restarts with Be Themer.",
          "Open User Settings → Be Themer, or press Ctrl+Alt+B.",
        ].map((s, i) => (
          <li key={i} className="flex gap-4">
            <span className="grid size-6 shrink-0 place-items-center rounded-full border border-line font-mono text-xs text-fg">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <Note tone="warn" title="Don't run it as administrator">
        Be Themer installs into your own user folder. Running the installer as administrator isn't needed and can install it for the wrong user.
      </Note>
      <Note title="Seeing a SmartScreen warning?">
        Click <span className="text-fg">More info</span>, then <span className="text-fg">Run anyway</span>. Windows shows this for apps that aren't code-signed; the files are the same ones listed in the release's checksums.
      </Note>
    </Panel>
  );
}

function TerminalPanel() {
  const [shell, setShell] = useState<"powershell" | "cmd">("powershell");
  return (
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">Downloads the installer, checks its SHA-256, and installs for Discord Stable.</p>
        <Tabs id="shell" value={shell} onChange={setShell} tabs={[{ value: "powershell", label: "PowerShell" }, { value: "cmd", label: "Command Prompt" }]} />
      </div>
      <div className="mt-5">
        <CopyCommand command={shell === "powershell" ? CMD.powershell : CMD.cmd} label={shell === "powershell" ? "Windows PowerShell" : "Command Prompt (cmd)"} />
      </div>
      <h3 className="mt-8 text-sm font-medium">Other options (PowerShell)</h3>
      <div className="mt-3 space-y-3">
        <div>
          <p className="mb-2 text-xs text-faint">Every Discord: Stable, PTB, Canary and Development</p>
          <CopyCommand command={CMD.allBranches} />
        </div>
        <div>
          <p className="mb-2 text-xs text-faint">Uninstall (your settings are kept)</p>
          <CopyCommand command={CMD.uninstall} />
        </div>
      </div>
      <Note title="Read it before you run it">
        As with any script piped into a shell, you can <a className="text-fg underline underline-offset-4" href={`${REPO}/blob/main/install.ps1`} target="_blank" rel="noreferrer">read install.ps1</a> first. It needs no administrator rights and sends nothing anywhere.
      </Note>
    </Panel>
  );
}

function SourcePanel() {
  return (
    <Panel>
      <p className="text-sm leading-relaxed text-muted">Needs Node.js 18 or newer and Git. This builds Be Themer and patches your Discord Stable to load it.</p>
      <div className="mt-5"><CopyCommand command={CMD.clone} /></div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href={REPO} external variant="ghost"><GithubIcon className="size-4" /> Repository</Button>
        <Button href={LATEST} external variant="soft">Latest release notes</Button>
      </div>
      <Note title="macOS and Linux">Not supported yet. Be Themer and its installer are tested on Windows only.</Note>
    </Panel>
  );
}

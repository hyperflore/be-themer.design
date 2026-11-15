import { FileCheck2 } from "lucide-react";
import { Button, Reveal } from "../components/ui";
import { GithubIcon, WindowsIcon } from "../components/icons";
import { Link } from "../router";
import { BUILDS, CORE_PLUGIN_NAMES, PLUGINS, THEME_PLUGIN_NAMES, VERSION } from "../data";

export function BuildPage({ id }: { id: "func" | "styler" | "core" }) {
  const build = BUILDS.find(b => b.id === id);
  if (!build) return null;
  const plugins = PLUGINS.filter(p =>
    id === "core" ? CORE_PLUGIN_NAMES.includes(p.name)
      : id === "styler" ? THEME_PLUGIN_NAMES.includes(p.name)
        : !THEME_PLUGIN_NAMES.includes(p.name));
  const releases = `${build.repo}/releases/latest`;

  return (
    <article className="mx-auto max-w-3xl px-5 pt-16 sm:pt-24">
      <Reveal>
        <Link to="/download" className="text-sm text-muted hover:text-fg">← All builds</Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{build.name}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{build.summary}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={`${build.repo}/releases/latest/download/${build.installer}`} size="lg"><WindowsIcon className="size-4" /> Download {build.name}</Button>
          <Button href={build.repo} external variant="ghost" size="lg"><GithubIcon className="size-4" /> Repository</Button>
        </div>
        <p className="mt-4 text-sm text-faint">Version {VERSION} · Windows · Installs into your own user folder, no administrator rights needed.</p>
      </Reveal>

      <Reveal delay={0.04} className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight">What's included</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
          {build.includes.map(item => (
            <li key={item} className="flex gap-3"><span className="mt-2 size-1 shrink-0 rounded-full bg-faint" />{item}</li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-fg">{build.pick}</p>
      </Reveal>

      <Reveal delay={0.04} className="mt-14">
        <h2 className="text-lg font-semibold tracking-tight">Plugins in this build ({plugins.length})</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {plugins.map(p => (
            <div key={p.name} className="rounded-xl border border-line bg-panel p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{p.name}</p>
                <span className="rounded-full border border-line px-2 py-0.5 text-[10px] text-faint">{p.category}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.04} className="mt-14">
        <div className="flex gap-4 rounded-2xl border border-line bg-panel p-6">
          <FileCheck2 className="mt-0.5 size-5 shrink-0 text-mint" />
          <div className="text-sm leading-relaxed text-muted">
            <p className="font-medium text-fg">Verify your download</p>
            <p className="mt-1">Compare the file with the checksums in <a className="text-fg underline underline-offset-4" href={`${releases}/download/SHA256SUMS.txt`}>SHA256SUMS.txt</a>:</p>
            <p className="mt-3 font-mono text-xs text-fg">Get-FileHash .\{build.installer} -Algorithm SHA256</p>
            <p className="mt-3">
              {build.name} is only published at <a className="text-fg underline underline-offset-4" href={build.repo} target="_blank" rel="noreferrer">{build.repo.replace("https://", "")}</a>. Installing it replaces any other Be Themer build in Discord.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.04} className="mt-14 pb-10 text-sm text-muted">
        Be Themer is open source under the MIT License. Support its developer on <a className="text-fg underline underline-offset-4" href="https://github.com/sponsors/70nee" target="_blank" rel="noreferrer">GitHub Sponsors (70nee)</a>.
      </Reveal>
    </article>
  );
}

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./ui";
import { REPO } from "../data";

type Release = { tag_name: string; name: string | null; published_at: string; html_url: string };
const API = "https://api.github.com/repos/hyperflore/Be-Themer/releases?per_page=4";

const ago = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  const units: [number, string][] = [[86400 * 30, "month"], [86400 * 7, "week"], [86400, "day"], [3600, "hour"], [60, "minute"]];
  for (const [n, u] of units) if (s >= n) { const v = Math.floor(s / n); return `${v} ${u}${v > 1 ? "s" : ""} ago`; }
  return "just now";
};

export function Releases() {
  const [list, setList] = useState<Release[] | null>(() => {
    try { const c = sessionStorage.getItem("releases"); return c ? JSON.parse(c) : null; } catch { return null; }
  });

  useEffect(() => {
    if (list) return;
    const ac = new AbortController();
    fetch(API, { signal: ac.signal, headers: { Accept: "application/vnd.github+json" } })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((r: Release[]) => {
        setList(r);
        try { sessionStorage.setItem("releases", JSON.stringify(r)); } catch {}
      })
      .catch(() => {});
    return () => ac.abort();
  }, [list]);

  if (!list?.length) return null;
  return (
    <Reveal className="mt-14">
      <div className="flex items-center gap-3 text-sm">
        <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#23a55a] opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-[#23a55a]" /></span>
        <span className="font-medium">Shipping often</span>
        <span className="text-faint">live from GitHub</span>
      </div>
      <ol className="mt-4 flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line sm:flex-row">
        {list.map((r, i) => (
          <li key={r.tag_name} className="flex-1 bg-bg">
            <a href={r.html_url} target="_blank" rel="noreferrer" className="group flex h-full flex-col gap-1 p-5 transition-colors hover:bg-panel">
              <span className="flex items-center justify-between">
                <span className="font-mono text-sm text-fg">{r.tag_name}</span>
                {i === 0 && <span className="rounded-full bg-[#23a55a]/15 px-2 py-0.5 text-[10px] font-medium text-[#3ba55d]">Latest</span>}
              </span>
              <span className="text-sm text-muted">{ago(r.published_at)}</span>
              <ArrowUpRight className="mt-auto size-4 self-end text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </li>
        ))}
      </ol>
      <a href={`${REPO}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-muted hover:text-fg">Read the changelog</a>
    </Reveal>
  );
}

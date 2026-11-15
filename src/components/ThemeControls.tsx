import clsx from "clsx";
import { LOOKS, type Look } from "./DiscordMock";

type Props = {
  look: Look; setLook: (l: Look) => void;
  gradient: number; setGradient: (n: number) => void;
  glass: number; setGlass: (n: number) => void;
};

export function ThemeControls({ look, setLook, gradient, setGradient, glass, setGlass }: Props) {
  return (
    <div className="grid gap-x-10 gap-y-6 rounded-2xl border border-line bg-panel p-5 sm:p-6 md:grid-cols-[auto_1fr_1fr] md:items-center">
      <fieldset>
        <legend className="mb-3 text-sm text-muted">Preset</legend>
        <div className="flex flex-wrap gap-2">
          {LOOKS.map(l => (
            <button key={l.name} type="button" onClick={() => setLook(l)} aria-pressed={l === look} title={l.name}
              className={clsx("group flex h-9 items-center gap-2 rounded-lg border pr-3 pl-2 text-sm transition-colors",
                l === look ? "border-line-strong bg-panel-2 text-fg" : "border-transparent text-muted hover:text-fg")}>
              {l.wallpaper
                ? <img src={l.wallpaper} alt="" className="size-5 rounded-md object-cover ring-1 ring-black/10" />
                : <span className="size-5 rounded-md ring-1 ring-black/10 ring-inset" style={{ background: `conic-gradient(${l.g1} 0 50%, ${l.g2} 0)` }} />}
              {l.name}
            </button>
          ))}
        </div>
      </fieldset>
      <Slider label={look.wallpaper ? "Wallpaper" : "Gradient"} value={gradient} onChange={setGradient} />
      <Slider label="Glass" value={glass} onChange={setGlass} />
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="mb-3 flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-fg tabular-nums">{value}%</span>
      </span>
      <input type="range" min={0} max={100} value={value} onChange={e => onChange(+e.target.value)} className="range w-full"
        style={{ "--fill": `${value}%` } as React.CSSProperties} />
    </label>
  );
}

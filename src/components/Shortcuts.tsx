import { useEffect, useState } from "react";
import clsx from "clsx";
import { Reveal } from "./ui";

const SHORTCUTS: { keys: string[]; does: string }[] = [
  { keys: ["Ctrl", "Alt", "B"], does: "Open the Be Themer window" },
  { keys: ["Ctrl", "Alt", "A"], does: "Turn Be Themer on or off (safe mode if a theme breaks something)" },
  { keys: ["Ctrl", "Alt", "M"], does: "Start or stop a call recording (Meow)" },
  { keys: ["Ctrl", "Alt", "T"], does: "Translate the selected text" },
  { keys: ["Ctrl", "R"], does: "Reload Discord" },
  { keys: ["F12"], does: "Open DevTools" },
];

const name = (e: KeyboardEvent) => (e.key === "Control" ? "Ctrl" : e.key.length === 1 ? e.key.toUpperCase() : e.key);

export function Shortcuts() {
  const [held, setHeld] = useState<Set<string>>(new Set());

  useEffect(() => {
    const down = (e: KeyboardEvent) => setHeld(h => new Set(h).add(name(e)));
    const up = (e: KeyboardEvent) => setHeld(h => { const n = new Set(h); n.delete(name(e)); return n; });
    const clear = () => setHeld(new Set());
    addEventListener("keydown", down);
    addEventListener("keyup", up);
    addEventListener("blur", clear);
    return () => { removeEventListener("keydown", down); removeEventListener("keyup", up); removeEventListener("blur", clear); };
  }, []);

  return (
    <section className="mx-auto mt-36 max-w-6xl px-5">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <Reveal>
          <h2 className="max-w-md text-3xl leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[2.5rem]">Everything is a shortcut away.</h2>
          <p className="mt-4 max-w-sm leading-relaxed text-muted">Open settings, switch Be Themer off, record a call or translate a line without reaching for the mouse.</p>
        </Reveal>

        <ul className="divide-y divide-line border-y border-line">
          {SHORTCUTS.map(s => {
            const on = s.keys.every(k => held.has(k));
            return (
              <li key={s.does} className={clsx("flex flex-col gap-3 py-5 transition-colors sm:flex-row sm:items-center sm:gap-8", on && "text-fg")}>
                <span className="flex shrink-0 items-center gap-1.5 sm:w-52">
                  {s.keys.map((k, i) => (
                    <span key={k} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-xs text-faint">+</span>}
                      <Cap k={k} held={held} />
                    </span>
                  ))}
                </span>
                <span className={clsx("text-[15px] transition-colors", on ? "text-fg" : "text-muted")}>{s.does}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Cap({ k, held, small }: { k: string; held: Set<string>; small?: boolean }) {
  const down = held.has(k);
  return (
    <kbd className={clsx(
      "inline-grid place-items-center rounded-lg border border-line-strong bg-panel-2 font-mono font-medium text-fg transition-[transform,box-shadow] duration-75",
      small ? "h-7 min-w-9 px-2 align-middle text-xs" : "h-10 min-w-11 px-3 text-sm",
      down ? "translate-y-[3px] shadow-[0_1px_0_var(--line-strong)]" : "shadow-[0_4px_0_var(--line-strong),0_6px_12px_-6px_rgb(0_0_0/.6)]",
    )}>
      {k}
    </kbd>
  );
}

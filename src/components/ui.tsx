import { useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Copy } from "lucide-react";
import clsx from "clsx";

export function Reveal({ children, delay = 0, className, now }: { children: ReactNode; delay?: number; className?: string; now?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      {...(now ? { animate: { opacity: 1, y: 0 } } : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" } })}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type ButtonProps = { href: string; children: ReactNode; variant?: "primary" | "ghost" | "soft"; external?: boolean; className?: string; size?: "md" | "lg" };
export function Button({ href, children, variant = "primary", external, className, size = "md" }: ButtonProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={clsx(
        "group inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[background,color,box-shadow,transform] duration-200 active:scale-[.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink",
        size === "lg" ? "h-12 px-5 text-[15px]" : "h-10 px-4 text-sm",
        variant === "primary" && "bg-fg text-bg shadow-[0_1px_2px_rgb(0_0_0/.12)] hover:bg-fg/90 dark:shadow-[0_1px_0_rgb(255_255_255/.15)_inset,0_8px_24px_-10px_rgb(0_0_0/.6)]",
        variant === "ghost" && "border border-line-strong text-fg hover:bg-panel-2",
        variant === "soft" && "bg-panel-2 text-fg hover:bg-line-strong",
        className,
      )}
    >
      {children}
    </a>
  );
}

function SlashBreaks({ text }: { text: string }) {
  const parts = text.split(/(?<=\/)/);
  return <>{parts.map((p, i) => <span key={i}>{p}{i < parts.length - 1 && <wbr />}</span>)}</>;
}

function Highlight({ line }: { line: string }) {
  const re = /(https?:\/\/[^\s"]+)|("[^"]*")|(\$[\w:]+)|((?<=\s)--?[A-Za-z][\w-]*)|([|;])|([^\s|;"]+)|(\s+)/g;
  const out: React.ReactNode[] = [];
  let cmd = true, m: RegExpExecArray | null, i = 0;
  while ((m = re.exec(line))) {
    const [t, url, str, variable, flag, op, word] = m;
    const k = i++;
    if (url) { out.push(<span key={k} className="text-[#a6e3a1]"><SlashBreaks text={url} /></span>); cmd = false; }
    else if (str) { out.push(<span key={k} className="text-[#a6e3a1]"><SlashBreaks text={str} /></span>); cmd = false; }
    else if (variable) { out.push(<span key={k} className="text-[#cba6f7]">{variable}</span>); cmd = false; }
    else if (flag) { out.push(<span key={k} className="text-[#89b4fa]">{flag}</span>); }
    else if (op) { out.push(<span key={k} className="text-[#7f849c]">{op}</span>); cmd = true; }
    else if (word) { out.push(<span key={k} className={cmd ? "text-[#f9e2af]" : undefined}>{word}</span>); if (word !== "=") cmd = false; }
    else out.push(t);
  }
  return <>{out}</>;
}

export function CopyCommand({ command, label = "Windows PowerShell" }: { command: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const cmd = /cmd/i.test(label);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-[#0e0e12] text-left text-[#cdd6f4] shadow-[0_1px_0_rgb(255_255_255/.06)_inset,0_24px_48px_-28px_rgb(0_0_0/.8)] dark:border-white/[.08]">
      <div className="flex h-10 items-center gap-2 border-b border-white/[.07] bg-white/[.025] pr-1.5 pl-3">
        <span className="flex h-7 items-center gap-2 rounded-md bg-white/[.06] px-2.5 text-xs text-[#bac2de]">
          <span className={clsx("grid size-4 place-items-center rounded-[4px] font-mono text-[9px] font-bold text-white", cmd ? "bg-[#45475a]" : "bg-[#2671be]")}>{cmd ? "C:" : ">_"}</span>
          {label}
        </span>
        <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy command"}
          className="ml-auto flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs text-[#a6adc8] transition-colors hover:bg-white/[.08] hover:text-white">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={copied ? "y" : "n"} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -6, opacity: 0 }} transition={{ duration: 0.14 }} className="flex items-center gap-1.5">
              {copied ? <><Check className="size-3.5 text-[#a6e3a1]" /> Copied</> : <><Copy className="size-3.5" /> Copy</>}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <div className="space-y-1 px-4 py-3.5 font-mono text-[13px] leading-6">
        {command.split("\n").map((line, n) => (
          <div key={n} className="grid grid-cols-[auto_1fr] gap-x-2.5">
            <span className="text-[#6c7086] select-none">{cmd ? ">" : "PS>"}</span>
            <code className="min-w-0 break-normal"><Highlight line={line} /></code>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange, id }: { tabs: { value: T; label: ReactNode }[]; value: T; onChange: (v: T) => void; id: string }) {
  return (
    <div role="tablist" className="inline-flex rounded-xl border border-line bg-panel p-1">
      {tabs.map(t => (
        <button
          key={t.value}
          role="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
          className={clsx("relative h-9 rounded-lg px-4 text-sm font-medium whitespace-nowrap transition-colors", value === t.value ? "text-fg" : "text-muted hover:text-fg")}
        >
          {value === t.value && (
            <motion.span layoutId={`tab-${id}`} className="absolute inset-0 rounded-lg bg-panel-2 shadow-[0_1px_0_var(--line-strong)_inset]" transition={{ type: "spring", bounce: 0.18, duration: 0.45 }} />
          )}
          <span className="relative flex items-center gap-2">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-xs tracking-wide text-faint uppercase">{children}</p>;
}

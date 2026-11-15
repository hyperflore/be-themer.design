import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface MenuItem {
  label: string;
  sub: string;
  href: string;
}

export function HoverMenu({ title, items, align = "left", children }: { title: string; items: MenuItem[]; align?: "left" | "right"; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div ref={ref} className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={e => { if (!ref.current?.contains(e.relatedTarget as Node | null)) setOpen(false); }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
            className={`absolute top-full z-50 w-72 pt-2 ${align === "right" ? "right-0" : "left-0"}`}>
            <div className="rounded-xl border border-line-strong bg-panel p-2 shadow-xl">
              <p className="px-2.5 pb-1.5 pt-1 text-xs font-medium text-faint">{title}</p>
              {items.map(item => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="block rounded-lg px-2.5 py-2 transition-colors hover:bg-panel-2">
                  <span className="block text-sm font-medium text-fg">{item.label}</span>
                  <span className="block text-xs text-muted">{item.sub}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

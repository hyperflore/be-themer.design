import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  AudioWaveform, Bell, ChevronDown, CircleHelp, Compass, Gem, Gift, Hash, Headphones, Heart, Leaf, Inbox, Library, MessagesSquare, Mic,
  MicVocal, Monitor, PhoneOff, Pin, Plus, Repeat, Search, Settings, Shuffle, Smile, Sticker, Users, Volume2,
} from "lucide-react";
import clsx from "clsx";
import { REPO } from "../data";

export type Look = { name: string; g1: string; g2: string; g3: string; base: string; accent: string; text: string; sub: string; roleA: string; roleB: string; wallpaper?: string };

export const LOOKS: Look[] = [
  { name: "Shards", wallpaper: "/wallpapers/shards.jpg", g1: "#3b5bdb", g2: "#a5b4fc", g3: "#1e293b", base: "8 10 22", accent: "#8ea2ff", text: "#eef1ff", sub: "#a3acd6", roleA: "#c4b5fd", roleB: "#93c5fd" },
  { name: "Dracula", g1: "#e11d48", g2: "#7c1d3a", g3: "#9333ea", base: "22 8 12", accent: "#ff4d6d", text: "#f7e8eb", sub: "#c39aa3", roleA: "#ff8fa3", roleB: "#d8b4fe" },
  { name: "Sakura", g1: "#ff5fa2", g2: "#8b5cf6", g3: "#fdba74", base: "24 14 28", accent: "#ff5fa2", text: "#f6e9f1", sub: "#c3a3b8", roleA: "#ff8cc0", roleB: "#c4b5fd" },
  { name: "Midnight", g1: "#5865f2", g2: "#06b6d4", g3: "#7c3aed", base: "10 13 28", accent: "#818cf8", text: "#e8ebff", sub: "#9aa3d1", roleA: "#a5b4fc", roleB: "#67e8f9" },
  { name: "Matcha", g1: "#10b981", g2: "#84cc16", g3: "#0ea5e9", base: "9 22 17", accent: "#34d399", text: "#e6f6ee", sub: "#93bba7", roleA: "#6ee7b7", roleB: "#bef264" },
  { name: "Ember", g1: "#f97316", g2: "#e11d48", g3: "#facc15", base: "26 14 10", accent: "#fb923c", text: "#fbeee6", sub: "#cfa892", roleA: "#fdba74", roleB: "#fda4af" },
  { name: "Mono", g1: "#a1a1aa", g2: "#52525b", g3: "#d4d4d8", base: "16 16 19", accent: "#e4e4e7", text: "#f4f4f5", sub: "#a1a1aa", roleA: "#f4f4f5", roleB: "#d4d4d8" },
];

type Person = { name: string; avatar: string; role: "roleA" | "roleB" | "text" };
export const NEONA: Person = { name: "Neona✱", avatar: "/avatars/neona.jpg", role: "roleA" };
export const HASTE: Person = { name: "haste", avatar: "/avatars/haste.jpg", role: "roleB" };
export const ME: Person = { name: "70ne", avatar: "/avatars/70ne.jpg", role: "text" };
const FRISTON: Person = { name: "Friston", avatar: "/avatars/friston.jpg", role: "text" };
export const KOKAIX9: Person = { name: "kokaix9", avatar: "/avatars/kokaix9.jpg", role: "text" };

export const REDD: Person = { name: "REDD", avatar: "/avatars/redd.jpg", role: "roleA" };
export const STXY: Person = { name: "Stxy", avatar: "/avatars/stxy.jpg", role: "roleB" };
const KABIR: Person = { name: "Doctor Kabir Singh", avatar: "/avatars/kabir.jpg", role: "text" };

export type Server = { name: string; icon: string; pixel?: boolean };
export const SERVER: Server = { name: "HyperCode", icon: "/servers/hypercode.png", pixel: true };
export const KOTHA: Server = { name: "Kotha", icon: "/servers/dog.jpg" };
const OTHER_SERVERS: (Server & { unread?: boolean })[] = [
  { name: "Dog House", icon: "/servers/dog.jpg", unread: true },
  { name: "Peak Season", icon: "/servers/peaks.jpg" },
  { name: "Skyline", icon: "/servers/city.jpg" },
];

export const SONG = { title: "Dracula (with JENNIE)", artist: "Tame Impala, JENNIE", cover: "/covers/dracula.jpg", length: 209 };

export type Msg = {
  by: Person; time: string; text?: React.ReactNode; embed?: boolean; sticker?: string; emoji?: string; reply?: { by: Person; text: string };
  old?: boolean;
  unreadSince?: string;
};

export function Mention({ children }: { children: string }) {
  return <span className="rounded-[3px] bg-[#5865f2]/30 px-0.5 font-medium text-[#c9cdfb]">@{children}</span>;
}

export const MESSAGES_KOTHA: Msg[] = [
  { by: KABIR, time: "12/11/2026 11:48 PM", old: true, text: <><Mention>kokaix9</Mention> <Mention>kokaix9</Mention> <Mention>kokaix9</Mention> <Mention>kokaix9</Mention> <Mention>kokaix9</Mention> <Mention>kokaix9</Mention></> },
  { by: KOKAIX9, time: "12/11/2026 11:51 PM", old: true, reply: { by: KABIR, text: "@kokaix9 @kokaix9 @kokaix9 @kokaix9 @kokaix9 @kokaix9" }, text: "bsdk raha nahi jata kya lode, bola 30 min" },
  { by: KABIR, time: "12/11/2026 11:52 PM", old: true, reply: { by: KOKAIX9, text: "bsdk raha nahi jata kya lode, bola 30 min" }, text: "kab aayega" },
  { by: REDD, time: "10:14 PM", unreadSince: "November 15, 2026", text: <><Mention>Stxy</Mention> kaha he? valo aayega</> },
  { by: STXY, time: "10:15 PM", reply: { by: REDD, text: "@Stxy kaha he? valo aayega" }, text: "valo hi hu" },
  { by: NEONA, time: "10:15 PM", emoji: "/emojis/neona.webp" },
  { by: ME, time: "10:16 PM", text: <><Mention>kokaix9</Mention> yooo</> },
];
export const MESSAGES: Msg[] = [
  { by: NEONA, time: "9:41 PM", text: "ok the new look is actually so clean" },
  { by: HASTE, time: "9:42 PM", text: "damn, which software did you actually use?" },
  {
    by: NEONA, time: "9:42 PM", embed: true,
    text: <>used the new BE-THEMER: <a href={REPO} target="_blank" rel="noreferrer" className="text-[#00a8fc] hover:underline">{REPO}</a></>,
  },
  { by: HASTE, time: "9:43 PM", text: "used gradient and glass?" },
  { by: NEONA, time: "9:43 PM", text: "yes, gradient: 60%" },
  { by: HASTE, time: "9:44 PM", text: "Cool!" },
];

export const MESSAGES_LATER: Msg[] = [
  { by: NEONA, time: "11:02 PM", text: "bacche kaha mar gaya" },
  { by: HASTE, time: "11:03 PM", text: "hag kar aaya 2 min" },
  { by: NEONA, time: "11:03 PM", text: "are bsdk" },
  { by: ME, time: "11:04 PM", sticker: "/stickers/sticker.webp" },
];

export type Layer = "wallpaper" | "glass" | "ui" | "widgets" | "chat";

export type Tweak = { look: Look; gradient: number; glass: number };
type WindowProps = Tweak & { messages?: Msg[]; still?: boolean; only?: Layer; wallpaper?: string; lite?: boolean; server?: Server; voice?: Person[]; members?: React.ReactNode };

export function DiscordWindow({ look, gradient, glass, messages = MESSAGES, still, only, wallpaper, lite, server = SERVER, voice = [NEONA, ME, FRISTON], members }: WindowProps) {
  const others: (Server & { unread?: boolean })[] = [SERVER, ...OTHER_SERVERS].filter(s => s.icon !== server.icon);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const visible = useInView(ref, { margin: "100px" });
  const live = seen && visible && !still;
  const show = (k: Layer) => !only || only === k;
  const ui = show("ui") ? "" : "invisible";
  const line = show("glass") ? "border-white/[.07]" : "border-transparent";
  const rule = show("glass") || show("ui") ? "border-white/[.07]" : "border-transparent";
  const g = gradient / 100;
  const surface = (k: number) => `rgb(${look.base} / ${Math.min(0.97, (0.96 - (glass / 100) * 0.62) * k).toFixed(3)})`;
  const blur = `blur(${Math.round(6 + glass * 0.22)}px) saturate(1.3)`;
  const frost = lite ? {} : { backdropFilter: blur, WebkitBackdropFilter: blur };
  const glassStyle = (k: number) => (show("glass") ? { background: surface(k), ...frost } : { background: "transparent" });
  const vars = { "--accent": look.accent, "--text": look.text, "--sub": look.sub, "--roleA": look.roleA, "--roleB": look.roleB } as React.CSSProperties;
  const ease = "transition-[background-color,color,border-color,backdrop-filter] duration-500";

  const wp = wallpaper ?? look.wallpaper;
  return (
    <div ref={ref} style={{ ...vars, color: "var(--text)", background: show("wallpaper") ? `rgb(${look.base})` : "transparent" }} className={clsx("relative isolate flex h-full flex-col overflow-hidden text-left select-none", ease)}>
      {show("wallpaper") && wp && <>
        <img aria-hidden src={wp} alt="" className="absolute inset-0 -z-10 size-full object-cover" draggable={false} />
        <div aria-hidden className="absolute inset-0 -z-10 transition-colors duration-300" style={{ background: `rgb(${look.base} / ${(0.7 - g * 0.55).toFixed(2)})` }} />
      </>}
      {show("wallpaper") && !wp && <>
        <div aria-hidden className="absolute inset-0 -z-10 transition-opacity duration-500" style={{
          opacity: 0.25 + g * 0.95,
          background: `radial-gradient(55% 65% at 8% 0%, ${look.g1}, transparent 70%), radial-gradient(50% 60% at 100% 15%, ${look.g2}, transparent 70%), radial-gradient(60% 55% at 65% 110%, ${look.g3}, transparent 72%)`,
        }} />
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: `rgb(${look.base} / .35)` }} />
      </>}

      <div className={clsx("relative flex h-8 shrink-0 items-center px-3 text-[12px]", ui)}>
        <div className="flex gap-2" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f57]" /><span className="size-3 rounded-full bg-[#febc2e]" /><span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="absolute inset-x-0 mx-auto flex w-fit items-center gap-1.5 font-medium">
          <img src={server.icon} alt="" className={clsx("size-4 rounded-[5px] object-cover", server.pixel && "[image-rendering:pixelated]")} /> {server.name}
        </div>
        <div className="ml-auto flex items-center gap-3 opacity-70"><Inbox className="size-4" /><CircleHelp className="size-4" /></div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="relative hidden w-[312px] shrink-0 flex-col md:flex">
          <div className="flex min-h-0 flex-1">
            <div className={clsx("flex w-[64px] shrink-0 flex-col items-center gap-2 overflow-hidden pt-1", ui)}>
              <RailIcon><img src="/logo-64.png" alt="" className="size-7 rounded-lg" /></RailIcon>
              <div className="my-0.5 h-0.5 w-7 shrink-0 rounded-full bg-white/10" />
              <div className="relative shrink-0">
                <span className="absolute top-1/2 -left-[10px] h-9 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                <img src={server.icon} alt={server.name} className={clsx("size-11 rounded-[14px] object-cover", server.pixel && "[image-rendering:pixelated]")} />
              </div>
              {others.map(s => (
                <div key={s.name} className="relative shrink-0">
                  {s.unread && <span className="absolute top-1/2 -left-[10px] h-2 w-1 -translate-y-1/2 rounded-r-full bg-white" />}
                  <img src={s.icon} alt={s.name} className={clsx("size-11 rounded-full object-cover", s.pixel && "[image-rendering:pixelated]")} />
                </div>
              ))}
              <RailIcon className="text-[#23a55a]"><Plus className="size-5" /></RailIcon>
              <RailIcon className="text-[#23a55a]"><Compass className="size-5" /></RailIcon>
            </div>

            <div className={clsx("flex min-w-0 flex-1 flex-col overflow-hidden rounded-tl-[10px] border-t border-l", line, ease)} style={glassStyle(1)}>
              <div className={clsx("flex h-12 shrink-0 items-center justify-between border-b px-4 text-[14px] font-semibold", rule)}>
                <span className={clsx("flex w-full items-center justify-between", ui)}>{server.name} <ChevronDown className="size-4 opacity-70" /></span>
              </div>
              <div className={clsx("min-h-0 flex-1 overflow-hidden px-2 pt-1 text-[14px]", ui)}>
                <Category label="Text Channels" />
                {["general", "screenshots", "music"].map((c, n) => (
                  <Row key={c} icon={<Hash className="size-[18px]" />} label={c} active={n === 0} dim={n > 1} />
                ))}
                <Category label="Voice Channels" />
                <Row icon={<Volume2 className="size-[18px]" />} label="Lounge" />
                {voice.map(p => (
                  <div key={p.name} className="flex items-center gap-2 py-[3px] pl-8 text-[13px]" style={{ color: p === ME ? "var(--text)" : "var(--sub)" }}>
                    <span className={clsx("rounded-full", p === NEONA && "ring-2 ring-[#23a55a]")}><Avatar src={p.avatar} size={22} /></span>
                    {p.name}
                  </div>
                ))}
              </div>
              <div className="h-[262px] shrink-0" />
            </div>
          </div>

          <div className={clsx("absolute inset-x-2 bottom-2 overflow-hidden rounded-[10px] border border-white/[.09] shadow-[0_8px_24px_rgb(0_0_0/.35)]", ease, !show("widgets") && "invisible")}
            style={{ background: surface(1.25), ...frost }}>
            <SpotifyWidget live={live} />
            <VoiceConnected />
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Avatar src={ME.avatar} size={32} status="online" />
              <div className="min-w-0 flex-1 text-[13px] leading-tight">
                <div className="font-semibold">{ME.name}</div>
                <div className="text-[11px]" style={{ color: "var(--sub)" }}>Online</div>
              </div>
              <div className="flex opacity-80">
                <span className="grid size-7 place-items-center"><Mic className="size-4" /></span>
                <span className="grid size-7 place-items-center"><Headphones className="size-4" /></span>
                <span className="grid size-7 place-items-center"><Settings className="size-4" /></span>
              </div>
            </div>
          </div>
        </div>

        <div className={clsx("flex min-w-0 flex-1 flex-col border-t", line, ease)} style={glassStyle(0.6)}>
          <div className={clsx("flex h-12 shrink-0 items-center border-b px-4", rule)}>
            <div className={clsx("flex w-full items-center gap-2", ui)}>
              <Hash className="size-5 shrink-0 opacity-60" />
              <span className="text-[15px] font-semibold">general</span>
              <span className="mx-1 hidden h-5 w-px bg-white/15 lg:block" />
              <span className="hidden truncate text-[13px] lg:block" style={{ color: "var(--sub)" }}>show off your setup</span>
              <div className="ml-auto flex items-center gap-4 opacity-75">
                <MessagesSquare className="hidden size-5 sm:block" /><Bell className="hidden size-5 sm:block" /><Pin className="hidden size-5 sm:block" /><Users className="size-5" />
                <div className="hidden h-6 w-36 items-center justify-between rounded bg-black/30 px-2 text-[12px] xl:flex" style={{ color: "var(--sub)" }}>
                  Search <Search className="size-3.5" />
                </div>
              </div>
            </div>
          </div>

          <Chat live={live} messages={messages} still={still} showChat={show("chat")} showUi={show("ui")} />
        </div>

        <div className={clsx("hidden shrink-0 overflow-hidden border-t xl:block", members ? "w-[256px]" : "w-[232px]", line, ease)} style={glassStyle(0.85)}>
          {members ? <div className={ui}>{members}</div> : <div className={clsx("px-2 pt-5", ui)}>
            <p className="px-2 text-[12px] font-semibold tracking-wide uppercase" style={{ color: "var(--sub)" }}>Online — 4</p>
            <div className="mt-2 space-y-0.5">
              <Member who={NEONA} status="online" activity="Playing VALORANT" />
              <Member who={HASTE} status="idle" activity="Playing Minecraft" />
              <Member who={ME} status="online" activity="Listening to Spotify" />
              <Member who={FRISTON} status="idle" tag={{ text: "CODE", icon: "leaf" }}
                activity={<span className="flex items-center gap-1"><Volume2 className="size-3.5 text-[#23a55a]" /> In voice</span>} />
            </div>
            <p className="mt-6 px-2 text-[12px] font-semibold tracking-wide uppercase" style={{ color: "var(--sub)" }}>Offline — 1</p>
            <div className="mt-2 opacity-45">
              <Member who={KOKAIX9} status="offline" tag={{ text: "BM", icon: "gem" }} />
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function SpotifyWidget({ live }: { live: boolean }) {
  const [t, setT] = useState(71);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setT(s => (s + 1) % SONG.length), 1000);
    return () => clearInterval(id);
  }, [live]);
  const pct = `${(t / SONG.length) * 100}%`;
  const ib = "grid size-6 shrink-0 place-items-center rounded-full opacity-80";

  return (
    <div className="border-b border-white/[.08] px-2.5 pt-2.5 pb-2 text-[#dbdee1]">
      <div className="flex items-center gap-1.5">
        <img src={SONG.cover} alt="" className="size-11 shrink-0 rounded-md object-cover shadow-[0_2px_8px_rgb(0_0_0/.4)]" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-tight">
          <Marquee run={live} className="text-[14px] font-semibold text-[#f2f3f5]">{SONG.title}</Marquee>
          <Marquee run={live} className="text-[12px] text-[#949ba4]">{SONG.artist}</Marquee>
        </div>
        <span className={clsx(ib, "text-[#1ed760] opacity-100")}><Heart className="size-[17px]" fill="currentColor" /></span>
        <span className={ib}><MicVocal className="size-[17px]" /></span>
        <span className={ib}><Library className="size-[17px]" /></span>
        <span className={ib}><ChevronDown className="size-[17px] rotate-180" /></span>
      </div>
      <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-[#949ba4] tabular-nums">
        <span>{fmt(t)}</span>
        <div className="relative h-1 flex-1 rounded-full bg-white/[.16]">
          <div className="absolute inset-y-0 left-0 rounded-full bg-[#b5bac1] transition-[width] duration-1000 ease-linear" style={{ width: pct }} />
        </div>
        <span>{fmt(SONG.length)}</span>
      </div>
      <div className="mt-1 grid grid-cols-5 place-items-center">
        <span className="relative grid size-8 place-items-center text-[#1ed760]"><Shuffle className="size-4" /><span className="absolute bottom-0.5 size-1 rounded-full bg-current" /></span>
        <span className="grid size-8 place-items-center"><Glyph d={ICON.prev} className="size-5" /></span>
        <span className="grid size-[34px] place-items-center rounded-full bg-[#f2f3f5] text-[#111214] shadow-[0_2px_6px_rgb(0_0_0/.3)]"><Glyph d={ICON.pause} className="size-[18px]" /></span>
        <span className="grid size-8 place-items-center"><Glyph d={ICON.next} className="size-5" /></span>
        <span className="grid size-8 place-items-center opacity-80"><Repeat className="size-4" /></span>
      </div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <Volume2 className="size-4 shrink-0 opacity-80" />
        <div className="relative h-1 flex-1 rounded-full bg-white/[.16]"><div className="absolute inset-y-0 left-0 w-[64%] rounded-full bg-[#1ed760]" /></div>
        <span className="w-8 text-right font-mono text-[11px] text-[#949ba4]">64%</span>
      </div>
      <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[#1ed760]">
        70NE-PC <Monitor className="size-3.5 text-[#b5bac1]" />
      </div>
    </div>
  );
}

function Marquee({ children, className, run = true }: { children: string; className?: string; run?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setOver(Math.max(0, (el.firstElementChild as HTMLElement).scrollWidth - el.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);
  return (
    <div ref={box} className={clsx("overflow-hidden whitespace-nowrap", over > 0 && "[mask-image:linear-gradient(to_right,#000_85%,transparent)]", className)}>
      <motion.span className="inline-block" animate={over && run ? { x: [0, 0, -over - 8, -over - 8, 0] } : { x: 0 }}
        transition={over ? { duration: 4 + over / 20, times: [0, 0.25, 0.55, 0.8, 1], repeat: Infinity, ease: "easeInOut" } : undefined}>
        {children}
      </motion.span>
    </div>
  );
}

function VoiceConnected() {
  return (
    <div className="flex items-center gap-2 border-b border-white/[.08] px-2.5 py-2">
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-[#23a55a]" fill="currentColor" aria-hidden>
        <rect x="3" y="15" width="3.5" height="6" rx="1" /><rect x="10.25" y="10" width="3.5" height="11" rx="1" /><rect x="17.5" y="4" width="3.5" height="17" rx="1" />
      </svg>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="text-[13px] font-semibold text-[#23a55a]">Voice Connected</div>
        <div className="truncate text-[11px]" style={{ color: "var(--sub)" }}>Lounge / {SERVER.name}</div>
      </div>
      <span className="grid size-7 place-items-center opacity-80"><AudioWaveform className="size-4" /></span>
      <span className="grid size-7 place-items-center opacity-80"><PhoneOff className="size-4" /></span>
    </div>
  );
}

function Chat({ live, messages, still, showChat, showUi }: { live: boolean; messages: Msg[]; still?: boolean; showChat: boolean; showUi: boolean }) {
  const reduce = useReducedMotion();
  const all = !!(reduce || still);
  const firstNew = Math.max(0, messages.findIndex(m => !m.old));
  const [shown, setShown] = useState(all ? messages.length : firstNew + 1);

  useEffect(() => {
    if (all) { setShown(messages.length); return; }
    if (!live || shown >= messages.length) return;
    const t = setTimeout(() => setShown(s => s + 1), shown === firstNew + 1 ? 900 : 1600);
    return () => clearTimeout(t);
  }, [live, shown, all, messages.length, firstNew]);

  const next = messages[shown];
  return (
    <>
      <div className={clsx("relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden pb-10 [mask-image:linear-gradient(to_bottom,transparent,#000_56px)]", !showChat && "invisible")}>
        {messages.slice(0, shown).map((m, n) => (
          <motion.div key={n} layout="position" initial={all || m.old ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 px-4 py-0.5">
            {m.unreadSince && (
              <div role="separator" aria-label="New messages" className="relative mb-4 flex items-center">
                <span className="h-px flex-1 bg-[#f23f43]" />
                <span className="px-2 text-[12px] font-semibold text-[#f23f43]">{m.unreadSince}</span>
                <span className="h-px flex-1 bg-[#f23f43]" />
                <span className="-ml-px rounded-r-[3px] bg-[#f23f43] pr-1 pl-1.5 text-[10px] leading-[14px] font-bold text-white [clip-path:polygon(4px_0,100%_0,100%_100%,4px_100%,0_50%)]">NEW</span>
              </div>
            )}
            {m.reply && (
              <div className="relative mb-1 flex items-center gap-1.5 pl-[56px] text-[13px]">
                <span aria-hidden className="absolute top-1/2 left-[19px] h-[9px] w-[30px] rounded-tl-md border-t-2 border-l-2 border-white/25" />
                <Avatar src={m.reply.by.avatar} size={16} />
                <span className="font-medium" style={{ color: `var(--${m.reply.by.role})` }}>{m.reply.by.name}</span>
                <span className="truncate" style={{ color: "var(--sub)" }}>{m.reply.text}</span>
              </div>
            )}
            <div className="flex gap-4">
            <Avatar src={m.by.avatar} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[15px] font-medium" style={{ color: `var(--${m.by.role})` }}>{m.by.name}</span>
                <span className="text-[11px]" style={{ color: "var(--sub)" }}>{m.old ? m.time : `Today at ${m.time}`}</span>
              </div>
              {m.text && <p className="text-[14.5px] leading-[1.375] break-words opacity-95">{m.text}</p>}
              {m.sticker && <img src={m.sticker} alt="Sticker" width={160} height={160} className="mt-1 size-[160px] object-contain" draggable={false} />}
              {m.emoji && <img src={m.emoji} alt=":emoji:" width={48} height={48} className="mt-0.5 size-12 object-contain" draggable={false} />}
              {m.embed && <GithubEmbed />}
            </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative shrink-0 px-4 pb-4">
        <div className={clsx("absolute inset-x-4 -top-[22px] flex h-[22px] items-center px-1 text-[12px]", !showChat && "invisible")} aria-live="polite">
          <AnimatePresence>
            {next && live && (
              <motion.div key={shown} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ delay: 0.2 }} className="flex items-center gap-1.5">
                <span className="flex gap-0.5">{[0, 1, 2].map(d => (
                  <motion.span key={d} className="size-1.5 rounded-full bg-current" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }} />
                ))}</span>
                <span><b className="font-semibold">{next.by.name}</b> <span style={{ color: "var(--sub)" }}>is typing…</span></span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className={clsx("flex h-11 items-center gap-3 rounded-lg bg-black/25 px-3.5 text-[14px]", !showUi && "invisible")}>
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/70 text-black/80"><Plus className="size-4" strokeWidth={3} /></span>
          <span className="min-w-0 flex-1 truncate" style={{ color: "var(--sub)" }}>Message #general</span>
          <div className="flex items-center gap-3.5 opacity-75">
            <Gift className="hidden size-5 sm:block" />
            <span className="hidden rounded-[4px] border-2 border-current px-0.5 text-[9px] leading-none font-extrabold sm:block">GIF</span>
            <Sticker className="hidden size-5 sm:block" />
            <Smile className="size-5" />
          </div>
        </div>
      </div>
    </>
  );
}

function GithubEmbed() {
  return (
    <div className="mt-1.5 flex max-w-[432px] gap-4 rounded-[4px] border-l-4 border-white/20 bg-black/25 py-2.5 pr-3 pl-3">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] opacity-70">GitHub</p>
        <p className="mt-1 text-[14px] leading-snug font-semibold text-[#00a8fc]">GitHub - hyperflore/Be-Themer</p>
        <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug opacity-85">
          A Discord desktop client mod for Windows: glass themes, wallpapers, per-server looks, a theme maker, custom loading screens and optional plugins.
        </p>
      </div>
      <img src="/logo-64.png" alt="" className="size-16 shrink-0 rounded-md" />
    </div>
  );
}

const ICON = {
  pause: <><rect x="6" y="4.5" width="4" height="15" rx="1.2" /><rect x="14" y="4.5" width="4" height="15" rx="1.2" /></>,
  prev: <><path d="M18.5 5.2v13.6a.8.8 0 0 1-1.25.66L8.6 12.66a.8.8 0 0 1 0-1.32l8.65-6.8a.8.8 0 0 1 1.25.66Z" /><rect x="4.5" y="5" width="2.6" height="14" rx="1.3" /></>,
  next: <><path d="M5.5 5.2v13.6a.8.8 0 0 0 1.25.66l8.65-6.8a.8.8 0 0 0 0-1.32L6.75 4.54a.8.8 0 0 0-1.25.66Z" /><rect x="16.9" y="5" width="2.6" height="14" rx="1.3" /></>,
};
function Glyph({ d, className }: { d: React.ReactNode; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>{d}</svg>;
}

export type Status = "online" | "idle" | "dnd" | "offline";

function StatusMark({ status }: { status: Status }) {
  const c = { online: "#23a55a", idle: "#f0b232", dnd: "#f23f43", offline: "#80848e" }[status];
  return (
    <span className="absolute -right-0.5 -bottom-0.5 rounded-full p-[2.5px]" style={{ background: "rgb(0 0 0 / .6)" }}>
      <svg viewBox="0 0 10 10" className="block size-[9px]" aria-hidden>
        {status === "online" && <circle cx="5" cy="5" r="5" fill={c} />}
        {status === "idle" && <path d="M5 0a5 5 0 1 1-5 5 3.6 3.6 0 1 0 5-5Z" fill={c} />}
        {status === "dnd" && <><circle cx="5" cy="5" r="5" fill={c} /><rect x="2" y="4" width="6" height="2" rx="1" fill="#000" fillOpacity=".6" /></>}
        {status === "offline" && <circle cx="5" cy="5" r="3.4" fill="none" stroke={c} strokeWidth="2.6" />}
      </svg>
    </span>
  );
}

export function Avatar({ src, color, size, status }: { src?: string; color?: string; size: number; status?: Status }) {
  return (
    <span className="relative block shrink-0" style={{ width: size, height: size }}>
      {src ? <img src={src} alt="" width={size} height={size} className="size-full rounded-full object-cover" draggable={false} />
        : <span className="block size-full rounded-full" style={{ background: color }} />}
      {status && <StatusMark status={status} />}
    </span>
  );
}

function Tag({ text, icon }: { text: string; icon: "leaf" | "gem" }) {
  return (
    <span className="inline-flex h-[18px] shrink-0 items-center gap-1 rounded-[5px] bg-white/[.09] px-1.5 text-[11px] leading-none font-semibold tracking-wide text-[#dbdee1]">
      {icon === "leaf" ? <Leaf className="size-3 fill-[#3ba55d] text-[#2d7d46]" /> : <Gem className="size-3 text-[#9fb2c8]" />}
      {text}
    </span>
  );
}

function Member({ who, status, activity, tag }: { who: Person; status: Status; activity?: React.ReactNode; tag?: { text: string; icon: "leaf" | "gem" } }) {
  return (
    <div className="flex items-center gap-3 rounded px-2 py-1.5">
      <Avatar src={who.avatar} size={32} status={status} />
      <div className="min-w-0 leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[14px] font-medium" style={{ color: `var(--${who.role})` }}>{who.name}</span>
          {tag && <Tag {...tag} />}
        </div>
        {activity && <div className="mt-0.5 truncate text-[11px]" style={{ color: "var(--sub)" }}>{activity}</div>}
      </div>
    </div>
  );
}

function RailIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("grid size-11 shrink-0 place-items-center rounded-full bg-white/[.07]", className)}>{children}</div>;
}

function Category({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-0.5 px-0.5 pt-3 pb-1 text-[12px] font-semibold tracking-wide uppercase" style={{ color: "var(--sub)" }}>
      <ChevronDown className="size-3" /> {label}
    </div>
  );
}

function Row({ icon, label, active, dim }: { icon: React.ReactNode; label: string; active?: boolean; dim?: boolean }) {
  return (
    <div className={clsx("flex h-7 items-center gap-1.5 rounded-md px-2", active && "bg-white/[.12] font-medium")} style={{ color: active ? "var(--text)" : "var(--sub)", opacity: dim ? 0.75 : 1 }}>
      <span className="opacity-70">{icon}</span> {label}
    </div>
  );
}

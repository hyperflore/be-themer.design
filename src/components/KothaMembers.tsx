import { ChevronRight, Droplet, Flame, Gamepad2, Gem, Music2, Settings, Shapes, Trophy, Zap } from "lucide-react";
import { siRoblox } from "simple-icons";
import { Avatar, type Status } from "./DiscordMock";

const A = (n: string) => `/avatars/kotha/${n}.jpg`;

type Tag = { text: string; icon: "gem" | "bolt" | "drop" | "blend" };
type Row = { name: string; avatar?: string; status: Status; color: string; sub?: React.ReactNode; tag?: Tag; plate?: string; bot?: boolean };

const ROWS: { group: string; rows: Row[] }[] = [
  { group: "Gaylan", rows: [
    { name: "dollar paglu", avatar: A("dollar"), status: "dnd", color: "#f0a35b", plate: "#1d3c8a", sub: <><Gamepad2 className="size-3" /> Marvel Rivals</> },
  ] },
  { group: "Kotha security", rows: [
    { name: "Kotha's gatekeeper", avatar: "/servers/dog.jpg", status: "online", color: "#5fd3b8", bot: true },
  ] },
  { group: "Homies", rows: [
    { name: "Anish", avatar: A("anish"), status: "dnd", color: "#5ab1f5", plate: "#5b6650", sub: "Zangetsu The Beast" },
    { name: "CALAMITY", avatar: A("calamity"), status: "dnd", color: "#3ea6ff" },
    { name: "Firefly-SL", avatar: A("firefly"), status: "dnd", color: "#9fd4ff", sub: "Dream bigger, regret bigger", tag: { text: "blend", icon: "blend" } },
    { name: "genoscu", avatar: A("genoscu"), status: "dnd", color: "#7cc4ff", plate: "#2a2a2e", sub: "larping optimisim" },
    { name: "Kotha's Hijra (j s…", avatar: A("hijra"), status: "idle", color: "#6fa8ff", plate: "#3b1f5e", tag: { text: "F1", icon: "bolt" } },
    { name: "Kuseru", status: "dnd", color: "#7cc4ff", sub: <><Music2 className="size-3" /> WAILT</> },
    { name: "LEGEND77", avatar: A("legend"), status: "online", color: "#5ab1f5", tag: { text: "CYPH", icon: "drop" } },
    { name: "Purgify", avatar: A("levi"), status: "dnd", color: "#3ea6ff", plate: "#4a1d6b" },
    { name: "Stxy", avatar: "/avatars/stxy.jpg", status: "dnd", color: "#5ab1f5", plate: "#1d2f6b", sub: <><Gamepad2 className="size-3" /> VALORANT</>, tag: { text: "BM", icon: "gem" } },
    { name: "Zaki", avatar: A("zaki"), status: "dnd", color: "#7cc4ff", sub: "can ring for scrims" },
  ] },
];

const ACTIVITY = [
  { who: "strife", whoColor: "#5ab1f5", avatar: undefined, title: "Roblox", meta: <><Gamepad2 className="size-3" /> 1d ago <Flame className="ml-1 size-3" /> Trending</>, art: "roblox" as const },
  { who: "kokai", whoColor: "#f0a35b", avatar: "/avatars/kokaix9.jpg", title: "yung kai", meta: <><Trophy className="size-3" /> 14 tracks this week</>, art: "music" as const },
  { who: "Stxy", whoColor: "#5ab1f5", avatar: "/avatars/stxy.jpg", title: "Whiteboard", meta: <><Shapes className="size-3" /> 3d ago</>, art: "board" as const },
];

export function KothaMembers() {
  return (
    <div className="h-full overflow-hidden px-2 pt-3 text-[13px]">
      <div className="mb-3 flex h-8 items-center rounded-md bg-black/30 px-2.5 text-[13px]" style={{ color: "var(--sub)" }}>Search Kotha</div>

      <div className="flex items-center gap-1.5 px-1.5 text-[13px] font-semibold" style={{ color: "var(--text)" }}>
        Activity — 16 <Settings className="size-3 opacity-70" /><ChevronRight className="ml-auto size-4 opacity-70" />
      </div>
      <div className="mt-2 space-y-1.5">
        {ACTIVITY.map(a => (
          <div key={a.who} className="flex items-center gap-2 rounded-lg border border-white/[.06] bg-black/25 p-2">
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-1.5">
                {a.avatar ? <img src={a.avatar} alt="" className="size-4 rounded-full object-cover" /> : <span className="size-4 rounded-full bg-[#c0392b]" />}
                <span className="truncate text-[12px] font-medium" style={{ color: a.whoColor }}>{a.who}</span>
              </div>
              <p className="mt-1 truncate text-[13px] font-semibold">{a.title}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px]" style={{ color: "var(--sub)" }}>{a.meta}</p>
            </div>
            <ActivityArt kind={a.art} />
          </div>
        ))}
      </div>

      {ROWS.map(g => (
        <div key={g.group} className="mt-4">
          <p className="px-1.5 text-[13px] font-semibold" style={{ color: "var(--text)" }}>{g.group} — {g.rows.length}</p>
          <div className="mt-1 space-y-px">
            {g.rows.map(r => <MemberRow key={r.name} r={r} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function MemberRow({ r }: { r: Row }) {
  return (
    <div className="relative flex h-[42px] items-center gap-2.5 overflow-hidden rounded-md px-1.5"
      style={r.plate ? { background: `linear-gradient(to right, transparent 35%, ${r.plate})` } : undefined}>
      {r.avatar ? <Avatar src={r.avatar} size={32} status={r.status} /> : <Avatar color="#4e5058" size={32} status={r.status} />}
      <div className="relative min-w-0 flex-1 leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[14px] font-medium" style={{ color: r.color }}>{r.name}</span>
          {r.bot && <span className="rounded-[4px] bg-[#5865f2] px-1 text-[10px] leading-4 font-semibold text-white">APP</span>}
          {r.tag && <ServerTag {...r.tag} />}
        </div>
        {r.sub && <div className="mt-0.5 flex items-center gap-1 truncate text-[11px]" style={{ color: "var(--sub)" }}>{r.sub}</div>}
      </div>
    </div>
  );
}

function ServerTag({ text, icon }: Tag) {
  const Icon = icon === "gem" ? Gem : icon === "bolt" ? Zap : icon === "drop" ? Droplet : Shapes;
  const c = icon === "bolt" ? "#f23f43" : icon === "drop" ? "#5ab1f5" : icon === "blend" ? "#c9a227" : "#9fb2c8";
  return (
    <span className="inline-flex h-[17px] shrink-0 items-center gap-0.5 rounded-[4px] bg-white/[.1] px-1 text-[10px] font-semibold text-[#dbdee1]">
      <Icon className="size-2.5" style={{ color: c }} fill={icon === "bolt" ? c : "none"} />{text}
    </span>
  );
}

function ActivityArt({ kind }: { kind: "roblox" | "music" | "board" }) {
  if (kind === "roblox") {
    return (
      <span className="grid size-11 shrink-0 place-items-center rounded-md bg-[#e8e8e8]">
        <svg viewBox="0 0 24 24" className="size-6" fill="#1b1b1b" aria-hidden><path d={siRoblox.path} /></svg>
      </span>
    );
  }
  if (kind === "music") {
    return <span className="grid size-11 shrink-0 place-items-center rounded-md bg-[#5d7a52] text-white/90"><Music2 className="size-5" /></span>;
  }
  return <span className="grid size-11 shrink-0 place-items-center rounded-md bg-[#f2f3f5] text-[#4f6bff]"><Shapes className="size-5" /></span>;
}

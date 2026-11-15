import { Activity, AppWindow, AtSign, AudioLines, BellOff, Calculator, Cat, Clapperboard, Clock, Copy, ExternalLink, EyeOff, FileLock2, Flower2, Gem, Globe, Highlighter, History, Image, Keyboard, Languages, Link, Link2, MessageSquareText, Mic, MonitorSmartphone, Moon, MousePointerClick, PanelLeftClose, PenLine, Pin, Quote, Replace, ShieldOff, ShoppingBag, Smile, Sparkles, Sticker, Terminal, Timer, Trash2, UserMinus, Users, UserX, Volume2, Wrench, Zap, ZoomIn, type LucideIcon } from "lucide-react";
import { siGoogletranslate, siKick, siSpotify, siTwitch, siYoutube, type SimpleIcon } from "simple-icons";
import type { Category, Plugin } from "../data";

export const TINT: Record<Category, string> = {
  Widgets: "#a78bfa", Chat: "#7dd3fc", Voice: "#5eead4", Privacy: "#86efac", Look: "#ff5fa2", Tools: "#fdba74",
};
export const BLURB: Record<Category, string> = {
  Widgets: "Players and a browser docked above your user panel.",
  Chat: "Reading, sending and tidying messages.",
  Voice: "Calls, timers, narration and sound.",
  Privacy: "Less of you sent to Discord and to others.",
  Look: "Window chrome, effects and tidy-ups.",
  Tools: "Recording, status, shortcuts and utilities.",
};

export type Brand = { icon: SimpleIcon; ink: string };
export const BRAND: Record<string, Brand> = {
  "Spotify Controls": { icon: siSpotify, ink: "#000" },
  YouTube: { icon: siYoutube, ink: "#fff" },
  Twitch: { icon: siTwitch, ink: "#fff" },
  Kick: { icon: siKick, ink: "#000" },
  "Translate Selection": { icon: siGoogletranslate, ink: "#fff" },
};

export const ICON: Record<string, LucideIcon> = {
  Lazy: Globe, Owlie: Clapperboard, Calculate: Calculator, "DMS Saaf": Trash2, Meow: Mic, "Fake Nitro": Gem,
  "Message Logger": History, "Silent Typing": Keyboard, "No Track": ShieldOff, "Clear URLs": Link2, "Anonymise File Names": FileLock2,
  "Custom Activity": Activity, "Custom Idle": Moon, "Call Timer": Timer, "Voice Narrator": AudioLines, "Voice Double-Click": MousePointerClick,
  "Notification Volume": Volume2, "Chat Tools": MessageSquareText, "Copy Raw Message": Copy, Emoji: Smile, "Exact Timestamps": Clock,
  "Keyword Highlight": Highlighter, "Message Click Actions": MousePointerClick, "Message Link Embeds": Link, "No Blocked Messages": UserX,
  "No Reply Mention": AtSign, "Silent Message Toggle": BellOff, "Text Replace": Replace, "Typing Indicator": PenLine, "Who Reacted": Users,
  "Pin DMs": Pin, "Relationship Notifier": UserMinus, "Handy Actions": Zap, "Link Tools": ExternalLink, "Media Tools": Image,
  "Image Zoom": ZoomIn, "Member Count": Users, "Platform Indicators": MonitorSmartphone, "Username Tools": AtSign, "Console Janitor": Terminal,
  "Keyboard Tweaks": Keyboard, Macmize: AppWindow, "Compact Server List": PanelLeftClose, "Hide Nitro & Shop": ShoppingBag,
  "Loading Quotes": Quote, "Sakura Petals": Flower2, "Screen Effects": Sparkles, "Cursor Pet": Cat, "Small Fixes": Wrench,
  Stickers: Sticker, "No Taskbar Badge": EyeOff, "Translate Selection": Languages,
};

export function Mark({ p, size = 36 }: { p: Plugin; size?: number }) {
  const brand = BRAND[p.name];
  if (brand) {
    return (
      <span className="grid shrink-0 place-items-center rounded-[10px]" style={{ width: size, height: size, background: `#${brand.icon.hex}` }}>
        <svg viewBox="0 0 24 24" style={{ width: size * 0.5, height: size * 0.5 }} fill={brand.ink} aria-hidden><path d={brand.icon.path} /></svg>
      </span>
    );
  }
  const Icon = ICON[p.name] ?? Wrench;
  const c = TINT[p.category];
  return (
    <span className="grid shrink-0 place-items-center rounded-[10px] border" style={{ width: size, height: size, color: c, borderColor: `color-mix(in srgb, ${c} 30%, transparent)`, background: `color-mix(in srgb, ${c} 10%, transparent)` }}>
      <Icon style={{ width: size * 0.45, height: size * 0.45 }} strokeWidth={1.75} />
    </span>
  );
}


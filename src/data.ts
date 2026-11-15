export const REPO = "https://github.com/hyperflore/Be-Themer";
export const RELEASES = `${REPO}/releases`;
export const LATEST = `${REPO}/releases/latest`;
export const DL = {
  installer: `${REPO}/releases/latest/download/BeThemerInstaller.exe`,
  cli: `${REPO}/releases/latest/download/BeThemerInstallerCli.exe`,
  sums: `${REPO}/releases/latest/download/SHA256SUMS.txt`,
};
export const DISCORD = "https://discord.gg/PG5ZFGCw4";
export const EMAIL = "bethemer.contact@gmail.com";
export const VERSION = "2.2.0";

export const FUNC_REPO = "https://github.com/hyperflore/Be-Func";
export const STYLER_REPO = "https://github.com/hyperflore/Be-Styler";
export const CORE_REPO = "https://github.com/hyperflore/Be-Core";
export const BUILDS = [
  {
    id: "themer",
    name: "Be Themer",
    repo: REPO,
    installer: "BeThemerInstaller.exe",
    cli: "BeThemerInstallerCli.exe",
    summary: "Everything: the theme engine, all 56 plugins, the splash screen and custom CSS.",
    includes: ["Theme engine: colours, wallpapers, glass, server themes and Theme Maker", "All 56 plugins, including Meow and Owlie", "Splash screen and custom CSS"],
    pick: "You want all of it.",
  },
  {
    id: "func",
    name: "Be Func",
    repo: FUNC_REPO,
    installer: "Be-Func.exe",
    cli: "Be-Func-Cli.exe",
    summary: "The plugins without the theme.",
    includes: ["48 function plugins, including Meow and Owlie", "No theme and none of the theme-effect plugins", "No splash screen and no custom CSS"],
    pick: "You want the plugins (recording, browser, Spotify, Twitch) and not the look.",
  },
  {
    id: "styler",
    name: "Be Styler",
    repo: STYLER_REPO,
    installer: "Be-Styler.exe",
    cli: "Be-Styler-Cli.exe",
    summary: "The theme, with the plugins that change how Discord looks.",
    includes: ["The full theme engine, splash screen and custom CSS", "8 theme-effect plugins: Cursor Pet, Sakura Petals, Screen Effects, Small Fixes, Macmize, Username Tools, Compact Server List and Loading Quotes", "No Meow or Owlie"],
    pick: "You want the look and nothing else.",
  },
  {
    id: "core",
    name: "Be Core",
    repo: CORE_REPO,
    installer: "Be-Core.exe",
    cli: "Be-Core-Cli.exe",
    summary: "The smallest build: just Fake Nitro, DMS Saaf, Meow and Owlie.",
    includes: ["4 plugins: Fake Nitro, DMS Saaf, Meow and Owlie", "No theme and no other plugins", "No splash screen and no custom CSS"],
    pick: "You only want those four, and the lightest install.",
  },
] as const;

export const BUILD_PAGES: Record<string, string> = { func: "/func", styler: "/styler", core: "/core" };

export const THEME_PLUGIN_NAMES = ["Cursor Pet", "Sakura Petals", "Screen Effects", "Small Fixes", "Macmize", "Username Tools", "Compact Server List", "Loading Quotes"];

export const CORE_PLUGIN_NAMES = ["Fake Nitro", "DMS Saaf", "Meow", "Owlie"];

export const CMD = {
  powershell: "irm https://raw.githubusercontent.com/hyperflore/Be-Themer/main/install.ps1 | iex",
  cmd: 'powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/hyperflore/Be-Themer/main/install.ps1 | iex"',
  allBranches: '$env:BETHEMER_ARGS = "--install --branch all"; irm https://raw.githubusercontent.com/hyperflore/Be-Themer/main/install.ps1 | iex',
  uninstall: '$env:BETHEMER_ARGS = "--uninstall"; irm https://raw.githubusercontent.com/hyperflore/Be-Themer/main/install.ps1 | iex',
  clone: "git clone https://github.com/hyperflore/Be-Themer.git\ncd Be-Themer\nnpm install\nnpm run inject",
};

export type Category = "Widgets" | "Chat" | "Voice" | "Privacy" | "Look" | "Tools";

export interface Plugin {
  name: string;
  desc: string;
  category: Category;
  on?: boolean;
  isNew?: boolean;
}

export const PLUGINS: Plugin[] = [
  { name: "Spotify Controls", desc: "A player above your user panel: seek, volume, shuffle, search, lyrics, Liked Songs and playlists.", category: "Widgets", isNew: true },
  { name: "YouTube", desc: "Watch YouTube in a widget. Search, paste a link, or follow channels.", category: "Widgets", isNew: true },
  { name: "Twitch", desc: "Live streams in a widget, with search, top channels and chat.", category: "Widgets", isNew: true },
  { name: "Kick", desc: "Kick streams in a widget, with search, live channels and chat.", category: "Widgets", isNew: true },
  { name: "Lazy", desc: "A small browser with tabs, its own search, and ad and tracker blocking.", category: "Widgets", isNew: true },
  { name: "Owlie", desc: "Record a screen or a window, with or without sound, up to 4K at 60 fps.", category: "Tools", on: true, isNew: true },
  { name: "Calculate", desc: "A glass calculator on a key combination you choose.", category: "Tools", isNew: true },
  { name: "DMS Saaf", desc: "Right-click a DM or channel to delete your own messages there.", category: "Chat", isNew: true },
  { name: "Meow", desc: "Records the voice call you're in to an MP3.", category: "Voice", on: true },
  { name: "Fake Nitro", desc: "Emoji and sticker links, stream quality controls, client themes and app icons on your client.", category: "Chat" },
  { name: "Message Logger", desc: "Deleted messages stay visible in red and edits keep their history, until you restart.", category: "Chat" },
  { name: "Silent Typing", desc: "Others don't see \"is typing…\" from you.", category: "Privacy" },
  { name: "No Track", desc: "Blocks Discord's analytics requests and crash reports.", category: "Privacy" },
  { name: "Clear URLs", desc: "Strips tracking parameters from links you send.", category: "Privacy" },
  { name: "Anonymise File Names", desc: "Uploads get an anonymous file name; the extension is kept.", category: "Privacy" },
  { name: "Custom Activity", desc: "Your own Playing or Listening status with details, timer and image.", category: "Tools" },
  { name: "Custom Idle", desc: "Choose how long until you're marked Idle, or turn it off.", category: "Tools" },
  { name: "Call Timer", desc: "How long you've been in the current voice call.", category: "Voice" },
  { name: "Voice Narrator", desc: "Reads out who joins, leaves or moves in your voice channel.", category: "Voice" },
  { name: "Voice Double-Click", desc: "Voice channels need a double-click to join.", category: "Voice" },
  { name: "Notification Volume", desc: "Volume for Discord's notification sounds.", category: "Voice" },
  { name: "Chat Tools", desc: "Reveal spoilers, blur NSFW media, character counter and more.", category: "Chat" },
  { name: "Copy Raw Message", desc: "Copy a message's raw text, or its ID with Shift.", category: "Chat" },
  { name: "Emoji", desc: "Sends a link to a custom emoji's image where you can't use it.", category: "Chat" },
  { name: "Exact Timestamps", desc: "Exact date and time, with seconds, next to messages.", category: "Chat" },
  { name: "Keyword Highlight", desc: "Highlights messages that contain your keywords.", category: "Chat" },
  { name: "Message Click Actions", desc: "Double-click to edit or reply; Backspace + click deletes.", category: "Chat" },
  { name: "Message Link Embeds", desc: "Previews of linked Discord messages you can already read.", category: "Chat" },
  { name: "No Blocked Messages", desc: "Hides blocked and ignored users' messages completely.", category: "Chat" },
  { name: "No Reply Mention", desc: "Replies don't ping by default, with exceptions.", category: "Chat" },
  { name: "Silent Message Toggle", desc: "A bell button that sends your messages as @silent.", category: "Chat" },
  { name: "Text Replace", desc: "Your own find-and-replace rules for messages you send.", category: "Chat" },
  { name: "Translate Selection", desc: "Translates selected text with Google Translate.", category: "Chat" },
  { name: "Typing Indicator", desc: "Shows who's typing next to channels and DMs.", category: "Chat" },
  { name: "Who Reacted", desc: "Alt+click a reaction to see who reacted.", category: "Chat" },
  { name: "Pin DMs", desc: "Pin direct messages for quick access.", category: "Chat" },
  { name: "Relationship Notifier", desc: "Tells you when a friend, group or server removes you.", category: "Tools" },
  { name: "Handy Actions", desc: "Read All, jump to the first message, invite links, copy channel link.", category: "Tools" },
  { name: "Link Tools", desc: "Skips \"Leaving Discord\" and opens music and game links in their apps.", category: "Tools" },
  { name: "Media Tools", desc: "Picture-in-picture, voice message download, reverse image search.", category: "Tools" },
  { name: "Image Zoom", desc: "A magnifying lens on opened images.", category: "Tools" },
  { name: "Member Count", desc: "Online, total and in-voice member counts.", category: "Tools" },
  { name: "Platform Indicators", desc: "Desktop, mobile and web icons next to names.", category: "Tools" },
  { name: "Username Tools", desc: "Usernames next to nicknames, and name colours.", category: "Tools" },
  { name: "Console Janitor", desc: "Quiets Discord's console and adds DevTools shortcuts.", category: "Tools" },
  { name: "Keyboard Tweaks", desc: "Stops F1 opening Discord's help page.", category: "Tools", on: true },
  { name: "Macmize", desc: "Red, yellow and green window buttons in the top-left corner.", category: "Look" },
  { name: "Compact Server List", desc: "Shrinks the server column.", category: "Look" },
  { name: "Hide Nitro & Shop", desc: "Hides the Nitro, Shop and Quests entries and the gift button.", category: "Look" },
  { name: "Loading Quotes", desc: "Your own lines on Discord's loading screen.", category: "Look", on: true },
  { name: "Sakura Petals", desc: "Falling petals in your accent colour.", category: "Look", on: true },
  { name: "Screen Effects", desc: "Snow, stars, fireflies, confetti, matrix code and click bursts.", category: "Look" },
  { name: "Cursor Pet", desc: "A small pet that follows your mouse and naps when you're idle.", category: "Look" },
  { name: "Small Fixes", desc: "Still typing dots, plain folders, full-size images and other tweaks.", category: "Look" },
  { name: "Stickers", desc: "Server sticker previews in channels where Discord blocks the sticker.", category: "Chat" },
  { name: "No Taskbar Badge", desc: "Removes the unread count from Discord's taskbar icon.", category: "Look" },
];

export const CATEGORIES: (Category | "All")[] = ["All", "Widgets", "Chat", "Voice", "Privacy", "Look", "Tools"];

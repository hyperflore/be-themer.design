import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import "./index.css";
import { RouterProvider, useRoute } from "./router";
import { Footer, Nav } from "./components/layout";
import { Home } from "./pages/Home";
import { MusicProvider } from "./components/Music";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { LOW_END } from "./lowEnd";

const Download = lazy(() => import("./pages/Download").then(m => ({ default: m.Download })));
const Plugins = lazy(() => import("./pages/Plugins").then(m => ({ default: m.Plugins })));
const Faq = lazy(() => import("./pages/Faq").then(m => ({ default: m.Faq })));
const BuildPage = lazy(() => import("./pages/Build").then(m => ({ default: m.BuildPage })));

const TITLES: Record<string, string> = {
  "/download": "Download · Be Themer",
  "/plugins": "Plugins · Be Themer",
  "/faq": "FAQ · Be Themer",
  "/func": "Be Func · Be Themer",
  "/styler": "Be Styler · Be Themer",
  "/core": "Be Core · Be Themer",
  "/be-core": "Be Core · Be Themer",
};

function Page() {
  const { path: raw } = useRoute();
  const path = raw.toLowerCase().replace(/\/+$/, "") || "/";
  document.title = TITLES[path] || "Be Themer: Just a better customizing option.";
  if (path === "/core" || path === "/be-core") return <BuildPage id="core" />;
  if (path === "/download") return <Download />;
  if (path === "/plugins") return <Plugins />;
  if (path === "/faq") return <Faq />;
  if (path === "/func") return <BuildPage id="func" />;
  if (path === "/styler") return <BuildPage id="styler" />;
  return <Home />;
}

const ALLOWED = "code, pre, kbd, input, textarea, [contenteditable=\"true\"], .selectable";
const allowed = (n: Node | null | undefined) => !!(n && (n instanceof Element ? n : n.parentElement)?.closest(ALLOWED));
document.addEventListener("copy", e => {
  const sel = document.getSelection();
  if (!sel || sel.isCollapsed) return;
  if (!allowed(sel.anchorNode) || !allowed(sel.focusNode)) e.preventDefault();
});
document.addEventListener("dragstart", e => { if (e.target instanceof HTMLImageElement) e.preventDefault(); });

if (!LOW_END && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <RouterProvider>
        <MusicProvider>
        <Nav />
        <main className="relative isolate"><Suspense fallback={<div className="min-h-screen" />}><Page /></Suspense></main>
        <Footer />
        </MusicProvider>
      </RouterProvider>
    </MotionConfig>
  </StrictMode>,
);

import { useEffect, useState } from "react";

export type SiteTheme = "light" | "dark";
const read = (): SiteTheme => {
  const c = document.documentElement.classList;
  return c.contains("dark") ? "dark" : "light";
};

export function useTheme() {
  const [theme, setTheme] = useState<SiteTheme>(read);
  useEffect(() => {
    const mo = new MutationObserver(() => setTheme(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return theme;
}

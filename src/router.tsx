import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from "react";

const RouteContext = createContext<{ path: string; go: (to: string) => void }>({ path: "/", go: () => {} });

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState(() => location.pathname);
  useEffect(() => {
    const onPop = () => setPath(location.pathname);
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);
  const go = (to: string) => {
    const [p, hash] = to.split("#");
    if (p && p !== location.pathname) {
      history.pushState(null, "", to);
      setPath(p);
      if (!hash) window.scrollTo({ top: 0 });
    } else if (hash) {
      history.replaceState(null, "", to);
    }
    if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }));
  };
  return <RouteContext.Provider value={{ path, go }}>{children}</RouteContext.Provider>;
}

export const useRoute = () => useContext(RouteContext);

export function Link({ to, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const { go } = useRoute();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(to);
  };
  return <a href={to} onClick={handle} {...rest} />;
}

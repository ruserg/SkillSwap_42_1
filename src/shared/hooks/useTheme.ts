import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type ThemePref = "light" | "dark" | "auto";

const STORAGE_KEY = "theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(effective: "light" | "dark") {
  if (typeof document === "undefined") return;
  const target = document.body || document.documentElement;
  if (effective === "dark") {
    target.setAttribute("data-theme", "dark");
  } else {
    target.removeAttribute("data-theme");
  }
}

export function useTheme() {
  const [stored, setStored] = useLocalStorage<ThemePref>(STORAGE_KEY, "auto");
  const [system, setSystem] = useState<"light" | "dark">(() =>
    getSystemTheme(),
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystem(getSystemTheme());
    try {
      mq.addEventListener?.("change", handler);
    } catch {
      mq.addListener?.(handler);
    }
    return () => {
      try {
        mq.removeEventListener?.("change", handler);
      } catch {
        mq.removeListener?.(handler);
      }
    };
  }, []);

  const effective = useMemo<"light" | "dark">(() => {
    if (stored === "auto") return system;
    return stored === "dark" ? "dark" : "light";
  }, [stored, system]);

  useEffect(() => {
    applyTheme(effective);
  }, [effective]);

  const setTheme = useCallback(
    (t: ThemePref) => {
      setStored(t);
    },
    [setStored],
  );

  const toggle = useCallback(() => {
    setStored((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setStored]);

  return { preference: stored, effective, setTheme, toggle } as const;
}

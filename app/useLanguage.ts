"use client";

import { useSyncExternalStore } from "react";

export type Language = "en" | "zh";
const storageKey = "mickyworks-language";
const changeEvent = "mickyworks:language";
let fallback: Language = "en";

function snapshot(): Language {
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved === "zh" || saved === "en" ? saved : fallback;
  } catch {
    return fallback;
  }
}

function subscribe(update: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) update();
  };
  window.addEventListener(changeEvent, update);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, update);
    window.removeEventListener("storage", onStorage);
  };
}

function setLanguage(language: Language) {
  fallback = language;
  try { window.localStorage.setItem(storageKey, language); } catch { /* Storage can be disabled. */ }
  window.dispatchEvent(new Event(changeEvent));
}

const serverSnapshot = (): Language => "en";

export default function useLanguage() {
  const language = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return [language, setLanguage] as const;
}

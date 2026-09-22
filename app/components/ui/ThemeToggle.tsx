"use client";

import { useEffect, useState } from "react";

//* 테마 선택값. "system" 은 OS 설정을 따르며 data-theme 을 두지 않습니다.
export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "theme";
const THEME_COLOR: Record<"light" | "dark", string> = {
  light: "#f6f0e4",
  dark: "#15110d",
};
const ORDER: ThemePreference[] = ["system", "dark", "light"];
const LABEL: Record<ThemePreference, string> = {
  system: "시스템",
  dark: "다크",
  light: "라이트",
};
const GLYPH: Record<ThemePreference, string> = {
  system: "◐",
  dark: "☾",
  light: "☀",
};

function readStored(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

//* 선택값을 <html data-theme> / localStorage / <meta theme-color> 에 반영합니다.
//* (첫 페인트 전 적용은 app/layout.tsx 의 인라인 스크립트가 같은 규칙으로 처리합니다)
export function applyTheme(pref: ThemePreference) {
  const root = document.documentElement;
  if (pref === "system") {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = pref;
  }
  try {
    if (pref === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* 사생활 보호 모드 등에서는 저장이 실패할 수 있음 */
  }
  const effective = pref === "system" ? (systemPrefersDark() ? "dark" : "light") : pref;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => (meta.content = THEME_COLOR[effective]));
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  //* SSR 에서는 저장값을 알 수 없으므로 "system" 으로 그리고, 마운트 후 실제 값으로 맞춥니다.
  const [pref, setPref] = useState<ThemePreference>("system");

  useEffect(() => {
    setPref(readStored());
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
    setPref(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      className={`pill pill-neutral ${className}`}
      aria-label={`테마: ${LABEL[pref]} (누르면 변경)`}
      title={`테마: ${LABEL[pref]}`}
    >
      <span aria-hidden="true">{GLYPH[pref]}</span>
    </button>
  );
}

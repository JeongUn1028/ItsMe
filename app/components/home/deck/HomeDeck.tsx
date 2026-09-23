"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import style from "./HomeDeck.module.css";

export interface DeckPage {
  /** URL 의 ?page= 값 */
  slug: string;
  /** 도트 버튼의 접근성 이름 */
  label: string;
}

interface HomeDeckProps {
  pages: DeckPage[];
  children: React.ReactNode;
}

const PARAM = "page";

/**
 * 홈을 좌우 페이지로 넘긴다. 데스크톱에서만 동작하고, 좁은 화면에서는
 * CSS 가 평범한 세로 스택으로 되돌리므로 이 컴포넌트는 컨트롤만 숨긴다.
 *
 * 페이지 상태는 `?page=<slug>` 로 공유·새로고침된다. 스크롤로 바뀔 때는
 * `replaceState` 라 히스토리를 오염시키지 않는다.
 */
export default function HomeDeck({ pages, children }: HomeDeckProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const writeUrl = useCallback(
    (next: number) => {
      const url = new URL(window.location.href);
      if (next === 0) url.searchParams.delete(PARAM);
      else url.searchParams.set(PARAM, pages[next].slug);
      window.history.replaceState(null, "", url);
    },
    [pages],
  );

  const goTo = useCallback(
    (next: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      if (!track) return;
      pendingRef.current = null;
      const clamped = Math.max(0, Math.min(next, pages.length - 1));
      track.scrollTo({ left: track.clientWidth * clamped, behavior });
      writeUrl(clamped);
      setIndex(clamped);
    },
    [pages.length, writeUrl],
  );

  //* 진입 시 ?page= 를 기억해 둔다. 실제 이동은 아래 effect 가 레이아웃 확정 후 처리한다.
  const pendingRef = useRef<number | null>(null);
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get(PARAM);
    const found = pages.findIndex((page) => page.slug === slug);
    if (found > 0) {
      pendingRef.current = found;
      setIndex(found);
    }
  }, [pages]);

  //* Suspense 로 콘텐츠가 뒤늦게 들어오면 트랙 크기가 바뀌며 스크롤이 0 으로 되돌아간다.
  //* 사용자가 직접 넘기기 전까지는 목표 페이지를 다시 맞춘다.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const settle = () => {
      const target = pendingRef.current;
      if (target === null || track.clientWidth === 0) return;
      const left = track.clientWidth * target;
      if (Math.abs(track.scrollLeft - left) > 1) {
        //* "auto" 는 CSS 의 scroll-behavior(smooth)를 따르라는 뜻이라 애니메이션이 걸린다.
        //* 복원은 즉시 끝나야 하므로 "instant" 를 쓴다.
        track.scrollTo({ left, behavior: "instant" });
      }
    };

    settle();
    const observer = new ResizeObserver(settle);
    observer.observe(track);

    const release = () => {
      pendingRef.current = null;
    };
    //* 사용자가 개입하면 더 이상 강제하지 않는다.
    track.addEventListener("pointerdown", release);
    track.addEventListener("wheel", release, { passive: true });
    track.addEventListener("touchstart", release, { passive: true });

    return () => {
      observer.disconnect();
      track.removeEventListener("pointerdown", release);
      track.removeEventListener("wheel", release);
      track.removeEventListener("touchstart", release);
    };
  }, []);

  //* 스와이프·트랙패드로 넘겼을 때도 도트와 URL 이 따라오게 한다.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (track.clientWidth === 0) return;
        const next = Math.round(track.scrollLeft / track.clientWidth);
        setIndex((prev) => {
          //* 복원 중에는 URL 을 건드리지 않는다.
          if (prev !== next && pendingRef.current === null) writeUrl(next);
          return next;
        });
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, [writeUrl]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  return (
    <div className={style.deck}>
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={index === 0}
        onClick={() => goTo(index - 1)}
        className={`pill pill-neutral ${style.arrow} ${style.arrowPrev}`}
      >
        ‹
      </button>

      <div
        ref={trackRef}
        data-home-deck=""
        className={style.track}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="홈 페이지 넘기기"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={index === pages.length - 1}
        onClick={() => goTo(index + 1)}
        className={`pill pill-neutral ${style.arrow} ${style.arrowNext}`}
      >
        ›
      </button>

      <div className={style.controls}>
        {pages.map((page, i) => (
          <button
            key={page.slug}
            type="button"
            aria-label={`${page.label} 페이지로 이동`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={`${style.dot} ${i === index ? style.dotActive : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import style from "./modal.module.css";

const ANIMATION_MS = 240;
//* 시트를 닫기로 판단하는 기준: 이만큼 끌어내렸거나, 이 속도 이상으로 튕겼을 때. (#43)
const DISMISS_DISTANCE_PX = 96;
const DISMISS_VELOCITY_PX_PER_MS = 0.6;
const SHEET_QUERY = "(max-width: 767px)";

//* OS 의 모션 감소 설정이 켜져 있으면 애니메이션 없이 즉시 열고 닫습니다.
const getAnimationMs = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : ANIMATION_MS;

export const Modal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const animationMsRef = useRef(ANIMATION_MS);
  // Portal 대상인 #modal-root가 브라우저에 마운트된 뒤에만 접근하기 위한 상태입니다.
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // isVisible을 ref로도 추적하여 closeModal이 isVisible state에 의존하지 않도록 합니다.
  const isVisibleRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  //* 모바일에서만 시트로 동작하므로, 레이아웃 분기와 같은 기준을 JS 에서도 본다.
  const [isSheet, setIsSheet] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startY: number;
    lastY: number;
    lastTime: number;
    offset: number;
  } | null>(null);

  const closeModal = useCallback(() => {
    if (!isVisibleRef.current) {
      return;
    }

    isVisibleRef.current = false;
    setIsVisible(false);

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      // 모달이 닫힐 때 body 스크롤 잠금을 즉시 해제합니다.
      document.body.style.overflow = "";

      // 인터셉트 라우트는 이전 히스토리로 되돌아가는 것이 가장 자연스럽습니다.
      if (window.history.length > 1) {
        router.back();

        // back 이후에도 URL이 그대로라면 인터셉트 상태가 남은 것이므로 홈으로 대체 이동합니다.
        window.setTimeout(() => {
          if (window.location.pathname === pathname) {
            router.replace("/");
          }
        }, 80);
        return;
      }

      router.replace("/");
    }, animationMsRef.current);
  }, [pathname, router]);

  //* 시트인지 여부는 열려 있는 동안 회전 등으로 바뀔 수 있어 계속 듣습니다.
  useEffect(() => {
    const query = window.matchMedia(SHEET_QUERY);
    const sync = () => setIsSheet(query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
    };
  }, []);

  //* 시트가 열려 있는 동안 뒤 페이지를 살짝 물러나게 합니다. (iOS 15 스타일)
  useEffect(() => {
    if (!isSheet || !isVisible) {
      return;
    }

    document.body.dataset.sheetOpen = "true";

    return () => {
      delete document.body.dataset.sheetOpen;
    };
  }, [isSheet, isVisible]);

  useEffect(() => {
    // 클라이언트에서만 portal 렌더링이 가능하므로 마운트 여부를 기록합니다.
    setIsMounted(true);
    animationMsRef.current = getAnimationMs();

    const rafId = window.requestAnimationFrame(() => {
      isVisibleRef.current = true;
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const prevOverflow = document.body.style.overflow;
    // 모달이 열려 있을 때 배경 스크롤을 막습니다.
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      // ESC 키로도 동일한 닫기 로직을 사용합니다.
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMounted, closeModal]);

  // 스크린리더/키보드 사용자가 바로 모달 안에서 시작하도록 포커스를 옮깁니다.
  // 포털이 실제로 그려진 뒤(isMounted 이후 렌더)에야 dialogRef 가 채워지므로 별도 effect 로 둡니다.
  useEffect(() => {
    if (!isMounted) {
      return;
    }
    const el = dialogRef.current;
    if (el && document.activeElement !== el) {
      el.focus({ preventScroll: true });
    }
  }, [isMounted]);


  //* 시트를 아래로 끌어 닫습니다. 안쪽이 이미 스크롤돼 있으면 스크롤이 우선입니다.
  const canStartDrag = (target: EventTarget | null) => {
    if (!(target instanceof Element)) {
      return false;
    }
    if (target.closest(`.${style.grabber}`)) {
      return true;
    }

    let node: Element | null = target;
    while (node && node !== dialogRef.current) {
      if (node.scrollTop > 0) {
        return false;
      }
      node = node.parentElement;
    }
    return true;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const sheet = dialogRef.current;
    if (!isSheet || !sheet || dragRef.current || !canStartDrag(event.target)) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      offset: 0,
    };
    sheet.setPointerCapture(event.pointerId);
    sheet.style.transition = "none";
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const sheet = dialogRef.current;
    if (!drag || !sheet || drag.pointerId !== event.pointerId) {
      return;
    }

    //* 위로 끄는 동작은 무시하고 아래 방향만 따라갑니다.
    drag.offset = Math.max(0, event.clientY - drag.startY);
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;
    sheet.style.transform = `translateY(${drag.offset}px)`;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const sheet = dialogRef.current;
    if (!drag || !sheet || drag.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    if (sheet.hasPointerCapture(event.pointerId)) {
      sheet.releasePointerCapture(event.pointerId);
    }

    const elapsed = Math.max(1, event.timeStamp - drag.lastTime);
    const velocity = (event.clientY - drag.lastY) / elapsed;

    //* 인라인으로 덮어쓴 값을 지워 클래스의 열림/닫힘 transform 으로 돌려놓습니다.
    sheet.style.transition = "";
    sheet.style.transform = "";

    if (
      drag.offset > DISMISS_DISTANCE_PX ||
      velocity > DISMISS_VELOCITY_PX_PER_MS
    ) {
      closeModal();
    }
  };

  if (!isMounted) {
    return null;
  }

  // RootLayout에 심어둔 portal 전용 DOM 노드입니다.
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <>
      <div
        role="presentation"
        onClick={closeModal}
        className={`${style.scrim} ${isVisible ? style.scrimVisible : ""}`}
        style={{ "--modal-dur": `${animationMsRef.current}ms` } as CSSProperties}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="포트폴리오 상세"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`${style.dialog} ${isVisible ? style.dialogVisible : ""}`}
        style={{ "--modal-dur": `${animationMsRef.current}ms` } as CSSProperties}
      >
        {/* 시트일 때만 보이는 손잡이. 스크린리더에는 의미가 없어 숨깁니다. */}
        <div
          aria-hidden="true"
          data-testid="sheet-grabber"
          className={style.grabber}
        />
        {children}
      </div>
    </>,
    modalRoot,
  );
};

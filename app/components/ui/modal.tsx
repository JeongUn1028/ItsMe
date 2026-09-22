"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";

const ANIMATION_MS = 240;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

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
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          background: "var(--scrim)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          opacity: isVisible ? 1 : 0,
          transition: `opacity ${animationMsRef.current}ms ease`,
        }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="포트폴리오 상세"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        style={{
          position: "fixed",
          top: "24px",
          left: "50%",
          transform: isVisible
            ? "translateX(-50%) translateY(0) scale(1)"
            : "translateX(-50%) translateY(14px) scale(0.985)",
          zIndex: 1000,
          width: "min(980px, calc(100vw - 48px))",
          maxHeight: "calc(100vh - 48px)",
          overflow: "hidden",
          overscrollBehavior: "contain",
          borderRadius: "18px",
          opacity: isVisible ? 1 : 0,
          outline: "none",
          transition: `transform ${animationMsRef.current}ms ${EASE_OUT}, opacity ${animationMsRef.current}ms ease`,
          willChange: "transform, opacity",
        }}
      >
        {children}
      </div>
    </>,
    modalRoot,
  );
};

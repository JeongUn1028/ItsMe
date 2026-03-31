"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export const Modal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  // Portal 대상인 #modal-root가 브라우저에 마운트된 뒤에만 접근하기 위한 상태입니다.
  const [isMounted, setIsMounted] = useState(false);

  const closeModal = useCallback(() => {
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
  }, [pathname, router]);

  useEffect(() => {
    // 클라이언트에서만 portal 렌더링이 가능하므로 마운트 여부를 기록합니다.
    setIsMounted(true);
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
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMounted, closeModal]);

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
          background: "rgba(15, 12, 8, 0.18)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        style={{
          position: "fixed",
          top: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "min(980px, calc(100vw - 48px))",
          maxHeight: "calc(100vh - 48px)",
          overflow: "hidden",
          overscrollBehavior: "contain",
          borderRadius: "18px",
        }}
      >
        {children}
      </div>
    </>,
    modalRoot,
  );
};

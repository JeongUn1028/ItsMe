"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export const Modal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const closeModal = useCallback(() => {
    document.body.style.overflow = "";

    if (window.history.length > 1) {
      router.back();

      // Fallback for cases where intercepted state is not popped.
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
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
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

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div
      role="presentation"
      onClick={closeModal}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "rgba(15, 12, 8, 0.45)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "min(980px, 100%)",
          maxHeight: "calc(100vh - 48px)",
          overflowY: "auto",
          borderRadius: "18px",
        }}
      >
        {children}
      </div>
    </div>,
    modalRoot,
  );
};

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

export default function LogoutButton() {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToast({ type, message });
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 2200);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`/api/logout`, {
        method: "POST",
      });

      if (response.ok) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        setToast(null);
        router.replace("/");
      } else {
        console.error("Logout failed");
        showToast("error", "로그아웃에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showToast("error", "요청 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="inline-flex items-center justify-center rounded-2xl border border-white/35 bg-[linear-gradient(135deg,rgba(46,31,20,0.95),rgba(94,64,42,0.95))] px-4 py-2 text-sm font-semibold text-[#fff8ee] shadow-[0_10px_24px_rgba(73,48,30,0.2),inset_0_1px_0_rgba(255,255,255,0.22)] transition hover:-translate-y-px hover:shadow-[0_14px_28px_rgba(73,48,30,0.26),inset_0_1px_0_rgba(255,255,255,0.22)] focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_rgba(150,228,209,0.32),0_10px_24px_rgba(73,48,30,0.2),inset_0_1px_0_rgba(255,255,255,0.22)]"
      >
        Logout
      </button>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-4 top-4 z-50 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
              : "border-rose-200 bg-rose-50/95 text-rose-900"
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";

export default function BackToHomeButton({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={`pill pill-neutral ${className ?? ""}`}
      onClick={() => router.back()}
    >
      {"<- Back to Home"}
    </button>
  );
}

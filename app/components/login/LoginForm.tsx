"use client";
import { useSearchParams } from "next/navigation";

import LoginFormUI from "./LoginFormUI";
import { Suspense } from "react";
import LoginSkeleton from "@/app/components/ui/skeleton/LoginSkeleton";

function LoginFields() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? undefined;
  const redirect = searchParams.get("redirect") ?? undefined;

  return <LoginFormUI error={error} redirect={redirect} />; // 로그인 폼 UI 컴포넌트에 에러 메시지와 리디렉션 URL 전달
}

export default function LoginForm() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginFields />
    </Suspense>
  );
}

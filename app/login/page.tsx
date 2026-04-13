import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Loading from "./loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// globals: false 환경에서는 Testing Library가 자동으로 cleanup하지 않으므로 직접 정리합니다.
afterEach(() => {
  cleanup();
});

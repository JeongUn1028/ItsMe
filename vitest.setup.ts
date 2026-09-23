import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

//* jsdom 에 없는 브라우저 API 를 최소한으로 채운다. (네트워크 모킹이 아니라 환경 보완)
if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = vi.fn() as unknown as Element["scrollTo"];
}

// globals: false 환경에서는 Testing Library가 자동으로 cleanup하지 않으므로 직접 정리합니다.
afterEach(() => {
  cleanup();
});

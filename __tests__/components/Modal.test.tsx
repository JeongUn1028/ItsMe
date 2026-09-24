import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "@/app/components/ui/modal";

const back = vi.fn();
const replace = vi.fn();

//* 실제 useRouter 는 같은 객체를 돌려준다. 매번 새 객체를 주면 closeModal 이 재생성되어
//* 닫기 타이머를 정리하는 effect 가 다시 돌아 버리므로, 모킹에서도 객체를 고정한다.
const router = { back, replace };

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  usePathname: () => "/portfolio/itsme",
}));

//* jsdom 에 없는 브라우저 API 를 채운다. (네트워크 모킹이 아니라 환경 보완)
const setViewportWidth = (isSheet: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: query === "(max-width: 767px)" ? isSheet : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
};

//* 여는 애니메이션은 requestAnimationFrame 으로 시작한다.
//* 가짜 타이머에서는 직접 흘려보내야 "열린 상태"가 되어 닫기 동작을 검증할 수 있다.
const renderModal = () => {
  const modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  document.body.append(modalRoot);

  const result = render(
    <Modal>
      <p>상세 내용</p>
    </Modal>,
  );

  act(() => {
    vi.advanceTimersByTime(50);
  });

  return result;
};

const dragSheet = (distance: number) => {
  const dialog = screen.getByRole("dialog");
  const grabber = screen.getByTestId("sheet-grabber");

  fireEvent.pointerDown(grabber, { pointerId: 1, clientY: 100 });
  fireEvent.pointerMove(dialog, { pointerId: 1, clientY: 100 + distance });
  fireEvent.pointerUp(dialog, { pointerId: 1, clientY: 100 + distance });

  return dialog;
};

describe("Modal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    back.mockClear();
    replace.mockClear();
    document.body.innerHTML = "";
    setViewportWidth(false);

    Element.prototype.setPointerCapture = vi.fn();
    Element.prototype.releasePointerCapture = vi.fn();
    Element.prototype.hasPointerCapture = vi.fn(() => true);
    window.history.pushState({}, "", "/portfolio/itsme");
  });

  afterEach(() => {
  });

  test("포털 안에 내용을 그리고 다이얼로그 역할을 준다", () => {
    renderModal();

    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(screen.getByText("상세 내용")).toBeDefined();
  });

  test("Esc 를 누르면 이전 화면으로 돌아간다", () => {
    renderModal();

    fireEvent.keyDown(window, { key: "Escape" });
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(back).toHaveBeenCalled();
  });

  test("배경을 누르면 닫힌다", () => {
    renderModal();

    fireEvent.click(screen.getByRole("presentation"));
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(back).toHaveBeenCalled();
  });

  test("모달이 열려 있는 동안 배경 스크롤을 막는다", () => {
    renderModal();

    expect(document.body.style.overflow).toBe("hidden");
  });

  test("시트를 충분히 끌어내리면 닫는다", () => {
    setViewportWidth(true);
    renderModal();

    dragSheet(160);
    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(back).toHaveBeenCalled();
  });

  test("조금만 끌면 닫지 않고 제자리로 돌린다", () => {
    setViewportWidth(true);
    renderModal();

    const dialog = dragSheet(24);

    expect(back).not.toHaveBeenCalled();
    //* 인라인으로 덮어쓴 transform 을 지워 클래스가 다시 위치를 잡는다.
    expect(dialog.style.transform).toBe("");
  });

  test("데스크톱에서는 끌어도 닫히지 않는다", () => {
    setViewportWidth(false);
    renderModal();

    dragSheet(200);

    expect(back).not.toHaveBeenCalled();
  });
});

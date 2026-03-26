import { getRawContents } from "@/lib/projects/getRawContents";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("getRawContents", () => {
  it("마크다운 파일의 경로를 입력받아 contents를 파싱해서 반환", () => {
    const filePath = path.join(
      process.cwd(),
      "content",
      "projects",
      "sample-project.md",
    );

    const contents = getRawContents(filePath);
    const normalized = contents.replace(/\n\s*\n/g, "\n");

    expect(normalized).toBe(
      "## 프로젝트 소개\n이 프로젝트는 나를 소개하기 위한 포트폴리오입니다.\n---\n## 문제\n기존 포트폴리오는 결과만 보여주는 경우가 많았습니다.\n---\n## 해결\n설계와 과정을 함께 보여주는 구조로 설계했습니다.",
    );
  });
});

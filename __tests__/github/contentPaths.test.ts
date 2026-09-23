import { describe, expect, it } from "vitest";
import {
  portfolioMarkdownPath,
  portfolioThumbnailUrl,
  publicFilePath,
  RESUME_IMAGE_URL,
  RESUME_JSON_PATH,
  RESUME_PDF_URL,
} from "@/lib/github/contentPaths";

//* 이 함수들이 리포지토리의 어느 경로에 커밋할지를 결정한다.
//* 경로가 어긋나면 기존 파일을 덮어쓰거나 엉뚱한 곳에 파일이 생긴다.

describe("contentPaths", () => {
  it("slug 를 받으면 포트폴리오 문서 경로를 만든다", () => {
    expect(portfolioMarkdownPath("itsme")).toBe("content/portfolio/itsme.md");
  });

  it("public 기준 URL 을 받으면 리포지토리 경로로 바꾼다", () => {
    expect(publicFilePath("/portfolio/itsme.png")).toBe(
      "public/portfolio/itsme.png",
    );
    expect(publicFilePath(RESUME_PDF_URL)).toBe("public/resume/resume.pdf");
  });

  it("PNG 를 올리면 확장자가 png 인 썸네일 경로를 만든다", () => {
    expect(portfolioThumbnailUrl("itsme", "image/png")).toBe(
      "/portfolio/itsme.png",
    );
  });

  it("PNG 가 아니면 확장자를 jpg 로 둔다", () => {
    expect(portfolioThumbnailUrl("itsme", "image/jpeg")).toBe(
      "/portfolio/itsme.jpg",
    );
  });

  it("썸네일 URL 은 public 경로와 맞물린다", () => {
    const url = portfolioThumbnailUrl("sample", "image/png");
    expect(publicFilePath(url)).toBe("public/portfolio/sample.png");
  });

  it("이력서 관련 경로는 고정되어 있다", () => {
    expect(RESUME_JSON_PATH).toBe("content/resume.json");
    expect(RESUME_IMAGE_URL).toBe("/resume/profile.jpg");
  });
});

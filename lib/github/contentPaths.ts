//* 콘텐츠 종류별로 리포지토리 안의 저장 경로를 만듭니다.
//* (콘텐츠 경로 규칙을 한 곳에 모아 서버 액션이 경로 문자열을 직접 조립하지 않도록 합니다.)

export const portfolioMarkdownPath = (slug: string) =>
  `content/portfolio/${slug}.md`;

//* thumbnail 은 "/portfolio/foo.png" 처럼 public 기준 URL 경로입니다.
export const publicFilePath = (urlPath: string) => `public${urlPath}`;

export const portfolioThumbnailUrl = (slug: string, mimeType: string) =>
  `/portfolio/${slug}.${mimeType === "image/png" ? "png" : "jpg"}`;

export const RESUME_JSON_PATH = "content/resume.json";
export const RESUME_IMAGE_URL = "/resume/profile.jpg";
export const RESUME_PDF_URL = "/resume/resume.pdf";

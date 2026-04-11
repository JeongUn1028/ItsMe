"use server";

import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateFile } from "@/lib/update-file/updateFile";

export interface CreatePortfolioState {
  success: boolean | null;
  message: string;
}

type FrontmatterPrimitive = string | number | boolean;
type FrontmatterValue = FrontmatterPrimitive | FrontmatterPrimitive[];

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

//* 입력된 날짜를 YYYY-MM-DD 형식으로 변환
function normalizeDate(input: string) {
  if (!input) {
    return new Date().toISOString().slice(0, 10);
  }

  return input.slice(0, 10);
}

//* 문자열 내부 큰따옴표를 이스케이프합니다.
function escapeYamlQuotedString(value: string) {
  return value.replace(/"/g, '\\"');
}

//* frontmatter 값을 YAML 한 줄 표현으로 직렬화합니다.
function stringifyYamlValue(value: FrontmatterValue): string {
  if (Array.isArray(value)) {
    return `[${value
      .map((item) =>
        typeof item === "string"
          ? `"${escapeYamlQuotedString(item)}"`
          : String(item),
      )
      .join(", ")}]`;
  }

  if (typeof value === "string") {
    return `"${escapeYamlQuotedString(value)}"`;
  }

  return String(value);
}

// 문자열 필드는 항상 따옴표가 붙도록 frontmatter 본문을 생성합니다.
function stringifyQuotedFrontmatter(data: Record<string, FrontmatterValue>) {
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${stringifyYamlValue(value)}`)
    .join("\n");
}

// 폼 데이터로 gray-matter 기반 Markdown(frontmatter + 본문) 문자열을 생성합니다.
function makeMarkdownContent(params: {
  thumbnailPath: string;
  size: number[];
  status: string;
  title: string;
  tags: string[];
  createdAt: string;
  publishedAt: string;
  githubLink: string;
  velogLink: string;
  summary: string;
  contents: string;
}) {
  const {
    thumbnailPath,
    size,
    status,
    title,
    tags,
    createdAt,
    publishedAt,
    githubLink,
    velogLink,
    summary,
    contents,
  } = params;

  const frontmatterData = {
    thumbnail: thumbnailPath,
    size: [size[0], size[1]],
    status,
    title,
    tags,
    createdAt,
    publishedAt,
    githubLink,
    velogLink,
    summary,
  };

  return matter.stringify(`${contents.trim()}\n`, frontmatterData, {
    engines: {
      yaml: {
        parse: () => ({}),
        stringify: (data: unknown) =>
          stringifyQuotedFrontmatter(data as Record<string, FrontmatterValue>),
      },
    },
  });
}

// 새 포트폴리오를 이미지와 함께 저장하고 md 문서를 생성합니다.
export async function createPortfolio(
  _prevState: CreatePortfolioState,
  formData: FormData,
): Promise<CreatePortfolioState> {
  const isLoggedIn = await getLoginStatus();
  //* 1. 로그인 여부 확인
  if (!isLoggedIn) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  try {
    //* 2. FormData에서 데이터 추출
    const {
      title,
      slug,
      createdAt,
      thumbnail,
      status,
      githubLink,
      velogLink,
      summary,
      contents,
      size,
      tags,
    } = {
      title: formData.get("title")?.toString() ?? "",
      slug: formData.get("slug")?.toString() ?? "",
      thumbnail: formData.get("thumbnail") as File | null,
      status: formData.get("status")?.toString() ?? "draft",
      size: formData.get("size")?.toString() ?? "",
      tags: formData.get("tags")?.toString() ?? "",
      githubLink: formData.get("githubLink")?.toString() ?? "",
      velogLink: formData.get("velogLink")?.toString() ?? "",
      createdAt: formData.get("createdAt")?.toString() ?? "",
      summary: formData.get("summary")?.toString() ?? "",
      contents: formData.get("contents")?.toString() ?? "",
    };

    if (
      !title ||
      !slug ||
      !summary ||
      !contents ||
      !thumbnail ||
      !githubLink ||
      !velogLink ||
      !size ||
      !tags
    ) {
      return { success: false, message: "필수 필드를 입력해주세요." };
    }

    const normalizedSlug = slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(normalizedSlug)) {
      return {
        success: false,
        message:
          "프로젝트 명은 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.",
      };
    }

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (tagsArray.length === 0) {
      return { success: false, message: "태그를 1개 이상 입력해주세요." };
    }

    const sizeArray = size
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    if (sizeArray.length !== 2) {
      return {
        success: false,
        message: "카드 사이즈는 2,1 처럼 두 개의 숫자로 입력해주세요.",
      };
    }

    if (sizeArray.some((n) => n < 1 || n > 3)) {
      return {
        success: false,
        message: "카드 사이즈 값은 1~3 사이여야 합니다.",
      };
    }

    const normalizedCreatedAt = normalizeDate(createdAt);
    const publishedAt = status === "published" ? normalizedCreatedAt : "";

    const portfolioDir = path.join(process.cwd(), "content/portfolio");
    const imageDir = path.join(process.cwd(), "public/portfolio");
    const markdownPath = path.join(portfolioDir, `${normalizedSlug}.md`);

    await fs.mkdir(portfolioDir, { recursive: true });
    await fs.mkdir(imageDir, { recursive: true });

    try {
      await fs.access(markdownPath);
      return {
        success: false,
        message: "같은 프로젝트 명의 포트폴리오가 이미 존재합니다.",
      };
    } catch {
      // 파일이 없으면 정상 흐름
    }

    if (thumbnail && thumbnail.size > 0) {
      const allowedImageMimeTypes = ["image/jpeg", "image/png"];
      if (!allowedImageMimeTypes.includes(thumbnail.type)) {
        return {
          success: false,
          message: "썸네일 이미지는 JPG 또는 PNG만 업로드할 수 있습니다.",
        };
      }

      //* 이미지 파일 저장
      const extension = thumbnail.type === "image/png" ? "png" : "jpg";
      const imageFileName = `${normalizedSlug}.${extension}`;
      const imagePath = path.join(imageDir, imageFileName);
      const imageBuffer = await thumbnail.arrayBuffer();
      await fs.writeFile(imagePath, Buffer.from(imageBuffer));

      //* Markdown 생성 및 저장
      const markdown = makeMarkdownContent({
        thumbnailPath: `/portfolio/${imageFileName}`,
        size: sizeArray,
        status,
        title,
        tags: tagsArray,
        createdAt: normalizedCreatedAt,
        publishedAt,
        githubLink,
        velogLink,
        summary,
        contents,
      });
      await fs.writeFile(markdownPath, markdown, "utf-8");

      //* gitHub에 업데이트

      const gitHubResponse = await updateFile(`${normalizedSlug}.md`, markdown);
      if (!gitHubResponse || !gitHubResponse.ok) {
        return {
          success: false,
          message: "GitHub 업데이트에 실패했습니다.",
        };
      }

      //* 캐시 재검증

      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath(`/portfolio/${normalizedSlug}`);
      redirect("/admin");
    }

    return { success: false, message: "썸네일 이미지를 선택해주세요." };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("Create portfolio error:", error);
    return {
      success: false,
      message: "포트폴리오 저장 중 오류가 발생했습니다.",
    };
  }
}

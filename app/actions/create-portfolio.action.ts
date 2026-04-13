"use server";

import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import { revalidatePath } from "next/cache";
import { updateFile } from "@/lib/update-file/updateFile";
import { setMarkdownContent } from "@/lib/portfolio/setMarkdownContent";

export interface CreatePortfolioState {
  success: boolean | null;
  message: string;
}

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

//* 새 포트폴리오를 이미지와 함께 저장하고 md 문서를 생성합니다.
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

    //* 3. Image GitHub에 저장 (파일이 있는 경우)
    if (thumbnail && thumbnail.size > 0) {
      if (
        !thumbnail.type ||
        !["image/jpeg", "image/png"].includes(thumbnail.type)
      ) {
        return {
          success: false,
          message: "썸네일 이미지는 JPG 또는 PNG만 업로드할 수 있습니다.",
        };
      }
      await updateFile(`public/portfolio/${normalizedSlug}.jpg`, thumbnail);
    }

    // *4 Markdown 파일 생성 및 저장

    //* Markdown 생성 및 저장
    const markdown = setMarkdownContent({
      thumbnailPath: `/public/portfolio/${slug.trim().toLowerCase()}.${thumbnail.type === "image/png" ? "png" : "jpg"}`,
      size: sizeArray,
      status,
      title,
      tags: tagsArray,
      createdAt: normalizedCreatedAt,
      githubLink,
      velogLink,
      summary,
      contents,
    });

    //* gitHub에 업데이트

    const gitHubResponse = await updateFile(`${normalizedSlug}.md`, markdown);
    if (!gitHubResponse || !gitHubResponse.success) {
      return {
        success: false,
        message: "GitHub 업데이트에 실패했습니다.",
      };
    }

    //* 캐시 재검증

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/portfolio/${normalizedSlug}`);

    return {
      success: true,
      message: "포트폴리오가 성공적으로 생성되었습니다.",
    };
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

"use server";

import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import { setMarkdownContent } from "@/lib/portfolio/setMarkdownContent";
import { updateFile } from "@/lib/update-file/updateFile";
import { revalidatePath } from "next/cache";

//* 입력된 날짜를 YYYY-MM-DD 형식으로 변환
function normalizeDate(input: string) {
  if (!input) {
    return new Date().toISOString().slice(0, 10);
  }

  return input.slice(0, 10);
}

export async function editPortfolio(
  _prevState: { success: boolean | null; message: string },
  formData: FormData,
): Promise<{ success: boolean | null; message: string }> {
  const isLoggedIn = await getLoginStatus();

  //* 1. 로그인 여부 확인
  if (!isLoggedIn) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  try {
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
      .filter((tag) => tag);
    if (tagsArray.length === 0) {
      return {
        success: false,
        message: "태그는 최소 한 개 이상 입력해야 합니다.",
      };
    }

    const sizeArray = size
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    if (sizeArray.length !== 2) {
      return {
        success: false,
        message: "프로젝트 사이즈는 2,1 처럼 두 개의 숫자로 입력해야 합니다.",
      };
    }

    if (
      sizeArray.some((s) => {
        const n = Number(s);
        return isNaN(n) || n < 1 || n > 3;
      })
    ) {
      return {
        success: false,
        message: "프로젝트 사이즈는 1에서 3 사이의 숫자여야 합니다.",
      };
    }

    const normalizedCreateAt = normalizeDate(createdAt);

    if (thumbnail && thumbnail.size !== 0) {
      if (
        !thumbnail.type ||
        !["image/jpeg", "image/png"].includes(thumbnail.type)
      ) {
        return {
          success: false,
          message: "썸네일은 JPG 또는 PNG 형식의 이미지 파일이어야 합니다.",
        };
      }
      const thumbnailResponse = await updateFile(
        `${normalizedSlug}.${thumbnail.type === "image/png" ? "png" : "jpg"}`,
        thumbnail,
      );
      if (!thumbnailResponse || !thumbnailResponse.success) {
        return {
          success: false,
          message: "썸네일 업로드에 실패했습니다.",
        };
      }
    }
    const markdown = setMarkdownContent({
      thumbnailPath: `portfolio/${slug.trim().toLowerCase()}.${thumbnail?.type === "image/png" ? "png" : "jpg"}`,
      size: sizeArray.map(Number),
      status,
      title,
      tags: tagsArray,
      createdAt: normalizedCreateAt,
      githubLink,
      velogLink,
      summary,
      contents,
    });

    const gitHubResponse = await updateFile(`${normalizedSlug}.md`, markdown);
    if (!gitHubResponse || !gitHubResponse.success) {
      return {
        success: false,
        message: "포트폴리오 수정 중 오류가 발생했습니다.",
      };
    }

    //* 캐시 재검증

    revalidatePath("/");
    revalidatePath(`/portfolio/${normalizedSlug}`);
    revalidatePath("/admin");

    return {
      success: true,
      message: "포트폴리오가 성공적으로 수정되었습니다.",
    };
  } catch (error) {
    console.error("Error editing portfolio:", error);
    return {
      success: false,
      message: "포트폴리오 수정 중 오류가 발생했습니다.",
    };
  }
}

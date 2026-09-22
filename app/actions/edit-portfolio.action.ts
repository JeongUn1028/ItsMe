"use server";

import { revalidatePath } from "next/cache";
import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import { commitFiles, type FileChange } from "@/lib/github/commitFiles";
import {
  portfolioMarkdownPath,
  portfolioThumbnailUrl,
  publicFilePath,
} from "@/lib/github/contentPaths";
import { parsePortfolioForm } from "@/lib/portfolio/parsePortfolioForm";
import { setMarkdownContent } from "@/lib/portfolio/setMarkdownContent";

type ActionState = { success: boolean | null; message: string };

//* 기존 포트폴리오를 수정합니다. 새 썸네일이 있으면 md 와 함께 한 커밋으로 반영합니다.
export async function editPortfolio(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  //* 1. 로그인 여부 확인
  if (!(await getLoginStatus())) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  //* 2. 폼 검증 (수정 시 썸네일은 선택)
  const parsed = parsePortfolioForm(formData, { requireThumbnail: false });
  if (!parsed.ok) {
    return { success: false, message: parsed.message };
  }
  const { thumbnail, slug, ...fields } = parsed.values;

  //* 3. 썸네일 경로 결정: 새 파일이 없으면 기존 경로를 그대로 유지합니다.
  const existingThumbnail =
    formData.get("existingThumbnail")?.toString().trim() ?? "";
  const thumbnailUrl = thumbnail
    ? portfolioThumbnailUrl(slug, thumbnail.type)
    : existingThumbnail;
  if (!thumbnailUrl) {
    return { success: false, message: "썸네일 이미지를 업로드해주세요." };
  }

  const markdown = setMarkdownContent({ ...fields, thumbnailPath: thumbnailUrl });

  const changes: FileChange[] = [
    { path: portfolioMarkdownPath(slug), content: markdown },
  ];
  if (thumbnail) {
    changes.unshift({ path: publicFilePath(thumbnailUrl), content: thumbnail });
    //* 확장자가 바뀌면(jpg → png 등) 이전 썸네일 파일은 제거합니다.
    if (existingThumbnail && existingThumbnail !== thumbnailUrl) {
      changes.push({ path: publicFilePath(existingThumbnail), delete: true });
    }
  }

  //* 4. 한 커밋으로 반영
  const result = await commitFiles(
    changes,
    `chore(file): Update portfolio ${slug} via API`,
  );
  if (!result.success) {
    return { success: false, message: "포트폴리오 수정 중 오류가 발생했습니다." };
  }

  //* 5. 캐시 재검증
  revalidatePath("/");
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath("/admin");

  return { success: true, message: "포트폴리오가 성공적으로 수정되었습니다." };
}

"use server";

import { revalidatePath } from "next/cache";
import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import { commitFiles } from "@/lib/github/commitFiles";
import {
  portfolioMarkdownPath,
  portfolioThumbnailUrl,
  publicFilePath,
} from "@/lib/github/contentPaths";
import { parsePortfolioForm } from "@/lib/portfolio/parsePortfolioForm";
import { setMarkdownContent } from "@/lib/portfolio/setMarkdownContent";

type ActionState = { success: boolean | null; message: string };

//* 새 포트폴리오의 md 문서와 썸네일을 한 커밋으로 GitHub 에 저장합니다.
export async function createPortfolio(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  //* 1. 로그인 여부 확인
  if (!(await getLoginStatus())) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  //* 2. 폼 검증
  const parsed = parsePortfolioForm(formData, { requireThumbnail: true });
  if (!parsed.ok) {
    return { success: false, message: parsed.message };
  }
  const { thumbnail, slug, ...fields } = parsed.values;
  //* requireThumbnail: true 이므로 여기서 thumbnail 은 항상 존재합니다.
  if (!thumbnail) {
    return { success: false, message: "썸네일 이미지를 업로드해주세요." };
  }

  //* 3. Markdown 생성
  const thumbnailUrl = portfolioThumbnailUrl(slug, thumbnail.type);
  const markdown = setMarkdownContent({ ...fields, thumbnailPath: thumbnailUrl });

  //* 4. 썸네일 + md 를 하나의 커밋으로 반영 (하나만 반영되는 상태를 막기 위해)
  const result = await commitFiles(
    [
      { path: publicFilePath(thumbnailUrl), content: thumbnail },
      { path: portfolioMarkdownPath(slug), content: markdown },
    ],
    `chore(file): Create portfolio ${slug} via API`,
  );
  if (!result.success) {
    return { success: false, message: "포트폴리오 저장 중 오류가 발생했습니다." };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true, message: "포트폴리오가 성공적으로 생성되었습니다." };
}

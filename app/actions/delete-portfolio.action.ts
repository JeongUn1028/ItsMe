"use server";

import { revalidatePath } from "next/cache";
import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import { commitFiles } from "@/lib/github/commitFiles";
import {
  portfolioMarkdownPath,
  publicFilePath,
} from "@/lib/github/contentPaths";

export async function deletePortfolioAction(
  _prevState: { success: boolean; message: string },
  formData: FormData,
): Promise<{ success: boolean; message: string }> {
  const slug = formData.get("slug")?.toString() ?? "";
  const thumbnail = formData.get("thumbnail")?.toString() ?? "";

  if (!slug || !thumbnail) {
    return { success: false, message: "포트폴리오 식별 정보가 부족합니다." };
  }

  const isLoggedIn = await getLoginStatus();
  if (!isLoggedIn) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  //* md 파일과 썸네일을 한 커밋으로 함께 삭제합니다.
  const result = await commitFiles(
    [
      { path: portfolioMarkdownPath(slug), delete: true },
      { path: publicFilePath(thumbnail), delete: true },
    ],
    `chore(file): Delete portfolio ${slug} via API`,
  );

  if (!result.success) {
    return { success: false, message: "포트폴리오 삭제에 실패했습니다." };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true, message: "포트폴리오가 성공적으로 삭제되었습니다." };
}

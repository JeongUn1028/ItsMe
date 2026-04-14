"use server";

import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import { deletePortfolio } from "@/lib/portfolio/deletePortfolio";

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

  try {
    const deleteResult = await deletePortfolio(slug, thumbnail);
    if (!deleteResult.success) {
      return { success: false, message: deleteResult.message };
    }

    return {
      success: true,
      message: "포트폴리오가 성공적으로 삭제되었습니다.",
    };
  } catch (error) {
    console.error("포트폴리오 삭제 중 오류:", error);
    return { success: false, message: "포트폴리오 삭제에 실패했습니다." };
  }
}

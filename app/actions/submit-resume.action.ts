"use server";

import { revalidatePath } from "next/cache";
import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import { commitFiles, type FileChange } from "@/lib/github/commitFiles";
import {
  publicFilePath,
  RESUME_IMAGE_URL,
  RESUME_JSON_PATH,
  RESUME_PDF_URL,
} from "@/lib/github/contentPaths";

interface ResumeState {
  success: boolean | null;
  message: string;
}

interface ResumeData {
  description: string;
  skills: string[];
  imagePath: string;
  pdfPath: string;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export async function submitResumeAction(
  _prevState: ResumeState,
  formData: FormData,
): Promise<ResumeState> {
  //* 1. 로그인 여부 확인
  if (!(await getLoginStatus())) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  //* 2. FormData 추출
  const description = formData.get("description")?.toString().trim() ?? "";
  const skillsInput = formData.get("skills")?.toString() ?? "";
  const imageFile = formData.get("thumbnail");
  const pdfFile = formData.get("pdf");

  if (!description || !skillsInput) {
    return { success: false, message: "모든 필드를 입력해주세요." };
  }

  const skills = skillsInput
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (skills.length === 0) {
    return { success: false, message: "최소 1개 이상의 기술을 입력해주세요." };
  }

  //* 3. 파일 검증 (업로드된 경우에만)
  const changes: FileChange[] = [];

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return {
        success: false,
        message: "프로필 이미지는 JPG 또는 PNG만 업로드할 수 있습니다.",
      };
    }
    changes.push({ path: publicFilePath(RESUME_IMAGE_URL), content: imageFile });
  }

  if (pdfFile instanceof File && pdfFile.size > 0) {
    if (pdfFile.type !== "application/pdf") {
      return { success: false, message: "이력서는 PDF 파일만 업로드할 수 있습니다." };
    }
    changes.push({ path: publicFilePath(RESUME_PDF_URL), content: pdfFile });
  }

  const newData: ResumeData = {
    description,
    skills,
    imagePath: RESUME_IMAGE_URL,
    pdfPath: RESUME_PDF_URL,
  };
  changes.push({ path: RESUME_JSON_PATH, content: newData });

  //* 4. 이미지/PDF/JSON 을 한 커밋으로 반영
  const result = await commitFiles(changes, "chore(file): Update resume via API");
  if (!result.success) {
    return { success: false, message: "GitHub 업데이트에 실패했습니다." };
  }

  //* 5. 캐시 재검증
  revalidatePath("/");
  revalidatePath("/admin");

  return { success: true, message: "레주메가 저장되었습니다." };
}

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
import { parseResumeForm } from "@/lib/resume/parseResumeForm";

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

export async function submitResumeAction(
  _prevState: ResumeState,
  formData: FormData,
): Promise<ResumeState> {
  //* 1. 로그인 여부 확인
  if (!(await getLoginStatus())) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  //* 2. 입력 검증
  const parsed = parseResumeForm(formData);
  if (!parsed.ok) {
    return { success: false, message: parsed.message };
  }
  const { description, skills, image, pdf } = parsed.values;

  //* 3. 업로드된 파일만 커밋 대상에 담는다
  const changes: FileChange[] = [];
  if (image) {
    changes.push({ path: publicFilePath(RESUME_IMAGE_URL), content: image });
  }
  if (pdf) {
    changes.push({ path: publicFilePath(RESUME_PDF_URL), content: pdf });
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

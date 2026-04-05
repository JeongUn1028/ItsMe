"use server";

import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth/getSession";
import { updateFile } from "@/lib/update-file/updateFile";

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
  const isLoggedIn = await getSession();
  if (!isLoggedIn) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  try {
    //* 2. FormData에서 텍스트 데이터 추출
    const description = formData.get("description")?.toString() ?? "";
    const skillsInput = formData.get("skills")?.toString() ?? "";
    const imageFile = formData.get("image") as File | null;
    const pdfFile = formData.get("pdf") as File | null;
    const allowedImageMimeTypes = ["image/jpeg", "image/png"];

    if (!description || !skillsInput) {
      return { success: false, message: "모든 필드를 입력해주세요." };
    }

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skills.length === 0) {
      return {
        success: false,
        message: "최소 1개 이상의 기술을 입력해주세요.",
      };
    }

    //* 3. 파일 저장 (있는 경우만)
    const imagePath = "/resume/profile.jpg";
    const pdfPath = "/resume/resume.pdf";

    if (imageFile && imageFile.size > 0) {
      if (!allowedImageMimeTypes.includes(imageFile.type)) {
        return {
          success: false,
          message: "프로필 이미지는 JPG 또는 PNG만 업로드할 수 있습니다.",
        };
      }

      const imageDir = path.join(process.cwd(), "public/resume");
      await fs.mkdir(imageDir, { recursive: true });

      const imageBuffer = await imageFile.arrayBuffer();
      const imageSavePath = path.join(imageDir, "profile.jpg");
      await fs.writeFile(imageSavePath, Buffer.from(imageBuffer));
    }

    if (pdfFile && pdfFile.size > 0) {
      if (!pdfFile.type || pdfFile.type !== "application/pdf") {
        return {
          success: false,
          message: "이력서는 PDF 파일만 업로드할 수 있습니다.",
        };
      }
      const pdfDir = path.join(process.cwd(), "public/resume");
      const pdfBuffer = await pdfFile.arrayBuffer();
      const pdfSavePath = path.join(pdfDir, "resume.pdf");
      await fs.writeFile(pdfSavePath, Buffer.from(pdfBuffer));
    }

    //* 4. 새로운 데이터 생성 (기존 데이터는 무시)
    const newData: ResumeData = {
      description,
      skills,
      imagePath,
      pdfPath,
    };

    //* 5. resume.json 저장
    const resumePath = path.join(process.cwd(), "content/resume.json");
    await fs.writeFile(resumePath, JSON.stringify(newData, null, 2), "utf-8");

    //* 6. GitHub에 업데이트
    const gitHubResponse = await updateFile("resume.json", newData);
    if (!gitHubResponse || !gitHubResponse.ok) {
      return {
        success: false,
        message: "GitHub 업데이트에 실패했습니다.",
      };
    }

    //* 7. 캐시 재검증
    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "레주메가 저장되었습니다." };
  } catch (error) {
    console.error("Resume update error:", error);
    return {
      success: false,
      message: "저장 중 오류가 발생했습니다.",
    };
  }
}

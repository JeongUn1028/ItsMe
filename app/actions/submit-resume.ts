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

export async function submitResumeAction(
  _prevState: ResumeState,
  formData: FormData,
): Promise<ResumeState> {
  const isLoggedIn = await getSession();
  if (!isLoggedIn) {
    return { success: false, message: "로그인이 필요합니다." };
  }

  try {
    const description = formData.get("description")?.toString() ?? "";
    const skillsInput = formData.get("skills")?.toString() ?? "";

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

    const resumePath = path.join(process.cwd(), "content/resume.json");
    await fs.writeFile(
      resumePath,
      JSON.stringify({ description, skills }, null, 2),
      "utf-8",
    );
    await updateFile("resume.json", { description, skills });

    revalidatePath("/");

    return { success: true, message: "레주메가 저장되었습니다." };
  } catch (error) {
    console.error("Resume update error:", error);
    return {
      success: false,
      message: "저장 중 오류가 발생했습니다.",
    };
  }
}

"use client";

import Link from "next/link";
import style from "./page.module.css";
import { getResume } from "@/lib/resume/getResume";
import { useActionState, useEffect, useState } from "react";
import { submitResumeAction } from "@/app/actions/submit-resume.action";
import ImageUpload from "@/app/components/common/ImageUpload";
import { DescriptionSection } from "./components/DescriptionSection";
import { SkillsSection } from "./components/SkillsSection";
import { PdfUploadSection } from "./components/PdfUploadSection";

//* Resume Edit Page
export default function EditResumeForm() {
  const [resume, setResume] = useState<{
    description: string;
    skills: string[];
    imagePath: string;
    pdfPath: string;
  }>({ description: "", skills: [], imagePath: "", pdfPath: "" });

  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [pdfHover, setPdfHover] = useState(false);

  const [state, formAction, isPending] = useActionState(submitResumeAction, {
    success: null,
    message: "",
  });

  useEffect(() => {
    const { description, skills, imagePath, pdfPath } = getResume();
    setResume({ description, skills, imagePath, pdfPath });
  }, []);

  const handlePdfSelect = (file: File | null) => {
    if (file && file.type === "application/pdf") {
      setSelectedPdfFile(file);
    }
  };

  const handlePdfDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPdfHover(true);
  };

  const handlePdfDragLeave = () => {
    setPdfHover(false);
  };

  const handlePdfDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setPdfHover(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") {
      handlePdfSelect(file);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1 className={style.title}>레주메 수정</h1>
      </div>

      <form className={`${style.form} glass`} action={formAction}>
        {/* 이미지 업로드 섹션 */}
        <ImageUpload initialUrl={resume.imagePath} />
        {/* Description 섹션 */}
        <DescriptionSection description={resume.description} />
        {/* Skills 섹션 */}
        <SkillsSection skills={resume.skills} />
        {/* PDF 업로드 섹션 */}
        <PdfUploadSection
          selectedPdfFile={selectedPdfFile}
          pdfPath={resume.pdfPath}
          pdfHover={pdfHover}
          onPdfSelect={handlePdfSelect}
          onPdfDragOver={handlePdfDragOver}
          onPdfDragLeave={handlePdfDragLeave}
          onPdfDrop={handlePdfDrop}
        />
        {/* 상태 메시지 */}
        {state.message && (
          <div
            className={
              state.success
                ? `${style.alert} ${style.alertSuccess}`
                : `${style.alert} ${style.alertError}`
            }
          >
            {state.message}
          </div>
        )}
        {/* 액션 버튼 */}
        <div className={style.actions}>
          <button
            type="submit"
            className={style.saveButton}
            disabled={isPending}
          >
            {isPending ? "저장 중..." : "저장"}
          </button>
          <Link href="/admin" className={style.cancelLink}>
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}

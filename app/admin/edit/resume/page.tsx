"use client";

import Link from "next/link";
import style from "./page.module.css";
import { getResume } from "@/lib/resume/getResume";
import { useActionState, useEffect, useState } from "react";
import { submitResumeAction } from "@/app/actions/submit-resume";
import { ImageUploadSection } from "./components/ImageUploadSection";
import { DescriptionSection } from "./components/DescriptionSection";
import { SkillsSection } from "./components/SkillsSection";
import { PdfUploadSection } from "./components/PdfUploadSection";

//* Resume Edit Page
export default function Page() {
  const [resume, setResume] = useState<{
    description: string;
    skills: string[];
    imagePath: string;
    pdfPath: string;
  }>({ description: "", skills: [], imagePath: "", pdfPath: "" });

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [imageHover, setImageHover] = useState(false);
  const [pdfHover, setPdfHover] = useState(false);
  const allowedImageMimeTypes = ["image/jpeg", "image/png"];

  const [state, formAction, isPending] = useActionState(submitResumeAction, {
    success: null,
    message: "",
  });

  useEffect(() => {
    const { description, skills, imagePath, pdfPath } = getResume();
    setResume({ description, skills, imagePath, pdfPath });
    setImagePreview(imagePath);
  }, []);

  const handleImageSelect = (file: File | null) => {
    if (file && allowedImageMimeTypes.includes(file.type)) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDragLeave = () => {
    setImageHover(false);
  };

  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setImageHover(true);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setImageHover(false);
    const file = e.dataTransfer.files?.[0];
    if (file && allowedImageMimeTypes.includes(file.type)) {
      handleImageSelect(file);
    }
  };

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
        <ImageUploadSection
          selectedImageFile={selectedImageFile}
          imagePreview={imagePreview}
          imageHover={imageHover}
          onImageSelect={handleImageSelect}
          onImageDragOver={handleImageDragOver}
          onImageDragLeave={handleImageDragLeave}
          onImageDrop={handleImageDrop}
        />
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

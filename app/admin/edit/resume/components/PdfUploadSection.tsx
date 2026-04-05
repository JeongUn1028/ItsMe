"use client";

import style from "../page.module.css";
import { useRef } from "react";

interface PdfUploadSectionProps {
  selectedPdfFile: File | null;
  pdfPath: string;
  pdfHover: boolean;
  onPdfSelect: (file: File | null) => void;
  onPdfDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onPdfDragLeave: () => void;
  onPdfDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function PdfUploadSection({
  selectedPdfFile,
  pdfPath,
  pdfHover,
  onPdfSelect,
  onPdfDragOver,
  onPdfDragLeave,
  onPdfDrop,
}: PdfUploadSectionProps) {
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onPdfSelect(file);
  };

  return (
    <div className={style.uploadSection}>
      <label className={style.label}>이력서 PDF</label>
      <div
        className={`${style.uploadArea} ${pdfHover ? style.dragover : ""}`}
        onDragOver={onPdfDragOver}
        onDragLeave={onPdfDragLeave}
        onDrop={onPdfDrop}
        onClick={() => pdfInputRef.current?.click()}
      >
        <input
          ref={pdfInputRef}
          type="file"
          name="pdf"
          accept="application/pdf"
          className={style.fileInput}
          onChange={handlePdfChange}
        />
        <div className={style.uploadAreaInner}>
          <div className={style.uploadIcon}>📄</div>
          <div className={style.uploadText}>PDF를 여기에 드래그하거나</div>
          <button
            type="button"
            className={style.uploadButton}
            onClick={(e) => {
              e.stopPropagation();
              pdfInputRef.current?.click();
            }}
          >
            파일 선택
          </button>
          <div className={style.uploadHint}>PDF 형식만 지원합니다</div>
        </div>
      </div>
      {selectedPdfFile && (
        <div className={style.pdfPreview}>
          <div className={style.pdfInfo}>
            <div className={style.pdfIcon}>📎</div>
            <div className={style.pdfDetails}>
              <div className={style.pdfName}>{selectedPdfFile.name}</div>
              <div className={style.pdfSize}>
                {(selectedPdfFile.size / 1024).toFixed(2)} KB
              </div>
            </div>
          </div>
          <button
            type="button"
            className={style.pdfButton}
            onClick={() => onPdfSelect(null)}
          >
            삭제
          </button>
        </div>
      )}
      {pdfPath && !selectedPdfFile && (
        <div className={style.pdfPreview}>
          <div className={style.pdfInfo}>
            <div className={style.pdfIcon}>📎</div>
            <div className={style.pdfDetails}>
              <div className={style.pdfName}>현재 이력서</div>
              <div className={style.pdfSize}>업로드 완료</div>
            </div>
          </div>
          <a
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className={style.pdfButton}
          >
            보기
          </a>
        </div>
      )}
    </div>
  );
}

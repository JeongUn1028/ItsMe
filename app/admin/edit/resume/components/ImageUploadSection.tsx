"use client";

import Image from "next/image";
import style from "../page.module.css";
import { useRef } from "react";

interface ImageUploadSectionProps {
  selectedImageFile: File | null;
  imagePreview: string;
  imageHover: boolean;
  onImageSelect: (file: File | null) => void;
  onImageDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onImageDragLeave: () => void;
  onImageDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function ImageUploadSection({
  selectedImageFile,
  imagePreview,
  imageHover,
  onImageSelect,
  onImageDragOver,
  onImageDragLeave,
  onImageDrop,
}: ImageUploadSectionProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageSelect(file);
  };

  return (
    <div className={style.uploadSection}>
      <label className={style.label}>프로필 이미지</label>
      <div className={style.imageUploadWrapper}>
        <div className={style.uploadAreaWrapper}>
          <div
            className={`${style.uploadArea} ${imageHover ? style.dragover : ""}`}
            onDragOver={onImageDragOver}
            onDragLeave={onImageDragLeave}
            onDrop={onImageDrop}
            onClick={() => imageInputRef.current?.click()}
          >
            <input
              ref={imageInputRef}
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className={style.fileInput}
              onChange={handleImageChange}
            />
            <div className={style.uploadAreaInner}>
              <div className={style.uploadIcon}>🖼️</div>
              <div className={style.uploadText}>
                이미지를 여기에 드래그하거나
              </div>
              <button
                type="button"
                className={style.uploadButton}
                onClick={(e) => {
                  e.stopPropagation();
                  imageInputRef.current?.click();
                }}
              >
                파일 선택
              </button>
              <div className={style.uploadHint}>JPG, PNG 형식만 지원합니다</div>
            </div>
          </div>
          {selectedImageFile && (
            <div className={style.fileName}>✓ {selectedImageFile.name}</div>
          )}
        </div>
        {imagePreview && (
          <div className={style.previewContainer}>
            <Image
              src={imagePreview}
              alt="Preview"
              width={200}
              height={200}
              className={style.previewImage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

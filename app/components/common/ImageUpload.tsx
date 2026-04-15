"use client";

import Image from "next/image";
import style from "./ImageUpload.module.css";
import { useState } from "react";

export default function ImageUpload({ initialUrl }: { initialUrl?: string }) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialUrl || null,
  );
  const [isDragOver, setIsDragOver] = useState(false);

  const handleThumbnailChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleThumbnailChange(file || null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      handleThumbnailChange(file);
    }
  };

  return (
    <div className={style.thumbnailSection}>
      <label className={style.fieldGroup}>
        <span className={style.label}>썸네일</span>
        <div
          className={style.thumbnailUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-drag-over={isDragOver}
        >
          <div className={style.uploadArea}>
            {thumbnailPreview ? (
              <div className={style.previewContainer}>
                <Image
                  src={thumbnailPreview}
                  alt="썸네일 미리보기"
                  width={300}
                  height={200}
                  className={style.thumbnailPreview}
                />
                <label htmlFor="thumbnail" className={style.changeButton}>
                  변경
                </label>
              </div>
            ) : (
              <div className={style.emptyState}>
                <div className={style.uploadIcon}>📸</div>
                <p className={style.uploadText}>이미지를 여기에 드래그하거나</p>
                <label htmlFor="thumbnail" className={style.uploadLink}>
                  클릭해서 선택
                </label>
              </div>
            )}
            <input
              id="thumbnail"
              type="file"
              name="thumbnail"
              accept="image/jpeg,image/png"
              onChange={handleFileInputChange}
              className={style.fileInput}
            />
          </div>
        </div>
      </label>
    </div>
  );
}

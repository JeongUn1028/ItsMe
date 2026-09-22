"use client";
import Image from "next/image";
import style from "./resume.module.css";
import { useState, type CSSProperties } from "react";
import { getResume } from "@/lib/resume/getResume";

export default function Resume() {
  const [isShowingDescription, setIsShowingDescription] = useState(false);
  const { description, skills, imagePath, pdfPath } = getResume();

  return (
    <div
      className={`glass fade-up ${style.card}`}
      style={{ "--i": 0 } as CSSProperties}
    >
      <h1 className={style.title}>ABOUT ME/RESUME</h1>
      <div
        className={`${style.content} ${isShowingDescription ? style.desktopDescription : style.desktopPhoto}`}
      >
        <div className={style.imageWrap}>
          <Image
            src={imagePath}
            alt="profile image"
            width={220}
            height={220}
            className={style.image}
          />
        </div>
        <div className={style.textWrap}>
          <div className={style.description}>{description}</div>
          <div className={style.skills}>
            <ul>
              {skills.map((skill, index) => (
                <li key={index} className={style.skill}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div className={style.actions}>
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className={style.resumeLink}
            >
              Resume PDF 보기
            </a>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={style.toggleButton}
        onClick={() => setIsShowingDescription((prev) => !prev)}
      >
        {isShowingDescription ? "사진 보기" : "소개글 보기"}
      </button>
    </div>
  );
}

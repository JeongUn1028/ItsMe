"use client";
import Image from "next/image";
import style from "./resume.module.css";
import { useState } from "react";
import { getResume } from "@/lib/resume/getResume";

export default function Resume() {
  const [isShowingDescription, setIsShowingDescription] = useState(false);
  const { description, skills } = getResume();

  return (
    <div className={`glass ${style.card}`}>
      <h1 className={style.title}>ABOUT ME/RESUME</h1>
      <div
        className={`${style.content} ${isShowingDescription ? style.desktopDescription : style.desktopPhoto}`}
      >
        <div className={style.imageWrap}>
          <Image
            src="/profile.JPG"
            alt="profile image"
            width={220}
            height={220}
            className={style.image}
          />
        </div>
        <div className={style.textWrap}>
          <p className={style.description}>{description}</p>
          <ul className={style.skills}>
            {skills.map((skill, index) => (
              <li key={index} className={style.skill}>
                {skill}
              </li>
            ))}
          </ul>
          <div className={style.actions}>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={style.resumeLink}
            >
              Resume PDF 보기
            </a>
            <p className={style.linkText}>
              public/resume.pdf 파일을 업로드하면 링크가 바로 연결됩니다.
            </p>
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

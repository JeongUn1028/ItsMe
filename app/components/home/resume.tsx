"use client";

import { useState } from "react";
import Image from "next/image";
import style from "./resume.module.css";

export default function Resume() {
  const [isShowingDescription, setIsShowingDescription] = useState(false);

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
          <p className={style.description}>
            단순히 화면을 구현하는 것을 넘어, 문제를 정의하고 서비스의 전체
            흐름을 설계하는 프론트엔드 개발자를 지향합니다. 이 포트폴리오는
            기획, 설계, 구현, 테스트, 배포까지 전 과정을 직접 수행하며 쌓아온
            경험을 담아낸 결과물입니다. 사용자 관점에서 더 나은 경험을 만들기
            위해 꾸준히 개선하고, 팀과 함께 제품의 완성도를 높이는 개발자로
            성장하고 있습니다.
          </p>
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

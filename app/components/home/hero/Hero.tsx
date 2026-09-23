import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getResume } from "@/lib/resume/getResume";
import { GITHUB_URL, VELOG_URL } from "@/lib/profile/links";
import style from "./Hero.module.css";

const NAME = "이정운";

/**
 * 홈 최상단 위젯. 이름 · 포지셔닝 한 줄 · 주력 기술 · 행동 유도를 한 화면에 담는다.
 *
 * 포지셔닝 문구는 `content/resume.json` 소개글의 첫 줄을 그대로 쓴다.
 * 관리자 화면에서 소개글을 고치면 여기도 함께 바뀐다.
 */
export default function Hero() {
  const { description, skills, imagePath, pdfPath } = getResume();
  //* 첫 줄은 포지셔닝 문구, 둘째 줄까지는 항상 노출하고 나머지는 접는다.
  const [headline, lead, ...rest] = description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <section
      className={`glass fade-up ${style.card}`}
      style={{ "--i": 0 } as CSSProperties}
      aria-labelledby="hero-name"
    >
      <div className={style.header}>
        <div className={style.imageWrap}>
          <Image
            src={imagePath}
            alt=""
            width={220}
            height={220}
            sizes="(max-width: 639px) 80px, 104px"
            priority
            className={style.image}
          />
        </div>
        <div className={style.identity}>
          <h1 id="hero-name" className={style.name}>
            {NAME}
          </h1>
          <p className={style.headline}>{headline}</p>
        </div>
      </div>

      {lead && <p className={style.lead}>{lead}</p>}

      {rest.length > 0 && (
        <details className={style.more}>
          <summary className={style.moreSummary}>
            소개 더 보기
          </summary>
          <div className={style.moreText}>{rest.join("\n\n")}</div>
        </details>
      )}

      <div className={style.aside}>
        {/* 칩(정보)과 버튼(행동)이 같은 캡슐이라 한 덩어리로 읽혔다.
            이름표와 크기로 역할을 갈라 준다. (#69) */}
        <div className={style.skillGroup}>
          <p id="skills-label" className={style.asideLabel}>
            주력 기술
          </p>
          <ul aria-labelledby="skills-label" className={style.skills}>
            {skills.map((skill) => (
              <li key={skill} className={`chip ${style.skill}`}>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className={style.actions}>
          <Link
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className={`pill ${style.action}`}
          >
            이력서 PDF
          </Link>
          {/* 액센트는 주요 행동(이력서)에만. 나머지는 중성 톤으로 둔다. (#66) */}
          <Link
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`pill pill-neutral ${style.action}`}
          >
            GitHub
          </Link>
          <Link
            href={VELOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`pill pill-neutral ${style.action}`}
          >
            Velog
          </Link>
        </div>
      </div>
    </section>
  );
}

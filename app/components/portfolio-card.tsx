//* 포트폴리오 container를 클릭하면 상세 페이지로 이동
//* 왼쪽사이드에 썸네일, 오른쪽 사이드에 프로젝트 제목, 설명, 태그가 보이는 형태

import { Project } from "@/lib/projects/types";
import Image from "next/image";

//* 프로젝트를 받아서 포트폴리오를 카드 형태로 렌더링
export default function PortfolioCard(project: Project) {
  const { thumbnail, title, summary, tags } = project;
  return (
    <div>
      <div>
        {/* <Image src={thumbnail} alt={title} width={500} height={300} /> */}
      </div>
      <div>
        <h2>{title}</h2>
        <p>{summary}</p>
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

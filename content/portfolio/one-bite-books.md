---
thumbnail: "/portfolio/one-bite-books.png"
size: [1, 2]
status: "published"
title: "한입북스를 통해 배운 NextJS"
tags: ["Next.js", "TypeScript"]
createdAt: "2026-08-11"
githubLink: "https://github.com/JeongUn1028/App-Router-Onebite-books"
velogLink: "https://velog.io/@jeongun1028/Next.js-%EA%B8%B0%EB%B0%98-Static-Portfolio-%EA%B5%AC%EC%B6%95"
summary: "📚 ONEBITE BOOKS
Next.js App Router 기반의 도서 목록 / 검색 / 상세 / 리뷰 예제 프로젝트입니다. 한입북스 강의를 기반으로 App Router의 라우팅, 데이터 페칭, 캐싱, 스트리밍, 서버 액션, 고급 라우팅 패턴, 최적화 기법을 학습하고 구현했습니다."
---
🔗 배포 링크: https://one-bite-books-app-tawny.vercel.app/

🛠 기술 스택
Next.js 15
React 19
TypeScript
Server Components + Client Components
Server Actions
Parallel Routes / Intercepting Routes
✨ 주요 기능
홈에서 추천 도서, 전체 도서 목록 조회
검색어 기반 도서 검색
도서 상세 정보 조회
리뷰 등록 / 삭제 (Server Action)
revalidateTag 기반 리뷰 목록 갱신
모달 인터셉트 라우팅 (@modal/(.)book/[id])
글로벌 에러 및 라우트 단위 에러 처리
🗂 라우트 구조
경로	설명
/	홈 (추천 도서 + 전체 도서)
/search?q=키워드	검색 결과
/book/[id]	도서 상세
/parallel	Parallel Route 예제

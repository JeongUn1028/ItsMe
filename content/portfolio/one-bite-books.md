---
thumbnail: "/portfolio/one-bite-books.png"
size: [1, 2]
status: "published"
title: "ONEBITE BOOKS — App Router 학습 프로젝트"
tags: ["Next.js 15", "React 19", "Server Actions"]
createdAt: "2026-08-11"
githubLink: "https://github.com/JeongUn1028/App-Router-Onebite-books"
velogLink: ""
summary: "도서 목록·검색·상세·리뷰를 구현하며 Next.js App Router의 캐싱, 스트리밍, Server Action, Parallel/Intercepting Route를 익힌 학습 프로젝트입니다. 여기서 정리한 패턴이 이후 ItsMe와 ReelTrailer의 뼈대가 되었습니다."
---

🔗 **Live**: [one-bite-books-app-tawny.vercel.app](https://one-bite-books-app-tawny.vercel.app/) · **Code**: [github.com/JeongUn1028/App-Router-Onebite-books](https://github.com/JeongUn1028/App-Router-Onebite-books)

## 무엇을 만들었나

"한입 크기로 잘라먹는 Next.js" 강의를 따라가며 만든 도서 서비스입니다. 강의 코드를 옮겨 적는 데서 끝내지 않고, **App Router의 각 기능이 어떤 문제를 풀기 위해 존재하는지**를 직접 실험하며 정리하는 것이 목표였습니다.

- 홈: 추천 도서 + 전체 도서 목록
- 검색: `?q=키워드` 기반 검색 결과
- 상세: 도서 정보 + 리뷰 목록
- 리뷰 등록/삭제 → Server Action + `revalidateTag`로 즉시 반영
- 목록에서 상세 진입 시 모달, URL 직접 접근 시 페이지 (`@modal/(.)book/[id]`)
- 라우트 단위 `error.tsx`와 전역 에러 처리

## 기술 스택

Next.js 15 App Router · React 19 · TypeScript · Server/Client Components · Server Actions · Parallel & Intercepting Routes

## 여기서 익힌 것

### 캐시는 네 층이다

같은 "캐시"라도 Request Memoization, Data Cache, Full Route Cache, Router Cache가 각각 다른 시점에 다른 범위를 담당한다는 것을 몸으로 익혔습니다. 이 프로젝트에서는 용도별로 다르게 썼습니다.

- 목록/상세 fetch → `cache: "force-cache"` 로 정적 캐시
- 추천 목록 → `revalidate: 3` 으로 주기적 재검증
- 리뷰 → `next: { tags: ["review-{bookId}"] }` 를 달고, 등록·삭제 후 `revalidateTag` 로 해당 도서만 갱신

`revalidatePath` / `revalidateTag` 한 번으로 서버 캐시(Data · Full Route)와 클라이언트 캐시(Router)가 연쇄 무효화되는 흐름을 확인한 것이 가장 큰 수확이었습니다.

### 스트리밍과 Suspense

헤더·푸터처럼 정적인 부분은 빌드 타임에, 데이터가 필요한 부분은 `Suspense` 로 감싸 스켈레톤을 먼저 보내고 준비되는 대로 스트리밍합니다. 쿼리 파라미터가 바뀔 때 스켈레톤을 다시 띄우려면 `Suspense` 에 `key` 가 필요하다는 것, React 19의 `use()` 로 `params` Promise를 하위 컴포넌트에서 풀면 상위 페이지를 정적으로 유지할 수 있다는 것을 배웠습니다.

### Server Action 과 폼 상태

`useActionState` 로 액션 결과와 `isPending` 을 관리해 중복 제출을 막고, `useFormStatus` 는 `<form>` 자식에서만 동작하므로 제출 버튼을 별도 컴포넌트로 분리했습니다. 이 패턴은 ItsMe의 관리자 폼에 그대로 재사용했습니다.

### Parallel + Intercepting Route = 모달

`@slot` 폴더로 병렬 렌더링하고 `(.)` 로 같은 레벨의 라우트를 가로채면, 클라이언트 네비게이션일 때만 모달로 열리고 새로고침하면 원래 페이지가 열립니다. 슬롯에 `default.tsx` 가 없으면 새로고침 시 404가 나는 함정도 여기서 겪었습니다.

## 이 프로젝트가 남긴 것

여기서 정리한 라우팅·캐싱·Server Action 패턴이 이후 **ItsMe**(포트폴리오 CMS)와 **ReelTrailer**(OTT 탐색 서비스)의 뼈대가 되었습니다. 학습 정리는 리포지토리 README에 항목별로 남겨 두었습니다.

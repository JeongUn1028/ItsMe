---
thumbnail: "/portfolio/itsme.png"
size: [2, 1]
status: "published"
title: "ItsMe — 직접 운영하는 포트폴리오 사이트"
tags: ["Next.js 15", "TypeScript", "Server Actions", "GitHub API", "Playwright"]
createdAt: "2026-04-26"
githubLink: "https://github.com/JeongUn1028/ItsMe"
velogLink: "https://velog.io/@jeongun1028/series/ItsMe"
summary: "지금 보고 계신 이 사이트입니다. DB 없이 GitHub 리포지토리를 콘텐츠 저장소로 쓰는 관리자 CMS를 함께 만들어, 글을 쓰면 커밋이 되고 배포가 되는 구조로 혼자서도 계속 운영할 수 있게 설계했습니다."
---

🔗 **Live**: [leejeongun.com](https://leejeongun.com) · **Code**: [github.com/JeongUn1028/ItsMe](https://github.com/JeongUn1028/ItsMe) · **개발기 시리즈**: [Velog](https://velog.io/@jeongun1028/series/ItsMe)

## 무엇을 만들었나

지금 보고 계신 이 사이트입니다. 소개 페이지 하나로 끝내지 않고, **콘텐츠를 직접 관리하고 계속 운영할 수 있는 구조**를 목표로 했습니다.

- **공개 영역** — iOS 위젯 그리드를 차용한 홈, 포트폴리오 목록/상세, Velog 최신 글 자동 연동
- **관리자 영역** — 로그인 후 포트폴리오 작성·수정·삭제, 이력서 갱신. 저장하면 GitHub 리포지토리에 커밋되고 Vercel이 재배포합니다
- **테마** — 시스템 설정을 따르는 다크 모드와 수동 토글, iOS "투명도 감소" 설정(`prefers-reduced-transparency`) 대응
- **품질** — Vitest 단위 테스트와 Playwright E2E(데스크톱·모바일)로 레이아웃 회귀까지 자동 검증

## 기술 스택

- **Framework** Next.js 15 App Router, React 19, TypeScript
- **Styling** CSS Modules + Tailwind CSS v4, 디자인 토큰 기반 라이트/다크 테마
- **Content** Markdown(frontmatter) → `next-mdx-remote` 렌더링
- **Auth** `jose` JWT + httpOnly 쿠키, Middleware 라우트 보호, `scrypt` 비밀번호 해시
- **Storage** GitHub Git Data API(`octokit`) — 리포지토리가 곧 데이터베이스
- **Test** Vitest + Testing Library, Playwright
- **Deploy** Vercel

## 핵심 설계와 결정

### 1. 상세 화면을 "URL이 있는 모달"로

목록에서 카드를 누르면 맥락을 유지한 채 모달이 열리고, 같은 URL을 새로고침하거나 공유하면 독립 페이지로 열립니다. 모달의 열림 상태를 클라이언트 state가 아니라 **Intercepting Route + Parallel Route로 URL에 귀속**시켰기 때문에, 뒤로가기·공유·새로고침이 모두 자연스럽게 동작합니다.

- 트레이드오프: 구조가 복잡해지는 대신 UX 일관성과 URL 기반 상태를 얻었습니다
- 모달은 `role="dialog"`, 열릴 때 포커스 이동, `Esc` 닫기, 모션 감소 설정 대응까지 처리했습니다

### 2. DB 대신 GitHub 리포지토리

개인 포트폴리오 콘텐츠에 별도 DB나 CMS를 운영하는 것은 과합니다. Markdown 파일을 Single Source of Truth로 두고, 관리자 화면의 저장은 곧 **GitHub 커밋**이 되도록 했습니다. 변경 이력이 Git에 남고, 운영 비용이 없습니다.

포트폴리오 하나는 md 문서와 썸네일 두 파일입니다. 파일마다 Contents API를 호출하면 중간 실패 시 한쪽만 반영되는 문제가 있어, **Git Data API로 blob → tree → commit → ref를 직접 만들어 여러 파일을 단일 커밋으로 원자적으로 반영**하는 `commitFiles()` 하나로 생성·수정·삭제를 통합했습니다.

### 3. 인증은 필요한 만큼만

관리자는 한 명입니다. 세션 저장소 없이 **JWT + httpOnly 쿠키**로 인증하고 Middleware에서 `/admin/*`을 보호합니다. 비밀번호는 평문 비교 대신 Node 내장 `scrypt` 해시를 `timingSafeEqual`로 비교하며, 아이디가 틀려도 응답 시간이 달라지지 않도록 했습니다. Refresh Token은 의도적으로 두지 않았습니다.

### 4. 디자인 토큰이 곧 테마

iOS 글래스 머티리얼을 차용하면서 색·반경·모션을 전부 `:root` 토큰으로 올렸습니다. 덕분에 다크 모드는 토큰 값 세트 하나를 추가하는 일이 되었고, 첫 페인트 전에 저장된 테마를 적용해 깜빡임 없이 전환됩니다.

## 테스트로 지키는 것

- **단위**: 폼 검증, 마크다운 파싱, 인증 로직, 테마 토글
- **E2E**: 390px에서 가로 넘침 없음, 카드 밖으로 콘텐츠가 넘치지 않음, 키보드만으로 모달 열고 닫기, 테마가 새로고침 후에도 유지, 투명도 감소 설정에서 블러 제거

CSS 리팩토링 중 E2E가 1280px에서 5px 넘치는 카드와 인터셉트 라우트가 깨진 dev 환경을 잡아냈습니다. 눈으로 확인하는 것만으로는 놓쳤을 회귀였습니다.

## 데이터 흐름

```text
관리자 입력
  → Server Action (검증)
  → commitFiles(): blob → tree → commit → ref   (md + 이미지 = 1 커밋)
  → GitHub push → Vercel 재배포
  → 공개 페이지 갱신
```

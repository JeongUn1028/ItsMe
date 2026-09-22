---
thumbnail: "/portfolio/reeltrailer-next.png"
size: [2, 1]
status: "published"
title: "ReelTrailer — 국내 OTT 통합 탐색 서비스"
tags: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL", "TanStack Query", "Vercel Cron"]
createdAt: "2026-08-31"
githubLink: "https://github.com/JeongUn1028/reeltrailer-next"
velogLink: "https://velog.io/@jeongun1028/series/ReelTrailer"
summary: "TMDB 데이터로 영화·TV를 탐색하고 Netflix, Disney+, Tving, Watcha, Wavve 중 어디서 볼 수 있는지 보여주는 풀스택 서비스입니다. React CSR 버전을 Next.js App Router로 전면 재구축해 Lighthouse 성능 91→100, SEO 92→100을 달성했고, 서버리스 환경의 DB 커넥션·리전 지연 문제를 직접 해결했습니다."
---

🔗 **Live**: [reeltrailer.vercel.app](https://reeltrailer.vercel.app/) · **Code**: [github.com/JeongUn1028/reeltrailer-next](https://github.com/JeongUn1028/reeltrailer-next) · **회고 시리즈**: [Velog](https://velog.io/@jeongun1028/series/ReelTrailer)

## 무엇을 만들었나

"이 영화, 어느 OTT에 있지?"를 한 화면에서 답해 주는 서비스입니다. TMDB 데이터를 매일 동기화해 **국내 구독형 OTT 5곳의 제공 여부**와 예고편을 함께 보여줍니다.

- **예고편 쇼케이스** — 인기 영화 예고편 플레이어 + 재생 목록 (YouTube 임베드)
- **OTT별 탐색** — `/netflix`, `/disney-plus`, `/tving`, `/watcha`, `/wavve`
- **추천 목록** — 신작 / 영화 / TV / 장르별, 전체·영화·TV 토글, 인기순·최신순·평점순 정렬, `/browse` 에서 페이지네이션
- **통합 검색** — 제목·원제 검색, 자동완성, 최근 검색어, 결과 유형 탭
- **상세** — backdrop 히어로, 예고편, OTT 바로가기, 비슷한 콘텐츠. 카드에서 열면 모달, URL로 열면 페이지 (같은 UI 재사용)
- **자동 동기화** — Vercel Cron이 매일 TMDB 콘텐츠·예고편·제공자 정보를 갱신하고, 제공 종료 콘텐츠 정리 → 캐시 무효화 → 웹훅 알림까지 수행
- **SEO** — 동적 metadata, Open Graph, `sitemap.ts`, `robots.ts`

## 기술 스택

- **Framework** Next.js 16 App Router, React 19, TypeScript
- **Data** PostgreSQL + Prisma 6, TanStack Query 5 (클라이언트 데이터)
- **UI** CSS Modules, Tailwind CSS 4
- **External** TMDB API, YouTube Embed
- **Infra** Vercel(서울 리전), Vercel Cron, Supabase, Speed Insights
- **Quality** ESLint 9, Vitest

## 왜 다시 만들었나

첫 버전은 React CSR로 만든 [ReelTrailer-React](https://github.com/JeongUn1028/ReelTrailer-React) 였습니다. 데이터 페칭이 클라이언트에 몰려 첫 화면이 느렸고, 검색 엔진에 내용이 노출되지 않았습니다. Next.js App Router로 **전면 재구축**하면서 렌더링 전략, 데이터 계층, 배포 환경을 처음부터 다시 설계했습니다.

**Lighthouse (재구축 전 → 후)**

- 성능 91 → **100** — 서버 컴포넌트에서 직접 DB 조회 + Suspense 스트리밍
- 접근성 85 → **98** — 모달 WAI-ARIA 보완, 시맨틱 구조
- SEO 92 → **100** — 동적 Metadata, OG, sitemap, robots
- 권장 사항 65 → **77** — iframe 쿠키 설정 강화

## 핵심 설계

### 콘텐츠는 하루에 한 번만 바뀐다 → 카탈로그를 메모리에서 처리

콘텐츠 변경은 Cron이 도는 하루 한 번뿐입니다. 그래서 요청마다 조건별 쿼리를 날리는 대신, `getCatalog()` 가 영화·TV 전체를 **쿼리 2개로 읽어 Next Data Cache(`unstable_cache`, 태그 `contents`)에 저장**하고, 필터·정렬·페이지네이션은 순수 함수로 메모리에서 처리합니다. 동기화가 끝나면 `revalidateTag("contents")` 로 한 번에 무효화합니다. 검색만 `pg_trgm` 인덱스로 DB를 직접 조회합니다.

### 서버/클라이언트 데이터 경계

추천 목록·상세·사이트맵은 서버 컴포넌트에서 카탈로그를 씁니다. 사용자 상호작용이 잦은 예고편 쇼케이스와 검색 자동완성만 클라이언트 컴포넌트로 두고 TanStack Query로 API를 호출하며, OTT slug를 쿼리 키에 포함해 5분 fresh · 10분 GC로 관리합니다.

### 같은 TMDB ID가 영화와 TV에 동시에 존재한다

`Movie` 와 `TvShow` 는 별도 모델이지만 화면에서는 `mediaType` 으로 통합합니다. ID만으로는 구분할 수 없어 상세 URL을 `/program/{id}?kind=movie|tvshow` 로 설계했습니다.

## 프로덕션에서 만난 문제

### 1. Prisma `P2024` — 커넥션 풀 타임아웃

한 요청 안에서 `Promise.all` 로 DB 쿼리를 병렬 호출하자 서버리스 커넥션 한도를 넘었습니다. 쿼리를 순차 실행 구조로 바꾸고 Supabase Transaction Pooler(`pgbouncer=true`)를 연결해 해결했습니다. 이 경험이 위의 "카탈로그를 쿼리 2개로" 설계로 이어졌습니다.

### 2. `ERR_INVALID_URL` — SSR에서만 터지는 fetch

클라이언트 컴포넌트에 Node 코어 모듈(`url`)이 번들에 섞여 들어갔고, SSR에서 상대경로 fetch의 기준점이 없었습니다. 코어 모듈 import를 제거하고 기준 URL을 환경변수로 명시했습니다.

### 3. 상세 모달이 느리다 — 리전 불일치

Vercel Function은 미국 `iad1`, DB는 서울이었습니다. 요청마다 태평양을 건너던 RTT를 `vercel.json` 과 Route Handler의 리전을 서울 `icn1` 로 지정해 없앴습니다.

## 화면과 라우팅

- `/` 홈 — 쇼케이스 + 추천 목록
- `/netflix` `/disney-plus` `/tving` `/watcha` `/wavve` — OTT 필터
- `/browse?ott=&kind=&genre=&sort=&page=` — 조건별 전체 목록
- `/search?q=&type=` — 통합 검색
- `/program/{id}?kind=movie|tvshow` — 상세 (카드에서 진입 시 모달)

```text
홈 ─┬─ OTT 필터 ─┐
    ├─ 장르 추천 ─┼─ 콘텐츠 카드 ─ 상세 모달 / 상세 페이지
    └─ 통합 검색 ─┘
```

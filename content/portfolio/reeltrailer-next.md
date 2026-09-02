---
thumbnail: "/portfolio/reeltrailer-next.png"
size: [2, 1]
status: "published"
title: "여러 OTT를 한곳에서 ReelTrailer 프로젝트"
tags: ["Next.js", "TypeScript", "Prisma", "Supabase"]
createdAt: "2026-08-31"
githubLink: "https://github.com/JeongUn1028/reeltrailer-next"
velogLink: "https://velog.io/@jeongun1028/series/ReelTrailer"
summary: "TMDB 데이터를 기반으로 영화와 TV 프로그램을 탐색하고, 국내 구독형 OTT(Netflix, Disney+, Tving, Watcha, Wavve)의 실시간 콘텐츠 및 예고편을 탐색하는 풀스택 웹 서비스입니다.

기존 React 기반 CSR 구조를 Next.js 16 App Router 아키텍처로 전면 마이그레이션하여, Intercepting Routes 기반의 상세 모달, Suspense 스트리밍 렌더링, SEO 최적화, 그리고 Vercel Serverless & Supabase 환경에서의 DB 커넥션 및 Latency 최적화를 달성했습니다."
---

# ReelTrailer

<br />
배포 링크: **[ReelTrailer! 클릭](https://reeltrailer.vercel.app/)**<br/><br/>

> TMDB 데이터를 기반으로 영화와 TV 프로그램을 탐색하고, 국내 구독형 OTT(Netflix, Disney+, Tving, Watcha, Wavve)의 실시간 콘텐츠 및 예고편을 탐색하는 풀스택 웹 서비스입니다. <br />
> 기존 React 기반 CSR 구조를 Next.js 16 App Router 아키텍처로 전면 마이그레이션하여, Intercepting Routes 기반의 상세 모달, Suspense 스트리밍 렌더링, SEO 최적화, 그리고 Vercel Serverless & Supabase 환경에서의 DB 커넥션 및 Latency 최적화를 달성했습니다.

---

## 📊 마이그레이션 성과 (Lighthouse 성능 비교)

기존 React (CSR) 환경 대비 Next.js App Router 전환 및 서버리스 최적화 후 달성한 지표입니다.

- **성능**: 91점 ➔ **100점** (+9점)  
  _주요 원인_: Direct DB Fetching 및 Suspense 기반 점진적 스트리밍 렌더링 적용
- **접근성**: 85점 ➔ **98점** (+13점)  
  _주요 원인_: WAI-ARIA 기반 모달 접근성 보완 및 시맨틱 HTML 구조 적용
- **권장 사항**: 65점 ➔ **77점** (+12점)  
  _주요 원인_: iFrame 쿠키 설정 강화
- **검색 엔진 최적화(SEO)**: 92점 ➔ **100점** (+8점)  
  _주요 원인_: 동적 Metadata, OpenGraph, `sitemap.ts`, `robots.ts` 구축

---

## 🛠️ 프로덕션 배포 트러블슈팅

Vercel 서버리스 프로덕션 환경 배포 과정에서 직면한 3가지 핵심 문제와 해결 방안입니다.

### 1. DB Connection Timeout

- **문제 상황**: `Prisma P2024` 커넥션 풀 타임아웃 발생
- **원인 분석**: 한 요청 내 `Promise.all`로 병렬 DB 쿼리를 호출하여 서버리스 커넥션 한도 초과
- **해결 방안**:
  - DB 쿼리 단일 순차 실행 구조로 로직 리팩토링
  - Supabase Transaction Pooler (`pgbouncer=true`) 연동

### 2. SSR URL Parsing Error

- **문제 상황**: SSR / Build 환경에서 `ERR_INVALID_URL` 파싱 실패
- **원인 분석**:
  - 클라이언트 컴포넌트에 Node 코어 모듈(`url`) 번들 오염
  - Node.js SSR 실행 시 상대경로 fetch 기준점 누락
- **해결 방안**:
  - Node 코어 모듈 import 구문 제거
  - Base URL을 환경변수(`NEXT_PUBLIC_API_URL`)로 명시 관리

### 3. Network Latency

- **문제 상황**: 배포 환경에서 상세 모달 로딩 속도 지연
- **원인 분석**: Vercel Function 리전(미국 `iad1`)과 Supabase DB 리전(서울 `ap-northeast-2`) 불일치로 인한 RTT 지연
- **해결 방안**: `vercel.json` 및 Route Handler 전역 배포 리전을 서울(`icn1`)로 지정하여 지리적 Latency 단축

---

## ✨ 주요 기능

- **인기 영화 예고편**: YouTube API 연동 임베드 재생 및 캐러셀 UI
- **OTT 플랫폼 필터링**: Netflix, Disney+, Tving, Watcha, Wavve별 콘텐츠 필터링
- **다중 추천 목록**: 영화, TV 프로그램, 장르별 추천 데이터 제공
- **통합 검색**: 제목 기반 영화·TV 대소문자 구분 없는 통합 검색
- **상세 정보 & 라우팅**: 포스터, 원제, 줄거리, 평점, 공개 연도, 장르, 제공 OTT 정보를 담은 상세 화면 (일반 상세 페이지와 Intercepting Route 모달의 UI 재사용)
- **점진적 UX**: Suspense 기반 검색창·캐러셀·추천 목록 스켈레톤 및 예외 404 처리
- **자동 동기화**: Vercel Cron을 통한 TMDB 콘텐츠, 예고편, 국내 OTT 제공 정보 일일 배치 동기화
- **SEO & 관측 가능성**: Open Graph 메타데이터, `robots.txt`, `sitemap.xml`, Vercel Speed Insights 적용

---

## 🗺️ 화면과 라우팅

- **`/`** : 전체 콘텐츠 홈, 예고편 캐러셀, 추천 목록
- **`/netflix`** : Netflix 필터 페이지
- **`/disney-plus`** : Disney+ 필터 페이지
- **`/tving`** : Tving 필터 페이지
- **`/watcha`** : Watcha 필터 페이지
- **`/wavve`** : Wavve 필터 페이지
- **`/search?q={query}`** : 제목 통합 검색 결과
- **`/program/{programId}?kind=movie`** : 영화 상세 페이지
- **`/program/{programId}?kind=tvshow`** : TV 프로그램 상세 페이지

> 콘텐츠 카드를 통해 상세 화면으로 이동할 때는 Next.js Intercepting Routes가 상세 UI를 모달로 표시합니다. URL에 직접 접근하거나 새로고침하면 동일한 UI가 독립 페이지로 표시됩니다.

```mermaid
flowchart TD
	A[홈] --> B[OTT 필터]
	A --> C[장르 추천]
	A --> D[통합 검색]
	B --> E[콘텐츠 카드]
	C --> E
	D --> E
	E --> F[상세 모달 또는 상세 페이지]

| 경로                               | 설명                                     |
| :--------------------------------- | :--------------------------------------- |
| `/`                                | 전체 콘텐츠 홈, 예고편 캐러셀, 추천 목록 |
| `/netflix`                         | Netflix 필터 페이지                      |
| `/disney-plus`                     | Disney+ 필터 페이지                      |
| `/tving`                           | Tving 필터 페이지                        |
| `/watcha`                          | Watcha 필터 페이지                       |
| `/wavve`                           | Wavve 필터 페이지                        |
| `/search?q={query}`                | 제목 통합 검색 결과                      |
| `/program/{programId}?kind=movie`  | 영화 상세 페이지                         |
| `/program/{programId}?kind=tvshow` | TV 프로그램 상세 페이지                  |

> 콘텐츠 카드를 통해 상세 화면으로 이동할 때는 Next.js Intercepting Routes가 상세 UI를 모달로 표시합니다. URL에 직접 접근하거나 새로고침하면 동일한 UI가 독립 페이지로 표시됩니다.

```

```mermaid
flowchart TD
	A[홈] --> B[OTT 필터]
	A --> C[장르 추천]
	A --> D[통합 검색]
	B --> E[콘텐츠 카드]
	C --> E
	D --> E
	E --> F[상세 모달 또는 상세 페이지]
```

# ItsMe — 개인 포트폴리오 웹사이트

단순한 소개 페이지를 넘어, **인증 · 데이터 관리 · 운영 흐름까지 직접 설계한 풀스택 포트폴리오 프로젝트**입니다.

> “기능을 구현하는 것”을 넘어 **“왜 그렇게 설계했는지를 설명할 수 있는 코드”**를 목표로 개발했습니다.

---

## 🔗 Live Demo

- https://leejeongun.com

---

## 📌 프로젝트 개요

ItsMe는 개인 포트폴리오를 소개하는 동시에, 콘텐츠를 직접 관리하고 지속적으로 운영할 수 있는 구조를 만드는 것을 목표로 설계했습니다.

### 1. 사용자 경험

- 자연스럽고 읽기 쉬운 포트폴리오 UI
- 진입 경로에 따라 달라지는 UX 제공
- URL을 통한 포트폴리오 상세 페이지 접근 및 공유

### 2. 운영 가능성

- 별도의 CMS 없이 콘텐츠를 직접 관리
- GitHub를 활용한 콘텐츠 버전 관리
- 혼자서도 지속적으로 유지·운영할 수 있는 구조

이를 위해 하나의 애플리케이션 안에 **User 영역(공개 페이지)**과 **Admin 영역(관리 시스템)**을 함께 구성했습니다.

---

## ✨ 주요 기능

### 👤 사용자 영역

- 포트폴리오 목록 및 상세 조회
- Velog 포스트 자동 연동
- 진입 경로 기반 UX 분기
  - 목록에서 진입 → 모달
  - URL 직접 접근 → 독립 페이지

### 🔐 관리자 영역

- JWT 기반 로그인 / 로그아웃
- Middleware 기반 라우트 보호
- 포트폴리오 CRUD
- Server Action 기반 폼 처리 및 피드백

---

## 🛠 기술 스택

| 구분 | 기술 |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS Modules |
| Auth | JWT (`jose`), Cookie |
| Content | Markdown, MDX |
| API | GitHub Git Data API (`octokit`) |
| Test | Vitest, Testing Library |

---

## ⚙️ 로컬 실행

```bash
cp .env.example .env.local   # 값 채우기
node scripts/hash-password.mjs '<관리자 비밀번호>'   # → ADMIN_PASSWORD_HASH
npm install
npm run dev
```

필요한 환경 변수는 `.env.example`에 설명과 함께 정리되어 있습니다.

---

# 🧠 핵심 설계 및 의사결정

## 1. 라우팅 기반 UX 설계

### 선택

- Intercepting Routes + Parallel Routes 활용

### 문제

포트폴리오 목록에서 상세 페이지로 이동할 때 단순 페이지 전환만 제공하면, 사용자가 목록을 보던 맥락이 끊어지는 문제가 있었습니다.

반면 상태 기반 모달을 사용하면 모달의 열림 상태가 URL과 분리되어 새로고침이나 URL 공유 시 동일한 상태를 유지하기 어렵습니다.

### 결정

상세 페이지를 **라우팅과 연결된 모달 UI**로 구현했습니다.

- 목록에서 진입 → 모달
- URL 직접 접근 → 독립 페이지

이를 통해 모달의 UI 상태를 별도의 클라이언트 상태로 관리하지 않고 **URL과 라우팅을 통해 관리**하도록 구성했습니다.

### 트레이드오프

| 방식 | 장점 | 단점 |
| --- | --- | --- |
| 상태 기반 모달 | 구현 단순 | URL 공유 및 새로고침 대응 어려움 |
| 라우팅 기반 모달 | URL 공유, 새로고침 대응 | 구조 복잡 |

→ 구조의 복잡도를 감수하고 **UX의 일관성과 URL 기반 상태 관리**를 선택했습니다.

---

## 2. 인증 전략 설계

### 선택

- JWT + Cookie 기반 인증
- Middleware를 통한 관리자 라우트 보호
- 관리자 비밀번호는 `scrypt` 해시로 저장하고 `timingSafeEqual`로 비교

### 이유

- 서버와 클라이언트에서 인증 상태를 활용할 수 있음
- Next.js App Router 구조와 결합하기 용이
- 별도의 세션 저장소 없이 관리자 인증 구현 가능

### 고려한 대안

| 방식 | 고려사항 |
| --- | --- |
| localStorage | 서버 측 접근이 어렵고 XSS 공격에 노출될 가능성 |
| Session 기반 | 서버 측 세션 상태 관리 필요 |

### 트레이드오프

- Refresh Token을 구현하지 않아 장기 세션 유지에는 한계
- Middleware 기반 인증으로 구성하여 세밀한 권한 제어에는 한계

→ 개인 포트폴리오의 단순한 관리자 시스템이라는 요구사항을 고려하여 **인증 구조의 복잡도를 최소화하는 방향**을 선택했습니다.

---

## 3. 콘텐츠 관리 및 데이터 처리

### 선택

- Server Action 기반 데이터 처리
- GitHub Git Data API(Trees/Commits) 기반 파일 관리
- Markdown을 Single Source of Truth로 사용

### 파일 변경을 하나의 커밋으로 묶은 이유

포트폴리오 하나는 md 문서와 썸네일 이미지 두 파일로 구성됩니다. 파일마다 Contents API를 호출하면 중간에 실패했을 때 한쪽만 반영되는 상태가 생길 수 있어, Git Data API로 blob → tree → commit → ref 순서로 처리해 **모든 변경이 단일 커밋으로 원자적으로 반영**되도록 했습니다. 생성·수정·삭제가 모두 같은 `commitFiles()` 함수를 사용합니다.

### 왜 DB나 CMS를 사용하지 않았는가

개인 프로젝트의 콘텐츠 관리라는 목적을 고려했을 때 별도의 DB나 CMS를 운영하는 것보다 GitHub를 콘텐츠 저장소로 활용하는 것이 적합하다고 판단했습니다.

- Git을 통한 변경 이력 관리 가능
- 별도의 CMS 운영 불필요
- 개인 프로젝트에 적합한 단순한 운영 구조

### Server Action을 선택한 이유

- UI와 서버 측 데이터 처리 로직을 가까운 위치에서 관리
- 클라이언트와 서버 간 데이터 처리 구조 단순화
- TypeScript 기반으로 서버 함수 호출 구조를 관리

### 데이터 흐름

```text
Admin 입력
    ↓
Server Action
    ↓
GitHub Git Data API
    ↓
md + 이미지를 단일 Commit 으로 저장
    ↓
콘텐츠 갱신
    ↓
UI 반영

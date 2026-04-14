# ItsMe — 개인 포트폴리오 웹사이트

> **단순한 소개 페이지를 넘어, 인증·데이터·운영 흐름까지 직접 설계한 풀스택 포트폴리오 프로젝트입니다.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

**🔗 Live Demo**: [leejeongun.com](https://www.leejeongun.com)

---

## 📌 프로젝트 소개

`ItsMe`는 신입 프론트엔드 개발자로서 **"왜 이렇게 설계했는가"를 설명할 수 있는 코드**를 목표로 만든 개인 포트폴리오입니다.

단순히 화면을 그리는 데 그치지 않고, 다음 두 가지를 핵심 목표로 삼았습니다.

- **사용자 경험**: 자연스럽고 읽기 편한 공개 포트폴리오 화면
- **운영 가능성**: 저 혼자서도 콘텐츠를 지속적으로 수정·관리할 수 있는 구조

이를 위해 **공개 포트폴리오(User 영역)** 와 **콘텐츠 관리 시스템(Admin 영역)** 을 하나의 프로젝트 안에서 함께 구현했습니다.

---

## ✨ 주요 기능

### 👤 사용자(공개) 영역
- 자기소개, 기술 스택, 링크, 연락처 조회
- 포트폴리오 목록 및 상세 조회
- **진입 경로에 따른 UX 분기**
  - 목록에서 클릭 → 모달로 표시
  - URL 직접 접근 → 독립 페이지로 표시
- Velog 포스트 자동 연동

### 🔐 관리자(Admin) 영역
- JWT 기반 로그인 / 로그아웃
- Middleware를 통한 관리자 라우트 보호
- 이력서 수정
- 포트폴리오 생성 / 수정 / 삭제
- Server Action 기반 폼 처리 및 즉각 피드백 (success / error)

---

## 🛠 기술 스택

| 구분 | 사용 기술 |
|------|----------|
| Framework | Next.js 15, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS Modules |
| Content | Markdown, MDX, gray-matter, next-mdx-remote |
| Auth | jose, JWT Cookie |
| API | octokit (GitHub Contents API) |
| Test | Vitest, Testing Library, jsdom |

---

## 🧠 기술적 고민 포인트

### 1. 라우팅과 화면 경험을 함께 설계

같은 포트폴리오 데이터를 **진입 경로에 따라 다른 UX로 제공**합니다.

- `(user)` / `(admin)` Route Group으로 관심사 분리
- **Intercepting Route + Parallel Route**를 활용해 목록 진입 시 모달, URL 직접 접근 시 독립 페이지로 분기
- Next.js App Router의 구조적 특성을 활용한 선언적 라우팅 설계

```
app/
├── (user)/          # 공개 페이지 라우트 그룹
├── (admin)/         # 관리자 페이지 라우트 그룹
├── @modal/          # Parallel Route: 모달 인터셉트
└── portfolio/       # 직접 접근 시 독립 상세 페이지
```

### 2. 콘텐츠를 코드처럼 관리

- `content/portfolio/*.md`를 **단일 소스(Single Source of Truth)** 로 사용
- frontmatter + markdown 본문을 분리 파싱하여 UI에 적용
- 생성·수정·삭제 후 `revalidatePath`로 화면 즉시 동기화
- GitHub Contents API(octokit)를 통해 파일을 원격 저장소에서 직접 관리

### 3. 관리자 작업 흐름 단순화

- 작성/수정 폼 컴포넌트를 분리하여 재사용성 확보
- 이미지·문서 업로드 및 유효성 검증 처리
- success/error 상태 메시지로 작업 결과를 즉각 피드백

---

## 📁 프로젝트 구조

```
.
├── app
│   ├── (user)/              # 공개 페이지 라우트 그룹
│   ├── (admin)/             # 관리자 페이지 라우트 그룹
│   ├── @modal/              # 상세 모달 인터셉트 라우트
│   ├── actions/             # Server Actions
│   ├── api/                 # 인증 / 업로드 route handlers
│   ├── components/          # 공통 / 도메인 컴포넌트
│   ├── login/               # 로그인 페이지
│   └── portfolio/           # 직접 접근용 상세 페이지
├── content
│   ├── portfolio/           # 포트폴리오 Markdown 원본
│   └── resume.json          # 이력서 원본
├── lib
│   ├── auth/                # 인증 유틸
│   ├── portfolio/           # 파싱 / 조회 / 변환 유틸
│   ├── resume/              # 이력서 처리 로직
│   └── update-file/         # GitHub 파일 저장 / 삭제 유틸
├── public/                  # 정적 자산
└── __tests__/               # 단위 테스트
```

---

## 🚀 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/JeongUn1028/ItsMe.git
cd ItsMe
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 변수를 채워주세요.

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 관리자 로그인 검증
NEXT_ID=admin-id
NEXT_SECRET=admin-password

# JWT 서명 / 검증
JWT_SECRET_KEY=your-jwt-secret

# GitHub Contents API (콘텐츠 저장 / 수정 / 삭제)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-owner
NEXT_PUBLIC_GITHUB_REPO=your-repo-name
NEXT_GITHUB_TOKEN_KEY=your-github-token
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## 📜 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드된 앱 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run test` | 단위 테스트 실행 |

---

## 🧪 테스트

유틸 레벨 단위 테스트를 중심으로 구성했습니다.

- frontmatter 파싱 검증
- Markdown 본문 추출 검증
- 포트폴리오 목록 생성 로직 검증
- raw content / raw frontmatter 유틸 검증

> 테스트 도구: **Vitest** + **Testing Library** + **jsdom**

---

## 🔮 앞으로 개선하고 싶은 점

- [ ] 액션 / 업로드 플로우 통합 테스트 추가
- [ ] UI 컴포넌트 테스트 확장 (Testing Library)
- [ ] 파일 업데이트 유틸의 실패 시 롤백 전략 보강
- [ ] 접근성(a11y) 개선

---

## 💬 마무리

**"UI를 만들 줄 안다"** 를 보여주는 데서 그치지 않고, 인증 흐름·데이터 관리·운영 가능한 구조까지 직접 연결해보는 데 의미를 둔 프로젝트입니다.

설계 의도를 설명할 수 있는 코드를 작성하는 것을 목표로 했으며, 앞으로도 기능 추가와 리팩터링을 통해 완성도를 높여갈 예정입니다.

---
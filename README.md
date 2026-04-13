# itsme

신입 프론트엔드 개발자로서, 단순한 소개 페이지를 넘어 실제 운영 흐름까지 담아낸 개인 포트폴리오 프로젝트입니다.

- Live Demo: https://www.leejeongun.com

## 왜 만들었는가

포트폴리오를 만들 때 가장 중요하게 본 점은 두 가지였습니다.

1. 사용자에게는 읽기 편하고 자연스러운 경험을 제공할 것
2. 개발자 입장에서는 콘텐츠를 계속 수정/운영할 수 있는 구조일 것

그래서 itsme는 공개 포트폴리오 화면과 관리자 CMS 기능을 하나의 프로젝트 안에서 함께 구현했습니다.

## 이 프로젝트로 보여주고 싶은 역량

- Next.js App Router 기반 구조 설계 능력
- 인증/권한 흐름을 포함한 실서비스형 기능 구현 능력
- Markdown 기반 콘텐츠 관리 및 자동 갱신 흐름 구현 능력
- UI 구성뿐 아니라 유지보수성과 확장성까지 고려하는 개발 습관

## 핵심 기능

### 사용자 영역

- 자기소개/기술 스택/링크/연락처 조회
- 포트폴리오 목록 및 상세 조회
- 상세 페이지 진입 UX 분기
  - 목록에서 진입: 모달
  - URL 직접 접근: 독립 페이지
- Velog 포스트 연동

### 관리자 영역

- 로그인/로그아웃
- 관리자 라우트 보호(middleware)
- 이력서 수정
- 포트폴리오 생성/수정/삭제
- Server Action 기반 폼 처리와 저장 결과 피드백

## 기술적으로 고민한 포인트

### 1) 라우팅과 화면 경험을 같이 설계

- `(user)` / `(admin)` Route Group으로 관심사 분리
- Intercepting Route + Parallel Route로 모달 상세 UX 구현
- 같은 데이터를 상황에 따라 다른 진입 경험으로 제공

### 2) 콘텐츠를 코드처럼 관리

- `content/portfolio/*.md`를 단일 소스로 사용
- frontmatter + markdown 본문 분리 처리
- 생성/수정/삭제 후 `revalidatePath`로 화면 동기화

### 3) 관리자 작업 흐름 단순화

- 작성/수정 폼 컴포넌트 분리
- 이미지/문서 업로드와 유효성 검증
- 상태 메시지(success/error)로 즉각 피드백

## 기술 스택

| 구분      | 사용 기술                                   |
| --------- | ------------------------------------------- |
| Framework | Next.js 15, React 19                        |
| Language  | TypeScript                                  |
| Styling   | Tailwind CSS v4, CSS Modules                |
| Content   | Markdown, MDX, gray-matter, next-mdx-remote |
| Auth      | jose, JWT Cookie                            |
| API       | octokit (GitHub Contents API)               |
| Test      | Vitest, Testing Library, jsdom              |

## 프로젝트 구조

```text
.
├── app
│   ├── (user)                 # 공개 페이지 라우트 그룹
│   ├── (admin)                # 관리자 페이지 라우트 그룹
│   ├── @modal                 # 상세 모달 인터셉트 라우트
│   ├── actions                # Server Actions
│   ├── api                    # 인증/업로드 route handlers
│   ├── components             # 공통/도메인 컴포넌트
│   ├── login                  # 로그인 페이지
│   └── portfolio              # 상세 페이지
├── content
│   ├── portfolio              # 포트폴리오 markdown 원본
│   └── resume.json            # 이력서 원본
├── lib
│   ├── auth                   # 인증 유틸
│   ├── portfolio              # 파싱/조회/변환 유틸
│   ├── resume                 # 이력서 처리 로직
│   └── update-file            # GitHub 파일 저장/삭제 유틸
├── public                     # 정적 자산
└── __tests__                  # 단위 테스트
```

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 환경 변수

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

JWT_SECRET_KEY=your-jwt-secret
NEXT_ID=admin-id
NEXT_SECRET=admin-password

NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-owner
NEXT_PUBLIC_GITHUB_REPO=your-repo-name
NEXT_GITHUB_TOKEN_KEY=your-github-token
```

- `NEXT_ID`, `NEXT_SECRET`: 관리자 로그인 검증
- `JWT_SECRET_KEY`: JWT 서명/검증
- GitHub 관련 변수: 콘텐츠 저장/수정/삭제

## 스크립트

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
```

## 테스트

현재는 유틸 레벨 테스트를 중심으로 구성했습니다.

- frontmatter 파싱
- markdown 본문 추출
- 포트폴리오 목록 생성
- raw content / raw frontmatter 유틸

## 앞으로 개선하고 싶은 점

- 액션/업로드 플로우 통합 테스트 추가
- UI 컴포넌트 테스트 확장
- 파일 업데이트 유틸의 실패 롤백 전략 보강

## 마무리

itsme는 화면을 만드는 데서 끝나지 않고, 인증/데이터/운영 흐름까지 직접 연결해보는 데 의미를 둔 프로젝트입니다.

신입 개발자로서 "왜 이렇게 설계했는지"를 설명할 수 있는 코드를 만들고자 했고, 앞으로도 기능 추가와 리팩터링을 통해 완성도를 높여갈 예정입니다.

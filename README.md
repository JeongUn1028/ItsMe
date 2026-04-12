# itsme

신입 프론트엔드 개발자로서 저를 소개하기 위해 만든 개인 포트폴리오 웹서비스입니다.

단순히 결과물을 나열하는 데서 끝나지 않고, 실제 서비스처럼 콘텐츠를 관리할 수 있는 구조를 직접 설계하고 구현하는 데 집중했습니다. 사용자에게는 깔끔한 포트폴리오 경험을, 관리자에게는 이력서와 프로젝트를 직접 수정할 수 있는 관리 기능을 제공하는 것이 목표였습니다.

[Live Demo](https://www.leejeongun.com)

## 프로젝트 소개

itsme는 다음 두 가지를 보여주기 위해 만든 프로젝트입니다.

- 사용자 입장에서 보기 좋은 포트폴리오 UI를 만들 수 있는지
- 개발자 입장에서 유지보수 가능한 구조를 설계할 수 있는지

이를 위해 포트폴리오 상세 페이지 모달 라우팅, 관리자 인증, Markdown 기반 콘텐츠 관리, Server Action 기반 폼 처리까지 직접 구현했습니다.

## 주요 기능

### 사용자 기능

- 자기소개, 기술 스택, 연락처, 외부 링크 확인
- 포트폴리오 목록 조회
- 포트폴리오 상세 페이지 조회
- 목록에서 진입할 때는 모달, 직접 URL 접근 시에는 독립 페이지로 진입
- Velog 게시글 목록 조회

### 관리자 기능

- 로그인 후 관리자 페이지 접근
- 이력서 소개글, 기술 스택, 프로필 이미지, PDF 이력서 수정
- 새 포트폴리오 작성
- 포트폴리오 삭제

## 구현 포인트

### 1. 모달과 페이지를 함께 지원하는 상세 라우팅

포트폴리오 카드를 눌렀을 때는 현재 페이지 흐름을 유지한 채 모달로 상세 내용을 보여주고, URL로 직접 접근했을 때는 독립적인 상세 페이지가 열리도록 구성했습니다.

- Next.js App Router의 Intercepting Route와 Parallel Route 활용
- 같은 콘텐츠를 상황에 따라 다른 진입 방식으로 제공
- 사용자 경험과 라우팅 구조를 함께 고려한 구현

### 2. Markdown 기반 포트폴리오 관리

포트폴리오 콘텐츠를 코드와 함께 관리할 수 있도록 Markdown 기반 구조를 사용했습니다.

- frontmatter로 메타데이터 관리
- 본문은 Markdown으로 작성
- gray-matter와 MDX 렌더링으로 화면 출력
- 콘텐츠 수정과 버전 관리를 쉽게 할 수 있는 구조

### 3. 관리자 인증과 보호된 라우트

관리자 페이지는 누구나 접근할 수 없도록 JWT 쿠키 검증을 통해 보호했습니다.

- 로그인 성공 시 JWT 발급
- middleware에서 /admin 경로 접근 제어
- 서버 환경에서도 동작 가능한 인증 흐름 구성

### 4. 직접 관리 가능한 콘텐츠 업데이트 흐름

이력서와 포트폴리오 데이터를 직접 수정할 수 있도록 관리자 폼과 저장 로직을 연결했습니다.

- Server Action 기반 폼 처리
- GitHub Contents API를 이용한 파일 저장 및 삭제
- 저장 후 revalidatePath로 화면 데이터 갱신

## 기술 스택

| 구분      | 사용 기술                                   |
| --------- | ------------------------------------------- |
| Framework | Next.js 15, React 19                        |
| Language  | TypeScript                                  |
| Styling   | Tailwind CSS v4, CSS Modules                |
| Content   | Markdown, MDX, gray-matter, next-mdx-remote |
| Auth      | jose, JWT Cookie                            |
| API       | octokit                                     |
| Test      | Vitest, Testing Library, jsdom              |

## 프로젝트 구조

```text
.
├── app
│   ├── @modal                  # 포트폴리오 상세 모달 인터셉트 라우트
│   ├── actions                 # Server Actions
│   ├── admin                   # 관리자 페이지
│   ├── api                     # 로그인/로그아웃/이력서 API
│   ├── components              # 화면 컴포넌트
│   ├── login                   # 로그인 페이지
│   └── portfolio               # 포트폴리오 상세 페이지
├── content
│   ├── portfolio               # 포트폴리오 Markdown 원본
│   └── resume.json             # 이력서 데이터 원본
├── lib
│   ├── auth                    # 인증 유틸
│   ├── portfolio               # 포트폴리오 파싱/조회 로직
│   ├── resume                  # 이력서 데이터 처리 로직
│   └── update-file             # GitHub 파일 저장/삭제 유틸
├── public                      # 정적 자산
└── __tests__                   # 유틸 단위 테스트
```

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속하면 됩니다.

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
NEXT_PUBLIC_TOKEN_KEY=your-github-token
```

- NEXT_ID, NEXT_SECRET은 관리자 로그인 검증에 사용합니다.
- JWT_SECRET_KEY는 로그인 후 발급하는 JWT 서명과 검증에 사용합니다.
- GitHub 관련 환경 변수는 이력서와 포트폴리오 파일 저장에 사용합니다.

## 스크립트

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
```

## 테스트

Vitest 기반 단위 테스트를 작성했습니다. 현재는 콘텐츠 파싱과 조회 로직을 중심으로 테스트하고 있습니다.

- frontmatter 파싱 검증
- Markdown 본문 추출 검증
- 포트폴리오 목록 생성 검증
- raw content / raw frontmatter 유틸 검증

## 아쉬운 점과 개선 예정

- 포트폴리오 수정 화면은 구현되어 있지만 저장 액션은 아직 연결되지 않았습니다.
- 관리자 기능 전반에 사용자 피드백 UI를 더 보강할 수 있습니다.
- 테스트 범위를 UI와 액션 레벨까지 확장할 계획입니다.

## 프로젝트를 통해 배우고자 한 점

이 프로젝트를 통해 단순한 화면 구현을 넘어, 프론트엔드 개발자가 실제로 고민해야 하는 흐름을 연습하고자 했습니다.

- 사용자가 자연스럽게 느끼는 화면 전환 경험
- 관리자 기능까지 고려한 서비스 구조 설계
- 데이터와 UI를 분리한 유지보수 가능한 코드 작성
- 새 기능 추가 시 테스트와 타입 안정성을 함께 고려하는 개발 방식

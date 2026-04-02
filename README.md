## 🚀 itsme: Next.js 기반 저를 소개하는 웹서비스

프론트엔드 개발자로서의 기술적 지향점과 실무 역량을 증명하기 위해 제작된 Next.js 15 기반 포트폴리오 서비스입니다.
단순한 결과물 나열보다는 데이터 모델링, 라우팅 최적화, 미들웨어, 유닛 테스트 등으로 프론트엔드 아키텍처를 구축하는 데 집중했습니다.
[🌐 Live Demo 바로가기](https://www.leejeongun.com)

## 📌 핵심 아키텍처 포인트

1. UX 최적화: Intercepting & Parallel Routes
   도입 이유: 사용자가 리스트에서 상세 페이지로 진입할 때 기존의 맥락(Context)을 유지하면서도, 새로고침시에는 독립적인 상세 페이지를 제공하기 위해 Next.js의 고급 라우팅 기능을 도입했습니다。
   결과: 모달 형태의 상세 보기와 개별 페이지 렌더링을 동시에 지원하여 부드러운 사용자 경험을 구현했습니다。
2. 콘텐츠 파이프라인: MDX & 정적 데이터화
   도입 이유: 외부 CMS 의존도를 낮추고 버전 관리가 용이하도록 로컬 마크다운(MDX) 기반 시스템을 설계했습니다。
   결과: gray-matter를 활용해 메타데이터(Frontmatter)와 본문을 분리하고, 정적 타입 기반의 데이터 파싱 로직을 구축했습니다。
3. 보안 미들웨어 & Edge Runtime Auth
   도입 이유: 관리자 페이지의 보안을 강화하기 위해 클라이언트 측 라우트 가드가 아닌, 서버 측 미들웨어 검증 방식을 채택했습니다。
   결과: JOSE 라이브러리를 활용해 Edge Runtime 환경에서도 가볍고 빠르게 동작하는 JWT 검증 로직을 구현했습니다。

## 🛠 기술 스택

분류 스택 도입 목적
Framework Next.js 15 (App Router) 서버 컴포넌트 활용 및 최신 렌더링 최적화
Language TypeScript 정적 타입을 통한 개발 생산성 및 안정성 확보
UI React 19, Tailwind CSS 최신 리액트 기능 활용 및 유연한 디자인 시스템 구축
Content MD, gray-matter 구조화된 콘텐츠 관리 및 확장성 있는 문서 작성
AuthJOSE (JWT) Edge 환경 호환성 및 경량화된 인증 로직 구현
Test Vitest 로직의 정합성 검증 및 리팩토링 안정성 확보

📂 프로젝트 구조

├── app/ # App Router 기반 레이아웃 및 페이지
│ ├── (auth)/ # 로그인 관련 경로
│ ├── admin/ # 미들웨어 보호 관리자 경로
│ ├── portfolio/ # 상세 페이지 라우트
│ └── @modal/ # 인터셉팅 라우트를 위한 병렬 경로
├── components/ # 재사용 가능한 UI 컴포넌트 (Atomic Design 지향)
├── content/ # 프로젝트 데이터 (.md 파일)
├── lib/ # 비즈니스 로직 및 유틸리티 (UI와 분리)
└── **tests**/ # 데이터 파싱 로직 단위 테스트

## 🚀 Future Roadmap (고도화 계획)

[ ] RBAC 고도화: 관리자 세션 상태에 따른 UI/UX 조건부 렌더링 최적화
[ ] Resume Engine: 마크다운 기반의 동적 이력서 생성 페이지 추가
[ ] Embedded CMS: 관리자 페이지 내에서 직접 포트폴리오를 추가/수정/삭제할 수 있는 대시보드 구축
[ ] Performance Optimization: 이미지 최적화 및 코드 스플리팅을 통한 로딩 속도 개선
[ ] Accessibility Audit: 웹 접근성 표준 준수를 위한 전반적인 UI/UX 개선

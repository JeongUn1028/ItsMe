---
thumbnail: "/public/portfolio/itsme.png"
size: [2, 1]
status: "published"
title: "Next.js 기반 개인 포트폴리오 프로젝트"
tags: ["Next.js", "TypeScript", "TDD"]
createdAt: "2026-04-26"
githubLink: "https://github.com/JeongUn1028"
velogLink: "https://velog.io/@jeongun1028/Next.js-%EA%B8%B0%EB%B0%98-Static-Portfolio-%EA%B5%AC%EC%B6%95"
summary: "Markdown 기반 CMS를 하나의 프로젝트에서 구현한 Next.js 개인 포트폴리오 웹사이트입니다."
---

🔗 **Live Demo**: [leejeongun.com](https://www.leejeongun.com)

## 📌 프로젝트 소개

ItsMe는 개인을 소개하고 프로젝트를 효과적으로 전달하기 위해 제작한 포트폴리오 웹사이트입니다.  
단순한 정적 페이지를 넘어, 공개 포트폴리오와 콘텐츠 관리 시스템(CMS)을 하나의 프로젝트 안에서 함께 구현했습니다.

---

## 🚀 주요 기능

- 👤 자기소개, 기술 스택, 연락처 소개
- 📁 포트폴리오 목록 및 상세 페이지
- 🔀 진입 경로에 따른 UX 분기 (모달 / 독립 페이지)
- 📝 Markdown 기반 콘텐츠 관리 (생성 / 수정 / 삭제)
- 📰 Velog API를 활용한 게시글 자동 연동
- 🔐 JWT 인증 및 Middleware 기반 관리자 페이지 보호

---

## 🧱 기술 스택

- **Framework**: Next.js 15 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, CSS Modules
- **Content**: Markdown, MDX, gray-matter, next-mdx-remote
- **Auth**: jose, JWT Cookie
- **API**: octokit (GitHub Contents API)
- **Test**: Vitest
- **Deployment**: Vercel

---

## 🏗 아키텍처

```text
/content/portfolio (Markdown)
        ↓
MD 파싱 (gray-matter + next-mdx-remote)
        ↓
Next.js App Router
  ├── (user)/     공개 포트폴리오 페이지
  ├── (admin)/    관리자 CMS 페이지
  └── @modal/     Intercepting Route (모달 UX)
        ↓
Server Actions (콘텐츠 CRUD + revalidatePath)
        ↓
GitHub Contents API (원격 파일 저장 / 수정 / 삭제)
        ↓
Vercel 배포
```

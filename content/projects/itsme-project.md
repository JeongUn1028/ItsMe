---
thumbnail: "/itsme-project.png"
size: [2, 1]
status: "published"
title: "Next.js 기반 개인 포트폴리오 프로젝트"
tags: ["Next.js", "TypeScript", "TDD"]
createdAt: "2026-04-26"
publishedAt: "2026-03-26"
githubLink: "https://github.com/JeongUn1028"
velogLink: "https://velog.io/@jeongun1028/Next.js-%EA%B8%B0%EB%B0%98-Static-Portfolio-%EA%B5%AC%EC%B6%95"
summary: "Next.js를 활용하여 개인 포트폴리오 웹사이트를 개발한 프로젝트입니다."
---

## 📌 프로젝트 소개

ItsMe는 개인을 소개하고 프로젝트를 효과적으로 전달하기 위해 제작한 포트폴리오 웹사이트입니다.  
단순한 정적 페이지를 넘어서, 콘텐츠를 관리하고 확장할 수 있는 구조를 목표로 개발했습니다.

---

## 🚀 주요 기능

- 👤 자기소개 및 기술 스택 소개
- 📁 프로젝트 리스트 및 상세 페이지
- 📝 Markdown 기반 콘텐츠 관리
- 📰 Velog API를 활용한 게시글 연동
- 💡 Modal UI를 활용한 인터랙션 제공

---

## 🧱 기술 스택

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: CSS Module + Tailwind CSS
- **Data**: Markdown / Velog API
- **Deployment**: Vercel

---

## 🧱 아키텍처

```text
/content/projects (Markdown)
        ↓
MD 파싱 (gray-matter)
        ↓
Next.js App Router
        ↓
정적 페이지 생성 (SSG)
        ↓
Vercel 배포
```

//**
//** type  */

interface RawFrontmatter {
  //* 백그라운드에서 동작 하는 필드
  thumbnail?: string;
  size?: number[];
  status?: "draft" | "published";
  //* 상단에 있는 필드
  title?: string;
  tags?: string[];
  createdAt?: string;
  publishedAt?: string;
  githubLink?: string;
  velogLink?: string;
  summary?: string;
  //* 하단에 있는 필드
}

interface Project {
  slug: string;
  thumbnail: string;
  size: number[];
  status: "draft" | "published";
  title: string;
  tags: string[];
  createdAt: string;
  publishedAt: string;
  githubLink: string;
  velogLink: string;
  summary: string;
  contents: string;
}

export type { RawFrontmatter, Project };

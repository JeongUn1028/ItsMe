interface RawFrontmatter {
  title?: string;
  summary?: string;
  thumbnail?: string;
  tags?: string[];
  status?: "draft" | "published";
  createdAt?: string;
}

interface Project {
  slug: string;
  title: string;
  summary: string;
  thumbnail: string;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
}

export type { RawFrontmatter, Project };

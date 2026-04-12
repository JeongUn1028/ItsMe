import matter from "gray-matter";
type FrontmatterPrimitive = string | number | boolean;
type FrontmatterValue = FrontmatterPrimitive | FrontmatterPrimitive[];

//* 문자열 내부 큰따옴표를 이스케이프합니다.
function escapeYamlQuotedString(value: string) {
  return value.replace(/"/g, '\\"');
}

//* frontmatter 값을 YAML 한 줄 표현으로 직렬화합니다.
function stringifyYamlValue(value: FrontmatterValue): string {
  if (Array.isArray(value)) {
    return `[${value
      .map((item) =>
        typeof item === "string"
          ? `"${escapeYamlQuotedString(item)}"`
          : String(item),
      )
      .join(", ")}]`;
  }

  if (typeof value === "string") {
    return `"${escapeYamlQuotedString(value)}"`;
  }

  return String(value);
}

function stringifyQuotedFrontmatter(data: Record<string, FrontmatterValue>) {
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${stringifyYamlValue(value)}`)
    .join("\n");
}

export function makeMarkdownContent(params: {
  thumbnailPath: string;
  size: number[];
  status: string;
  title: string;
  tags: string[];
  createdAt: string;
  githubLink: string;
  velogLink: string;
  summary: string;
  contents: string;
}) {
  const {
    thumbnailPath,
    size,
    status,
    title,
    tags,
    createdAt,
    githubLink,
    velogLink,
    summary,
    contents,
  } = params;

  const frontmatterData = {
    thumbnail: thumbnailPath,
    size: [size[0], size[1]],
    status,
    title,
    tags,
    createdAt,
    githubLink,
    velogLink,
    summary,
  };

  return matter.stringify(`${contents.trim()}\n`, frontmatterData, {
    engines: {
      yaml: {
        parse: () => ({}),
        stringify: (data: unknown) =>
          stringifyQuotedFrontmatter(data as Record<string, FrontmatterValue>),
      },
    },
  });
}

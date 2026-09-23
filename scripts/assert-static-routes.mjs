// 공개 페이지가 프리렌더되는지 검증한다.
// 관리자용 컴포넌트가 공개 트리로 들어와 cookies() 를 읽으면 라우트 전체가 동적이 되는데,
// 빌드 로그의 ● 표시만으로는 알아차리기 어려워 산출물을 직접 확인한다. (#57)
import fs from "node:fs";
import path from "node:path";

const distDir = process.env.NEXT_DIST_DIR ?? ".next";
const manifestPath = path.join(distDir, "prerender-manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.error(`${manifestPath} 가 없습니다. 먼저 빌드하세요.`);
  process.exit(1);
}

const prerendered = new Set(
  Object.keys(JSON.parse(fs.readFileSync(manifestPath, "utf8")).routes ?? {}),
);

const slugs = fs
  .readdirSync(path.join("content", "portfolio"))
  .filter((name) => name.endsWith(".md"))
  .map((name) => name.replace(/\.md$/, ""));

const required = ["/", ...slugs.map((slug) => `/portfolio/${slug}`)];
const missing = required.filter((route) => !prerendered.has(route));

if (missing.length > 0) {
  console.error("정적으로 프리렌더되지 않은 공개 경로:");
  for (const route of missing) console.error(`  - ${route}`);
  console.error(
    "\n공개 트리에서 cookies()/headers() 를 읽는 컴포넌트가 있는지 확인하세요.",
  );
  process.exit(1);
}

console.log(`공개 경로 ${required.length}개가 모두 프리렌더됨`);

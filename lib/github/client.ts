import { Octokit } from "octokit";

const GITHUB_API_VERSION = "2026-03-10";

export interface GithubRepoConfig {
  owner: string;
  repo: string;
  branch: string;
}

let octokitInstance: Octokit | null = null;

//* 환경변수를 읽어 Octokit 인스턴스를 한 번만 생성해 재사용합니다.
//* 모듈 최상단에서 만들지 않는 이유는 env 가 로드되기 전에 고정되는 것을 피하기 위해서입니다.
export function getOctokit(): Octokit {
  if (!octokitInstance) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("GITHUB_TOKEN 환경변수가 설정되지 않았습니다.");
    }
    octokitInstance = new Octokit({ auth: token });
  }
  return octokitInstance;
}

//* 콘텐츠가 저장되는 리포지토리 정보를 환경변수에서 읽습니다.
export function getRepoConfig(): GithubRepoConfig {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!owner || !repo) {
    throw new Error("GITHUB_OWNER 또는 GITHUB_REPO 환경변수가 설정되지 않았습니다.");
  }

  return { owner, repo, branch };
}

export const githubHeaders = { "X-GitHub-Api-Version": GITHUB_API_VERSION };

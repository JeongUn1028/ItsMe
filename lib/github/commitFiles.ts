import { getOctokit, getRepoConfig, githubHeaders } from "./client";

//* 하나의 커밋에 담을 파일 변경 하나를 표현합니다.
//* content: File(이미지/PDF) | string(Markdown) | object(JSON)
export type FileChange =
  | { path: string; content: File | string | object }
  | { path: string; delete: true };

export interface CommitResult {
  success: boolean;
  message: string;
}

const COMMITTER = { name: "itsme-bot", email: "wjddns363@naver.com" };

//* 변경 내용을 GitHub blob 에 올리기 위한 base64 문자열로 변환합니다.
async function toBase64(content: File | string | object): Promise<string> {
  //* File 은 object 이기도 하므로 먼저 검사해야 합니다.
  if (content instanceof File) {
    return Buffer.from(await content.arrayBuffer()).toString("base64");
  }
  if (typeof content === "string") {
    return Buffer.from(content).toString("base64");
  }
  return Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
}

//* 여러 파일의 생성/수정/삭제를 Git Trees API 로 단 하나의 커밋에 묶어 반영합니다.
//* Contents API 를 파일마다 호출하면 중간에 실패했을 때 일부만 반영되는 문제가 있어 이 방식을 사용합니다.
export async function commitFiles(
  changes: FileChange[],
  message: string,
): Promise<CommitResult> {
  if (changes.length === 0) {
    return { success: false, message: "커밋할 변경 사항이 없습니다." };
  }

  try {
    const octokit = getOctokit();
    const { owner, repo, branch } = getRepoConfig();

    //* 1. 브랜치의 최신 커밋과 그 트리 SHA
    const head = await octokit.request(
      "GET /repos/{owner}/{repo}/commits/{ref}",
      { owner, repo, ref: `heads/${branch}`, headers: githubHeaders },
    );
    const parentSha = head.data.sha;
    const baseTreeSha = head.data.commit.tree.sha;

    //* 2. 새 내용은 blob 으로 먼저 올리고, 삭제는 sha: null 로 표시
    const tree = await Promise.all(
      changes.map(async (change) => {
        if ("delete" in change) {
          return {
            path: change.path,
            mode: "100644" as const,
            type: "blob" as const,
            sha: null,
          };
        }
        const blob = await octokit.request(
          "POST /repos/{owner}/{repo}/git/blobs",
          {
            owner,
            repo,
            content: await toBase64(change.content),
            encoding: "base64",
            headers: githubHeaders,
          },
        );
        return {
          path: change.path,
          mode: "100644" as const,
          type: "blob" as const,
          sha: blob.data.sha,
        };
      }),
    );

    //* 3. 기존 트리를 기반으로 새 트리 생성
    const newTree = await octokit.request(
      "POST /repos/{owner}/{repo}/git/trees",
      { owner, repo, base_tree: baseTreeSha, tree, headers: githubHeaders },
    );

    //* 4. 커밋 생성
    const newCommit = await octokit.request(
      "POST /repos/{owner}/{repo}/git/commits",
      {
        owner,
        repo,
        message,
        tree: newTree.data.sha,
        parents: [parentSha],
        committer: COMMITTER,
        headers: githubHeaders,
      },
    );

    //* 5. 브랜치가 새 커밋을 가리키도록 갱신 (이 단계 전까지는 리포에 아무 영향이 없음)
    await octokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.data.sha,
      headers: githubHeaders,
    });

    return { success: true, message: "GitHub에 커밋되었습니다." };
  } catch (error) {
    console.error("GitHub commit error:", error);
    return { success: false, message: "GitHub 커밋에 실패했습니다." };
  }
}

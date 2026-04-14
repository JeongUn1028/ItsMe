import { Octokit } from "octokit";

//TODO - 삭제 하는 로직만 두고 호출해서 삭제 시키도록 변경
export async function deleteFiles(mdPath: string, imagePath: string) {
  console.log(mdPath, imagePath);
  if (!mdPath || !imagePath) {
    return {
      success: false,
      message: "Missing file paths",
    };
  }

  const OWNER = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const TOKEN = process.env.NEXT_GITHUB_TOKEN_KEY;
  const DELETE_PATHS = [`content/portfolio/${mdPath}.md`, `public${imagePath}`];

  //* GitHub 환경 변수 체크
  if (!OWNER || !REPO || !TOKEN) {
    return {
      success: false,
      message: "Missing GitHub environment variables",
    };
  }

  try {
    const octokit = new Octokit({
      auth: TOKEN,
    });

    //* 1. 최신 커밋 트리의 SHA 값 가져오기
    const SHA = await octokit.request(
      `GET /repos/${OWNER}/${REPO}/commits/heads/main`,
      {
        owner: OWNER,
        repo: REPO,
        ref: "heads/main",
        headers: {
          "X-GitHub-Api-Version": "2026-03-10",
        },
      },
    );

    //* 2. 파일 삭제를 위한 새로운 트리 생성
    const tree = DELETE_PATHS.map((path) => ({
      path,
      mode: "100644" as const,
      type: "blob" as const,
      sha: null, // 파일 삭제를 위해 SHA를 null로 설정
    }));

    //* 3. 깃허브 서버에 새로운 트리 생성
    const newTree = await octokit.request(
      `POST /repos/${OWNER}/${REPO}/git/trees`,
      {
        owner: OWNER,
        repo: REPO,
        base_tree: SHA.data.commit.tree.sha,
        tree,
        headers: {
          "X-GitHub-Api-Version": "2026-03-10",
        },
      },
    );

    //* 4. 새로운 커밋 생성
    const newCommit = await octokit.request(
      `POST /repos/${OWNER}/${REPO}/git/commits`,
      {
        owner: OWNER,
        repo: REPO,
        message: `chore(file): Delete files for ${mdPath}`,
        tree: newTree.data.sha,
        parents: [SHA.data.sha],
        committer: {
          name: "itsme-bot",
          email: "wjddns363@naver.com",
        },
      },
    );

    //* 5. 브랜치 업데이트
    await octokit.request(`PATCH /repos/${OWNER}/${REPO}/git/refs/heads/main`, {
      owner: OWNER,
      repo: REPO,
      sha: newCommit.data.sha,
      headers: {
        "X-GitHub-Api-Version": "2026-03-10",
      },
    });
  } catch (error) {
    console.error("GitHub file deletion error:", error);
    return {
      success: false,
      message: "GitHub 파일 삭제에 실패했습니다.",
    };
  }

  return {
    success: true,
    message: "파일이 성공적으로 삭제되었습니다.",
  };
}

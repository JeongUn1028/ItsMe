import { Octokit } from "octokit";
import { getGithubSHA } from "./getGithubSHA";

// 일단 포트폴리오 전용으로 만들고 필요하면 이력서에도 적용하기
// 파일명으로 한번에 md파일, 이미지 파일 삭제
export async function deleteFile(fileName: string, thumbnail: string) {
  if (!fileName || !thumbnail) {
    return {
      success: false,
      message: "Missing fileName or thumbnail information",
    };
  }

  const thumbnailFileName = thumbnail.split("/").pop() ?? "";

  const OWNER = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const TOKEN = process.env.NEXT_PUBLIC_TOKEN_KEY;
  const thumbnailPath = `public/portfolio/${thumbnailFileName}`;
  const mdPath = `content/portfolio/${fileName}.md`;

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

    //* 1. 이미지 파일 삭제
    const imageSha = await getGithubSHA(thumbnailPath);
    await octokit.request(
      `DELETE /repos/${OWNER}/${REPO}/contents/${thumbnailPath}`,
      {
        owner: OWNER,
        repo: REPO,
        path: thumbnailPath,
        message: `chore(file): Delete thumbnail for ${fileName}`,
        committer: {
          name: "itsme-bot",
          email: "wjddns363@naver.com",
        },
        sha: imageSha,
        headers: {
          "X-GitHub-Api-Version": "2026-03-10",
        },
      },
    );

    //* 2. md 파일 삭제
    const mdSha = await getGithubSHA(mdPath);

    await octokit.request(`DELETE /repos/${OWNER}/${REPO}/contents/${mdPath}`, {
      owner: OWNER,
      repo: REPO,
      path: mdPath,
      message: `chore(file): Delete markdown file for ${fileName}`,
      committer: {
        name: "itsme-bot",
        email: "wjddns363@naver.com",
      },
      sha: mdSha,
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

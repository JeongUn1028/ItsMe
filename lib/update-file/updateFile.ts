import { Octokit } from "octokit";

interface UpdateFileResult {
  success: boolean;
  message: string;
}

export async function updateFile(
  filePath: string,
  content: object | string | File,
): Promise<UpdateFileResult> {
  //* filePath: json, md 파일 경로
  //* content: 업데이트할 내용

  if (!filePath || !content) {
    return {
      success: false,
      message: "Missing filePath or content",
    };
  }

  const OWNER = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const TOKEN = process.env.NEXT_PUBLIC_TOKEN_KEY;

  const PATH = filePath;

  if (!OWNER || !REPO || !TOKEN) {
    return {
      success: false,
      message: "Missing GitHub environment variables",
    };
  }

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
    //* 파일의 SHA 값 가져오기
    const sha = await octokit
      .request(`GET /repos/${OWNER}/${REPO}/contents/${PATH}`, {
        owner: OWNER,
        repo: REPO,
        path: PATH,
        headers: {
          "X-GitHub-Api-Version": "2026-03-10",
        },
      })
      .then((response) => {
        return response.data.sha;
      });
    //* 파일 업데이트 요청

    //* 1. content를 타입에 따라 적절히 변환
    const content = async () => {
      //* JSON
      if (typeof content === "object") {
        return Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
      }
      //* Image or PDF
      else if (content instanceof File) {
        const arrayBuffer = await content.arrayBuffer();
        return Buffer.from(arrayBuffer).toString("base64");
      }
    };

    await octokit.request(`PUT /repos/${OWNER}/${REPO}/contents/${PATH}`, {
      owner: OWNER,
      repo: REPO,
      path: PATH,
      message: `chore(file): Update ${filePath} via API`,
      committer: {
        name: "itsme-bot",
        email: "wjddns363@naver.com",
      },
      content: await content(),
      sha,
      headers: {
        "X-GitHub-Api-Version": "2026-03-10",
      },
    });
    return {
      success: true,
      message: "File updated successfully",
    };
  } catch (error) {
    console.error("Error updating file:", error);
    return {
      success: false,
      message: "Failed to update file on GitHub",
    };
  }
}

import { Octokit } from "octokit";

interface UpdateFileResult {
  success: boolean;
  message: string;
}

export async function updateFile(
  fileName: string,
  content: object,
): Promise<UpdateFileResult> {
  //* finename: json, md 파일명
  //* content: 업데이트할 내용

  if (!fileName || !content) {
    return {
      success: false,
      message: "Missing fileName or content",
    };
  }

  const OWNER = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const TOKEN = process.env.NEXT_PUBLIC_TOKEN_KEY;
  const PATH =
    fileName === "resume.json"
      ? `content/${fileName}`
      : `content/projects/${fileName}`;

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

    await octokit.request(`PUT /repos/${OWNER}/${REPO}/contents/${PATH}`, {
      owner: OWNER,
      repo: REPO,
      path: PATH,
      message: `chore(file): Update ${fileName} via API`,
      committer: {
        name: "itsme-bot",
        email: "wjddns363@naver.com",
      },
      content: Buffer.from(
        typeof content === "object"
          ? JSON.stringify(content, null, 2)
          : String(content),
      ).toString("base64"),
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

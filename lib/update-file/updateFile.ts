import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function updateFile(fileName: string, content: object | string) {
  //* finename: json, md, 파일명
  //* content: 업데이트할 내용

  if (!fileName || !content) {
    return NextResponse.json(
      { message: "Missing fileName or content" },
      { status: 400 },
    );
  }
  const OWNER = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const TOKEN = process.env.NEXT_PUBLIC_TOKEN_KEY;
  let PATH = "";
  if (fileName.endsWith(".json")) {
    PATH = `content/${fileName}`;
  } else if (fileName.endsWith(".md")) {
    PATH = `content/portfolio/${fileName}`;
  } else {
    PATH = `content/portfolio/${fileName}`;
  }

  if (!OWNER || !REPO || !TOKEN) {
    return NextResponse.json(
      { message: "Missing GitHub environment variables" },
      { status: 500 },
    );
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
    return NextResponse.json(
      { message: "File updated successfully and redeployed" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

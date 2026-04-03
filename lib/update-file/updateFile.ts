import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function updateFile(fileName: string, content: object) {
  //* finename: json, md 파일명
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
  const PATH =
    fileName === "resume.json"
      ? `/content/${fileName}`
      : `/content/projects/${fileName}`;

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

    const res = await octokit.request(
      `PUT /repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
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
      },
    );

    return res;

    // let sha: string | undefined;
    // if (getFile.ok) {
    //   const fileData = await getFile.json();
    //   sha = fileData.sha;
    // }
    // let formattedContent: string;
    // if (fileName.endsWith(".json")) {
    //   formattedContent = JSON.stringify(content, null, 2);
    // } else {
    //   formattedContent = String(content);
    // // }

    // const updateFile = await fetch(
    //   `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
    //   {
    //     method: "PUT",
    //     headers: {
    //       Authorization: `token ${TOKEN}`,
    //       "Content-Type": "application/json",
    //       "X-GitHub-Api-Version": "2026-03-10",
    //     },
    //     body: JSON.stringify({
    //       message: `chore(file): Update ${fileName} via API`,
    //       content: Buffer.from(formattedContent).toString("base64"),
    //       sha,
    //       branch: "main",
    //     }),
    //   },
    // );
    // if (!updateFile.ok) {
    //   const errorData = await updateFile.json();
    //   console.error("GitHub API error:", errorData);
    //   return NextResponse.json(
    //     { message: "Failed to update file" },
    //     { status: 500 },
    //   );
    // }
    // return NextResponse.json(
    //   { message: "File updated successfully and redeployed" },
    //   { status: 200 },
    // );
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

//TODO - 한번에 여러 파일 업데이트할 수 있도록 개선하기 (예: 포트폴리오 md + 이미지)

import { Octokit } from "octokit";
import { getGithubSHA } from "./getGithubSHA";

//* fileName 을 받아서 filePath 로 변경, content를 받아서 GitHub API로 파일 업데이트 요청하는 함수
export async function updateFile(fileName: string, content: object | string) {
  //* fileName: json, md, 파일명
  //* content: 업데이트할 내용

  if (!fileName || !content) {
    return {
      success: false,
      message: "Missing fileName or content",
    };
  }

  const OWNER = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const TOKEN = process.env.NEXT_GITHUB_TOKEN_KEY;
  let PATH = "";
  //* Resume 의 .json 파일
  if (fileName.endsWith(".json")) {
    PATH = `content/${fileName}`;
    //* Portfolio 의 .md 파일
  } else if (fileName.endsWith(".md")) {
    PATH = `content/portfolio/${fileName}`;
    //* 이미지나 PDF 파일 (resume의 경우 public/resume폴더, portfolio의 경우 public/portfolio 폴더)
  } else {
    if (fileName.includes("resume")) {
      PATH = `public/resume/${fileName}`;
    } else {
      PATH = `public/portfolio/${fileName}`;
    }
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
    const sha = await getGithubSHA(PATH);
    //* 파일 업데이트 요청

    //* 1. content를 타입에 따라 적절히 변환
    const gitHubcontent = async (): Promise<string> => {
      //* Image or PDF — File 체크를 object보다 먼저 해야 함 (File은 object)
      if (content instanceof File) {
        const arrayBuffer = await content.arrayBuffer();
        return Buffer.from(arrayBuffer).toString("base64");
      }
      //* JSON
      else if (typeof content === "object") {
        return Buffer.from(JSON.stringify(content, null, 2)).toString("base64");
      }
      //* Markdown
      else {
        return Buffer.from(content).toString("base64");
      }
    };

    await octokit.request(`PUT /repos/${OWNER}/${REPO}/contents/${PATH}`, {
      owner: OWNER,
      repo: REPO,
      path: PATH,
      message: `chore(file): Update ${fileName} via API`,
      committer: {
        name: "itsme-bot",
        email: "wjddns363@naver.com",
      },
      content: await gitHubcontent(),
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

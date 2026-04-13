import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.NEXT_GITHUB_TOKEN_KEY,
});

export const getGithubSHA = async (filePath: string): Promise<string> => {
  const OWNER = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO;

  try {
    const sha = await octokit
      .request(`GET /repos/${OWNER}/${REPO}/contents/${filePath}`, {
        owner: OWNER,
        repo: REPO,
        path: filePath,
        headers: {
          "X-GitHub-Api-Version": "2026-03-10",
        },
      })
      .then((response) => response.data.sha);
    return sha;
  } catch (error) {
    console.error("Error fetching GitHub SHA:", error);
    throw error;
  }
};

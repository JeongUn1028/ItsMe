//* 클라이언트 번들로 유입되면 빌드가 실패하도록 서버 전용임을 표시합니다. (#54)
import "server-only";

export const getVelogPosts = async () => {
  try {
    const res = await fetch("https://v2.velog.io/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query Posts($username: String!, $limit: Int!) { posts(username: $username, limit: $limit) {title tags url_slug released_at}}`,
        variables: {
          username: "jeongun1028",
          limit: 3,
        },
      }),
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.data.posts;
  } catch (error) {
    console.error("Error fetching Velog posts:", error);
    return [];
  }
};

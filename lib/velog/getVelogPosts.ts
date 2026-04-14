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

import Link from "next/link";
import style from "./velog-posts.module.css";

export default async function Posts() {
  //TODO velog api 연동해서 최근 글 3개 불러오기
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
  });
  const data = await res.json();

  return (
    <div className={`glass ${style.velogInner}`}>
      {data.data.posts.map(
        (post: {
          title: string;
          tags: string[];
          url_slug: string;
          released_at: string;
        }) => (
          <Link
            href={`https://velog.io/@jeongun1028/${post.url_slug}`}
            key={post.title}
            target="_blank"
          >
            <div className={style.container}>
              <h2 className={style.title}>{post.title}</h2>
              <div className={style.tag}>
                {post.tags.map((tag) => (
                  <p key={tag}>{tag}</p>
                ))}
              </div>
              <div className={style.dateContainer}>
                <p>
                  작성 일자 : {new Date(post.released_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ),
      )}
    </div>
  );
}

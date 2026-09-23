import style from "./VelogPosts.module.css";
import { getVelogPosts } from "@/lib/velog/getVelogPosts";
import VelogPost from "./VelogPost";
import { velogPost } from "@/lib/types/velogTypes";
import type { CSSProperties } from "react";

export async function VelogPosts() {
  const posts = await getVelogPosts();
  return (
    <div
      className={`glass fade-up ${style.container}`}
      style={{ "--i": 1 } as CSSProperties}
    >
      <h1 className={style.title}>VELOG POSTS</h1>
      {posts.length > 0 ? (
        posts.map((post: velogPost) => (
          <VelogPost key={post.url_slug} post={post} />
        ))
      ) : (
        <p>최근 게시물이 없습니다.</p>
      )}
    </div>
  );
}

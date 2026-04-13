import style from "./velog-posts.module.css";
import { getVelogPosts } from "@/lib/getVelogPosts";
import VelogPost from "./velog-post";
import { VelogPostType } from "@/lib/portfolio/types";

export async function VelogPosts() {
  const posts = await getVelogPosts();
  return (
    <div className={`glass ${style.container}`}>
      <h1 className={style.title}>VELOG POSTS</h1>
      {posts.length > 0 ? (
        posts.map((post: VelogPostType) => (
          <VelogPost key={post.url_slug} post={post} />
        ))
      ) : (
        <p>최근 게시물이 없습니다.</p>
      )}
    </div>
  );
}

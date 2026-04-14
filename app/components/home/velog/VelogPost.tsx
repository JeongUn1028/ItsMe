import Link from "next/link";
import style from "./VelogPost.module.css";
import { velogPost } from "@/lib/types/velogTypes";

export default function VelogPost({ post }: { post: velogPost }) {
  return (
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
          <p>작성 일자 : {new Date(post.released_at).toLocaleDateString()}</p>
        </div>
      </div>
    </Link>
  );
}

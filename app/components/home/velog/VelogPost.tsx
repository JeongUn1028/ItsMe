import Link from "next/link";
import style from "./VelogPost.module.css";
import { velogPost } from "@/lib/types/velogTypes";

export default function VelogPost({ post }: { post: velogPost }) {
  return (
    <Link
      href={`https://velog.io/@jeongun1028/${post.url_slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={style.link}
    >
      <div className={style.container}>
        <h2 className={style.title}>{post.title}</h2>
        {/* 태그와 날짜를 같은 줄에 둬 글마다 행 높이가 들쭉날쭉해지지 않게 한다. (#69) */}
        <div className={style.meta}>
          <div className={style.tag}>
            {post.tags.map((tag) => (
              <p key={tag} className="chip">
                {tag}
              </p>
            ))}
          </div>
          <p className={style.date}>
            {new Date(post.released_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}

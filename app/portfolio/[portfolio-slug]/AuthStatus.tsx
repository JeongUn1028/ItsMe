import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import Link from "next/link";
import DeleteForm from "./deleteForm";
import style from "./page.module.css";

export default async function AuthStatus({
  slug,
  thumbnail,
}: {
  slug: string;
  thumbnail: string;
}) {
  const isLoggedIn = await getLoginStatus();
  return (
    isLoggedIn && (
      <div className={style.actionGroup}>
        <Link href={`/admin/edit/portfolio/${slug}`} className={style.editLink}>
          {"Edit->"}
        </Link>
        <DeleteForm slug={slug} thumbnail={thumbnail} />
      </div>
    )
  );
}

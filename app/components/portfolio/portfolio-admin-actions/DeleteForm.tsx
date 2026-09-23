"use client";

import { deletePortfolioAction } from "@/app/actions/delete-portfolio.action";
import { useActionState } from "react";
import style from "./PortfolioAdminActions.module.css";

export default function DeleteForm({
  slug,
  thumbnail,
}: {
  slug: string;
  thumbnail: string;
}) {
  const [, formAction, isPending] = useActionState(deletePortfolioAction, {
    success: false,
    message: "",
  });

  return (
    <form action={formAction} className={style.deleteForm}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="thumbnail" value={thumbnail} />
      <button type="submit" disabled={isPending} className={`pill pill-danger ${style.deleteButton}`}>
        {isPending ? "삭제 중..." : "삭제"}
      </button>
    </form>
  );
}

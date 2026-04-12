"use client";

import { deletePortfolio } from "@/app/actions/delete-portfolio";
import { useActionState } from "react";

export default function DeleteForm({
  slug,
  thumbnail,
}: {
  slug: string;
  thumbnail: string;
}) {
  const [, formAction, isPending] = useActionState(deletePortfolio, {
    success: false,
    message: "",
  });
  return (
    <form action={formAction}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="thumbnail" value={thumbnail} />
      <button type="submit" disabled={isPending}>
        {isPending ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
}

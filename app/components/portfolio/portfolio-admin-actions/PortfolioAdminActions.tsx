import Link from "next/link";
import DeleteForm from "./DeleteForm";
import style from "./PortfolioAdminActions.module.css";

interface PortfolioAdminActionsProps {
  slug: string;
  thumbnail: string;
}

//* 포트폴리오 항목의 관리자 액션(수정·삭제).
//* 인증 경계 안쪽(/admin)에서만 쓴다. 공개 페이지에 두면 cookies() 때문에
//* 라우트 전체가 동적이 되어 정적 렌더링을 잃는다. (#57)
export default function PortfolioAdminActions({
  slug,
  thumbnail,
}: PortfolioAdminActionsProps) {
  return (
    <div className={style.actionGroup}>
      <Link
        href={`/admin/edit/portfolio/${slug}`}
        className={`pill pill-neutral ${style.editLink}`}
      >
        수정
      </Link>
      <DeleteForm slug={slug} thumbnail={thumbnail} />
    </div>
  );
}

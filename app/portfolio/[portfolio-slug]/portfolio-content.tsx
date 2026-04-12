import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import BackToHomeButton from "@/app/components/ui/back-to-home-button";
import { useMDXComponents } from "@/mdx-components";
import { getPortfolioData } from "@/lib/portfolio/getPortfolioData";
import style from "./page.module.css";
import { getLoginStatus } from "@/lib/auth/getLoginStatus";
import DeleteForm from "./deleteForm";

function getPortfolioOrNotFound(slug: string) {
  try {
    return getPortfolioData(slug);
  } catch {
    notFound();
  }
}

export async function PortfolioContent({
  params,
  isModal = false,
}: {
  params: Promise<{ "portfolio-slug": string }>;
  isModal?: boolean;
}) {
  const { "portfolio-slug": slug } = await params;
  const portfolio = getPortfolioOrNotFound(slug);
  const isLogin = await getLoginStatus();

  return (
    <section className={isModal ? style.viewportModal : style.viewport}>
      <article
        className={`${style.modal} ${isModal ? style.modalScrollable : ""}`}
      >
        <header className={style.header}>
          <div className={style.headerRow}>
            <BackToHomeButton className={style.backLink} />
            {isLogin && (
              <div>
                <Link
                  href={`/admin/edit/portfolio/${slug}`}
                  className={style.editLink}
                >
                  {"Edit->"}
                </Link>
                <DeleteForm slug={slug} thumbnail={portfolio.thumbnail} />
              </div>
            )}
          </div>

          <h1 className={style.title}>{portfolio.title}</h1>
          <p className={style.summary}>{portfolio.summary}</p>

          <div className={style.metaRow}>
            {portfolio.tags.map((tag) => (
              <span key={tag} className={style.tag}>
                #{tag}
              </span>
            ))}
          </div>

          <div className={style.metaRow}>
            <span className={style.divider}>•</span>
            <span className={style.meta}>Created {portfolio.createdAt}</span>
          </div>

          <div className={style.linkRow}>
            <Link
              href={portfolio.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className={style.resourceLink}
            >
              GitHub
            </Link>
            <Link
              href={portfolio.velogLink}
              target="_blank"
              rel="noopener noreferrer"
              className={style.resourceLink}
            >
              Velog
            </Link>
          </div>
        </header>

        <div className={style.content}>
          <MDXRemote
            components={useMDXComponents}
            source={portfolio.contents}
          />
        </div>
      </article>
    </section>
  );
}

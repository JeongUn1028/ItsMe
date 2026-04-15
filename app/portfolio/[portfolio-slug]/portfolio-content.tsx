import style from "./page.module.css";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import BackToHomeButton from "@/app/components/ui/BackToHomeBtn";
import { useMDXComponents } from "@/mdx-components";
import { getPortfolioData } from "@/lib/portfolio/getPortfolioData";
import { Suspense } from "react";
import AuthStatus from "./AuthStatus";
import AuthStatusSkeleton from "../../components/ui/skeleton/AuthStatusSkeleton";
import Image from "next/image";

export async function PortfolioContent({
  params,
  isModal = false,
}: {
  params: Promise<{ "portfolio-slug": string }>;
  isModal?: boolean;
}) {
  const { "portfolio-slug": slug } = await params;
  const portfolio = getPortfolioData(slug);

  return (
    <section className={isModal ? style.viewportModal : style.viewport}>
      <article
        className={`${style.modal} ${isModal ? style.modalScrollable : ""}`}
      >
        <header className={style.header}>
          <div className={style.headerRow}>
            <BackToHomeButton className={style.backLink} />
            <Suspense fallback={<AuthStatusSkeleton />}>
              <AuthStatus slug={slug} thumbnail={portfolio.thumbnail} />
            </Suspense>
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
              <Image
                src={"/links/github_logo_icon.png"}
                alt="GitHub"
                width={32}
                height={32}
              />
            </Link>
            <Link
              href={portfolio.velogLink}
              target="_blank"
              rel="noopener noreferrer"
              className={style.resourceLink}
            >
              <Image
                src={"/links/velog_logo_icon.svg"}
                alt="Velog"
                width={32}
                height={32}
              />
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

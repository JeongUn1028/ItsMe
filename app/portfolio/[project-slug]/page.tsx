import { notFound } from "next/navigation";
import { getProjectData } from "@/lib/projects/getProjectData";
import { useMDXComponents } from "@/mdx-components";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import BackToHomeButton from "@/app/components/ui/back-to-home-button";
import style from "./page.module.css";

function getProjectOrNotFound(slug: string) {
  try {
    return getProjectData(slug);
  } catch {
    notFound();
  }
}

export default async function Portfolio({
  params,
  isModal = false,
}: {
  params: Promise<{ "project-slug": string }>;
  isModal?: boolean;
}) {
  const { "project-slug": slug } = await params;

  const project = getProjectOrNotFound(slug);

  return (
    <section className={isModal ? style.viewportModal : style.viewport}>
      <article
        className={`${style.modal} ${isModal ? style.modalScrollable : ""}`}
      >
        <header className={style.header}>
          <BackToHomeButton className={style.backLink} />

          <h1 className={style.title}>{project.title}</h1>
          <p className={style.summary}>{project.summary}</p>

          <div className={style.metaRow}>
            {project.tags.map((tag) => (
              <span key={tag} className={style.tag}>
                #{tag}
              </span>
            ))}
          </div>

          <div className={style.metaRow}>
            <span className={style.meta}>Published {project.publishedAt}</span>
            <span className={style.divider}>•</span>
            <span className={style.meta}>Created {project.createdAt}</span>
          </div>

          <div className={style.linkRow}>
            <Link
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className={style.resourceLink}
            >
              GitHub
            </Link>
            <Link
              href={project.velogLink}
              target="_blank"
              rel="noopener noreferrer"
              className={style.resourceLink}
            >
              Velog
            </Link>
          </div>
        </header>

        <div className={style.content}>
          <MDXRemote components={useMDXComponents} source={project.contents} />
        </div>
      </article>
    </section>
  );
}

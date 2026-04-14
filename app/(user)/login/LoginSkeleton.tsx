import style from "./page.module.css";

export default function LoginSkeleton() {
  return (
    <main className={style.page}>
      <div className={style.shell}>
        <section className={style.intro}>
          <div className={style.eyebrow}>ADMIN ACCESS</div>
          <div>
            <h1 className={style.headline}>Portfolio control room.</h1>
            <p className={style.copy}>
              글 발행 상태와 포트폴리오 구성을 관리하기 위한 관리자
              로그인입니다.
            </p>
          </div>
          <div className={style.meta}>
            <span className={style.dot}></span>
            Secure entry with server-side cookie validation
          </div>
        </section>

        <section className={`glass ${style.card} ${style.skeletonCard}`}>
          <div className={style.accent}></div>
          <div className={style.cardHeader}>
            <div
              className={`${style.skeletonLine} ${style.skeletonLabel}`}
            ></div>
            <div
              className={`${style.skeletonLine} ${style.skeletonInput}`}
            ></div>
          </div>

          <div className={style.form}>
            <div className={style.field}>
              <div
                className={`${style.skeletonLine} ${style.skeletonLabel}`}
              ></div>
              <div
                className={`${style.skeletonLine} ${style.skeletonInput}`}
              ></div>
            </div>

            <div className={style.field}>
              <div
                className={`${style.skeletonLine} ${style.skeletonLabel}`}
              ></div>
              <div
                className={`${style.skeletonLine} ${style.skeletonInput}`}
              ></div>
            </div>

            <div
              className={`${style.skeletonLine} ${style.skeletonButton}`}
            ></div>
          </div>

          <div className={`${style.skeletonLine} ${style.skeletonHint}`}></div>
        </section>
      </div>
    </main>
  );
}

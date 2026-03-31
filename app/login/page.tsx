import { fetchLoginAction } from "@/app/actions/fetch-login";
import { JSX } from "react";
import style from "./page.module.css";

export default function Page(): JSX.Element {
  return (
    <main className={style.page}>
      <div className={style.shell}>
        <section className={style.intro}>
          <div className={style.eyebrow}>ADMIN ACCESS</div>
          <div>
            <h1 className={style.headline}>Portfolio control room.</h1>
            <p className={style.copy}>
              글 발행 상태와 포트폴리오 구성을 관리하기 위한 관리자
              로그인입니다. 개인 작업용 접근만 허용됩니다.
            </p>
          </div>
          <div className={style.meta}>
            <span className={style.dot}></span>
            Secure entry with server-side cookie validation
          </div>
        </section>

        <section className={`glass ${style.card}`}>
          <div className={style.accent}></div>
          <div className={style.cardHeader}>
            <div className={style.eyebrow}>LOGIN</div>
            <h1 className={style.title}>관리자 로그인</h1>
            <p className={style.description}>
              인증이 완료되면 관리자 화면으로 이동할 수 있는 세션이 생성됩니다.
            </p>
          </div>

          <form action={fetchLoginAction} className={style.form}>
            <div className={style.field}>
              <label htmlFor="username" className={style.label}>
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="아이디를 입력하세요"
                className={style.input}
                name="username"
                required
              />
            </div>

            <div className={style.field}>
              <label htmlFor="password" className={style.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className={style.input}
                name="password"
                required
              />
            </div>

            <button className={style.submit} type="submit">
              로그인
            </button>
          </form>

          <p className={style.hint}>
            로그인 상태는 서버에서 발급한 보안 쿠키를 기준으로 유지됩니다.
          </p>
        </section>
      </div>
    </main>
  );
}

import { z } from "zod";
import { readText } from "@/lib/validation/formValue";

const ADMIN_PATH = "/admin";

//* "//evil.com" 은 프로토콜 상대 URL 이라 외부로 나간다. 단일 슬래시로 시작하는 내부 경로만 허용한다.
const isInternalPath = (path: string) =>
  path.startsWith("/") && !path.startsWith("//");

const loginFormSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export interface LoginFormValues {
  username: string;
  password: string;
}

//* redirectTo 는 성공·실패 양쪽에서 필요하므로 최상위에 둔다.
export type LoginParseResult = { redirectTo: string } & (
  | { ok: true; values: LoginFormValues }
  | { ok: false }
);

/**
 * 로그인 폼의 FormData 를 검증하고, open redirect 를 막은 이동 경로를 함께 돌려준다.
 *
 * @example
 * const result = parseLoginForm(formData);
 * if (!result.ok) redirect(`/login?error=missing&redirect=${result.redirectTo}`);
 */
export function parseLoginForm(formData: FormData): LoginParseResult {
  const requestedPath = readText(formData, "redirect");
  const redirectTo = isInternalPath(requestedPath) ? requestedPath : ADMIN_PATH;

  const parsed = loginFormSchema.safeParse({
    username: readText(formData, "username"),
    password: readText(formData, "password"),
  });

  return parsed.success
    ? { ok: true, redirectTo, values: parsed.data }
    : { ok: false, redirectTo };
}

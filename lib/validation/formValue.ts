import { z } from "zod";

//* FormData 값은 string | File | null 이므로, 스키마에 넣기 전에 형태를 맞춰 둔다.

/** FormData 의 텍스트 필드를 trim 된 문자열로 읽는다. 없으면 빈 문자열. */
export const readText = (formData: FormData, key: string): string =>
  formData.get(key)?.toString().trim() ?? "";

/** 업로드되지 않았거나 0바이트인 파일은 "없음"으로 취급한다. */
export const readFile = (formData: FormData, key: string): File | null => {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
};

/** "a, b," 처럼 쉼표로 구분된 입력을 빈 항목 없는 배열로 바꾼다. */
export const commaSeparated = z.string().transform((value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0),
);

/** 첫 번째 검증 실패 메시지만 사용자에게 보여준다. */
export const firstIssueMessage = (error: z.ZodError): string =>
  error.issues[0]?.message ?? "입력값이 올바르지 않습니다.";

/** 업로드 파일의 MIME 타입을 제한한다. 파일이 없으면 통과한다. */
export const fileOfType = (allowed: readonly string[], message: string) =>
  z
    .instanceof(File)
    .nullable()
    .refine((file) => file === null || allowed.includes(file.type), {
      message,
    });

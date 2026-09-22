import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;
const HASH_PREFIX = "scrypt";

//* 관리자 비밀번호 해시 문자열을 생성합니다. 형식: scrypt$<salt hex>$<hash hex>
//* (scripts/hash-password.mjs 에서 사용)
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${HASH_PREFIX}$${salt}$${derived.toString("hex")}`;
}

//* 입력한 비밀번호가 저장된 해시와 일치하는지 타이밍 공격에 안전하게 비교합니다.
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [prefix, salt, hashHex] = storedHash.split("$");
  if (prefix !== HASH_PREFIX || !salt || !hashHex) {
    return false;
  }

  const expected = Buffer.from(hashHex, "hex");
  const derived = (await scrypt(password, salt, expected.length)) as Buffer;

  return (
    derived.length === expected.length && timingSafeEqual(derived, expected)
  );
}

//* 문자열 길이가 달라도 비교 시간이 일정하도록 고정 길이 다이제스트로 비교합니다.
function safeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

//* 관리자 아이디/비밀번호를 환경변수(ADMIN_USERNAME, ADMIN_PASSWORD_HASH)와 대조합니다.
export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminUsername || !adminPasswordHash) {
    console.error("ADMIN_USERNAME 또는 ADMIN_PASSWORD_HASH 환경변수가 없습니다.");
    return false;
  }

  //* 아이디가 틀려도 비밀번호 검증까지 수행해 응답 시간으로 아이디 존재 여부가 드러나지 않게 합니다.
  const usernameMatches = safeEqualString(username, adminUsername);
  const passwordMatches = await verifyPassword(password, adminPasswordHash);

  return usernameMatches && passwordMatches;
}

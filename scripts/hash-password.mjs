// 사용법: node scripts/hash-password.mjs '<비밀번호>'
// 출력된 값을 ADMIN_PASSWORD_HASH 환경변수에 넣으세요.
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error("사용법: node scripts/hash-password.mjs '<비밀번호>'");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
console.log(`scrypt$${salt}$${hash}`);

import { randomBytes, randomInt } from "node:crypto";

export function randString(length = 50): string {
  return randomBytes((length * 3) / 4)
    .toString("base64url")
    .slice(0, length);
}

export function randNumericString(length = 6): string {
  let result = ""
  for (let i = 0; i <= length; i++) {
    result += randomInt(0, 9).toString()
  }
  return result
}

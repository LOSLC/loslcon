import * as bcrypt from "bcrypt";

export async function hashString(str: string, l = 10): Promise<string> {
  return await bcrypt.hash(str, l);
}

export async function compareHash(str: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(str, hash);
}

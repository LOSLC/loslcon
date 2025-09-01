"use server";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/env";

const encoder = new TextEncoder();

async function hmacSign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Buffer.from(sig).toString("base64url");
}

export async function signValue(value: string) {
  return `${value}.${await hmacSign(value, getEnv("APP_SECRET"))}`;
}

export async function verifySignedValue(signed: string) {
  const idx = signed.lastIndexOf(".");
  if (idx < 0) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const secret = getEnv("APP_SECRET");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    Buffer.from(sig, "base64url"),
    encoder.encode(value),
  );
  return isValid ? value : null;
}

export async function setHttpOnlyCookie(name: string, value: string, maxAgeSeconds: number) {
  const jar = await cookies();
  jar.set(name, await signValue(value), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

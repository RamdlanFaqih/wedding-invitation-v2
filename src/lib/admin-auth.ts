import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "invitation-admin";
export const SESSION_SECONDS = 60 * 60 * 8;

function signature(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || `invitation-session:${process.env.ADMIN_PASSWORD || "admin123"}`;
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function validCredentials(username: string, password: string) {
  const expected = signature(`${process.env.ADMIN_USERNAME || "admin"}:${process.env.ADMIN_PASSWORD || "admin123"}`);
  return timingSafeEqual(Buffer.from(signature(`${username}:${password}`)), Buffer.from(expected));
}

export function createSession() {
  const expires = String(Date.now() + SESSION_SECONDS * 1000);
  return `${expires}.${signature(expires)}`;
}

export async function isAdmin() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const [expires, signed, extra] = token.split(".");
  if (extra || !expires || !signed || !/^[a-f0-9]{64}$/.test(signed) || !/^\d+$/.test(expires) || Number(expires) <= Date.now()) return false;
  const expected = signature(expires);
  return signed.length === expected.length && timingSafeEqual(Buffer.from(signed), Buffer.from(expected));
}

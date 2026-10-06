"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, createSession, SESSION_SECONDS, validCredentials } from "@/lib/admin-auth";

export async function login(_previous: string, form: FormData) {
  const username = String(form.get("username") || "").trim();
  const password = String(form.get("password") || "");
  if (username.length > 100 || password.length > 200 || !validCredentials(username, password)) {
    return "Username atau password salah. Silakan coba lagi.";
  }
  (await cookies()).set(ADMIN_COOKIE, createSession(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_SECONDS,
  });
  redirect("/tambah-tamu-undangan");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/tambah-tamu-undangan");
}

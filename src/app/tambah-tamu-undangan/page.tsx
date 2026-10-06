import Link from "next/link";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-auth";
import { coupleNames } from "@/config/wedding";
import { GuestLinkForm, LoginForm } from "./forms";
import { logout } from "./actions";
import "./styles.css";

export const metadata: Metadata = { title: "Tambah Tamu Undangan", robots: { index: false, follow: false } };

export default async function GuestAdminPage() {
  const authenticated = await isAdmin();
  return <main className="guest-admin">
    <header className="guest-admin-header"><Link href="/">{coupleNames}<span>WEDDING INVITATION</span></Link>{authenticated && <form action={logout}><button className="button button-outline">Keluar</button></form>}</header>
    <section className="guest-admin-panel">
      <span className="eyebrow">A PERSONAL INVITATION</span>
      <h1>{authenticated ? <>Undangan untuk <em>orang terkasih.</em></> : <>Selamat <em>datang.</em></>}</h1>
      <p>{authenticated ? "Tulis nama tamu, buat tautannya, lalu kirim undangan dengan mudah." : "Masuk untuk membuat tautan undangan khusus bagi setiap tamu."}</p>
      {authenticated ? <GuestLinkForm /> : <LoginForm />}
    </section>
    <footer className="guest-admin-footer">Dibuat dengan cinta · {coupleNames}</footer>
  </main>;
}

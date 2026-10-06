"use client";

import { useActionState, useState, type FormEvent } from "react";
import { ArrowUpRight, Copy, Link, LockKeyhole } from "lucide-react";
import { coupleNames } from "@/config/wedding";
import { login } from "./actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, "");
  return <form action={action} className="guest-admin-form">
    <label htmlFor="username">Username</label><input id="username" name="username" autoComplete="username" required maxLength={100} />
    <label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required maxLength={200} />
    <p role="alert" className="guest-admin-feedback">{error}</p>
    <button className="button button-dark" disabled={pending}><LockKeyhole size={17} />{pending ? "Sedang masuk…" : "Masuk"}<ArrowUpRight size={17} /></button>
  </form>;
}

export function GuestLinkForm() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<{ name: string; url: string } | null>(null);
  const [feedback, setFeedback] = useState("");
  function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const guest = name.trim();
    if (!guest) { setFeedback("Isi nama tamu terlebih dahulu."); return; }
    const url = new URL("/", window.location.origin);
    url.searchParams.set("to", guest);
    setResult({ name: guest, url: url.toString() });
    setFeedback("Tautan siap. Salin dan kirim kepada tamu undangan.");
  }
  const message = result ? `Yth. ${result.name},\n\nDengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan ${coupleNames}.\n\nSilakan buka undangan melalui tautan berikut:\n${result.url}\n\nKehadiran dan doa Anda sangat berarti bagi kami. Terima kasih.` : "";
  async function copy(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); setFeedback(`${label} berhasil disalin.`); }
    catch { setFeedback("Belum berhasil disalin. Pilih teks di bawah dan salin secara manual."); }
  }
  return <>
    <form onSubmit={generate} className="guest-admin-form">
      <label htmlFor="guest">1. Nama tamu undangan</label>
      <input id="guest" value={name} onChange={(event) => { setName(event.target.value); setResult(null); setFeedback(""); }} placeholder="Contoh: Bapak Budi & Ibu Sari" required maxLength={80} aria-describedby="guest-help" />
      <small id="guest-help">Nama ini akan tampil pada amplop undangan. Maksimal 80 karakter.</small>
      <button className="button button-dark"><Link size={17} />Buat Tautan Undangan<ArrowUpRight size={17} /></button>
    </form>
    <p role="status" className="guest-admin-feedback">{feedback}</p>
    {result && <section className="guest-admin-result" aria-label="Hasil tautan undangan">
      <span className="eyebrow">SIAP DIKIRIM</span><h2>Untuk {result.name}</h2>
      <label htmlFor="invitation-url">2. Salin tautan atau pesan undangan</label>
      <input id="invitation-url" readOnly value={result.url} onFocus={(event) => event.target.select()} />
      <div className="guest-admin-buttons"><button className="button button-dark" onClick={() => copy(result.url, "Tautan")}><Copy size={16} />Salin Tautan</button><a className="button button-outline" href={result.url} target="_blank" rel="noopener noreferrer">Lihat Undangan<ArrowUpRight size={16} /></a></div>
      <label htmlFor="invitation-message">Pesan siap kirim</label><textarea id="invitation-message" readOnly value={message} rows={9} onFocus={(event) => event.target.select()} />
      <button className="button button-outline" onClick={() => copy(message, "Pesan undangan")}><Copy size={16} />Salin Pesan & Tautan</button>
      <small>Tempel pesan ke WhatsApp atau aplikasi pesan pilihanmu. Nama tamu tidak disimpan sebagai daftar.</small>
    </section>}
  </>;
}

"use client";

import { ArrowDown, ArrowUpRight, Check, Heart, Send } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { LittleFlower } from "./botanical";

type Wish = { id: string; name: string; message: string; date: string };
const storageKey = "asri-wedding:wishes:v1";
function subscribeToWishes(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("wishes-updated", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("wishes-updated", callback); };
}
function getStoredWishes() {
  try { return localStorage.getItem(storageKey) ?? "[]"; } catch { return "[]"; }
}
const examples: Wish[] = [
  { id: "sample-1", name: "Nadia & Fajar", message: "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Selalu saling menggenggam dalam setiap musim kehidupan. Bahagia selalu, kalian! 🤍", date: "Contoh ucapan" },
  { id: "sample-2", name: "Putri Amelia", message: "Dua hati yang baik akhirnya menemukan rumah. Semoga cinta kalian terus tumbuh, bahkan dalam hal-hal paling sederhana. Selamat menempuh hidup baru!", date: "Contoh ucapan" },
  { id: "sample-3", name: "Dimas", message: "So happy for you both! Semoga perjalanan baru ini penuh tawa, petualangan, dan banyak hal indah. Sampai bertemu di hari bahagia kalian!", date: "Contoh ucapan" },
];

function validWish(value: unknown): value is Wish {
  if (!value || typeof value !== "object") return false;
  const w = value as Partial<Wish>;
  return typeof w.id === "string" && typeof w.name === "string" && w.name.length <= 80 && typeof w.message === "string" && w.message.length <= 1000 && typeof w.date === "string";
}

export function Guestbook() {
  const stored = useSyncExternalStore(subscribeToWishes, getStoredWishes, () => "[]");
  const wishes = useMemo<Wish[]>(() => {
    try {
      const parsed: unknown = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.filter(validWish).slice(0, 50) : [];
    } catch { return []; }
  }, [stored]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(3);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanMessage = message.trim();
    if (cleanName.length < 2 || cleanMessage.length < 5) {
      setError(true);
      setFeedback("Tulis nama minimal 2 karakter dan ucapan minimal 5 karakter, ya.");
      return;
    }
    const wish: Wish = { id: crypto.randomUUID(), name: cleanName, message: cleanMessage, date: "Baru saja · pratinjau" };
    const next = [wish, ...wishes].slice(0, 50);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new Event("wishes-updated"));
      setMessage("");
      setVisible(3);
      setError(false);
      setFeedback("Ucapan tersimpan di browser ini sebagai pratinjau. Belum dikirim ke mempelai.");
    } catch {
      setError(true);
      setFeedback("Browser tidak mengizinkan penyimpanan. Ucapan belum tersimpan; teksmu tetap ada di sini.");
    }
  }

  const allWishes = [...wishes, ...examples];

  return (
    <section className="wishes-section section-space" id="ucapan">
      <div className="section-heading"><span className="eyebrow">WORDS TO KEEP, FOREVER</span><h2>Sepucuk <em>doa.</em></h2><p>Hadiah terindah adalah doa yang tulus.<br />Titipkan harapan baikmu untuk perjalanan kami.</p></div>
      <div className="guestbook-grid">
        <form className="wish-form" onSubmit={submit}>
          <LittleFlower /><h3>Dengan segenap cinta</h3><p>Setiap kata baikmu begitu berarti.</p>
          <label htmlFor="guest-name">Nama kamu</label><input id="guest-name" name="name" autoComplete="name" placeholder="Nama yang kami kenal" minLength={2} maxLength={80} required value={name} onChange={(event) => setName(event.target.value)} />
          <label htmlFor="guest-message">Ucapan & doa</label><textarea id="guest-message" name="message" placeholder="Tuliskan doa dan harapan baikmu di sini…" minLength={5} maxLength={1000} required rows={4} value={message} onChange={(event) => setMessage(event.target.value)} /><span className="character-count">{message.length} / 1000</span>
          <p className="demo-notice">Mode pratinjau: ucapan hanya tersimpan di browser ini. Contoh ucapan di samping bukan pesan tamu sungguhan.</p>
          <button className="button button-dark" type="submit"><Send size={15} /><span>Kirim Ucapan</span><ArrowUpRight size={17} /></button>
          {feedback && <p className={`form-feedback ${error ? "is-error" : ""}`} role="status">{!error && <Check size={16} />}{feedback}</p>}
        </form>
        <div className="wishes-list"><div className="wishes-list-heading"><span><Heart size={14} /> Catatan penuh cinta</span><span>{allWishes.length.toString().padStart(2, "0")}</span></div>
          {allWishes.slice(0, visible).map((wish) => <article className="wish-card" key={wish.id}><div className="wish-avatar">{wish.name.charAt(0).toUpperCase()}</div><div><h4>{wish.name}</h4><span className="wish-date">{wish.date}</span><p>{wish.message}</p><Heart size={13} className="wish-heart" /></div></article>)}
          {visible < allWishes.length && <button className="text-button load-more" onClick={() => setVisible((count) => count + 3)}>Baca ucapan lainnya <ArrowDown size={14} /></button>}
        </div>
      </div>
    </section>
  );
}

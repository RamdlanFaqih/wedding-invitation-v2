"use client";

import { Check, Copy, Gift } from "lucide-react";
import { useState } from "react";
import { wedding, type GiftAccount } from "@/config/wedding";

const pendingAccount: GiftAccount = { id: "pending", bank: "", accountNumber: "", accountHolder: "" };

function BankCard({ account }: { account: GiftAccount }) {
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);
  const number = account.accountNumber.replace(/\s/g, "");
  const ready = Boolean(account.bank.trim() && account.accountHolder.trim() && /^\d+$/.test(number));

  async function copyNumber() {
    if (!ready) return;
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setFeedback(`Nomor rekening ${account.bank} berhasil disalin.`);
    } catch {
      setCopied(false);
      setFeedback("Nomor belum tersalin. Pilih nomor rekening di atas untuk menyalinnya secara manual.");
    }
  }

  return (
    <article className="bank-card" aria-label={ready ? `Rekening ${account.bank}` : "Informasi rekening menyusul"}>
      <div className="bank-card-header"><span className="eyebrow">WEDDING GIFT</span><Gift size={24} strokeWidth={1.25} aria-hidden="true" /></div>
      <h3>{account.bank || "Nama bank menyusul"}</h3>
      <dl className="bank-details">
        <div><dt>Nomor rekening</dt><dd className="bank-number">{account.accountNumber || "Belum tersedia"}</dd></div>
        <div><dt>Atas nama</dt><dd>{account.accountHolder || "Nama pemilik menyusul"}</dd></div>
      </dl>
      <button className="button button-dark" type="button" onClick={copyNumber} disabled={!ready}>
        {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
        {ready ? (copied ? "Salin Lagi" : "Salin Nomor Rekening") : "Rekening menyusul"}
      </button>
      <p className="bank-feedback" role="status">{feedback}</p>
    </article>
  );
}

export function WeddingGift() {
  const accounts = wedding.giftAccounts.length ? wedding.giftAccounts : [pendingAccount];
  return (
    <section className="gift-section section-space" id="hadiah" aria-labelledby="gift-heading">
      <div className="section-heading">
        <span className="eyebrow">A LITTLE GIFT, A LOT OF LOVE</span>
        <h2 id="gift-heading">Tanda <em>kasih.</em></h2>
        <p>Kehadiran dan doa baikmu adalah hadiah terindah bagi kami.<br />Jika ingin berbagi tanda kasih, kamu dapat mengirimkannya melalui rekening berikut.</p>
      </div>
      <div className="bank-grid">{accounts.map((account) => <BankCard key={account.id} account={account} />)}</div>
      {!wedding.giftAccounts.length && <p className="gift-note">Informasi rekening akan kami lengkapi segera.</p>}
    </section>
  );
}

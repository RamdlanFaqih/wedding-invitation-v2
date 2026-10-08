"use client";

import { ArrowUpRight, MailOpen } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Botanical, LittleFlower } from "./botanical";
import { coupleNames, wedding, weddingDate } from "@/config/wedding";

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}
function getGuest() {
  return new URLSearchParams(window.location.search).get("to")?.trim().slice(0, 80) || "Tamu Istimewa";
}

export function Envelope({ onOpening, onOpen }: { onOpening: () => void; onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const guest = useSyncExternalStore(subscribeToLocation, getGuest, () => "Tamu Istimewa");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function open() {
    if (opening) return;
    onOpening();
    setOpening(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(onOpen, reduced ? 20 : 1550);
  }

  return (
    <section className={`envelope-screen ${opening ? "is-opening" : ""}`} aria-label="Sampul undangan">
      <div className="cover-grain" />
      <div className="cover-watermark" aria-hidden="true">with love.</div>
      <figure className="cover-postcard cover-postcard-left" aria-hidden="true"><Image src="/images/image-2.jpeg" alt="" width={832} height={1280} unoptimized /><figcaption>a little beginning.</figcaption></figure>
      <figure className="cover-postcard cover-postcard-right" aria-hidden="true"><Image src="/images/image-5.jpeg" alt="" width={854} height={1281} unoptimized /><figcaption>a lifetime together.</figcaption></figure>
      <header className="cover-header"><span className="wordmark" aria-label={coupleNames}>{wedding.bride.initial.toLowerCase()}<span>&</span>{wedding.groom.initial.toLowerCase()}<span className="wordmark-dot">.</span></span><span className="eyebrow">A LITTLE FOREVER</span><span className="cover-year">EST. {weddingDate.year}</span></header>
      <div className="cover-content">
        <div className="cover-heading"><span className="eyebrow line-label">SOMETHING BEAUTIFUL IS BEGINNING</span><h1>A letter, <em>with love.</em></h1><p>Ada cerita indah yang ingin kami bagikan denganmu.</p></div>
        <div className="envelope-stage" aria-hidden="true">
          <Botanical className="cover-sprig sprig-left" variant="bloom" />
          <Botanical className="cover-sprig sprig-right" />
          <div className="envelope-shadow" />
          <div className="envelope">
            <div className="envelope-back" />
            <div className="invitation-letter"><LittleFlower /><span className="eyebrow">THE WEDDING OF</span><span className="letter-names">{wedding.bride.name}<i>&</i>{wedding.groom.name}</span><span className="letter-date">{weddingDate.numeric}</span></div>
            <div className="envelope-front" /><div className="envelope-fold" /><div className="envelope-flap" />
            <div className="wax-seal"><span>{wedding.bride.initial}<span>&</span>{wedding.groom.initial}</span></div>
            <span className="envelope-caption">a little note. a lifetime of love.</span>
          </div>
          <span className="handwritten envelope-note">for you, with love <span>↗</span></span>
        </div>
        <div className="recipient"><span className="eyebrow">KEPADA YANG TERKASIH</span><h2>{guest}</h2><p>Di tempat</p></div>
        <button className="button button-dark open-button" onClick={open} disabled={opening}><MailOpen size={16} strokeWidth={1.5} /><span>{opening ? "Membuka cerita kami…" : "Buka Undangan"}</span><ArrowUpRight size={17} strokeWidth={1.5} /></button>
        <span className="cover-footnote">Sebuah undangan untuk menjadi bagian dari cerita kami.</span>
      </div>
      <footer className="cover-footer"><span>{coupleNames}</span><LittleFlower /><span>{wedding.dateLabel}</span></footer>
    </section>
  );
}

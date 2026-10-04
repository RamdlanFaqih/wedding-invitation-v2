"use client";

import { ArrowUpRight, CalendarDays, Check, Gift, Heart, MapPin, Pause, Play, Share2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Botanical, LittleFlower } from "./botanical";
import { Envelope } from "./envelope";
import { Guestbook } from "./guestbook";
import { WeddingGift } from "./wedding-gift";
import { PhotoGallery } from "./photo-gallery";
import { Hero, CouplePortrait } from "./hero";
import { useInvitationMotion } from "./use-invitation-motion";
import { coupleNames, wedding, weddingDate } from "@/config/wedding";
import { downloadCalendar } from "@/lib/calendar";

function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, new Date(wedding.date).getTime() - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  if (remaining === 0) return <p className="event-arrived">Hari bahagia kami telah tiba. Terima kasih untuk setiap doa.</p>;
  const values = remaining === null ? ["—", "—", "—", "—"] : [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  return <div className="countdown" aria-label="Hitung mundur menuju acara">{values.map((value, index) => <div key={index}><span>{String(value).padStart(2, "0")}</span><span className="eyebrow">{["HARI", "JAM", "MENIT", "DETIK"][index]}</span></div>)}</div>;
}

export function Invitation() {
  const [opened, setOpened] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  useInvitationMotion(opened, motionPaused);
  const [active, setActive] = useState("beranda");
  const [shareMessage, setShareMessage] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!opened) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.getAttribute("data-nav-section") || entry.target.id);
    }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [opened]);

  async function share() {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    try {
      if (navigator.share) await navigator.share({ title: `The Wedding of ${coupleNames}`, text: "Dengan penuh cinta, kami mengundangmu ke hari bahagia kami.", url: url.toString() });
      else { await navigator.clipboard.writeText(url.toString()); setShareMessage("Tautan undangan disalin."); }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) setShareMessage("Tautan belum tersalin. Silakan salin alamat halaman dari browser.");
    }
  }

  return (
    <>
      {!opened && <Envelope onOpen={() => setOpened(true)} />}
      <div className={`invitation-site ${opened ? "is-revealed" : ""} ${motionPaused ? "motion-paused" : ""}`} inert={!opened} aria-hidden={!opened}>
        <header className="site-header"><a href="#beranda" className="wordmark" aria-label="Kembali ke awal">{wedding.bride.initial.toLowerCase()}<span>&</span>{wedding.groom.initial.toLowerCase()}<span className="wordmark-dot">.</span></a><span className="header-note">THE BEGINNING OF OUR FOREVER</span><div className="header-actions"><button className="motion-button" type="button" aria-label={motionPaused ? "Lanjutkan animasi" : "Jeda animasi"} aria-pressed={motionPaused} onClick={() => setMotionPaused((paused) => !paused)}>{motionPaused ? <Play size={16} /> : <Pause size={16} />}<span>Animasi</span></button><button className="share-button" onClick={share} aria-label="Bagikan undangan"><Share2 size={17} strokeWidth={1.4} /><span>Bagikan</span></button></div></header>
        <main>
          <Hero heading={heading} />
          {wedding.isPreview && <div className="preview-ribbon"><Sparkles size={13} /><span>Pratinjau · Cerita masih contoh. Jam acara dan informasi rekening menyusul.</span></div>}
          <section className="quote-section"><LittleFlower /><p>“Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.”</p><span className="eyebrow">QS. AR-RUM : 21 · PENGGALAN AYAT</span></section>
          <section className="couple-section section-space" id="mempelai"><div className="section-heading"><span className="eyebrow">BY GRACE, WE FOUND EACH OTHER</span><h2>Dua hati, <em>satu tujuan.</em></h2><p>Dengan memohon rahmat dan rida Allah SWT,<br />kami bermaksud menyatukan langkah dalam ikatan pernikahan.</p></div>
            <div className="couple-grid">
              <article className="person-card"><span className="person-letter" aria-hidden="true">{wedding.bride.initial}</span><span className="eyebrow">THE BRIDE</span><h3>{wedding.bride.fullName}</h3><p>{wedding.bride.parents}</p><span className="handwritten">a heart full of sunshine</span></article>
              <CouplePortrait />
              <article className="person-card"><span className="person-letter" aria-hidden="true">{wedding.groom.initial}</span><span className="eyebrow">THE GROOM</span><h3>{wedding.groom.fullName}</h3><p>{wedding.groom.parents}</p><span className="handwritten">her favorite place to come home</span></article>
            </div>
          </section>
          <PhotoGallery />
          <section className="story-section section-space" id="cerita"><div className="story-title"><span className="eyebrow">EVERY LOVE HAS A STORY</span><h2>Dan ini,<br /><em>cerita kami.</em></h2><p>Bukan tentang kisah yang sempurna.<br />Tentang dua orang yang selalu<br />memilih untuk bersama.</p><Botanical className="story-botanical" variant="bloom" /></div><div className="story-timeline">{wedding.story.map((chapter, index) => <article className="story-chapter" key={chapter.year}><span className="chapter-dot" /><span className="eyebrow">{chapter.year} <span className="chapter-number">/ 0{index + 1}</span></span><h3>{chapter.title}</h3><p>{chapter.text}</p></article>)}</div></section>
          <section className="event-section section-space" id="acara"><div className="event-watermark" aria-hidden="true">save the date</div><div className="section-heading"><span className="eyebrow">A DAY TO REMEMBER</span><h2>Untuk sebuah <em>selamanya.</em></h2><p>Kehadiranmu akan melengkapi kebahagiaan kami.</p></div><div className="event-date"><span>{wedding.dayLabel}</span><strong aria-label={wedding.dateLabel}><span className="event-day">{weddingDate.day}</span><span className="event-month">{weddingDate.month} <i>{weddingDate.year}</i></span></strong><span>{wedding.venue}, {wedding.city}</span></div><Countdown /><div className="event-grid">{wedding.events.map((event, index) => <article className="event-card" key={event.title}><span className="event-number">0{index + 1}</span>{index === 0 ? <div className="rings-icon" aria-hidden="true"><i /><i /></div> : <LittleFlower />}<h3>{event.title}</h3><span className="event-time">{event.time}</span><p>{event.description}</p></article>)}</div><div className="event-actions"><button className="button button-dark" onClick={downloadCalendar}><CalendarDays size={16} />Simpan Tanggal<ArrowUpRight size={16} /></button><a className="button button-outline" href={wedding.mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16} />Petunjuk Lokasi<ArrowUpRight size={16} /></a></div><p className="venue-address"><MapPin size={13} />{wedding.address}</p></section>
          <section className="love-note"><Botanical className="note-botanical" /><span className="eyebrow">THE LITTLE THINGS, THE BIG FEELINGS</span><p>Di antara banyak hal yang berubah,<br />aku ingin terus <em>memilihmu.</em></p><span className="handwritten">today, tomorrow, and all the days after.</span></section>
          <WeddingGift />
          <Guestbook />
          <section className="closing"><LittleFlower /><span className="eyebrow">UNTIL WE MEET ON OUR SPECIAL DAY</span><h2>Terima kasih,<br /><em>dari hati kami.</em></h2><p>Untuk setiap doa, kasih, dan kehadiranmu.<br />Tak sabar merayakan hari bahagia ini bersamamu.</p><span className="closing-names">{coupleNames}</span><span className="eyebrow">{weddingDate.numeric}</span><Botanical className="closing-leaf" variant="bloom" /></section>
        </main>
        <footer className="site-footer"><span>Made with love, for a lifetime.</span><Heart size={12} /><span>{coupleNames.toUpperCase()} © {weddingDate.year}</span></footer>
        <nav className="bottom-nav" aria-label="Navigasi undangan">{[{ id: "beranda", label: "Awal", icon: <Heart size={17} /> }, { id: "mempelai", label: "Mempelai", icon: <LittleFlower /> }, { id: "cerita", label: "Cerita", icon: <Sparkles size={17} /> }, { id: "acara", label: "Acara", icon: <CalendarDays size={17} /> }, { id: "hadiah", label: "Hadiah", icon: <Gift size={17} /> }, { id: "ucapan", label: "Ucapan", icon: <SendIcon /> }].map((item) => <a key={item.id} href={`#${item.id}`} className={active === item.id ? "active" : ""} aria-current={active === item.id ? "location" : undefined}>{item.icon}<span>{item.label}</span></a>)}</nav>
        {shareMessage && <div className="share-toast" role="status"><Check size={16} />{shareMessage}<button onClick={() => setShareMessage("")} aria-label="Tutup notifikasi">×</button></div>}
      </div>
    </>
  );
}

function SendIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m21 3-7 18-4-7-7-4 18-7Z" /><path d="m10 14 11-11" /></svg>; }

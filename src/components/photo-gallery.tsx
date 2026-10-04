"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const photos = [
  { src: "/images/image-4.jpeg", alt: "Asri dan Agi bergandengan tangan di antara lengkungan bangunan", caption: "Satu langkah, bersama.", width: 878, height: 1278 },
  { src: "/images/image-5.jpeg", alt: "Asri dan Agi saling menatap di depan pintu besar berornamen", caption: "Di sisimu, aku pulang.", width: 854, height: 1281 },
  { src: "/images/image-1.jpeg", alt: "Detail tangan Asri dan Agi di balik kain veil yang lembut", caption: "Dalam genggamanmu.", width: 854, height: 1281 },
  { src: "/images/image-2.jpeg", alt: "Potret pasangan dengan Asri di depan dan Agi di belakang", caption: "Tentang kita.", width: 832, height: 1280 },
  { src: "/images/image-3.jpeg", alt: "Asri menoleh ke samping dengan Agi berdiri di belakangnya", caption: "Untuk selamanya.", width: 808, height: 1280 },
] as const;

export function PhotoGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const isOpen = activeIndex !== null;
  const selected = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function move(direction: number) {
    setActiveIndex((index) => index === null ? null : (index + direction + photos.length) % photos.length);
  }

  return (
    <section className="gallery-section section-space" id="galeri" data-nav-section="mempelai" aria-labelledby="gallery-heading">
      <div className="section-heading">
        <span className="eyebrow">LITTLE MOMENTS, LIFETIME MEMORIES</span>
        <h2 id="gallery-heading">Cerita dalam <em>bingkai.</em></h2>
        <p>Beberapa momen yang ingin kami simpan selamanya.<br />Ketuk foto untuk melihat lebih dekat.</p>
      </div>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <figure className={`photo-item ${index < 2 ? "photo-featured" : ""}`} key={photo.src}>
            <button className="photo-button" type="button" onClick={() => setActiveIndex(index)} aria-label={`Perbesar foto ${index + 1}: ${photo.alt}`} aria-haspopup="dialog">
              <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized loading="lazy" sizes="(max-width: 760px) 50vw, (max-width: 1100px) 50vw, 520px" />
              <span className="photo-expand" aria-hidden="true"><Expand size={18} /></span>
            </button>
            <figcaption><span className="eyebrow">0{index + 1}</span><span className="handwritten">{photo.caption}</span></figcaption>
          </figure>
        ))}
      </div>
      <dialog ref={dialog} className="photo-dialog" aria-label="Galeri foto Asri dan Agi" onClose={() => setActiveIndex(null)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      }}>
        <button className="photo-close" type="button" aria-label="Tutup foto" onClick={() => dialog.current?.close()}><X size={25} /></button>
        {selected && <div className="photo-dialog-content">
          <Image src={selected.src} alt={selected.alt} width={selected.width} height={selected.height} unoptimized className="photo-full" />
          <div className="photo-controls">
            <button type="button" aria-label="Foto sebelumnya" onClick={() => move(-1)}><ArrowLeft size={22} /></button>
            <p aria-live="polite">{(activeIndex ?? 0) + 1} / {photos.length}<span>{selected.caption}</span></p>
            <button type="button" aria-label="Foto berikutnya" onClick={() => move(1)}><ArrowRight size={22} /></button>
          </div>
        </div>}
      </dialog>
    </section>
  );
}

import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { RefObject } from "react";
import { Botanical, LittleFlower } from "./botanical";
import { wedding, weddingDate } from "@/config/wedding";

export function Hero({ heading }: { heading: RefObject<HTMLHeadingElement | null> }) {
  return (
    <section className="hero" id="beranda">
      <div className="hero-layout">
        <div className="hero-copy">
          <span className="eyebrow hero-kicker"><span aria-hidden="true">✦</span> A LOVE WORTH CELEBRATING</span>
          <span className="hero-intro">the wedding of</span>
          <h1 ref={heading} tabIndex={-1}><span>{wedding.bride.name}</span><span className="hero-second-name"><i>&</i>{wedding.groom.name}</span></h1>
          <p>Di antara jutaan kemungkinan,<br />kami menemukan <em>satu sama lain.</em></p>
          <div className="hero-date"><span>{weddingDate.day}</span><i /><span>{weddingDate.month.toUpperCase()}</span><i /><span>{weddingDate.year}</span></div>
          <a href="#acara" className="button button-dark hero-cta">Hari bahagia kami <ArrowUpRight size={19} /></a>
          <a href="#mempelai" className="hero-explore"><span className="hero-scroll"><ArrowDown size={18} /></span><span>Gulir untuk mengenal cerita kami</span></a>
        </div>
        <div className="hero-visual">
          <div className="hero-photo-frame"><Image src="/images/image-4.jpeg" alt="Asri dan Agi bergandengan tangan di antara lengkungan bangunan" width={878} height={1278} unoptimized loading="eager" /></div>
          <div className="forever-stamp" aria-hidden="true"><svg className="stamp-ring" viewBox="0 0 140 140"><defs><path id="forever-ring" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" /></defs><text><textPath href="#forever-ring" textLength="326">TOGETHER IS A BEAUTIFUL PLACE TO BE · </textPath></text></svg><LittleFlower /></div>
          <figure className="hero-keepsake"><Image src="/images/image-1.jpeg" alt="Detail genggaman tangan di balik veil" width={854} height={1281} unoptimized loading="lazy" /><figcaption>you & me, always.</figcaption></figure>
          <Botanical className="hero-botanical" variant="bloom" />
          <span className="hero-photo-label">OUR FAVORITE CHAPTER, YET.</span>
        </div>
      </div>
      <div className="hero-bottom"><span>{wedding.city.toUpperCase()}, INDONESIA</span><span className="handwritten">and so, our forever begins.</span><span>WITH LOVE, ALWAYS <span aria-hidden="true">✦</span></span></div>
    </section>
  );
}

export function CouplePortrait() {
  return (
    <figure className="couple-portrait">
      <div className="couple-portrait-frame"><Image src="/images/image-2.jpeg" alt="Potret Asri dan Agi bersama dalam busana putih" width={832} height={1280} unoptimized loading="lazy" /></div>
      <figcaption className="handwritten">two hearts, one beautiful beginning.</figcaption>
      <LittleFlower className="portrait-flower" />
    </figure>
  );
}

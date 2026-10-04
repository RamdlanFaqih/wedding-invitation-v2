"use client";

import { useEffect } from "react";

/** Animate only on entry. Content stays readable if motion or JS is unavailable. */
export function useInvitationMotion(opened: boolean, paused: boolean) {
  useEffect(() => {
    if (!opened || paused) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const animations = new Set<Animation>();

    function stop() {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    }

    function start() {
      stop();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer?.unobserve(entry.target);
          if (!(entry.target instanceof HTMLElement) || typeof entry.target.animate !== "function") return;
          const animation = entry.target.animate([
            { opacity: 0, transform: "translateY(28px)" },
            { opacity: 1, transform: "translateY(0)" },
          ], { duration: 850, easing: "cubic-bezier(.22,1,.36,1)" });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
      document.querySelectorAll(".section-heading, .quote-section, .person-card, .couple-portrait, .photo-item, .story-title, .story-chapter, .event-card, .bank-card, .wish-form, .wishes-list, .closing > h2").forEach((element) => observer?.observe(element));
    }

    start();
    preference.addEventListener("change", start);
    return () => { stop(); preference.removeEventListener("change", start); };
  }, [opened, paused]);
}

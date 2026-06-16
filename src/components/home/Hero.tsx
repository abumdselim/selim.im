"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HERO_AUTOPLAY_SECONDS,
  HERO_EYEBROW,
  HERO_SLIDES,
} from "@/lib/constants";
import {
  BTN_HERO_PRIMARY,
  BTN_SECONDARY,
  CONTAINER,
  HERO_LANDING_PT,
  REVEAL,
  REVEAL_DELAY_1,
  REVEAL_DELAY_2,
  TYPE_BODY,
  TYPE_HERO,
  TYPE_HERO_ACCENT,
  TYPE_LABEL,
} from "@/lib/design-system";

function StatPill({ stat, compact = false }: { stat: { value: string; label: string }; compact?: boolean }) {
  const valueClass = compact
    ? "font-display text-lg sm:text-xl font-extrabold text-[#137ece] leading-none"
    : "font-display text-lg sm:text-xl font-extrabold text-[#137ece] leading-none";
  const labelClass = compact
    ? "font-body text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1.5 leading-snug"
    : "font-body text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5 leading-snug";
  const boxClass = compact
    ? "flex-1 min-w-0 px-3 sm:px-3.5 py-3 sm:py-3.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm shadow-slate-200/50 backdrop-blur-sm text-center"
    : "flex-1 sm:flex-none min-w-0 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-white/95 border border-slate-200/90 shadow-sm shadow-slate-200/50 backdrop-blur-sm text-center";

  return (
    <div className={boxClass}>
      <p className={valueClass}>{stat.value}</p>
      <p className={labelClass}>{stat.label}</p>
    </div>
  );
}

function HeroSlideProgress({
  current,
  onSelect,
  className = "",
}: {
  current: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const progressStyle = { "--hero-progress-duration": `${HERO_AUTOPLAY_SECONDS}s` } as React.CSSProperties;

  return (
    <div
      className={`hero-slide-progress ${className}`}
      style={progressStyle}
      aria-label="Hero slide progress"
    >
      <div className="flex items-center gap-2 sm:gap-2.5 w-full max-w-xs sm:max-w-sm lg:max-w-[240px]">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className="flex-1 min-h-[36px] py-2 px-1 bg-transparent border-0 cursor-pointer hover:opacity-80 transition-opacity duration-300 flex items-center"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div className="h-[3px] w-full bg-slate-200/80 rounded-full overflow-hidden">
              <div
                className={`h-full bg-[#137ece] rounded-full ${current === i ? "progress-bar-fill progress-bar-fill-active" : "progress-bar-fill w-0 bg-[#137ece]/20"}`}
                key={current === i ? `active-${current}` : `idle-${i}`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % HERO_SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, HERO_AUTOPLAY_SECONDS * 1000);
    return () => clearInterval(id);
  }, [paused, next]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let startX = 0;
    let startY = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) next();
      else prev();
    };
    hero.addEventListener("touchstart", onStart, { passive: true });
    hero.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      hero.removeEventListener("touchstart", onStart);
      hero.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  const bodyClass = `${TYPE_BODY} text-[15px] sm:text-base lg:text-lg leading-snug sm:leading-relaxed max-w-xl text-center lg:text-left mx-auto lg:mx-0`;

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full bg-[#f8fafc] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 inievo-hero-grid pointer-events-none" aria-hidden />
      <div className="absolute inset-0 inievo-hero-grid-vignette pointer-events-none" aria-hidden />

      <div className="relative z-10 flex flex-col min-h-[100dvh] lg:min-h-0">
        <div
          className={`relative z-10 ${CONTAINER} ${HERO_LANDING_PT} w-full max-w-4xl lg:max-w-5xl mx-auto flex-1 flex flex-col justify-center min-h-0 lg:block lg:flex-none lg:pb-10 lg:justify-start`}
        >
        <div className="items-center lg:items-start w-full relative z-10 flex flex-col gap-y-4 sm:gap-y-5">
          <div className="flex flex-col gap-y-2.5 sm:gap-y-3 w-full">
            <p className={`${TYPE_LABEL} ${REVEAL} text-center lg:text-left w-full`}>{HERO_EYEBROW}</p>
            <div className="grid w-full mb-2 sm:mb-3">
              {HERO_SLIDES.map((slide, i) => (
                <div
                  key={slide.persona}
                  className={`col-start-1 row-start-1 flex items-start justify-center lg:justify-start ${current === i ? "hero-crossfade-active" : "hero-crossfade-inactive pointer-events-none"}`}
                >
                  <h1 className={`${TYPE_HERO} text-center lg:text-left mb-0`}>
                    {slide.before ? <span className="text-slate-900">{slide.before}</span> : null}
                    <span className={TYPE_HERO_ACCENT}>{slide.highlight}</span>
                  </h1>
                </div>
              ))}
            </div>
            <div className={`grid w-full mt-0 ${REVEAL_DELAY_1}`}>
              {HERO_SLIDES.map((slide, i) => (
                <div
                  key={`sub-${slide.persona}`}
                  className={`col-start-1 row-start-1 flex items-start justify-center lg:justify-start ${current === i ? "hero-crossfade-active" : "hero-crossfade-inactive pointer-events-none"}`}
                >
                  <p className={bodyClass}>{slide.subtext}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid w-full mt-0 lg:hidden">
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={`mstats-${slide.persona}`}
                className={`col-start-1 row-start-1 flex items-start justify-center w-full ${current === i ? "hero-crossfade-active" : "hero-crossfade-inactive pointer-events-none"}`}
              >
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full max-w-lg sm:max-w-xl mx-auto">
                  {slide.stats.map((s) => (
                    <StatPill key={s.label} stat={s} compact />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid w-full mt-0 hidden lg:grid">
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={`dstats-${slide.persona}`}
                className={`col-start-1 row-start-1 flex items-start justify-center lg:justify-start w-full ${current === i ? "hero-crossfade-active" : "hero-crossfade-inactive pointer-events-none"}`}
              >
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 w-full">
                  {slide.stats.map((s) => (
                    <StatPill key={s.label} stat={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <HeroSlideProgress
            current={current}
            onSelect={setCurrent}
            className="hidden lg:flex w-full justify-start"
          />

          <div className={`grid w-full mt-3 sm:mt-5 lg:mt-0 ${REVEAL_DELAY_2}`}>
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={`cta-${slide.persona}`}
                className={`col-start-1 row-start-1 flex flex-col sm:flex-row w-full gap-3 sm:gap-4 items-stretch sm:items-center justify-center lg:justify-start ${current === i ? "hero-crossfade-active" : "hero-crossfade-inactive pointer-events-none"}`}
              >
                <Link href={slide.primary_cta.href} className={`${BTN_HERO_PRIMARY} w-full sm:w-auto text-center`}>
                  {slide.primary_cta.label}
                </Link>
                <Link href={slide.secondary_cta.href} className={`${BTN_SECONDARY} w-full sm:w-auto text-center`}>
                  {slide.secondary_cta.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
        </div>

        <HeroSlideProgress
          current={current}
          onSelect={setCurrent}
          className="lg:hidden relative z-10 w-full flex justify-center px-4 pt-1 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-5 mt-auto"
        />
      </div>
    </section>
  );
}

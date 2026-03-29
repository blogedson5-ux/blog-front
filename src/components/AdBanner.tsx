"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AdImage = {
  _id: string;
  url: string;
  public_id: string;
};

type Ad = {
  _id: string;
  titulo: string;
  descricao: string;
  link: string;
  images: AdImage[];
  createdAt: string;
  updatedAt: string;
};

type BannerSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  cta: string;
};

type AdBannerProps = {
  ad?: Ad | Ad[] | null;
  className?: string;
  heightClassName?: string;
};

export function AdBanner({
  ad,
  className = "",
  heightClassName = "h-[190px] sm:h-[420px] lg:h-[520px]",
}: AdBannerProps) {
  const [currentBanner, setCurrentBanner] = useState(0);

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const realAd = useMemo<Ad | null>(() => {
    if (!ad) return null;

    if (Array.isArray(ad)) {
      return (ad[0] ?? null) as Ad | null;
    }

    return ad as Ad;
  }, [ad]);

  const bannerSlides = useMemo<BannerSlide[]>(() => {
    if (
      !realAd ||
      !Array.isArray(realAd.images) ||
      realAd.images.length === 0
    ) {
      return [];
    }

    return realAd.images.map((image, index) => ({
      id: image._id || `${realAd._id}-${index}`,
      title: realAd.titulo,
      subtitle: realAd.descricao,
      image: image.url,
      href: realAd.link,
      cta: "Saiba mais",
    }));
  }, [realAd]);

  useEffect(() => {
    if (bannerSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerSlides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [bannerSlides.length]);

  useEffect(() => {
    if (currentBanner >= bannerSlides.length && bannerSlides.length > 0) {
      setCurrentBanner(0);
    }
  }, [bannerSlides.length, currentBanner]);

  const handlePrevBanner = () => {
    if (bannerSlides.length <= 1) return;

    setCurrentBanner((prev) =>
      prev === 0 ? bannerSlides.length - 1 : prev - 1,
    );
  };

  const handleNextBanner = () => {
    if (bannerSlides.length <= 1) return;

    setCurrentBanner((prev) => (prev + 1) % bannerSlides.length);
  };

  const handleBannerTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleBannerTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleBannerTouchEnd = () => {
    if (bannerSlides.length <= 1) return;

    const startX = touchStartXRef.current;
    const endX = touchEndXRef.current;

    if (startX === null || endX === null) return;

    const distance = startX - endX;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      handleNextBanner();
    } else {
      handlePrevBanner();
    }
  };

  return (
    <section className={`mx-auto max-w-7xl sm:px-6 lg:px-8 ${className}`}>
      <div className="relative overflow-hidden rounded-none border-0 bg-white shadow-none sm:rounded-[32px] sm:border sm:border-slate-200 sm:shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div
          className={`relative w-full touch-pan-y ${heightClassName}`}
          onTouchStart={handleBannerTouchStart}
          onTouchMove={handleBannerTouchMove}
          onTouchEnd={handleBannerTouchEnd}
        >
          {bannerSlides.length > 0 ? (
            <>
              {bannerSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentBanner
                      ? "translate-x-0 opacity-100"
                      : index < currentBanner
                        ? "-translate-x-full opacity-0"
                        : "translate-x-full opacity-0"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: "center top" }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-[#081938]/82 via-[#38bdf8]/20 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
                    <span className="absolute left-5 top-5 inline-flex w-fit rounded-full bg-white/16 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:left-8 sm:top-8 lg:left-10 lg:top-10">
                      Publicidade
                    </span>

                    <div className="flex flex-col gap-3">
                      <h2 className="max-w-2xl text-lg font-black uppercase leading-tight tracking-[-0.02em] text-white sm:text-2xl lg:text-3xl">
                        {slide.title}
                      </h2>

                      {slide.subtitle && slide.subtitle.trim() ? (
                        <p className="max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
                          {slide.subtitle}
                        </p>
                      ) : null}

                      {slide.href && (
                        <a
                          href={slide.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#0f4fa8] transition hover:bg-[#f0f9ff]"
                        >
                          {slide.cta}
                          <span className="text-[10px]">→</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {bannerSlides.length > 1 && (
                <>
                  <button
                    onClick={handlePrevBanner}
                    aria-label="Banner anterior"
                    className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 sm:flex"
                  >
                    ←
                  </button>

                  <button
                    onClick={handleNextBanner}
                    aria-label="Próximo banner"
                    className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 sm:flex"
                  >
                    →
                  </button>

                  <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                    {bannerSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBanner(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          currentBanner === index
                            ? "w-8 bg-white"
                            : "w-2.5 bg-white/45"
                        }`}
                        aria-label={`Ir para banner ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0">
              <div className="flex h-full w-full items-center justify-center bg-[#eaf4ff] p-8 text-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#38bdf8]">
                    Publicidade
                  </p>
                  <h2 className="mt-3 text-2xl font-black uppercase text-slate-900 sm:text-4xl">
                    Nenhum anúncio disponível
                  </h2>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

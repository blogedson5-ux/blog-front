"use client";

import { useAd, usePost } from "@/data/news";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type PostImage = {
  url: string;
  public_id: string;
};

type Post = {
  _id: string;
  titulo: string;
  textOne: string;
  category: string;
  image?: PostImage;
  createdAt: Date | string;
  updatedAt: Date | string;
};

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

type SidebarAd = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

export default function Home() {
  const router = useRouter();
  const { data: news, isLoading, isError } = usePost();
  const { data: ad } = useAd();

  const posts: Post[] = (news ?? []) as Post[];

  const realAd = useMemo<Ad | null>(() => {
    if (!ad) return null;
    if (Array.isArray(ad)) {
      return (ad[0] ?? null) as Ad | null;
    }
    return ad as Ad;
  }, [ad]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const sidebarAds: SidebarAd[] = [
    {
      id: "1",
      title: "ANUNCIE AQUI",
      subtitle: "Seu negócio em destaque no portal.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop",
      href: "#anuncie-aqui",
    },
    {
      id: "2",
      title: "DIVULGUE SUA EMPRESA",
      subtitle: "Mais visibilidade para sua marca.",
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1400&auto=format&fit=crop",
      href: "#anuncie-aqui",
    },
    {
      id: "3",
      title: "ESPAÇO PUBLICITÁRIO",
      subtitle: "Promova campanhas, eventos e serviços.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
      href: "#anuncie-aqui",
    },
  ];

  const bannerSlides = useMemo<BannerSlide[]>(() => {
    if (!realAd || !Array.isArray(realAd.images) || realAd.images.length === 0) {
      return [];
    }

    return realAd.images.slice(0, 3).map((image, index) => ({
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

  const sortedNews = useMemo(() => {
    if (!posts.length) return [];

    return [...posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [posts]);

  const categories = useMemo(() => {
    const uniqueCategories = sortedNews
      .map((item) => item.category?.trim())
      .filter((category): category is string => Boolean(category));

    return ["Todas", ...Array.from(new Set(uniqueCategories))];
  }, [sortedNews]);

  const filteredNews = useMemo(() => {
    let filtered = sortedNews;

    if (selectedCategory !== "Todas") {
      filtered = filtered.filter(
        (item) =>
          item.category?.trim().toLowerCase() ===
          selectedCategory.toLowerCase(),
      );
    }

    if (!search.trim()) return filtered;

    const term = search.toLowerCase();

    return filtered.filter((item) => {
      return (
        item.titulo?.toLowerCase().includes(term) ||
        item.textOne?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term)
      );
    });
  }, [sortedNews, search, selectedCategory]);

  const topNews = filteredNews.slice(0, 3);
  const latestNews =
    filteredNews.length > 3 ? filteredNews.slice(3) : filteredNews;

  const newsGroupedByCategory = useMemo(() => {
    const grouped = latestNews.reduce<Record<string, Post[]>>((acc, item) => {
      const key = item.category?.trim() || "Sem categoria";

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, items]) => ({
      category,
      items,
    }));
  }, [latestNews]);

  const formatDate = (date: string | Date) => {
    const parsedDate = date instanceof Date ? date : new Date(date);

    return parsedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleNavigateToNews = (id: string) => {
    router.push(`/noticia/${id}`);
  };

  const getImageUrl = (item: Post) =>
    item.image?.url ||
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop";

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

  const renderNewsImage = ({
    src,
    alt,
    wrapperClassName = "",
    imageClassName = "",
  }: {
    src: string;
    alt: string;
    wrapperClassName?: string;
    imageClassName?: string;
  }) => {
    return (
      <div
        className={`flex h-full w-full items-center justify-center overflow-hidden ${wrapperClassName}`}
      >
        <img
          src={src}
          alt={alt}
          className={`block max-h-full max-w-full object-contain ${imageClassName}`}
        />
      </div>
    );
  };

  const renderOverlayCardContent = (
    item: Post,
    options?: {
      large?: boolean;
    },
  ) => {
    const isLarge = options?.large ?? false;
    const badgeText = item.category?.trim() || "Destaque";

    return (
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#081938]/92 via-[#2563eb]/35 to-transparent p-4 sm:p-5 lg:p-6">
        <span className="mb-3 inline-flex w-fit rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
          {badgeText}
        </span>

        <h2
          className={`font-black uppercase leading-[1.02] tracking-[-0.03em] text-white drop-shadow-sm ${
            isLarge
              ? "line-clamp-4 max-w-4xl text-2xl sm:text-3xl lg:text-[2.9rem]"
              : "line-clamp-3 text-lg sm:text-xl lg:text-2xl"
          }`}
        >
          {item.titulo}
        </h2>

        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100 sm:text-xs">
          {formatDate(item.createdAt)}
        </p>
      </div>
    );
  };

  const renderTopNewsSection = () => {
    if (!topNews.length) return null;

    if (topNews.length === 1) {
      const item = topNews[0];

      return (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div
            onClick={() => handleNavigateToNews(item._id)}
            className="group cursor-pointer overflow-hidden rounded-[32px] border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          >
            <div className="relative h-[320px] overflow-hidden rounded-[24px] bg-[#eaf4ff] sm:h-[380px] lg:h-[500px]">
              {renderNewsImage({
                src: getImageUrl(item),
                alt: item.titulo,
                wrapperClassName: "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                imageClassName: "transition duration-500 group-hover:scale-105",
              })}
              {renderOverlayCardContent(item, { large: true })}
            </div>
          </div>
        </section>
      );
    }

    if (topNews.length === 2) {
      const main = topNews[0];
      const secondary = topNews[1];

      return (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="grid gap-2 md:hidden">
              <div
                onClick={() => handleNavigateToNews(main._id)}
                className="group cursor-pointer overflow-hidden rounded-[24px]"
              >
                <div className="relative h-[320px] overflow-hidden rounded-[24px] bg-[#eaf4ff] sm:h-[380px]">
                  {renderNewsImage({
                    src: getImageUrl(main),
                    alt: main.titulo,
                    wrapperClassName:
                      "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(main, { large: true })}
                </div>
              </div>

              <div
                onClick={() => handleNavigateToNews(secondary._id)}
                className="group cursor-pointer overflow-hidden rounded-[24px]"
              >
                <div className="relative h-[220px] overflow-hidden rounded-[24px] bg-[#eaf4ff] sm:h-[280px]">
                  {renderNewsImage({
                    src: getImageUrl(secondary),
                    alt: secondary.titulo,
                    wrapperClassName:
                      "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(secondary)}
                </div>
              </div>
            </div>

            <div className="hidden gap-2 md:grid md:grid-cols-[1.2fr_0.8fr]">
              <div
                onClick={() => handleNavigateToNews(main._id)}
                className="group cursor-pointer overflow-hidden rounded-[24px]"
              >
                <div className="relative min-h-[560px] overflow-hidden rounded-[24px] bg-[#eaf4ff]">
                  {renderNewsImage({
                    src: getImageUrl(main),
                    alt: main.titulo,
                    wrapperClassName:
                      "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(main, { large: true })}
                </div>
              </div>

              <div className="grid grid-rows-2 gap-2">
                <div className="rounded-[24px] bg-transparent" />

                <div
                  onClick={() => handleNavigateToNews(secondary._id)}
                  className="group cursor-pointer overflow-hidden rounded-[24px]"
                >
                  <div className="relative h-[278px] overflow-hidden rounded-[24px] bg-[#eaf4ff]">
                    {renderNewsImage({
                      src: getImageUrl(secondary),
                      alt: secondary.titulo,
                      wrapperClassName:
                        "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                      imageClassName:
                        "transition duration-500 group-hover:scale-105",
                    })}
                    {renderOverlayCardContent(secondary)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    const main = topNews[0];
    const topRight = topNews[1];
    const bottomRight = topNews[2];

    return (
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-2 md:hidden">
            <div
              onClick={() => handleNavigateToNews(main._id)}
              className="group cursor-pointer overflow-hidden rounded-[24px]"
            >
              <div className="relative h-[320px] overflow-hidden rounded-[24px] bg-[#eaf4ff] sm:h-[380px]">
                {renderNewsImage({
                  src: getImageUrl(main),
                  alt: main.titulo,
                  wrapperClassName: "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                  imageClassName:
                    "transition duration-500 group-hover:scale-105",
                })}
                {renderOverlayCardContent(main, { large: true })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => handleNavigateToNews(topRight._id)}
                className="group cursor-pointer overflow-hidden rounded-[24px]"
              >
                <div className="relative h-[220px] overflow-hidden rounded-[24px] bg-[#eaf4ff] sm:h-[280px]">
                  {renderNewsImage({
                    src: getImageUrl(topRight),
                    alt: topRight.titulo,
                    wrapperClassName:
                      "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(topRight)}
                </div>
              </div>

              <div
                onClick={() => handleNavigateToNews(bottomRight._id)}
                className="group cursor-pointer overflow-hidden rounded-[24px]"
              >
                <div className="relative h-[220px] overflow-hidden rounded-[24px] bg-[#eaf4ff] sm:h-[280px]">
                  {renderNewsImage({
                    src: getImageUrl(bottomRight),
                    alt: bottomRight.titulo,
                    wrapperClassName:
                      "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(bottomRight)}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden gap-2 md:grid md:grid-cols-[1.2fr_0.8fr]">
            <div
              onClick={() => handleNavigateToNews(main._id)}
              className="group cursor-pointer overflow-hidden rounded-[24px]"
            >
              <div className="relative min-h-[560px] overflow-hidden rounded-[24px] bg-[#eaf4ff]">
                {renderNewsImage({
                  src: getImageUrl(main),
                  alt: main.titulo,
                  wrapperClassName: "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                  imageClassName:
                    "transition duration-500 group-hover:scale-105",
                })}
                {renderOverlayCardContent(main, { large: true })}
              </div>
            </div>

            <div className="grid grid-rows-2 gap-2">
              <div
                onClick={() => handleNavigateToNews(topRight._id)}
                className="group cursor-pointer overflow-hidden rounded-[24px]"
              >
                <div className="relative h-[278px] overflow-hidden rounded-[24px] bg-[#eaf4ff]">
                  {renderNewsImage({
                    src: getImageUrl(topRight),
                    alt: topRight.titulo,
                    wrapperClassName:
                      "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(topRight)}
                </div>
              </div>

              <div
                onClick={() => handleNavigateToNews(bottomRight._id)}
                className="group cursor-pointer overflow-hidden rounded-[24px]"
              >
                <div className="relative h-[278px] overflow-hidden rounded-[24px] bg-[#eaf4ff]">
                  {renderNewsImage({
                    src: getImageUrl(bottomRight),
                    alt: bottomRight.titulo,
                    wrapperClassName:
                      "h-full w-full rounded-[24px] bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(bottomRight)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E90FF]" />
            <p className="text-base font-medium text-slate-700">
              Carregando notícias...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !posts.length) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              Nenhuma notícia encontrada
            </h2>
            <p className="text-slate-600">
              Não foi possível carregar as notícias no momento.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="relative">
        <section className="mx-auto max-w-7xl px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
          <div className="relative overflow-hidden rounded-none border-0 bg-white shadow-none sm:rounded-[32px] sm:border sm:border-slate-200 sm:shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div
              className="relative h-[220px] w-full touch-pan-y sm:h-[320px] lg:h-[390px]"
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
                      />

                      <div className="absolute inset-0 bg-gradient-to-r from-[#081938]/82 via-[#1E90FF]/25 to-transparent" />

                      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
                        <span className="mb-3 inline-flex w-fit rounded-full bg-white/16 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                          Publicidade
                        </span>

                        <h2 className="max-w-3xl text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
                          {slide.title}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
                          {slide.subtitle}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <a
                            href={slide.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f4fa8] transition hover:bg-[#f0f9ff]"
                          >
                            {slide.cta}
                            <span>→</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}

                  {bannerSlides.length > 1 && (
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
                  )}
                </>
              ) : (
                <div className="absolute inset-0">
                  <div className="flex h-full w-full items-center justify-center bg-[#eaf4ff] p-8 text-center">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1E90FF]">
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

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="inline-flex rounded-full border border-[#bfe3ff] bg-[#f0f9ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#1E90FF]">
                    Portal de notícias
                  </span>
                </div>

                <div className="w-full md:max-w-sm">
                  <input
                    type="text"
                    placeholder="Pesquisar notícia..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-[#cfe9ff] bg-[#f8fcff] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E90FF] focus:ring-2 focus:ring-[#d8efff]"
                  />
                </div>
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileCategoriesOpen((prev) => !prev)}
                  className="inline-flex items-center rounded-2xl border border-[#cfe9ff] bg-[#f0f9ff] px-4 py-3 text-sm font-semibold text-[#0f4fa8] shadow-sm transition hover:bg-[#e6f4ff]"
                >
                  Categorias
                </button>
              </div>

              {isMobileCategoriesOpen && (
                <div className="md:hidden">
                  <div className="flex items-center gap-3 overflow-x-auto rounded-[22px] border border-[#dbeeff] bg-[#f8fcff] px-3 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <button
                      onClick={() => setIsMobileCategoriesOpen(false)}
                      className="flex h-10 min-w-10 items-center justify-center rounded-full border border-[#1E90FF] bg-white text-base font-bold text-[#1E90FF] shadow-sm"
                      aria-label="Fechar categorias"
                    >
                      X
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                          selectedCategory === category
                            ? "border border-[#1E90FF] bg-[#1E90FF] text-white"
                            : "border border-[#cfe9ff] bg-[#f0f9ff] text-[#0f4fa8] hover:bg-[#e6f4ff]"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="hidden flex-wrap gap-2 md:flex">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                      selectedCategory === category
                        ? "border border-[#1E90FF] bg-[#1E90FF] text-white"
                        : "border border-[#cfe9ff] bg-[#f0f9ff] text-[#0f4fa8] hover:bg-[#e6f4ff]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {renderTopNewsSection()}

        <section className="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 lg:px-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-7">
              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1E90FF]">
                  Atualizações
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 sm:text-[2rem]">
                  Últimas notícias por categoria
                </h3>
              </div>

              {newsGroupedByCategory.length > 0 ? (
                newsGroupedByCategory.map((group) => (
                  <div
                    key={group.category}
                    className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]"
                  >
                    <div className="mb-6 border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#1E90FF]" />
                        <h4 className="text-xl font-black uppercase tracking-[0.04em] text-slate-900">
                          {group.category}
                        </h4>
                      </div>
                    </div>

                    <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                      {group.items.map((item) => (
                        <article
                          key={item._id}
                          onClick={() => handleNavigateToNews(item._id)}
                          className="group flex cursor-pointer gap-4 rounded-[24px] border border-[#bfe3ff] bg-[#f0f9ff] p-3 shadow-[0_12px_38px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:bg-[#e7f4ff] hover:shadow-[0_18px_48px_rgba(15,23,42,0.10)]"
                        >
                          <div className="h-[210px] w-[150px] flex-shrink-0 overflow-hidden rounded-[18px] bg-transparent sm:h-[230px] sm:w-[165px]">
                            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[18px] bg-transparent p-0">
                              <img
                                src={getImageUrl(item)}
                                alt={item.titulo}
                                className="block max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                              />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1 self-center">
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E90FF]">
                              {item.category}
                            </p>

                            <h5 className="line-clamp-3 text-base font-extrabold uppercase leading-6 tracking-[-0.02em] text-slate-900 transition group-hover:text-[#0f4fa8] sm:text-lg">
                              {item.titulo}
                            </h5>

                            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                  <div className="rounded-[22px] border border-dashed border-[#cfe9ff] bg-[#f8fcff] px-4 py-12 text-center text-sm text-slate-500">
                    Nenhuma notícia encontrada para essa pesquisa.
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-5">
              <div
                id="anuncie-aqui"
                className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">
                    Anuncie aqui
                  </h3>
                  <span className="rounded-full bg-[#f0f9ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1E90FF]">
                    Destaque
                  </span>
                </div>

                <div className="space-y-4">
                  {sidebarAds.map((adItem) => (
                    <a
                      key={adItem.id}
                      href={adItem.href}
                      className="block overflow-hidden rounded-[22px] border border-slate-200 transition hover:shadow-md"
                    >
                      <img
                        src={adItem.image}
                        alt={adItem.title}
                        className="h-40 w-full object-cover"
                      />
                      <div className="bg-white p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#1E90FF]">
                          Publicidade
                        </p>
                        <h4 className="mt-1 line-clamp-2 text-sm font-bold uppercase text-slate-900">
                          {adItem.title}
                        </h4>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">
                          {adItem.subtitle}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                <h3 className="text-lg font-black text-slate-900">Pesquisar</h3>
                <input
                  type="text"
                  placeholder="Digite um termo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-4 w-full rounded-2xl border border-[#cfe9ff] bg-[#f8fcff] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E90FF] focus:ring-2 focus:ring-[#d8efff]"
                />
              </div>

              <div className="hidden rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:block">
                <h3 className="text-lg font-black text-slate-900">
                  Categorias
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                        selectedCategory === category
                          ? "border border-[#1E90FF] bg-[#1E90FF] text-white"
                          : "border border-[#cfe9ff] bg-[#f0f9ff] text-[#0f4fa8] hover:bg-[#e6f4ff]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                <h3 className="text-lg font-black text-slate-900">
                  Mais recentes
                </h3>

                <div className="mt-4 space-y-4">
                  {filteredNews.slice(0, 4).map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleNavigateToNews(item._id)}
                      className="flex w-full items-center gap-3 rounded-[22px] border border-[#bfe3ff] bg-[#f0f9ff] p-2 text-left shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:bg-[#e7f4ff] hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
                    >
                      <div className="h-[120px] w-[92px] flex-shrink-0 overflow-hidden rounded-[16px] bg-transparent">
                        <div className="flex h-full w-full items-center justify-center p-0">
                          <img
                            src={getImageUrl(item)}
                            alt={item.titulo}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {formatDate(item.createdAt)}
                        </p>
                        <p className="mt-1 line-clamp-3 text-sm font-bold uppercase leading-5 text-slate-900">
                          {item.titulo}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

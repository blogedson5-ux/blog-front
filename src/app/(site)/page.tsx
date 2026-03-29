"use client";

import { useAd, usePost } from "@/data/news";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

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
  videoUrl: string;
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

type GroupedNews = {
  category: string;
  items: Post[];
};

function InstagramEmbedPreview({ url }: { url: string }) {
  useEffect(() => {
    const scriptId = "instagram-embed-script-home";
    const existingScript = document.getElementById(scriptId);

    const processEmbed = () => {
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
      }
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = processEmbed;
      document.body.appendChild(script);
    } else {
      processEmbed();
    }
  }, [url]);

  return (
    <div className="flex h-full justify-center overflow-hidden bg-black">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          width: "100%",
          maxWidth: "420px",
          minWidth: "280px",
          margin: "0 auto",
        }}
      />
    </div>
  );
}

function extractTikTokVideoId(url: string) {
  const match = url.match(/\/video\/(\d+)/i);
  return match ? match[1] : "";
}

function TikTokEmbedPreview({ url }: { url: string }) {
  useEffect(() => {
    const scriptId = "tiktok-embed-script-home";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <div className="flex h-full justify-center overflow-hidden bg-black">
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={extractTikTokVideoId(url)}
        style={{
          maxWidth: "420px",
          minWidth: "280px",
          margin: "0 auto",
        }}
      >
        <section>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Ver publicação no TikTok
          </a>
        </section>
      </blockquote>
    </div>
  );
}

function HomeVideoPreview({
  item,
  onOpen,
  formatDate,
}: {
  item: Post;
  onOpen: (id: string) => void;
  formatDate: (date: string | Date) => string;
}) {
  const url = item.videoUrl?.trim();

  if (!url) return null;

  const isInstagram = url.includes("instagram.com");
  const isTikTok = url.includes("tiktok.com");

  if (!isInstagram && !isTikTok) return null;

  return (
    <article className="w-[320px] flex-shrink-0 overflow-hidden border border-slate-800 bg-black sm:w-[360px]">
      <div className="h-[440px] overflow-hidden bg-black">
        {isInstagram && <InstagramEmbedPreview url={url} />}
        {isTikTok && <TikTokEmbedPreview url={url} />}
      </div>

      <div className="border-t border-slate-800 bg-black px-4 py-4">
        {item.category && item.category.trim() ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7dd3fc]">
            {item.category}
          </p>
        ) : null}

        <h4
          onClick={() => onOpen(item._id)}
          className="mt-2 cursor-pointer line-clamp-2 text-sm font-extrabold leading-5 text-white transition hover:text-[#7dd3fc]"
        >
          {item.titulo}
        </h4>

        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {formatDate(item.createdAt)}
        </p>
      </div>
    </article>
  );
}

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

  const socialLinks = {
    instagram: "https://www.instagram.com/",
    whatsapp: "https://wa.me/5583999999999",
    tiktok: "https://www.tiktok.com/",
  };

  const whatsappNumber = "5583999999999";

  const getWhatsAppAdLink = (adTitle?: string) => {
    const message = `Olá! Tenho interesse em anunciar no portal.${
      adTitle ? ` Vi o espaço "${adTitle}"` : ""
    } e gostaria de saber mais informações sobre valores, formatos e disponibilidade.`;

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const sidebarAds: SidebarAd[] = [
    {
      id: "1",
      title: "ANUNCIE AQUI",
      subtitle: "Seu negócio em destaque no portal.",
      image:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1400&auto=format&fit=crop",
      href: "#anuncie-aqui",
    },
    {
      id: "2",
      title: "DIVULGUE SUA EMPRESA",
      subtitle: "Mais visibilidade para sua marca.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
      href: "#anuncie-aqui",
    },
    {
      id: "3",
      title: "IMPULSIONE SUAS VENDAS",
      subtitle: "Alcance mais clientes todos os dias.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
      href: "#anuncie-aqui",
    },
  ];

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

  const newsGroupedByCategory = useMemo<GroupedNews[]>(() => {
    if (selectedCategory !== "Todas") {
      return [
        {
          category: selectedCategory,
          items: filteredNews,
        },
      ];
    }

    const grouped = filteredNews.reduce<Record<string, Post[]>>((acc, item) => {
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
  }, [filteredNews, selectedCategory]);

  const videoPosts = useMemo(() => {
    return [...sortedNews].filter(
      (item) =>
        typeof item.videoUrl === "string" && item.videoUrl.trim() !== "",
    );
  }, [sortedNews]);

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
        className={`relative h-full w-full overflow-hidden ${wrapperClassName}`}
      >
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
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
            className="group cursor-pointer overflow-hidden border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          >
            <div className="relative h-[260px] overflow-hidden bg-[#eaf4ff] sm:h-[380px] lg:h-[500px]">
              {renderNewsImage({
                src: getImageUrl(item),
                alt: item.titulo,
                wrapperClassName: "h-full w-full bg-[#eaf4ff]",
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
          <div className="border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="grid gap-2 md:hidden">
              <div
                onClick={() => handleNavigateToNews(main._id)}
                className="group cursor-pointer overflow-hidden"
              >
                <div className="relative h-[260px] overflow-hidden bg-[#eaf4ff] sm:h-[380px]">
                  {renderNewsImage({
                    src: getImageUrl(main),
                    alt: main.titulo,
                    wrapperClassName: "h-full w-full bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(main, { large: true })}
                </div>
              </div>

              <div
                onClick={() => handleNavigateToNews(secondary._id)}
                className="group cursor-pointer overflow-hidden"
              >
                <div className="relative h-[200px] overflow-hidden bg-[#eaf4ff] sm:h-[280px]">
                  {renderNewsImage({
                    src: getImageUrl(secondary),
                    alt: secondary.titulo,
                    wrapperClassName: "h-full w-full bg-[#eaf4ff]",
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
                className="group cursor-pointer overflow-hidden"
              >
                <div className="relative h-[560px] overflow-hidden bg-[#eaf4ff]">
                  {renderNewsImage({
                    src: getImageUrl(main),
                    alt: main.titulo,
                    wrapperClassName: "h-full w-full bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(main, { large: true })}
                </div>
              </div>

              <div className="grid grid-rows-2 gap-2">
                <div className="bg-transparent" />

                <div
                  onClick={() => handleNavigateToNews(secondary._id)}
                  className="group cursor-pointer overflow-hidden"
                >
                  <div className="relative h-[278px] overflow-hidden bg-[#eaf4ff]">
                    {renderNewsImage({
                      src: getImageUrl(secondary),
                      alt: secondary.titulo,
                      wrapperClassName: "h-full w-full bg-[#eaf4ff]",
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
        <div className="border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="grid gap-2 md:hidden">
            <div
              onClick={() => handleNavigateToNews(main._id)}
              className="group cursor-pointer overflow-hidden"
            >
              <div className="relative h-[260px] overflow-hidden bg-[#eaf4ff] sm:h-[380px]">
                {renderNewsImage({
                  src: getImageUrl(main),
                  alt: main.titulo,
                  wrapperClassName: "h-full w-full bg-[#eaf4ff]",
                  imageClassName:
                    "transition duration-500 group-hover:scale-105",
                })}
                {renderOverlayCardContent(main, { large: true })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => handleNavigateToNews(topRight._id)}
                className="group cursor-pointer overflow-hidden"
              >
                <div className="relative h-[200px] overflow-hidden bg-[#eaf4ff] sm:h-[280px]">
                  {renderNewsImage({
                    src: getImageUrl(topRight),
                    alt: topRight.titulo,
                    wrapperClassName: "h-full w-full bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(topRight)}
                </div>
              </div>

              <div
                onClick={() => handleNavigateToNews(bottomRight._id)}
                className="group cursor-pointer overflow-hidden"
              >
                <div className="relative h-[200px] overflow-hidden bg-[#eaf4ff] sm:h-[280px]">
                  {renderNewsImage({
                    src: getImageUrl(bottomRight),
                    alt: bottomRight.titulo,
                    wrapperClassName: "h-full w-full bg-[#eaf4ff]",
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
              className="group cursor-pointer overflow-hidden"
            >
              <div className="relative h-[560px] overflow-hidden bg-[#eaf4ff]">
                {renderNewsImage({
                  src: getImageUrl(main),
                  alt: main.titulo,
                  wrapperClassName: "h-full w-full bg-[#eaf4ff]",
                  imageClassName:
                    "transition duration-500 group-hover:scale-105",
                })}
                {renderOverlayCardContent(main, { large: true })}
              </div>
            </div>

            <div className="grid grid-rows-2 gap-2">
              <div
                onClick={() => handleNavigateToNews(topRight._id)}
                className="group cursor-pointer overflow-hidden"
              >
                <div className="relative h-[278px] overflow-hidden bg-[#eaf4ff]">
                  {renderNewsImage({
                    src: getImageUrl(topRight),
                    alt: topRight.titulo,
                    wrapperClassName: "h-full w-full bg-[#eaf4ff]",
                    imageClassName:
                      "transition duration-500 group-hover:scale-105",
                  })}
                  {renderOverlayCardContent(topRight)}
                </div>
              </div>

              <div
                onClick={() => handleNavigateToNews(bottomRight._id)}
                className="group cursor-pointer overflow-hidden"
              >
                <div className="relative h-[278px] overflow-hidden bg-[#eaf4ff]">
                  {renderNewsImage({
                    src: getImageUrl(bottomRight),
                    alt: bottomRight.titulo,
                    wrapperClassName: "h-full w-full bg-[#eaf4ff]",
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
              className="relative h-[190px] w-full touch-pan-y sm:h-[420px] lg:h-[520px]"
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

                      <div className="absolute inset-0 bg-gradient-to-r from-[#081938]/82 via-[#1E90FF]/25 to-transparent" />

                      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-10">
                        <span className="absolute left-5 top-5 inline-flex w-fit rounded-full bg-white/16 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:left-8 sm:top-8 lg:left-10 lg:top-10">
                          Publicidade
                        </span>

                        <div className="flex flex-col gap-3">
                          <h2 className="max-w-2xl text-lg font-black uppercase leading-tight tracking-[-0.02em] text-white sm:text-2xl lg:text-3xl">
                            {slide.title}
                          </h2>

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
          <div className="space-y-10">
            <div className="space-y-7">
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1E90FF]">
                  Atualizações
                </p>

                <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                  Últimas notícias por categoria
                </h3>
              </div>

              {newsGroupedByCategory.length > 0 ? (
                newsGroupedByCategory.map((group) => {
                  const destaque = group.items.slice(0, 2);
                  const lista = group.items.slice(2, 12);

                  return (
                    <section key={group.category} className="mb-10">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="h-2 w-2 bg-[#1E90FF]" />
                        <h4 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
                          {group.category}
                        </h4>
                      </div>

                      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                        <div>
                          <div className="grid gap-4 md:grid-cols-2">
                            {destaque.map((item) => (
                              <div
                                key={item._id}
                                onClick={() => handleNavigateToNews(item._id)}
                                className="cursor-pointer"
                              >
                                <div className="h-[240px] w-full overflow-hidden sm:h-[260px]">
                                  <img
                                    src={getImageUrl(item)}
                                    alt={item.titulo}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-tight text-[#1E90FF]">
                                  {item.titulo}
                                </h3>

                                <p className="mt-1 text-[10px] text-gray-500">
                                  {formatDate(item.createdAt)}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 grid gap-3">
                            {lista.map((item) => (
                              <div
                                key={item._id}
                                onClick={() => handleNavigateToNews(item._id)}
                                className="flex cursor-pointer gap-3"
                              >
                                <div className="h-[85px] w-[110px] flex-shrink-0 overflow-hidden">
                                  <img
                                    src={getImageUrl(item)}
                                    alt={item.titulo}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div>
                                  <h5 className="line-clamp-2 text-xs font-bold leading-tight text-[#1E90FF]">
                                    {item.titulo}
                                  </h5>

                                  <p className="mt-1 text-[10px] text-gray-500">
                                    {formatDate(item.createdAt)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          {sidebarAds.map((adItem) => (
                            <a
                              key={adItem.id}
                              href={getWhatsAppAdLink(adItem.title)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative block overflow-hidden"
                            >
                              <img
                                src={adItem.image}
                                alt={adItem.title}
                                className="h-[160px] w-full object-cover transition duration-500 group-hover:scale-105"
                              />

                              <div className="absolute inset-0 bg-black/50 transition group-hover:bg-black/60" />

                              <div className="absolute inset-0 flex flex-col justify-end p-4">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-white">
                                  Publicidade
                                </p>

                                <h4 className="text-sm font-extrabold uppercase leading-tight text-white">
                                  {adItem.title}
                                </h4>

                                <span className="mt-1 text-[10px] font-semibold text-blue-300">
                                  Clique e anuncie →
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                })
              ) : (
                <div className="border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
                  <div className="border border-dashed border-[#cfe9ff] bg-[#f8fcff] px-4 py-12 text-center text-sm text-slate-500">
                    Nenhuma notícia encontrada para essa pesquisa.
                  </div>
                </div>
              )}
            </div>

            {videoPosts.length > 0 && (
              <section className="bg-black px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-red-600" />
                  <h3 className="text-xl font-black uppercase tracking-wide text-white">
                    Vídeos
                  </h3>
                </div>

                <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex min-w-max gap-4">
                    {videoPosts.map((item) => (
                      <HomeVideoPreview
                        key={item._id}
                        item={item}
                        onOpen={handleNavigateToNews}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      </div>

      <footer className="mt-12 border-t border-slate-200 bg-[#081938] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* LOGO */}
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dybjtiyiv/image/upload/v1774805428/ChatGPT_Image_29_de_mar._de_2026_14_24_34_hmvsxp.png"
                  alt="Logo do portal"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                  Portal de Notícias
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  Informação, vídeos e cobertura local em destaque.
                </p>
              </div>
            </div>

            {/* REDES SOCIAIS */}
            <div className="flex items-center gap-3">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/5 transition hover:bg-[#1E90FF]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm5.25-2a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                </svg>
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/5 transition hover:bg-[#1E90FF]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12.04 2C6.52 2 2.05 6.46 2.05 11.98c0 1.77.46 3.49 1.34 5L2 22l5.16-1.35a9.93 9.93 0 0 0 4.88 1.25h.01c5.51 0 9.98-4.47 9.98-9.99A9.98 9.98 0 0 0 12.04 2Zm0 18.2h-.01a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.06.8.82-2.99-.2-.31a8.2 8.2 0 0 1-1.27-4.39c0-4.55 3.7-8.25 8.24-8.25 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.17c-.25-.13-1.47-.72-1.7-.8-.23-.08-.39-.13-.56.13-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.38-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.77-1.83-.2-.48-.41-.41-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.25 3.74.59.25 1.06.4 1.42.51.6.19 1.15.16 1.59.1.49-.08 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
                </svg>
              </a>

              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/5 transition hover:bg-[#1E90FF]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M14.5 3c.34 1.9 1.46 3.38 3.38 4.1.74.28 1.48.4 2.12.42v2.57a7.3 7.3 0 0 1-3.78-1.07v6.18c0 3.53-2.87 6.4-6.4 6.4S3.42 18.73 3.42 15.2s2.87-6.4 6.4-6.4c.36 0 .72.03 1.06.09v2.67a3.78 3.78 0 0 0-1.06-.15 3.79 3.79 0 1 0 3.79 3.79V3h.89Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 text-center text-xs uppercase tracking-[0.14em] text-slate-400">
            © {new Date().getFullYear()} Portal de Notícias. Todos os direitos
            reservados.
          </div>
        </div>
      </footer>
    </main>
  );
}

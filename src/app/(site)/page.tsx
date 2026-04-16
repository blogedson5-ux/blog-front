"use client";

import { AdBanner } from "@/components/AdBanner";
import { CategoryTabs } from "@/components/CategoryTabs";
import { Footer } from "@/components/Footer.tsxFooter";
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

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const whatsappNumber = "558381686623";

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
    if (!realAd || !Array.isArray(realAd.images) || realAd.images.length === 0) {
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

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);

    if (category === "Todas") {
      router.push("/");
      return;
    }

    const slug = category
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    router.push(`/categoria/${slug}`);
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
        <AdBanner ad={ad} />

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5">
              <div>
                <span className="inline-flex rounded-full border border-[#bfe3ff] bg-[#f0f9ff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#1E90FF]">
                  Portal de notícias
                </span>
              </div>

              <CategoryTabs
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
              />

              <div className="w-full md:max-w-sm">
                <input
                  type="text"
                  placeholder="Pesquisar notícia..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-b border-[#cfe9ff] bg-transparent px-0 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1E90FF]"
                />
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
                                className="h-full w-full object-cover"
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

                      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_300px]">
                        <div className="grid gap-3 md:grid-cols-2">
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

                        <aside className="space-y-4">
                          {sidebarAds.map((ad) => {
                            const whatsappLink = getWhatsAppAdLink(ad.title);

                            return (
                              <div
                                key={ad.id}
                                className="relative h-[140px] w-full overflow-hidden"
                              >
                                <img
                                  src={ad.image}
                                  alt={ad.title}
                                  className="h-full w-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-r from-[#081938]/90 via-[#1E90FF]/35 to-transparent" />

                                <div className="absolute inset-0 flex flex-col justify-between p-3">
                                  <span className="w-fit rounded-full bg-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                                    Publicidade
                                  </span>

                                  <div>
                                    <h3 className="text-xs font-extrabold uppercase text-white">
                                      {ad.title}
                                    </h3>

                                    <p className="mt-1 line-clamp-2 text-[10px] text-blue-100">
                                      {ad.subtitle}
                                    </p>

                                    <a
                                      href={whatsappLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1E90FF] transition hover:opacity-80"
                                    >
                                      Fale conosco
                                      <span className="text-[#1E90FF]">→</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </aside>
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

      <Footer />
    </main>
  );
}
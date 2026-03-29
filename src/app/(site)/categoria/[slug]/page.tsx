"use client";

import { Footer } from "@/components/Footer.tsxFooter";
import { useAd, usePost } from "@/data/news";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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

const ITEMS_PER_PAGE = 8;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function formatCategoryFromSlug(slug: string) {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const { data: news, isLoading, isError } = usePost();
  const { data: ad } = useAd();

  const posts: Post[] = (news ?? []) as Post[];

  const slug = String(params.slug ?? "");
  const currentPageFromUrl = Number(searchParams.get("page") || "1");

  const [currentBanner, setCurrentBanner] = useState(0);

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const categoryName = useMemo(() => formatCategoryFromSlug(slug), [slug]);

  const filteredPosts = useMemo(() => {
    const normalizedSlug = normalizeText(categoryName);

    return [...posts]
      .filter((item) => normalizeText(item.category || "") === normalizedSlug)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [posts, categoryName]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / ITEMS_PER_PAGE),
  );

  const currentPage = Math.min(
    Math.max(1, Number.isNaN(currentPageFromUrl) ? 1 : currentPageFromUrl),
    totalPages,
  );

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredPosts.slice(start, end);
  }, [filteredPosts, currentPage]);

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

  const formatDate = (date: string | Date) => {
    const parsedDate = date instanceof Date ? date : new Date(date);

    return parsedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getImageUrl = (item: Post) =>
    item.image?.url ||
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop";

  const handleNavigateToNews = (id: string) => {
    router.push(`/noticia/${id}`);
  };

  const goToPage = (page: number) => {
    router.push(`/categoria/${slug}?page=${page}`);
  };

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

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 8) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
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

  if (isError) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              Erro ao carregar notícias
            </h2>
            <p className="text-slate-600">
              Não foi possível carregar as matérias desta categoria.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="mb-4 text-sm font-semibold text-[#1E90FF] transition hover:opacity-80"
          >
            ← Voltar
          </button>

          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 bg-[#1E90FF]" />
            <h1 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
              {categoryName}
            </h1>
          </div>

          <p className="text-sm text-slate-500">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1
              ? "matéria encontrada"
              : "matérias encontradas"}
          </p>
        </div>

        {paginatedPosts.length === 0 ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              Nenhuma matéria encontrada
            </h2>
            <p className="text-slate-600">
              Ainda não existem matérias nesta categoria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {paginatedPosts.map((item) => (
                <article
                  key={item._id}
                  onClick={() => handleNavigateToNews(item._id)}
                  className="cursor-pointer overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1"
                >
                  <div className="h-[220px] w-full overflow-hidden bg-[#eaf4ff]">
                    <img
                      src={getImageUrl(item)}
                      alt={item.titulo}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1E90FF]">
                      {item.category}
                    </p>

                    <h2 className="mt-2 line-clamp-3 text-base font-extrabold leading-tight text-slate-900">
                      {item.titulo}
                    </h2>

                    <p className="mt-3 text-xs text-slate-500">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full border border-[#cfe9ff] bg-[#f0f9ff] px-4 py-2 text-sm font-semibold text-[#0f4fa8] transition hover:bg-[#e6f4ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>

              {getVisiblePages().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-2 text-sm font-semibold text-slate-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(Number(page))}
                    className={`min-w-10 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      currentPage === page
                        ? "border border-[#1E90FF] bg-[#1E90FF] text-white"
                        : "border border-[#cfe9ff] bg-[#f0f9ff] text-[#0f4fa8] hover:bg-[#e6f4ff]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-full border border-[#cfe9ff] bg-[#f0f9ff] px-4 py-2 text-sm font-semibold text-[#0f4fa8] transition hover:bg-[#e6f4ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </>
        )}
      </section>

      <section className="mx-auto max-w-7xl py-8 sm:px-6 lg:px-8">
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

      <Footer />
    </main>
  );
}

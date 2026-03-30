"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useEffect } from "react";
import { usePostById, usePost, useAd } from "@/data/news";
import { AdBanner } from "@/components/AdBanner";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    const scriptId = "instagram-embed-script";
    const existingScript = document.getElementById(scriptId);

    const processEmbed = () => {
      if (window.instgrm && window.instgrm.Embeds) {
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
    <div className="flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          width: "100%",
          maxWidth: "540px",
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

function TikTokEmbed({ url }: { url: string }) {
  useEffect(() => {
    const scriptId = "tiktok-embed-script";
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
    <div className="flex justify-center">
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={extractTikTokVideoId(url)}
        style={{
          maxWidth: "605px",
          minWidth: "325px",
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

function VideoEmbed({ url }: { url?: string }) {
  if (!url || !url.trim()) return null;

  const isInstagram = url.includes("instagram.com");
  const isTikTok = url.includes("tiktok.com");

  if (!isInstagram && !isTikTok) return null;

  return (
    <section className="mt-10 border-t border-slate-200 pt-8 sm:pt-10">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-600 sm:text-xs">
          Publicação vinculada
        </h2>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-4">
        {isInstagram && <InstagramEmbed url={url} />}
        {isTikTok && <TikTokEmbed url={url} />}
      </div>
    </section>
  );
}

export default function NewsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: news, isLoading, isError } = usePostById(id);
  const { data: allNews } = usePost();
  const { data: ad } = useAd();

  const formatDate = (date: string | Date) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    return parsedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const relatedNews = useMemo(() => {
    if (!allNews || !news) return [];

    const filtered = allNews.filter((item: any) => item._id !== news._id);

    return [...filtered]
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 8);
  }, [allNews, news]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="rounded-[24px] border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-400" />
            <p className="text-base font-medium text-slate-700">
              Carregando notícia...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !news) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              Notícia não encontrada
            </h2>
            <p className="text-slate-600">
              Não foi possível carregar esta matéria no momento.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <article className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <header className="mx-auto max-w-4xl border-b border-slate-200 pb-6 sm:pb-8">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] sm:text-xs">
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-sky-600 ring-1 ring-sky-100">
              Matéria
            </span>

            {news.category && news.category.trim() ? (
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                {news.category}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-[2rem] font-black uppercase leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-[2.6rem] lg:text-[3.4rem]">
            {news.titulo}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Publicado em {formatDate(news.createdAt)}</span>

            {news.category && news.category.trim() ? (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{news.category}</span>
              </>
            ) : null}
          </div>
        </header>

        <section className="mx-auto mt-6 max-w-5xl sm:mt-8">
          <div className="overflow-hidden rounded-[24px] bg-slate-50">
            <div className="flex min-h-[220px] items-center justify-center sm:min-h-[320px] lg:min-h-[520px]">
              <img
                src={news.image?.url}
                alt={news.titulo}
                className="block max-h-[520px] w-full object-contain"
              />
            </div>
          </div>
        </section>

        <AdBanner ad={ad} className="mt-8 sm:mt-10 lg:mt-12" />

        <section className="mx-auto mt-8 max-w-4xl sm:mt-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-600 sm:text-xs">
              Informações da notícia
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6 sm:pt-8">
            <p className="whitespace-pre-line text-[17px] leading-8 text-slate-800 sm:text-[19px] sm:leading-9">
              {news.textOne}
            </p>
          </div>

          {news.videoUrl && news.videoUrl.trim() ? (
            <VideoEmbed url={news.videoUrl} />
          ) : null}
        </section>

        {relatedNews.length > 0 && (
          <section className="mx-auto mt-14 max-w-6xl border-t border-slate-200 pt-8 sm:mt-16 sm:pt-10">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-600 sm:text-xs">
                  Veja mais
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
                  Outras matérias
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {relatedNews.map((item: any) => (
                <Link
                  key={item._id}
                  href={`/noticia/${item._id}`}
                  className="group overflow-hidden rounded-[18px] border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={item.image?.url}
                      alt={item.titulo}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px]">
                      <span>{formatDate(item.createdAt)}</span>

                      {item.category && item.category.trim() ? (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="line-clamp-1">{item.category}</span>
                        </>
                      ) : null}
                    </div>

                    <h3 className="mt-2 line-clamp-3 text-sm font-extrabold uppercase leading-5 tracking-[-0.02em] text-slate-900 transition-colors duration-300 group-hover:text-sky-700 sm:text-[15px]">
                      {item.titulo}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
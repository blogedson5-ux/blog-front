"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { usePostById, usePost } from "@/data/news";
import { useMemo } from "react";

export default function NewsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: news, isLoading, isError } = usePostById(id);
  const { data: allNews } = usePost();

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

    const filtered = allNews.filter((item) => item._id !== news._id);

    return [...filtered]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 6);
  }, [allNews, news]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1E90FF]" />
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
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
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
      <article className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <header className="mx-auto max-w-4xl border-b border-slate-200 pb-8 sm:pb-10">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] sm:text-xs">
            <span className="inline-flex rounded-full border border-[#bfe3ff] bg-[#f0f9ff] px-3 py-1 text-[#1E90FF]">
              Matéria
            </span>

            {news.category?.trim() ? (
              <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600">
                {news.category}
              </span>
            ) : null}
          </div>

          <h1 className="mt-5 text-3xl font-black uppercase leading-[1.02] tracking-[-0.04em] text-slate-900 sm:text-4xl lg:text-[3.6rem]">
            {news.titulo}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>Publicado em {formatDate(news.createdAt)}</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
            <span>Conteúdo informativo</span>
          </div>
        </header>

        <section className="mx-auto mt-8 max-w-5xl sm:mt-10">
          <div className="overflow-hidden rounded-[32px] bg-transparent shadow-none">
            <div className="flex min-h-[240px] items-center justify-center bg-transparent p-0 sm:min-h-[340px] lg:min-h-[560px]">
              <img
                src={news.image?.url}
                alt={news.titulo}
                className="block max-h-[520px] w-full object-contain"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className="min-w-0 rounded-[32px] border border-[#bfe3ff] bg-[#f0f9ff] px-6 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:px-9 sm:py-10 lg:px-12">
            <div className="mb-7 flex items-center gap-3 border-b border-[#cfe9ff] pb-5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1E90FF]" />
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-500">
                Informações da notícia
              </p>
            </div>

            <div className="max-w-none space-y-8">
              <p className="text-[18px] leading-9 text-slate-800 sm:text-[20px]">
                {news.textOne}
              </p>

              {news.textTwo?.trim() ? (
                <>
                  <div className="h-px w-full bg-[#cfe9ff]" />
                  <p className="text-[17px] leading-9 text-slate-700 sm:text-[18px]">
                    {news.textTwo}
                  </p>
                </>
              ) : null}
            </div>
          </div>

          <aside className="h-fit lg:sticky lg:top-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#1E90FF]">
                Resumo
              </span>

              <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.02em] text-slate-900">
                Sobre esta matéria
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Página pensada para leitura, com foco no conteúdo da notícia,
                contraste forte, hierarquia visual clara e acabamento mais
                editorial.
              </p>

              <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Data de publicação
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatDate(news.createdAt)}
                  </p>
                </div>

                {news.category?.trim() ? (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Categoria
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {news.category}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </section>

        {relatedNews.length > 0 && (
          <section className="mx-auto mt-16 max-w-6xl border-t border-slate-200 pt-10 sm:pt-12">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#1E90FF] sm:text-xs">
                  Continue lendo
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-900 sm:text-3xl">
                  Outras matérias
                </h2>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {relatedNews.map((item) => (
                <Link
                  key={item._id}
                  href={`/noticia/${item._id}`}
                  className="group overflow-hidden rounded-[30px] border border-[#bfe3ff] bg-[#f0f9ff] shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e7f4ff] hover:shadow-[0_20px_48px_rgba(15,23,42,0.09)]"
                >
                  <div className="flex h-[220px] items-center justify-center overflow-hidden bg-transparent p-3">
                    <img
                      src={item.image?.url}
                      alt={item.titulo}
                      className="block h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      <span>{formatDate(item.createdAt)}</span>
                      {item.category?.trim() ? (
                        <>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span>{item.category}</span>
                        </>
                      ) : null}
                    </div>

                    <h3 className="mt-4 line-clamp-3 text-lg font-black uppercase leading-7 tracking-[-0.02em] text-slate-900 transition-colors duration-300 group-hover:text-[#0f4fa8]">
                      {item.titulo}
                    </h3>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1E90FF]">
                      Ler matéria
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
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

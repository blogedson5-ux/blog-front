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

    // 1️⃣ Remove a matéria atual
    const filtered = allNews.filter((item) => item._id !== news._id);

    // 2️⃣ Ordena por data (mais recente primeiro)
    const sorted = [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    if (sorted.length <= 6) return sorted;

    // 3️⃣ Gera offset aleatório para rodízio
    const maxOffset = sorted.length - 6;
    const randomOffset = Math.floor(Math.random() * (maxOffset + 1));

    // 4️⃣ Retorna 6 mantendo ordem por data
    return sorted.slice(randomOffset, randomOffset + 6);
  }, [allNews, news]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p>Carregando notícia...</p>
      </main>
    );
  }

  if (isError || !news) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p>Notícia não encontrada.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-14">

      {/* HEADER */}
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-neutral-900">
          {news.titulo}
        </h1>

        <span className="text-sm text-neutral-500">
          Publicado em {formatDate(news.createdAt)}
        </span>

        <hr className="mt-4" />
      </header>

      {/* TEXTO 1 */}
      <p className="text-base sm:text-lg leading-relaxed text-neutral-800">
        {news.textOne}
      </p>

      {/* IMAGEM */}
      <div className="w-full overflow-hidden rounded-xl">
        <img
          src={news.image.url}
          alt={news.titulo}
          className="
            w-full
            h-auto
            max-h-[600px]
            object-cover
            transition-transform
            duration-300
            hover:scale-[1.01]
          "
        />
      </div>

      {/* TEXTO 2 */}
      <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
        {news.textTwo}
      </p>

      {/* OUTRAS MATÉRIAS */}
      {relatedNews.length > 0 && (
        <section className="space-y-6 border-t pt-10">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">
            Outras matérias
          </h2>

          <ul className="grid gap-6 sm:grid-cols-2">
            {relatedNews.map((item) => (
              <li
                key={item._id}
                className="space-y-1 border-b pb-4 sm:border-none"
              >
                <Link
                  href={`/noticia/${item._id}`}
                  className="block text-blue-600 hover:text-blue-700 hover:underline transition"
                >
                  {item.titulo}
                </Link>

                <span className="text-xs text-neutral-500">
                  {formatDate(item.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

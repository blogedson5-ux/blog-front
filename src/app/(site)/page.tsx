"use client";
import { usePost } from "@/data/news";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function Home() {
  const router = useRouter();
  const { data: news, isLoading, isError } = usePost();

  const sortedNews = useMemo(() => {
    if (!news) return [];

    return [...news].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [news]);

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

  const formatDate = (date: string | Date) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    return parsedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleNavigateToNews = (id: string) => {
    router.push(`/noticia/${id}`);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-16">
        {sortedNews.map((item) => (
          <article
            key={item._id}
            className="space-y-5 border-b border-neutral-200 pb-12"
          >
            {/* DATA */}
            <span className="text-xs uppercase tracking-wide text-neutral-500">
              {formatDate(item.createdAt)}
            </span>

            {/* TÍTULO */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug text-neutral-900">
              {item.titulo}
            </h2>

            {/* IMAGEM */}
            <div className="w-full overflow-hidden rounded-lg">
              <img
                src={item.image.url}
                alt={item.titulo}
                className="
                  w-full
                  h-auto
                  max-h-[500px]
                  object-cover
                  transition-transform
                  duration-300
                  hover:scale-[1.02]
                "
              />
            </div>

            {/* TEXTO */}
            <div className="relative">
              <p className="text-base sm:text-lg leading-relaxed text-neutral-700 line-clamp-4">
                {item.textOne}
              </p>

              <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* BOTÃO */}
            <button
              onClick={() => handleNavigateToNews(item._id)}
              className="text-sm sm:text-base font-medium text-blue-600 hover:underline"
            >
              Ler matéria completa
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

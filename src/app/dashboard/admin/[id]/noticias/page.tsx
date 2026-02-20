"use client";

import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { usePost } from "@/data/news";
import BackAdminButton from "@/components/BackAdminButton";

export default function AdminNewsPage() {
  const { data: news, refetch, isLoading } = usePost();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlerUrl = () => {
    const newPath = pathname.replace("/noticias", "/posts/new");
    router.push(newPath);
  };

  const handlerEdit = (id: string) => {
    const newPath = pathname.replace("/noticias", `/posts/new?idPost=${id}`);
    router.push(newPath);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const openDeleteModal = (postId: string) => {
    setPostToDelete(postId);
    setIsConfirmOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;

    try {
      setIsDeleting(true);

      await axios.delete(`post/delete-post/${postToDelete}`);

      toast.success("Post deletado com sucesso!");
      await refetch();
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao deletar post";
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setPostToDelete(null);
    }
  };

  // 🔥 FILTRO + ORDENAÇÃO (MAIS RECENTE PRIMEIRO)
  const filteredNews = useMemo(() => {
    if (!news) return [];

    return news
      .filter((item) => {
        const matchTitle = item.titulo
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchDate = filterDate
          ? new Date(item.createdAt).toISOString().split("T")[0] === filterDate
          : true;

        return matchTitle && matchDate;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
  }, [news, search, filterDate]);

  // 🔥 AGRUPAR POR DATA (mantendo ordem já definida)
  const groupedNews = useMemo(() => {
    const grouped: any = {};

    filteredNews.forEach((item) => {
      const date = formatDate(item.createdAt);
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    return grouped;
  }, [filteredNews]);

  if (isLoading) {
    return <p className="p-6">Carregando matérias...</p>;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* HEADER */}
      <header className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <BackAdminButton />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Gerenciar Matérias
              </h1>
              <p className="text-sm text-neutral-500">
                Administre e organize as publicações
              </p>
            </div>
          </div>

          <button
            onClick={handlerUrl}
            className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800 transition"
          >
            + Nova matéria
          </button>
        </div>

        {/* FILTROS */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <div className="grid md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Buscar por título
              </label>

              <input
                type="text"
                placeholder="Digite o nome da matéria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-neutral-900 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                Filtrar por data
              </label>

              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-neutral-900 outline-none transition"
              />
            </div>

            {(search || filterDate) && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilterDate("");
                }}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </header>

      {/* LISTAGEM */}
      <section className="space-y-14">
        {Object.keys(groupedNews).length === 0 && (
          <p className="text-neutral-500 text-sm">
            Nenhuma matéria encontrada.
          </p>
        )}

        {Object.entries(groupedNews).map(([date, items]: any) => (
          <div key={date} className="space-y-6">
            <h2 className="text-lg font-semibold text-neutral-800 border-b pb-2">
              {date}
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item: any) => (
                <article
                  key={item._id}
                  className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition flex flex-col"
                >
                  <div className="aspect-[16/9] bg-neutral-100 overflow-hidden">
                    <img
                      src={item.image?.url}
                      alt={item.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1 space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 line-clamp-2">
                      {item.titulo}
                    </h3>

                    <p className="text-sm text-neutral-600 line-clamp-3">
                      {item.textOne}
                    </p>

                    <div className="mt-auto flex gap-3 pt-4">
                      <button
                        onClick={() => handlerEdit(item._id)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Atualizar
                      </button>

                      <button
                        onClick={() => openDeleteModal(item._id)}
                        className="flex-1 border border-red-500 text-red-600 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* MODAL CONFIRMAÇÃO */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Confirmar exclusão
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                Tem certeza que deseja deletar esta matéria? Essa ação não pode
                ser desfeita.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsConfirmOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-xl border"
              >
                Cancelar
              </button>

              <button
                onClick={confirmDeletePost}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {isDeleting ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

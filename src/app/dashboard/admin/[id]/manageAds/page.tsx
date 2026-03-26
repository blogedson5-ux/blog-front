"use client";

import axios from "@/lib/axios";
import BackAdminButton from "@/components/BackAdminButton";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Pencil,
  Trash2,
  ExternalLink,
  Images,
  CalendarDays,
  RefreshCw,
  Eye,
} from "lucide-react";

interface AdImage {
  _id: string;
  url: string;
  public_id: string;
}

interface Ad {
  _id: string;
  titulo: string;
  descricao: string;
  link: string;
  images: AdImage[];
  createdAt: string;
  updatedAt: string;
}

export default function ManageAdPage() {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.replace("/manageAds", "");

  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function fetchAd(showRefreshState = false) {
    try {
      if (showRefreshState) setIsRefreshing(true);
      else setIsLoading(true);

      const response = await axios.get("ads/get-ad");

      const result = Array.isArray(response.data)
        ? response.data[0]
        : response.data;

      setAd(result || null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao carregar anúncio");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    fetchAd();
  }, []);

  async function handleDelete() {
    if (!ad) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja deletar o anúncio?",
    );
    if (!confirmed) return;

    try {
      setDeleting(true);

      await axios.delete(`ads/delete-ad/${ad._id}`);

      setAd(null);
      toast.success("Anúncio deletado!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao deletar anúncio");
    } finally {
      setDeleting(false);
    }
  }

  function handleEdit() {
    if (!ad) return;
    router.push(`${basePath}/anuncio?idAd=${ad._id}`);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR");
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <BackAdminButton />
        </div>

        <div className="rounded-[28px] border bg-white shadow p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Gerenciar anúncio</h1>
              <p className="text-sm text-gray-500">
                Visualize, edite ou delete o anúncio atual.
              </p>
            </div>

            <button
              onClick={() => fetchAd(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl"
            >
              <RefreshCw size={16} />
              Atualizar
            </button>
          </div>

          {isLoading ? (
            <p>Carregando...</p>
          ) : !ad ? (
            <p>Nenhum anúncio cadastrado</p>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold">{ad.titulo}</h2>
                <p className="text-gray-600 mt-2">{ad.descricao}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Link</p>
                <a href={ad.link} target="_blank" className="text-blue-600">
                  {ad.link}
                </a>
              </div>

              <div className="grid gap-3">
                {ad.images.map((img, i) => (
                  <div key={img._id}>
                    <img
                      src={img.url}
                      className="w-full rounded-xl aspect-[3/1] object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-black text-white rounded-xl"
                >
                  Editar
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-xl"
                >
                  Deletar
                </button>
              </div>

              <div className="text-sm text-gray-500">
                Criado em: {formatDate(ad.createdAt)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

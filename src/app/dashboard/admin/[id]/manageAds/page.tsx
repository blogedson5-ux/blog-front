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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <BackAdminButton />
        </div>

        <div className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_10px_40px_rgba(14,165,233,0.08)]">
          <div className="border-b border-sky-100 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Gerenciar anúncio
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Visualize, edite ou delete o anúncio atual.
                </p>
              </div>

              <button
                onClick={() => fetchAd(true)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-medium text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                {isRefreshing ? "Atualizando..." : "Atualizar"}
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {isLoading ? (
              <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-6 text-center text-sm text-slate-600">
                Carregando...
              </div>
            ) : !ad ? (
              <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-6 text-center text-sm text-slate-600">
                Nenhum anúncio cadastrado
              </div>
            ) : (
              <div className="space-y-8">
                <div className="rounded-3xl border border-sky-100 bg-sky-50/60 p-5">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-700">
                          <Eye size={14} />
                          Anúncio ativo
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                          {ad.titulo}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                          {ad.descricao}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-sky-100 bg-white px-3 py-2 text-slate-600">
                          <Images size={16} className="text-sky-600" />
                          {ad.images.length} imagem{ad.images.length > 1 ? "ens" : ""}
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-2xl border border-sky-100 bg-white px-3 py-2 text-slate-600">
                          <CalendarDays size={16} className="text-sky-600" />
                          Criado em {formatDate(ad.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Link</p>

                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-sky-700 transition hover:bg-sky-50"
                  >
                    <span className="truncate">{ad.link}</span>
                    <ExternalLink size={16} className="shrink-0" />
                  </a>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Images size={18} className="text-sky-600" />
                    <h3 className="text-lg font-semibold text-slate-900">
                      Imagens do anúncio
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {ad.images.map((img, i) => (
                      <div
                        key={img._id}
                        className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm"
                      >
                        <div className="flex items-center justify-between border-b border-sky-100 bg-sky-50/70 px-4 py-3">
                          <span className="text-sm font-medium text-slate-700">
                            Banner {i + 1}
                          </span>
                          <span className="text-xs text-slate-500">
                            Horizontal
                          </span>
                        </div>

                        <img
                          src={img.url}
                          alt={`Banner ${i + 1}`}
                          className="w-full aspect-[3/1] object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    {deleting ? "Deletando..." : "Deletar"}
                  </button>
                </div>

                <div className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-4 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">Criado em:</span>{" "}
                    {formatDate(ad.createdAt)}
                  </p>
                  <p className="mt-1">
                    <span className="font-medium text-slate-800">
                      Última atualização:
                    </span>{" "}
                    {formatDate(ad.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
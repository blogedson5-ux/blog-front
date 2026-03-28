"use client";

import axios from "@/lib/axios";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  Check,
  ImagePlus,
  RectangleHorizontal,
  Trash2,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";

import { getCroppedImg } from "@/lib/cropImage";
import BackAdminButton from "@/components/BackAdminButton";

type AdForm = {
  titulo: string;
  link: string;
};

type ImageSlot = {
  id: number;
  imageSrc: string | null;
  croppedImage: string | null;
  croppedAreaPixels: Area | null;
  crop: { x: number; y: number };
  zoom: number;
};

const BANNER_PRESET = {
  id: "banner-horizontal",
  label: "Banner Horizontal",
  description: "1280 x 520 • 2.46:1",
  aspect: 1280 / 520,
  width: 1280,
  height: 520,
};
const MAX_IMAGES = 3;

function createEmptyImageSlot(id: number): ImageSlot {
  return {
    id,
    imageSrc: null,
    croppedImage: null,
    croppedAreaPixels: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
  };
}

function extractImageUrl(image: any): string | null {
  if (!image) return null;

  if (typeof image === "string") return image;
  if (typeof image?.url === "string") return image.url;
  if (typeof image?.secure_url === "string") return image.secure_url;
  if (typeof image?.imageUrl === "string") return image.imageUrl;
  if (typeof image?.src === "string") return image.src;

  return null;
}

export default function NewAdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idAd = searchParams.get("idAd");
  const isEditMode = !!idAd;

  const [form, setForm] = useState<AdForm>({
    titulo: "",
    link: "",
  });

  const [errors, setErrors] = useState<Partial<AdForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAd, setIsLoadingAd] = useState(false);

  const [images, setImages] = useState<ImageSlot[]>([createEmptyImageSlot(1)]);

  const pageTitle = useMemo(
    () => (isEditMode ? "Atualizar Anúncio" : "Novo Anúncio"),
    [isEditMode],
  );

  const pageDescription = useMemo(
    () =>
      isEditMode
        ? "Edite os dados do anúncio e salve as alterações."
        : "Cadastre um anúncio com até 3 imagens em formato de banner horizontal.",
    [isEditMode],
  );

  useEffect(() => {
    async function loadAd() {
      if (!idAd) return;

      setIsLoadingAd(true);

      try {
        const response = await axios.get(`ads/get-ad/${idAd}`);
        const ad = response?.data?.ad || response?.data;

        setForm({
          titulo: ad?.titulo || "",
          link: ad?.link || "",
        });

        const rawImages =
          ad?.images || ad?.imagens || ad?.banners || ad?.photos || [];

        const normalizedImages = Array.isArray(rawImages)
          ? rawImages
              .map((img: any, index: number) => {
                const url = extractImageUrl(img);

                if (!url) return null;

                return {
                  id: index + 1,
                  imageSrc: url,
                  croppedImage: url,
                  croppedAreaPixels: null,
                  crop: { x: 0, y: 0 },
                  zoom: 1,
                } as ImageSlot;
              })
              .filter(Boolean)
          : [];

        if (normalizedImages.length > 0) {
          setImages(normalizedImages as ImageSlot[]);
        } else {
          setImages([createEmptyImageSlot(1)]);
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Erro ao carregar anúncio";
        toast.error(message);
      } finally {
        setIsLoadingAd(false);
      }
    }

    loadAd();
  }, [idAd]);

  function validate() {
    const newErrors: Partial<AdForm> = {};

    if (!form.titulo.trim()) newErrors.titulo = "Título é obrigatório";

    const validImages = images.filter((img) => img.croppedImage);

    if (validImages.length === 0) {
      toast.error("Adicione pelo menos 1 imagem de anúncio");
      setErrors(newErrors);
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof AdForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function updateImageSlot(
    id: number,
    updater: (slot: ImageSlot) => ImageSlot,
  ) {
    setImages((prev) =>
      prev.map((slot) => (slot.id === id ? updater(slot) : slot)),
    );
  }

  function onFileChange(file: File, id: number) {
    const reader = new FileReader();

    reader.onload = () => {
      updateImageSlot(id, (slot) => ({
        ...slot,
        imageSrc: reader.result as string,
        croppedImage: null,
        croppedAreaPixels: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
      }));
    };

    reader.readAsDataURL(file);
  }

  function removeImage(id: number) {
    if (images.length === 1) {
      updateImageSlot(id, (slot) => ({
        ...slot,
        imageSrc: null,
        croppedImage: null,
        croppedAreaPixels: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
      }));
      return;
    }

    setImages((prev) => prev.filter((slot) => slot.id !== id));
  }

  function addImageSlot() {
    if (images.length >= MAX_IMAGES) {
      toast.error("Você só pode adicionar no máximo 3 imagens");
      return;
    }

    const nextId = Math.max(...images.map((img) => img.id)) + 1;

    setImages((prev) => [...prev, createEmptyImageSlot(nextId)]);
  }

  async function handleCropConfirm(id: number) {
    const currentImage = images.find((img) => img.id === id);

    if (!currentImage?.imageSrc || !currentImage.croppedAreaPixels) return;

    try {
      const cropped = await getCroppedImg(
        currentImage.imageSrc,
        currentImage.croppedAreaPixels,
        BANNER_PRESET.width,
        BANNER_PRESET.height,
      );

      updateImageSlot(id, (slot) => ({
        ...slot,
        croppedImage: cropped,
      }));

      toast.success("Recorte banner aplicado com sucesso!");
    } catch {
      toast.error("Não foi possível finalizar o recorte da imagem");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);

    const base64ToFile = (base64: string, filename: string) => {
      const arr = base64.split(",");
      const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    };

    const formData = new FormData();
    const existingImages: string[] = [];

    images.forEach((img, index) => {
      if (!img.croppedImage) return;

      if (img.croppedImage.startsWith("data:image")) {
        const imageFile = base64ToFile(
          img.croppedImage,
          `anuncio-banner-${index + 1}.jpg`,
        );

        formData.append("images", imageFile);
      } else {
        existingImages.push(img.croppedImage);
      }
    });

    formData.append("titulo", form.titulo);
    if (form.link) {
      formData.append("link", form.link);
    }
    formData.append("cropPreset", BANNER_PRESET.id);
    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      if (isEditMode && idAd) {
        await axios.put(`ads/update-ad/${idAd}`, formData);
        toast.success("Anúncio atualizado com sucesso!");
      } else {
        await axios.post("ads/create-ad", formData);
        toast.success("Anúncio criado com sucesso!");

        setForm({
          titulo: "",
          link: "",
        });

        setImages([createEmptyImageSlot(1)]);
      }

      router.refresh();
    } catch (error: any) {
      const message = isEditMode
        ? error?.response?.data?.message || "Erro ao atualizar anúncio"
        : error?.response?.data?.message || "Erro ao criar anúncio";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (hasError?: boolean) =>
    `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-gray-200 focus:border-gray-900 focus:ring-4 focus:ring-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-[#f6f7f9] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <BackAdminButton />
        </div>

        <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              {pageTitle}
            </h1>
            <p className="mt-2 text-sm text-gray-500">{pageDescription}</p>
          </div>

          {isLoadingAd ? (
            <div className="p-8">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
                Carregando dados do anúncio...
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="space-y-8 p-6 sm:p-8"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Imagens do anúncio
                  </label>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {images.length}/{MAX_IMAGES} imagens
                    </span>

                    <button
                      type="button"
                      onClick={addImageSlot}
                      disabled={images.length >= MAX_IMAGES}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Upload size={16} />
                      Adicionar imagem
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <RectangleHorizontal size={16} />
                    Formato obrigatório: {BANNER_PRESET.label}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Todas as imagens serão recortadas em {BANNER_PRESET.width} x{" "}
                    {BANNER_PRESET.height}px.
                  </p>
                </div>

                <div className="space-y-6">
                  {images.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Imagem {index + 1}
                          </p>
                          <p className="text-xs text-gray-500">
                            Banner horizontal • proporção 3:1
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeImage(item.id)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Remover
                        </button>
                      </div>

                      {!item.imageSrc && !item.croppedImage && (
                        <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white px-6 text-center transition hover:border-gray-400 hover:bg-gray-50">
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 shadow-sm">
                            <ImagePlus className="text-gray-500" size={24} />
                          </div>

                          <span className="text-sm font-medium text-gray-700">
                            Clique para selecionar a imagem
                          </span>
                          <span className="mt-1 text-xs text-gray-500">
                            Depois ajuste o recorte no formato banner horizontal
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              onFileChange(e.target.files[0], item.id)
                            }
                          />
                        </label>
                      )}

                      {item.imageSrc && !item.croppedImage && (
                        <div className="space-y-5">
                          <div className="relative h-[220px] w-full overflow-hidden rounded-2xl bg-black sm:h-[320px]">
                            <Cropper
                              image={item.imageSrc}
                              crop={item.crop}
                              zoom={item.zoom}
                              aspect={BANNER_PRESET.aspect}
                              onCropChange={(newCrop) =>
                                updateImageSlot(item.id, (slot) => ({
                                  ...slot,
                                  crop: newCrop,
                                }))
                              }
                              onZoomChange={(newZoom) =>
                                updateImageSlot(item.id, (slot) => ({
                                  ...slot,
                                  zoom: newZoom,
                                }))
                              }
                              onCropComplete={(_, pixels) =>
                                updateImageSlot(item.id, (slot) => ({
                                  ...slot,
                                  croppedAreaPixels: pixels,
                                }))
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Zoom
                            </span>
                            <input
                              type="range"
                              min={1}
                              max={3}
                              step={0.1}
                              value={item.zoom}
                              onChange={(e) =>
                                updateImageSlot(item.id, (slot) => ({
                                  ...slot,
                                  zoom: Number(e.target.value),
                                }))
                              }
                              className="w-full accent-gray-900"
                            />
                          </div>

                          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
                            <p className="text-sm font-medium text-gray-900">
                              Formato atual: {BANNER_PRESET.label}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Saída do recorte: {BANNER_PRESET.width} x{" "}
                              {BANNER_PRESET.height}px
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              A imagem será salva somente com o recorte, sem
                              bordas pretas.
                            </p>
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                              type="button"
                              onClick={() => handleCropConfirm(item.id)}
                              className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
                            >
                              Confirmar recorte
                            </button>

                            <button
                              type="button"
                              onClick={() => removeImage(item.id)}
                              className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              Remover imagem
                            </button>
                          </div>
                        </div>
                      )}

                      {item.croppedImage && (
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                              <Check size={14} />
                              Corte aplicado
                            </span>

                            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600">
                              {BANNER_PRESET.width} x {BANNER_PRESET.height}
                            </span>
                          </div>

                          <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
                            <img
                              src={item.croppedImage}
                              alt={`Imagem final ${index + 1}`}
                              className="block h-auto w-full"
                            />
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                              type="button"
                              onClick={() =>
                                updateImageSlot(item.id, (slot) => ({
                                  ...slot,
                                  croppedImage: null,
                                  crop: { x: 0, y: 0 },
                                  zoom: 1,
                                }))
                              }
                              className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
                            >
                              Alterar recorte
                            </button>

                            <button
                              type="button"
                              onClick={() => removeImage(item.id)}
                              className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              Trocar imagem
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Título
                  </label>
                  <input
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    placeholder="Título do anúncio"
                    className={inputClass(!!errors.titulo)}
                  />
                  {errors.titulo && (
                    <p className="text-sm text-red-500">{errors.titulo}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Link de destino
                  </label>
                  <input
                    name="link"
                    value={form.link}
                    onChange={handleChange}
                    placeholder="https://..."
                    className={inputClass()}
                  />
                  {errors.link && (
                    <p className="text-sm text-red-500">{errors.link}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-gray-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Atualizando..."
                      : "Salvando..."
                    : isEditMode
                      ? "Salvar alterações"
                      : "Publicar anúncio"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

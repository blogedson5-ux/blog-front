"use client";

import axios from "@/lib/axios";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import {
  Check,
  Circle,
  Clapperboard,
  ImagePlus,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  type LucideIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import { getCroppedImg } from "@/lib/cropImage";
import { usePost, usePostById } from "@/data/news";
import BackAdminButton from "@/components/BackAdminButton";

type PostForm = {
  titulo: string;
  textOne: string;
  category: string;
  videoUrl: string;
};

type CropPreset = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  aspect: number;
  width: number;
  height: number;
  icon: LucideIcon;
};

const INSTAGRAM_CROP_PRESETS: CropPreset[] = [
  {
    id: "feed-square",
    label: "Feed Quadrado",
    shortLabel: "1:1",
    description: "1080 x 1080 • 1:1",
    aspect: 1 / 1,
    width: 1080,
    height: 1080,
    icon: Square,
  },
  {
    id: "feed-vertical",
    label: "Feed Vertical",
    shortLabel: "4:5",
    description: "1080 x 1350 • 4:5",
    aspect: 4 / 5,
    width: 1080,
    height: 1350,
    icon: RectangleVertical,
  },
  {
    id: "feed-horizontal",
    label: "Feed Horizontal",
    shortLabel: "1.91:1",
    description: "1080 x 566 • 1.91:1",
    aspect: 1.91 / 1,
    width: 1080,
    height: 566,
    icon: RectangleHorizontal,
  },
  {
    id: "stories",
    label: "Stories",
    shortLabel: "9:16",
    description: "1080 x 1920 • 9:16",
    aspect: 9 / 16,
    width: 1080,
    height: 1920,
    icon: RectangleVertical,
  },
  {
    id: "reels",
    label: "Reels",
    shortLabel: "9:16",
    description: "1080 x 1920 • 9:16",
    aspect: 9 / 16,
    width: 1080,
    height: 1920,
    icon: Clapperboard,
  },
  {
    id: "profile",
    label: "Perfil",
    shortLabel: "1:1",
    description: "320 x 320 • 1:1",
    aspect: 1 / 1,
    width: 320,
    height: 320,
    icon: Circle,
  },
];

export default function NewPostPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const idPost = searchParams.get("idPost");

  const { data: news } = usePostById(idPost);
  const { data: allPosts } = usePost();

  const [form, setForm] = useState<PostForm>({
    titulo: "",
    textOne: "",
    category: "",
    videoUrl: "",
  });

  const [errors, setErrors] = useState<Partial<PostForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [selectedCropPresetId, setSelectedCropPresetId] =
    useState<string>("feed-vertical");

  const selectedCropPreset = useMemo(() => {
    return (
      INSTAGRAM_CROP_PRESETS.find(
        (preset) => preset.id === selectedCropPresetId,
      ) || INSTAGRAM_CROP_PRESETS[1]
    );
  }, [selectedCropPresetId]);

  const categories = useMemo(() => {
    if (!allPosts || !Array.isArray(allPosts)) return [];

    const uniqueCategories = allPosts
      .map((item: any) => item.category?.trim())
      .filter((category: string | undefined): category is string =>
        Boolean(category && category.length > 0),
      );

    return [...new Set(uniqueCategories)].sort((a, b) => a.localeCompare(b));
  }, [allPosts]);

  useEffect(() => {
    if (!idPost || !news) return;

    setForm({
      titulo: news.titulo ?? "",
      textOne: news.textOne ?? "",
      category: news.category ?? "",
      videoUrl: news.videoUrl ?? "",
    });

    setCroppedImage(news.image?.url ?? null);
  }, [idPost, news]);

  function validate() {
    const newErrors: Partial<PostForm> = {};

    if (!form.titulo.trim()) newErrors.titulo = "Título é obrigatório";
    if (!form.textOne.trim()) {
      newErrors.textOne = "Primeiro texto é obrigatório";
    }
    if (!form.category.trim()) {
      newErrors.category = "Categoria é obrigatória";
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

    if (errors[name as keyof PostForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      category: value,
    }));

    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  }

  const filteredCategories = useMemo(() => {
    const term = form.category.trim().toLowerCase();

    if (!term) return categories;

    return categories.filter((category) =>
      category.toLowerCase().includes(term),
    );
  }, [categories, form.category]);

  function handleSelectCategory(category: string) {
    setForm((prev) => ({
      ...prev,
      category,
    }));

    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  }

  function onFileChange(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCroppedImage(null);
      setCroppedAreaPixels(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setSelectedCropPresetId("feed-vertical");
    };

    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageSrc(null);
    setCroppedImage(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setSelectedCropPresetId("feed-vertical");
  }

  function handleSelectCropPreset(presetId: string) {
    setSelectedCropPresetId(presetId);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setCroppedImage(null);
  }

  async function handleCropConfirm() {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const cropped = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        selectedCropPreset.width,
        selectedCropPreset.height,
      );

      setCroppedImage(cropped);
      toast.success(`Recorte ${selectedCropPreset.label} aplicado!`);
    } catch {
      toast.error("Não foi possível finalizar o recorte da imagem");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const isEdit = Boolean(idPost);

    if (!validate()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!isEdit && !croppedImage) {
      toast.error("Selecione e corte uma imagem");
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

    if (croppedImage && croppedImage.startsWith("data:image")) {
      const imageFile = base64ToFile(
        croppedImage,
        `post-image-${selectedCropPreset.id}.jpg`,
      );
      formData.append("image", imageFile);
    }

    formData.append("titulo", form.titulo);
    formData.append("textOne", form.textOne);
    formData.append("category", form.category);
    formData.append("videoUrl", form.videoUrl);
    formData.append("cropPreset", selectedCropPreset.id);

    try {
      if (isEdit) {
        await axios.put(`post/update-post/${idPost}`, formData);
        toast.success("Post atualizado com sucesso!");
        router.replace(pathname.replace("/posts/new", "/noticias"));
      } else {
        await axios.post("post/create-post", formData);
        toast.success("Post criado com sucesso!");
        setForm({ titulo: "", textOne: "", category: "", videoUrl: "" });
        removeImage();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao criar postagem";
      toast.error(message);
      console.log(message, "teste");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (hasError?: boolean) =>
    `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-sky-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <BackAdminButton />
        </div>

        <div className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_10px_40px_rgba(14,165,233,0.08)]">
          <div className="border-b border-sky-100 px-6 py-6 sm:px-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {idPost ? "Editar Post" : "Novo Post"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Preencha os dados da postagem de forma simples e organizada.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className="space-y-8 p-6 sm:p-8"
          >
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Imagem de destaque
              </label>

              {!imageSrc && !croppedImage && (
                <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-sky-200 bg-sky-50/60 px-6 text-center transition hover:border-sky-400 hover:bg-sky-50">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <ImagePlus className="text-sky-600" size={24} />
                  </div>

                  <span className="text-sm font-medium text-slate-700">
                    Clique para selecionar uma imagem
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    Escolha a imagem e depois selecione o formato de corte do
                    Instagram
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      e.target.files?.[0] && onFileChange(e.target.files[0])
                    }
                  />
                </label>
              )}
            </div>

            {imageSrc && !croppedImage && (
              <div className="space-y-5 rounded-3xl border border-sky-100 bg-sky-50/60 p-4 sm:p-5">
                <div className="relative h-[260px] w-full overflow-hidden rounded-2xl bg-black sm:h-[380px]">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={selectedCropPreset.aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Formatos de corte do Instagram
                      </p>
                      <p className="text-xs text-slate-500">
                        No celular, deslize para o lado para ver todos os
                        formatos
                      </p>
                    </div>

                    <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-sky-700 shadow-sm border border-sky-100">
                      Selecionado: {selectedCropPreset.label}
                    </div>
                  </div>

                  <div className="-mx-1 overflow-x-auto pb-1 sm:mx-0 sm:overflow-visible">
                    <div className="flex gap-3 px-1 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
                      {INSTAGRAM_CROP_PRESETS.map((preset) => {
                        const Icon = preset.icon;
                        const isSelected = selectedCropPreset.id === preset.id;

                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectCropPreset(preset.id)}
                            className={`relative flex min-w-[92px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-center transition-all sm:min-w-0 sm:flex-row sm:items-center sm:justify-start sm:gap-3 sm:px-4 sm:text-left ${
                              isSelected
                                ? "border-sky-500 bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg"
                                : "border-sky-100 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50"
                            }`}
                          >
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                                isSelected
                                  ? "border-white/20 bg-white/10"
                                  : "border-sky-100 bg-sky-50"
                              }`}
                            >
                              <Icon
                                size={20}
                                className={
                                  isSelected ? "text-white" : "text-sky-700"
                                }
                              />
                            </div>

                            <div className="sm:hidden">
                              <p
                                className={`text-[11px] font-semibold leading-none ${
                                  isSelected ? "text-white" : "text-slate-700"
                                }`}
                              >
                                {preset.shortLabel}
                              </p>
                            </div>

                            <div className="hidden min-w-0 sm:block">
                              <p className="truncate text-sm font-semibold">
                                {preset.label}
                              </p>
                              <p
                                className={`text-xs ${
                                  isSelected ? "text-white/85" : "text-slate-500"
                                }`}
                              >
                                {preset.description}
                              </p>
                            </div>

                            {isSelected && (
                              <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-sky-700 sm:right-3 sm:top-3">
                                <Check size={13} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Zoom
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">
                    Formato atual: {selectedCropPreset.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Saída do recorte: {selectedCropPreset.width} x{" "}
                    {selectedCropPreset.height}px
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    A imagem será salva somente com o recorte, sem bordas
                    pretas.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCropConfirm}
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Confirmar recorte
                  </button>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="inline-flex items-center justify-center rounded-2xl border border-sky-100 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
                  >
                    Remover imagem
                  </button>
                </div>
              </div>
            )}

            {croppedImage && (
              <div className="space-y-4 rounded-3xl border border-sky-100 bg-sky-50/60 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    <Check size={14} />
                    Corte selecionado: {selectedCropPreset.label}
                  </span>

                  <span className="rounded-full border border-sky-100 bg-white px-3 py-1 text-xs font-medium text-sky-700">
                    {selectedCropPreset.width} x {selectedCropPreset.height}
                  </span>
                </div>

                <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-sky-100 bg-white">
                  <img
                    src={croppedImage}
                    alt="Imagem final"
                    className="block h-auto w-full"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setCroppedImage(null);
                      setCrop({ x: 0, y: 0 });
                      setZoom(1);
                    }}
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Alterar recorte
                  </button>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="inline-flex items-center justify-center rounded-2xl border border-sky-100 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50"
                  >
                    Trocar imagem
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Título
                </label>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Título"
                  className={inputClass(!!errors.titulo)}
                />
                {errors.titulo && (
                  <p className="text-sm text-red-500">{errors.titulo}</p>
                )}
              </div>

              <div className="relative space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Categoria
                </label>

                <input
                  name="post-category"
                  autoComplete="new-password"
                  autoCorrect="off"
                  spellCheck={false}
                  value={form.category}
                  onChange={handleCategoryChange}
                  onFocus={() => setIsCategoryOpen(true)}
                  onBlur={() => {
                    setTimeout(() => setIsCategoryOpen(false), 150);
                  }}
                  placeholder="Categoria"
                  className={`w-full rounded-2xl border bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition-all ${
                    errors.category
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-sky-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  }`}
                />

                <span className="pointer-events-none absolute right-4 top-[52px] text-sm text-slate-400">
                  ▼
                </span>

                {isCategoryOpen && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-2xl border border-sky-100 bg-white p-1 shadow-xl shadow-sky-100/50">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            handleSelectCategory(category);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                            form.category === category
                              ? "bg-sky-100 font-medium text-sky-700"
                              : "text-slate-700 hover:bg-sky-50"
                          }`}
                        >
                          {category}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-sm text-slate-500">
                        Nenhuma categoria encontrada. Você pode cadastrar uma
                        nova.
                      </div>
                    )}
                  </div>
                )}

                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Conteúdo inicial
                </label>
                <textarea
                  name="textOne"
                  value={form.textOne}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Primeiro texto"
                  className={inputClass(!!errors.textOne)}
                />
                {errors.textOne && (
                  <p className="text-sm text-red-500">{errors.textOne}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  URL do vídeo (Instagram ou TikTok)
                </label>
                <input
                  name="videoUrl"
                  value={form.videoUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClass()}
                />
                <p className="text-xs text-slate-500">
                  Cole o link do vídeo. A prévia será exibida após o cadastro.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Salvando..."
                  : idPost
                    ? "Atualizar"
                    : "Publicar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
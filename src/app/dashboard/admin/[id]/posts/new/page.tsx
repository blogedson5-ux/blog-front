"use client";

import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Cropper from "react-easy-crop";
import { ImagePlus } from "lucide-react";
import toast from "react-hot-toast";

import { getCroppedImg } from "@/lib/cropImage";
import { usePostById } from "@/data/news";
import BackAdminButton from "@/components/BackAdminButton";

type PostForm = {
  titulo: string;
  textOne: string;
  textTwo: string;
};

export default function NewPostPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const idPost = searchParams.get("idPost");

  const { data: news } = usePostById(idPost);

  const [form, setForm] = useState<PostForm>({
    titulo: "",
    textOne: "",
    textTwo: "",
  });

  const [errors, setErrors] = useState<Partial<PostForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!idPost || !news) return;

    setForm({
      titulo: news.titulo ?? "",
      textOne: news.textOne ?? "",
      textTwo: news.textTwo ?? "",
    });

    setCroppedImage(news.image.url);
  }, [idPost, news]);

  function validate() {
    const newErrors: Partial<PostForm> = {};

    if (!form.titulo.trim()) newErrors.titulo = "Título é obrigatório";
    if (!form.textOne.trim())
      newErrors.textOne = "Primeiro texto é obrigatório";
    if (!form.textTwo.trim()) newErrors.textTwo = "Segundo texto é obrigatório";

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

  function onFileChange(file: File) {
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCroppedImage(null);
      setCroppedAreaPixels(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };

    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageSrc(null);
    setCroppedImage(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }

  async function handleCropConfirm() {
    if (!imageSrc || !croppedAreaPixels) return;

    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, 1200, 630);
    setCroppedImage(cropped);
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
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new File([u8arr], filename, { type: mime });
    };

    const formData = new FormData();

    if (croppedImage && croppedImage.startsWith("data:image")) {
      const imageFile = base64ToFile(croppedImage, "post-image.jpg");
      formData.append("image", imageFile);
    }

    formData.append("titulo", form.titulo);
    formData.append("textOne", form.textOne);
    formData.append("textTwo", form.textTwo);

    try {
      if (isEdit) {
        await axios.put(`post/update-post/${idPost}`, formData);
        toast.success("Post atualizado com sucesso!");
        router.replace(pathname.replace("/posts/new", "/noticias"));
      } else {
        await axios.post("post/create-post", formData);
        toast.success("Post criado com sucesso!");
        setForm({ titulo: "", textOne: "", textTwo: "" });
        removeImage();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao criar postagem";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-10">
      {/* BOTÃO VOLTAR FIXO */}
      <div className="fixed top-4 left-4 z-50">
        <BackAdminButton />
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-2xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
          {idPost ? "Editar Post" : "Novo Post"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Upload */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Imagem de destaque
            </label>

            {!imageSrc && (
              <label className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                <ImagePlus className="text-gray-400 mb-3" size={40} />
                <span className="text-sm text-gray-500 text-center">
                  Clique para selecionar a imagem
                </span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    e.target.files && onFileChange(e.target.files[0])
                  }
                />
              </label>
            )}
          </div>

          {/* Cropper */}
          {imageSrc && !croppedImage && (
            <div className="space-y-4">
              <div className="relative w-full h-[250px] sm:h-[350px] bg-black rounded-lg overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1200 / 630}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                />
              </div>

              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleCropConfirm}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-900 text-white"
                >
                  Confirmar recorte
                </button>

                <button
                  type="button"
                  onClick={removeImage}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border"
                >
                  Remover imagem
                </button>
              </div>
            </div>
          )}

          {/* Preview */}
          {croppedImage && (
            <div className="space-y-3">
              <img
                src={croppedImage}
                alt="Imagem final"
                className="rounded-lg border w-full"
              />
              <button
                type="button"
                onClick={removeImage}
                className="px-4 py-2 rounded-lg border"
              >
                Trocar imagem
              </button>
            </div>
          )}

          {/* Inputs */}
          <div>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Título"
              className={`w-full border rounded-lg px-3 py-3 ${
                errors.titulo ? "border-red-500" : ""
              }`}
            />
            {errors.titulo && (
              <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
            )}
          </div>

          <div>
            <textarea
              name="textOne"
              value={form.textOne}
              onChange={handleChange}
              rows={4}
              placeholder="Primeiro texto"
              className={`w-full border rounded-lg px-3 py-3 ${
                errors.textOne ? "border-red-500" : ""
              }`}
            />
            {errors.textOne && (
              <p className="text-red-500 text-sm mt-1">{errors.textOne}</p>
            )}
          </div>

          <div>
            <textarea
              name="textTwo"
              value={form.textTwo}
              onChange={handleChange}
              rows={4}
              placeholder="Segundo texto"
              className={`w-full border rounded-lg px-3 py-3 ${
                errors.textTwo ? "border-red-500" : ""
              }`}
            />
            {errors.textTwo && (
              <p className="text-red-500 text-sm mt-1">{errors.textTwo}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : idPost ? "Atualizar" : "Publicar"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import axios from "@/lib/axios";
import Cropper from "react-easy-crop";
import router, {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { getCroppedImg } from "@/services/cropImage";

import {
  Container,
  Form,
  UploadCard,
  ImagePreview,
  RemoveImageButton,
  Field,
  Button,
} from "./styles";

export default function ProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const searchParams = useSearchParams();
  const { id } = useParams();
  const router = useRouter();

  const productId = searchParams.get("id");
  const isEditing = Boolean(productId);

  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    priceUnit: 0,
    priceWholesale: 0,
  });

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const parseBRLToNumber = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    return Number(numeric) / 100;
  };

  const parseBRL = (value: string) => {
    return value.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
  };

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setIsCropping(true);
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setImageFile(null);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "priceUnit" || name === "priceWholesale") {
      setForm((prev) => ({
        ...prev,
        [name]: parseBRLToNumber(value),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isEditing && !imageFile) {
      alert("Selecione e corte uma imagem");
      return;
    }

    try {
      const formData = new FormData();

      if (imageFile) {
        formData.append("image", imageFile);
      }

      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("priceUnit", String(form.priceUnit));
      formData.append("priceWholesale", String(form.priceWholesale));

      const url = isEditing
        ? `/product/update-product/${productId}`
        : "/product/create-product";

      const method = isEditing ? "put" : "post";

      await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(
        isEditing
          ? "Produto atualizado com sucesso!"
          : "Produto cadastrado com sucesso!",
      );

      router.push(`/dashboard/admin/${id}`);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar produto");
    }
  }

  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      try {
        const { data } = await axios.get(`/product/get-product/${productId}`);

        setForm({
          name: data.name,
          category: data.category,
          priceUnit: data.priceUnit,
          priceWholesale: data.priceWholesale,
        });

        setImagePreview(data.image.url);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar produto");
      }
    }

    loadProduct();
  }, [productId]);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        {!imagePreview ? (
          <UploadCard>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <span>Adicionar foto do produto</span>
            <small>Toque para escolher uma imagem</small>
          </UploadCard>
        ) : (
          <ImagePreview>
            <img src={imagePreview} alt="Prévia do produto" />
            <RemoveImageButton type="button" onClick={handleRemoveImage}>
              Remover imagem
            </RemoveImageButton>
          </ImagePreview>
        )}

        <Field>
          <label>Nome do produto</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </Field>

        <Field>
          <label>Categoria</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </Field>

        <Field>
          <label>Valor unitário</label>
          <input
            type="text"
            name="priceUnit"
            value={formatBRL(form.priceUnit)}
            onChange={handleChange}
            placeholder="R$ 0,00"
          />
        </Field>

        <Field>
          <label>Valor em atacado</label>
          <input
            type="text"
            name="priceWholesale"
            value={formatBRL(form.priceWholesale)}
            onChange={handleChange}
            placeholder="R$ 0,00"
          />
        </Field>

        <Button type="submit">
          {isEditing ? "Atualizar produto" : "Cadastrar produto"}
        </Button>
      </Form>

      {/* MODAL DE CORTE */}
      {isCropping && imagePreview && (
        <div className="cropper-overlay">
          <div className="cropper-container">
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
            />

            <div className="cropper-actions">
              <button
                type="button"
                onClick={async () => {
                  const croppedFile = await getCroppedImg(
                    imagePreview,
                    croppedAreaPixels,
                  );

                  setImageFile(croppedFile);
                  setImagePreview(URL.createObjectURL(croppedFile));
                  setIsCropping(false);
                }}
              >
                Confirmar
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCropping(false);
                  setImagePreview(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

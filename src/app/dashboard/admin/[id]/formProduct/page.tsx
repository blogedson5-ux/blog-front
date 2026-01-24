"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "@/lib/axios";
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
  const [form, setForm] = useState({
    name: "",
    category: "",
    priceUnit: "",
    priceWholesale: "",
  });

  console.log(imageFile)

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setImageFile(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      alert("Selecione uma imagem do produto");
      return;
    }

    try {
      const formData = new FormData();

      // imagem
      formData.append("image", imageFile);

      // campos do formulário
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("priceUnit", form.priceUnit);
      formData.append("priceWholesale", form.priceWholesale);

      await axios.post("/product/create-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Produto cadastrado com sucesso!");

      setForm({
        name: "",
        category: "",
        priceUnit: "",
        priceWholesale: "",
      });

      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar produto");
    }
  }

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
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <label>Categoria</label>
          <input
            type="text"
            name="category"
            id="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <label>Valor unitário</label>
          <input
            type="number"
            name="priceUnit"
            id="priceUnit"
            step="0.01"
            value={form.priceUnit}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <label>Valor em atacado</label>
          <input
            type="number"
            name="priceWholesale"
            id="priceWholesale"
            step="0.01"
            value={form.priceWholesale}
            onChange={handleChange}
            required
          />
        </Field>

        <Button type="submit">Cadastrar produto</Button>
      </Form>
    </Container>
  );
}

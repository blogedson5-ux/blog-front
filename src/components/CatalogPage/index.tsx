"use client";

import axios from "@/lib/axios";
import styled from "styled-components";
import { useMemo, useState, useRef, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { PropsProduct } from "@/types/product";

import ProductList from "../ProductList";

import { FiArrowLeft } from "react-icons/fi";

/* ================== STYLES ================== */

const Page = styled.main`
  min-height: 100vh;
  padding: 24px 16px 60px;
`;

const TopBar = styled.div`
  max-width: 700px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;

  &:hover {
    color: #f97316;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: #d97745;
  color: #fff;
  cursor: pointer;
`;

const SearchInput = styled.input`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 220px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;

  &:focus {
    outline: none;
    border-color: #d97745;
  }
`;

const CategorySection = styled.section`
  margin-bottom: 56px;
`;

const CategoryTitle = styled.h2`
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 24px;
`;

const EmptyState = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f97316;
  font-size: 1.6rem;
  font-weight: 700;
`;

/* ================== MODAL ================== */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #111827;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 320px;
  color: #fff;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #dc2626;
  color: #fff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const UpdateButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #f97316;
  color: #fff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

/* ================== PAGE ================== */

type Props = {
  products?: PropsProduct[];
  adm?: string;
};

export default function CatalogPage({ products, adm }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  console.log(pathname);

  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedProduct, setSelectedProduct] = useState<PropsProduct | null>(
    null,
  );

  useEffect(() => {
    if (openSearch) inputRef.current?.focus();
  }, [openSearch]);

  const productsByCategory = useMemo(() => {
    if (!products) return {};

    return products
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .reduce(
        (acc, product) => {
          const category = product.category || "Outros";
          acc[category] = acc[category] || [];
          acc[category].push(product);
          return acc;
        },
        {} as Record<string, PropsProduct[]>,
      );
  }, [products, search]);

  const hasResults = Object.values(productsByCategory).some(
    (items) => items.length > 0,
  );

  const handleDelete = async (deleteId: string) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este produto?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`product/delete-product/${deleteId}`);

      alert("Produto excluído com sucesso!");

      // atualizar lista ou redirecionar
      router.refresh(); // App Router
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir produto");
    }
  };

  const handleUpdate = (product: PropsProduct) => {
    router.push(`${pathname}/formProduct?id=${product._id}`);
  };

  return (
    <Page>
      <TopBar>
        {adm === "admin" ? (
          <div style={{ width: 90 }} />
        ) : (
          <BackButton onClick={() => router.push("/")}>
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>
        )}

        <SearchWrapper>
          <SearchButton onClick={() => setOpenSearch((p) => !p)}>
            🔍
          </SearchButton>

          {openSearch && (
            <SearchInput
              ref={inputRef}
              placeholder="Buscar produto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => !search && setOpenSearch(false)}
            />
          )}
        </SearchWrapper>
      </TopBar>

      {!hasResults && search && (
        <EmptyState>Produto não existente no catálogo!</EmptyState>
      )}

      {hasResults &&
        Object.entries(productsByCategory).map(([category, items]) => (
          <CategorySection key={category}>
            <CategoryTitle>{category}</CategoryTitle>

            <ProductList
              products={items}
              isAdmin={adm === "admin"}
              onSelect={setSelectedProduct}
            />
          </CategorySection>
        ))}

      {selectedProduct && (
        <ModalOverlay onClick={() => setSelectedProduct(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{selectedProduct.name}</h3>

            <ModalActions>
              <DeleteButton onClick={() => handleDelete(selectedProduct._id)}>
                Deletar
              </DeleteButton>

              <UpdateButton onClick={() => handleUpdate(selectedProduct)}>
                Atualizar
              </UpdateButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Page>
  );
}

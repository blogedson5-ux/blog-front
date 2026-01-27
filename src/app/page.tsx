"use client";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/hooks/useClient";

import { Header } from "@/components/Header";
import { Banner } from "@/components/Banner";
import { Section } from "@/components/Section";
import { ProductGrid } from "@/components/ProductGrid";
import { PropsProduct } from "@/types/product";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

export default function Home() {
  const { data: dataProduct } = useQuery<PropsProduct[]>({
    queryKey: ["Product"],
    queryFn: getProduct,
  });

  return (
    <>
      <Header />
      <Banner />
      <Section title="Todos os Bonés" />
      <ProductGrid dataProduct={dataProduct} />

      <WhatsAppFloatingButton
        phone="5583998033753"
        message="Olá! Vim pelo site e gostaria de saber mais."
      />
    </>
  );
}

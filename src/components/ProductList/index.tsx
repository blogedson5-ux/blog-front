"use client";

import { PropsProduct } from "@/types/product";
import {
  Title,
  Prices,
  Card,
  DecorationBottom,
  DecorationTop,
  ImageBox,
  PriceGroup,
  PriceLabel,
  PriceValue,
  ProductImage,
  List,
  GlobalStyles,
} from "./styles";
import style from "styled-jsx/style";

type Props = {
  products: PropsProduct[] | undefined;
  isAdmin: boolean;
  onSelect?: (product: PropsProduct) => void;
};

export default function ProductList({ products, isAdmin, onSelect }: Props) {
  return (
    <>
      <GlobalStyles />
      <List>
        {products?.map((item) => {
          const Wrapper = isAdmin ? "button" : "div";

          return (
            <Wrapper
              key={item._id}
              onClick={isAdmin ? () => onSelect?.(item) : undefined}
              style={{
                all: "unset",
                width: "100%",
                cursor: isAdmin ? "pointer" : "default",
              }}
            >
              <Card>
                <DecorationTop />
                <DecorationBottom />

                <ImageBox>
                  <ProductImage
                    src={item.image.url}
                    alt={item.image.filename}
                    width={1000}
                    height={1000}
                  />
                </ImageBox>

                <Title>{item.name}</Title>

                <Prices>
                  <PriceGroup>
                    <PriceLabel>Unidade:</PriceLabel>
                    <PriceValue>R$ {item.priceUnit}</PriceValue>
                  </PriceGroup>

                  <PriceGroup>
                    <PriceLabel>Atacado:</PriceLabel>
                    <PriceValue>R$ {item.priceWholesale}</PriceValue>
                  </PriceGroup>
                </Prices>
              </Card>
            </Wrapper>
          );
        })}
      </List>
    </>
  );
}

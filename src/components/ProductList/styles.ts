import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    background: #5D5D5D;
  }
`;

export const List = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* Card base */
export const Card = styled.article`
  position: relative;

  width: 100%;

  max-width: 700px;
  height: 80vh;
  max-height: 820px;

  background: #ffffff;
  border-radius: 20px;
  padding: 36px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 48px;

  /* Sombreamento */
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.08),
    0 40px 80px rgba(0, 0, 0, 0.12);
`;

/* Imagem */
export const ImageBox = styled.div`
  width: 80%;

  display: flex;
  justify-content: baseline;

  overflow: hidden;
`;

export const ProductImage = styled.img`
  max-width: 100%;
  object-fit: contain;
  border-radius: 20px;
  border: 2px solid #e5e7eb;
`;

/* Título */
export const Title = styled.h2`
  margin-top: 22px;
  font-size: 1.6rem;
  font-weight: 700;
  color: #111827;
`;

/* Preços */
export const Prices = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`;

export const PriceGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const PriceLabel = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
`;

export const PriceValue = styled.div`
  color: #ffffff;
  padding: 10px 30px;
  background: #d97745;
  border-radius: 6px;
  font-weight: 700;
  font-size: 1.2rem;
  min-width: 100px;
  text-align: center;
`;

/* 🎨 Decorações (bolinhas) */
export const DecorationTop = styled.div`
  position: absolute;
  top: 20px;
  right: 15px;
  width: 50px;
  height: 50px;
  background: #d97745;
  border-radius: 50%;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: #d97745;
    border-radius: 50%;
  }

  &::before {
    width: 29px;
    height: 29px;
    top: 40px;
    right: 50px;
  }

  &::after {
    width: 30px;
    height: 30px;
    top: 60px;
    right: 0;
  }
`;

export const DecorationBottom = styled.div`
  position: absolute;
  bottom: 26px;
  left: 24px;
  width: 28px;
  height: 28px;
  background: #d97745;
  border-radius: 50%;

  &::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    background: #d97745;
    border-radius: 50%;
    left: 34px;
    bottom: 4px;
  }
`;

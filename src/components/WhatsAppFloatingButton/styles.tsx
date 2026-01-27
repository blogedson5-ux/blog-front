"use client";
import styled from "styled-components";

export const Container = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;

  width: 56px;
  height: 56px;

  background-color: #25d366;
  color: #fff;

  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  z-index: 9999;

  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.08);
    background-color: #1ebe5d;
  }

  svg {
    margin-left: 1px; /* ajuste fino visual */
  }
`;

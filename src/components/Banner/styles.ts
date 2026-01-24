"use client"
import styled from 'styled-components';

export const Container = styled.section`
  width: 100%;
  height: 220px;
  margin: 24px 0;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  text-align: center;
  padding: 0 20px;

  span {
    font-size: 0.85rem;
    color: #6b7280;
  }

  strong {
    display: block;
    margin-top: 8px;
    font-size: 1.8rem;
    line-height: 1.2;
    color: #111827;
  }
`;

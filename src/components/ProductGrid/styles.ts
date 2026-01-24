"use client"
import styled from 'styled-components';

export const Grid = styled.section`
  padding: 0 20px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const Card = styled.div`
  background: #f3f4f6;
  border-radius: 10px;
  padding: 12px;

  .image {
    width: 100%;
    height: 120px;
    background: #d1d5db;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 0.9rem;
    margin-bottom: 4px;
    color: #111827;
  }

  span {
    font-size: 0.75rem;
    color: #6b7280;
  }
`;

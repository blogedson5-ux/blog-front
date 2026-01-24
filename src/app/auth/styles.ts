import styled from "styled-components";

export const Container = styled.section`
  min-height: 100vh;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  h2 {
    font-size: 25px;
  }
`;

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;

  display: flex;
  align-items: center;
  gap: 6px;

  background: transparent;
  border: none;
  color: #111827;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: #f97316;
  }
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;

  label {
    margin-bottom: 6px;
    font-size: 0.9rem;
    color: #111827;
  }

  input {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #d1d5db;

    &:focus {
      border-color: #f97316;
      box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
      outline: none;
    }
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #f97316;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #ea580c;
  }
`;

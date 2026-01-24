import styled from "styled-components";

export const Container = styled.section`
  padding: 16px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const UploadCard = styled.label`
  height: 180px;
  border: 2px dashed #fb923c;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  background: #fff7ed;

  span {
    font-weight: 600;
    color: #9a3412;
  }

  small {
    font-size: 0.8rem;
    color: #7c2d12;
  }

  input {
    display: none;
  }
`;

export const ImagePreview = styled.div`
  position: relative;
  height: 220px;
  border-radius: 14px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const RemoveImageButton = styled.button`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.8rem;
  cursor: pointer;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.9rem;
    font-weight: 500;
  }

  input {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 0.95rem;

    &:focus {
      border-color: #fb923c;
      outline: none;
      box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.25);
    }
  }
`;

export const Button = styled.button`
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: #f97316;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
`;

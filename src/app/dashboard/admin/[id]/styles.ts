import styled from "styled-components";

export const Wrapper = styled.div``;

export const MenuButton = styled.button`
  display: flex;
  justify-content: space-between;

  background: transparent;
  border: none;
  color: #111827;
  cursor: pointer;

  position: relative;
  top: 1.5rem;
`;

export const MenuToggleButton = styled.button`
  display: flex;
  justify-content: space-between;

  background: transparent;
  border: none;
  color: #111827;
  cursor: pointer;

  position: relative;
  top: 2rem;
  left: 1.5rem;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 10;
`;

export const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 260px;
  background: #ffffff;
  padding: 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(-100%)"};

  transition: transform 0.3s ease;
  z-index: 20;
`;

export const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 24px;
`;

export const CompanyName = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
`;

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;

  background: #f97316;
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: 8px;

  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;

  background: transparent;
  border: none;
  color: #ef4444;

  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
`;

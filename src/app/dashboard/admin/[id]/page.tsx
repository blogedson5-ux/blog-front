"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { FiMenu, FiX, FiLogOut, FiPlus } from "react-icons/fi";

import {
  Wrapper,
  MenuButton,
  Overlay,
  SidebarContainer,
  CompanyName,
  MenuContent,
  MenuItem,
  LogoutButton,
  MenuToggleButton,
} from "./styles";
import { destroyCookie } from "nookies";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    destroyCookie(null, "nextauth.token", { path: "/" });
    destroyCookie(null, "nextauth.userId", { path: "/" });

    router.push("/");
  };

  return (
    <Wrapper>
      <MenuToggleButton onClick={() => setIsOpen(true)}>
        <FiMenu size={28} />
      </MenuToggleButton>

      {isOpen && <Overlay onClick={() => setIsOpen(false)} />}

      <SidebarContainer $isOpen={isOpen}>
        <MenuButton onClick={() => setIsOpen(false)}>
          <CompanyName>Simoes Bone</CompanyName>
          <FiX size={22} />
        </MenuButton>

        <MenuContent>
          <MenuItem onClick={() => router.push(`${pathname}/formProduct`)}>
            <FiPlus size={18} />
            Cadastrar Produto
          </MenuItem>
        </MenuContent>

        <LogoutButton>
          <FiLogOut size={18} onClick={logout} />
          Sair
        </LogoutButton>
      </SidebarContainer>
    </Wrapper>
  );
}

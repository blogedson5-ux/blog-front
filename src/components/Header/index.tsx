"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import BackAdminButton from "../BackAdminButton";

export function Header() {
  const router = useRouter();

  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies["nextauth.userId"];

    setHasToken(!!token);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center"
          aria-label="Ir para a página inicial"
        >
          <Image
            src="https://res.cloudinary.com/dybjtiyiv/image/upload/v1774805428/ChatGPT_Image_29_de_mar._de_2026_14_24_34_hmvsxp.png"
            alt="Logo"
            width={90}
            height={28}
            priority
            className="object-contain"
          />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Redes sociais */}
          <div className="flex items-center gap-1.5 mr-1 text-blue-400">
            <a
              href="https://www.instagram.com/edson_fherreyra2ct/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-blue-50 transition"
              aria-label="Instagram"
            >
              <FaInstagram size={18} />
            </a>

            <a
              href="https://wa.me/558381686623"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-blue-50 transition"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={18} />
            </a>

            <a
              href="https://www.tiktok.com/@edson_fherreya2ct?_r=1&_t=ZS-93nEcin1nPd&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnpLrcJAtctl0lZRL_GeEIgxIdZCSLVSp2nN8-L_VbolAh3IgahUvl6n56fHk_aem_ELBI1Zbzhb642pbmCuzZtg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-blue-50 transition"
              aria-label="TikTok"
            >
              <FaTiktok size={18} />
            </a>
          </div>

          {/* Login / Admin */}
          {hasToken ? (
            <BackAdminButton />
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="p-2 rounded-full text-blue-400 hover:bg-blue-50 transition"
              aria-label="Entrar"
            >
              <User size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

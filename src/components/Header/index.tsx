"use client";

import { Search, Menu, LogIn } from "lucide-react";
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

    if (token) {
      setHasToken(true);
    } else {
      setHasToken(false);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="text-lg font-bold text-gray-900"
        >
          Blog Edson
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Buscar"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Search size={20} />
          </button>

          {/* Sign In */}
          {hasToken ? (
            <BackAdminButton />
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Entrar"
            >
              <LogIn size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

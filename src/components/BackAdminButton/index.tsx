"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { parseCookies } from "nookies";

export default function BackAdminButton() {
  const router = useRouter();

  const cookies = parseCookies();

  const userId = cookies["nextauth.userId"];

  return (
    <button
      onClick={() => router.push(`/dashboard/admin/${userId}`)}
      aria-label="Voltar para painel administrativo"
      title="Voltar para painel administrativo"
      className="
        group
        inline-flex
        items-center
        gap-2
        px-4
        py-2.5
        rounded-xl
        bg-blue-600
        text-white
        text-sm
        font-medium
        shadow-md
        transition-all
        duration-300
        hover:bg-blue-700
        hover:shadow-lg
        active:scale-95
      "
    >
      <LayoutDashboard
        size={18}
        className="transition-transform duration-300 group-hover:scale-110"
      />

      <span className="hidden sm:inline">Admin</span>
    </button>
  );
}

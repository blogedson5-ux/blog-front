"use client";

import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function BackHomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      aria-label="Voltar para página inicial"
      title="Voltar para página inicial"
      className="
        group
        inline-flex
        items-center
        gap-2
        px-4
        py-2.5
        rounded-xl
        bg-neutral-900
        text-white
        text-sm
        font-medium
        shadow-md
        transition-all
        duration-300
        hover:bg-neutral-800
        hover:shadow-lg
        active:scale-95
      "
    >
      <Home
        size={18}
        className="transition-transform duration-300 group-hover:scale-110"
      />

      <span className="hidden sm:inline">
        Início
      </span>
    </button>
  );
}

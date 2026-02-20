"use client";

import { usePathname, useRouter } from "next/navigation";
import { FileText, Users, BarChart3 } from "lucide-react";
import React from "react";
import BackHomeButton from "@/components/BackHomeButton";

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* BOTÃO VOLTAR HOME */}
          <BackHomeButton />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
            <p className="text-sm text-gray-500">Gerencie o conteúdo do site</p>
          </div>
        </div>
      </header>

      {/* Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminCard
          icon={<FileText size={22} />}
          title="Posts"
          description="Criar, editar e publicar posts"
          onClick={() => router.push(`${pathname}/posts/new`)}
        />

        <AdminCard
          icon={<Users size={22} />}
          title="Noticias"
          description="Gerenciar Noticias"
          onClick={() => router.push(`${pathname}/noticias`)}
        />

        <AdminCard
          icon={<BarChart3 size={22} />}
          title="Estatísticas"
          description="Visualizar métricas do site"
          onClick={() => router.push("")}
        />
      </section>
    </div>
  );
}

type AdminCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

function AdminCard({ icon, title, description, onClick }: AdminCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        bg-white
        border
        rounded-2xl
        p-6
        text-left
        transition
        hover:shadow-md
        hover:-translate-y-1
        duration-300
      "
    >
      <div className="flex items-center gap-3 mb-3 text-gray-900">
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  );
}

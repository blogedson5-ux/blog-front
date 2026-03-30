"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { destroyCookie } from "nookies";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  FileText,
  Newspaper,
  Megaphone,
  LayoutDashboard,
  BarChart3,
  LogOut,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAnalytics, usePost, useMonthlyReports } from "@/data/news";
import BackHomeButton from "@/components/BackHomeButton";

function formatNumber(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("pt-BR").format(safeValue);
}

function formatDateLabel(value: string) {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) return value;

  return `${day}/${month}`;
}

function formatCategorySlug(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMonthKey(monthKey: string) {
  const [year, month] = monthKey.split("-");

  if (!year || !month) return monthKey;

  return `${month}/${year}`;
}

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
};

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-[0_12px_30px_rgba(14,165,233,0.22)]"
          : "bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            active
              ? "bg-white/15 text-white"
              : "bg-sky-50 text-sky-600 group-hover:bg-sky-100"
          }`}
        >
          {icon}
        </div>

        <span className="text-sm font-semibold">{label}</span>
      </div>

      <ArrowRight
        size={16}
        className={`transition-transform duration-300 ${
          active ? "text-white/90" : "text-slate-400 group-hover:translate-x-1"
        }`}
      />
    </button>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, isError } = useAnalytics();
  const { data: allPosts } = usePost();
  const { data: monthlyReports } = useMonthlyReports();

  const postsMap = useMemo(() => {
    const map = new Map<string, any>();

    (allPosts || []).forEach((post: any) => {
      if (post?._id) {
        map.set(String(post._id), post);
      }
    });

    return map;
  }, [allPosts]);

  const getPageLabel = (page: string) => {
    if (!page) return "Página desconhecida";

    if (page === "/") return "Página inicial";

    if (page.startsWith("/categoria/")) {
      const slug = page.replace("/categoria/", "");
      return `Categoria: ${formatCategorySlug(slug)}`;
    }

    if (page.startsWith("/noticia/")) {
      const id = page.replace("/noticia/", "");
      const post = postsMap.get(id);

      if (post?.titulo) {
        return post.titulo;
      }

      return "Notícia não encontrada";
    }

    return page;
  };

  function handleLogout() {
    destroyCookie(null, "nextauth.token", { path: "/" });
    destroyCookie(null, "nextauth.userId", { path: "/" });

    router.replace("/");
    router.refresh();
  }

  const chartData = data?.chartData || [];
  const topPages = data?.topPages || [];

  const topPagesWithLabel = topPages.map((item: any) => ({
    ...item,
    label: getPageLabel(item.page),
  }));

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fbff_35%,_#ffffff_70%)]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[300px] shrink-0 border-r border-sky-100 bg-white/80 p-5 backdrop-blur-xl xl:flex xl:flex-col">
          <div className="mb-8 flex items-start gap-3">
            <BackHomeButton />

            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                <Sparkles size={13} />
                Administração
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Controle geral do site
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label="Visão geral"
              active
              onClick={() => router.push(`${pathname}`)}
            />

            <SidebarItem
              icon={<FileText size={18} />}
              label="Criar post"
              onClick={() => router.push(`${pathname}/posts/new`)}
            />

            <SidebarItem
              icon={<Megaphone size={18} />}
              label="Criar anúncio"
              onClick={() => router.push(`${pathname}/anuncio`)}
            />

            <SidebarItem
              icon={<Megaphone size={18} />}
              label="Gerenciar anúncio"
              onClick={() => router.push(`${pathname}/manageAds`)}
            />

            <SidebarItem
              icon={<Newspaper size={18} />}
              label="Notícias"
              onClick={() => router.push(`${pathname}/noticias`)}
            />

            <SidebarItem
              icon={<BarChart3 size={18} />}
              label="Analytics"
              onClick={() => router.push(`${pathname}/analytics`)}
            />
          </div>

          <div className="mt-8 rounded-[24px] border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
              Painel profissional
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              Gestão centralizada
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Acesse conteúdos, anúncios, notícias e métricas em um só lugar.
            </p>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={handleLogout}
              className="
                group inline-flex w-full items-center justify-center gap-2
                rounded-2xl border border-red-200/80 bg-white
                px-5 py-3 text-sm font-semibold text-red-600
                shadow-[0_10px_25px_rgba(239,68,68,0.08)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:border-red-300
                hover:bg-red-50 hover:text-red-700
              "
            >
              <LogOut
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
              Sair do painel
            </button>
          </div>
        </aside>

        {/* Conteúdo */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            {/* topo mobile/tablet */}
            <header className="mb-8 rounded-[28px] border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(14,165,233,0.10)] backdrop-blur-xl xl:hidden">
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <BackHomeButton />

                    <div>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                        <Sparkles size={13} />
                        Administração
                      </div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Dashboard
                      </h1>
                      <p className="mt-1 text-sm text-slate-500">
                        Analytics e atalhos do painel
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SidebarItem
                    icon={<FileText size={18} />}
                    label="Criar Notícia"
                    onClick={() => router.push(`${pathname}/posts/new`)}
                  />
                  <SidebarItem
                    icon={<Newspaper size={18} />}
                    label="Notícias"
                    onClick={() => router.push(`${pathname}/noticias`)}
                  />
                  <SidebarItem
                    icon={<Megaphone size={18} />}
                    label="Criar anúncio"
                    onClick={() => router.push(`${pathname}/anuncio`)}
                  />
                  <SidebarItem
                    icon={<Megaphone size={18} />}
                    label="Gerenciar anúncio"
                    onClick={() => router.push(`${pathname}/manageAds`)}
                  />
                </div>
              </div>
            </header>

            {/* analytics */}
            {isLoading ? (
              <div className="rounded-[24px] border border-sky-100 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <p className="text-base font-semibold text-slate-600">
                  Carregando dados de acesso...
                </p>
              </div>
            ) : isError || !data ? (
              <div className="rounded-[24px] border border-red-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <h1 className="text-2xl font-black text-slate-950">
                  Erro ao carregar analytics
                </h1>
                <p className="mt-2 text-slate-600">
                  Não foi possível carregar os dados de acesso do site.
                </p>
              </div>
            ) : (
              <>
                <header className="mb-8 flex flex-col gap-3 sm:mb-10">
                  <span className="inline-flex w-fit rounded-full bg-sky-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-600 ring-1 ring-sky-100">
                    Painel administrativo
                  </span>

                  <div>
                    <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
                      Analytics do site
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                      Acompanhe o volume de acessos do portal, o desempenho
                      diário e as páginas com maior número de visitas.
                    </p>
                  </div>
                </header>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                    <p className="text-sm font-semibold text-slate-500">
                      Total de acessos
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
                      {formatNumber(Number(data.totalVisits || 0))}
                    </h2>
                  </div>

                  <div className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                    <p className="text-sm font-semibold text-slate-500">
                      Acessos hoje
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
                      {formatNumber(Number(data.todayVisits || 0))}
                    </h2>
                  </div>

                  <div className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                    <p className="text-sm font-semibold text-slate-500">
                      Acessos nesta semana
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
                      {formatNumber(Number(data.thisWeekVisits || 0))}
                    </h2>
                  </div>

                  <div className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                    <p className="text-sm font-semibold text-slate-500">
                      Média diária
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
                      {formatNumber(Number(data.avgDailyVisits || 0))}
                    </h2>
                  </div>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
                  <div className="rounded-[28px] border border-sky-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                    <div className="mb-5">
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-600">
                        Desempenho
                      </span>
                      <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">
                        Acessos por dia
                      </h2>
                    </div>

                    <div className="h-[280px] w-full sm:h-[360px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient
                              id="visitsFill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#38bdf8"
                                stopOpacity={0.35}
                              />
                              <stop
                                offset="95%"
                                stopColor="#38bdf8"
                                stopOpacity={0.03}
                              />
                            </linearGradient>
                          </defs>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatDateLabel}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            labelFormatter={(label) =>
                              `Data: ${formatDateLabel(String(label))}`
                            }
                            formatter={(value) => [
                              `${formatNumber(Number(value))} acessos`,
                              "Visitas",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="visits"
                            stroke="#38bdf8"
                            strokeWidth={3}
                            fill="url(#visitsFill)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-sky-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                    <div className="mb-5">
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-600">
                        Ranking
                      </span>
                      <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">
                        Páginas mais acessadas
                      </h2>
                    </div>

                    <div className="h-[280px] w-full sm:h-[360px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topPagesWithLabel} layout="vertical">
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                          />
                          <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            type="category"
                            dataKey="label"
                            width={180}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            labelFormatter={(label) => String(label)}
                            formatter={(value) => [
                              `${formatNumber(Number(value))} acessos`,
                              "Visitas",
                            ]}
                          />
                          <Bar
                            dataKey="visits"
                            fill="#38bdf8"
                            radius={[0, 8, 8, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </section>

                <section className="mt-6 rounded-[28px] border border-sky-100 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                  <div className="mb-5">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-600">
                      Relatório
                    </span>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">
                      Lista de acessos por página
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-0">
                      <thead>
                        <tr>
                          <th className="border-b border-sky-100 px-4 py-3 text-left text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                            Página
                          </th>
                          <th className="border-b border-sky-100 px-4 py-3 text-right text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                            Visitas
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {topPagesWithLabel.length > 0 ? (
                          topPagesWithLabel.map((item: any) => (
                            <tr key={item.page}>
                              <td className="border-b border-sky-50 px-4 py-4 text-sm font-medium text-slate-800">
                                {item.label}
                              </td>
                              <td className="border-b border-sky-50 px-4 py-4 text-right text-sm font-bold text-slate-900">
                                {formatNumber(Number(item.visits || 0))}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={2}
                              className="px-4 py-8 text-center text-sm text-slate-500"
                            >
                              Ainda não há acessos registrados.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="mt-6 rounded-[28px] border border-sky-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
                  <div className="mb-5">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-600">
                      Histórico
                    </span>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">
                      Meses já fechados
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      Aqui ficam os relatórios mensais já fechados, mesmo depois
                      que os dados detalhados forem apagados.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {monthlyReports && monthlyReports.length > 0 ? (
                      monthlyReports.map((report: any) => (
                        <div
                          key={report.monthKey}
                          className="rounded-[20px] border border-sky-100 bg-sky-50/60 p-4 sm:p-5"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="text-lg font-black text-slate-950">
                                {formatMonthKey(report.monthKey)}
                              </h3>
                              <p className="mt-1 text-sm text-slate-600">
                                Comparação com{" "}
                                {report.comparison?.previousMonthKey
                                  ? formatMonthKey(
                                      report.comparison.previousMonthKey,
                                    )
                                  : "mês anterior indisponível"}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                              <div className="rounded-[14px] bg-white px-4 py-3 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                  Total
                                </p>
                                <p className="mt-1 text-lg font-black text-slate-950">
                                  {formatNumber(report.totalVisits)}
                                </p>
                              </div>

                              <div className="rounded-[14px] bg-white px-4 py-3 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                  Média diária
                                </p>
                                <p className="mt-1 text-lg font-black text-slate-950">
                                  {formatNumber(report.avgDailyVisits)}
                                </p>
                              </div>

                              <div className="rounded-[14px] bg-white px-4 py-3 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                  Crescimento
                                </p>
                                <p className="mt-1 text-lg font-black text-slate-950">
                                  {report.comparison?.growthPercentage || 0}%
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 rounded-[16px] bg-white p-4 shadow-sm">
                            <p className="mb-3 text-sm font-semibold text-slate-500">
                              Top páginas do mês
                            </p>

                            <div className="space-y-3">
                              {report.topPages && report.topPages.length > 0 ? (
                                report.topPages.map((item: any) => (
                                  <div
                                    key={item.key}
                                    className="flex items-center justify-between gap-4 border-b border-sky-50 pb-3 last:border-b-0 last:pb-0"
                                  >
                                    <p className="min-w-0 flex-1 text-sm font-medium text-slate-800">
                                      {item.label}
                                    </p>
                                    <p className="text-sm font-black text-slate-950">
                                      {formatNumber(item.visits)}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-500">
                                  Não há páginas registradas neste relatório.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[18px] border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                        Ainda não há relatórios mensais fechados.
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

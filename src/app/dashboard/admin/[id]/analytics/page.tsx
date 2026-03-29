"use client";

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
import { useAnalytics } from "@/data/news";

function formatNumber(value: number) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("pt-BR").format(safeValue);
}

function formatDateLabel(value: string) {
  const [year, month, day] = value.split("-");

  if (!year || !month || !day) return value;

  return `${day}/${month}`;
}

export default function AdminAnalyticsPage() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <p className="text-base font-semibold text-slate-600">
              Carregando dados de acesso...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="rounded-[24px] border border-red-200 bg-white p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <h1 className="text-2xl font-black text-slate-950">
              Erro ao carregar analytics
            </h1>
            <p className="mt-2 text-slate-600">
              Não foi possível carregar os dados de acesso do site.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const chartData = data.chartData || [];
  const topPages = data.topPages || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <header className="mb-8 flex flex-col gap-3 sm:mb-10">
          <span className="inline-flex w-fit rounded-full bg-sky-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-600 ring-1 ring-sky-100">
            Painel administrativo
          </span>

          <div>
            <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Analytics do site
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Acompanhe o volume de acessos do portal, o desempenho diário e as
              páginas com maior número de visitas.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <p className="text-sm font-semibold text-slate-500">
              Total de acessos
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
              {formatNumber(Number(data.totalVisits || 0))}
            </h2>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <p className="text-sm font-semibold text-slate-500">
              Acessos hoje
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
              {formatNumber(Number(data.todayVisits || 0))}
            </h2>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <p className="text-sm font-semibold text-slate-500">
              Acessos nesta semana
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
              {formatNumber(Number(data.thisWeekVisits || 0))}
            </h2>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <p className="text-sm font-semibold text-slate-500">
              Média diária
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">
              {formatNumber(Number(data.avgDailyVisits || 0))}
            </h2>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
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
                    <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatDateLabel}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
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

          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
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
                <BarChart data={topPages} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="page"
                    width={140}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${formatNumber(Number(value))} acessos`,
                      "Visitas",
                    ]}
                  />
                  <Bar dataKey="visits" fill="#38bdf8" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
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
                  <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Página
                  </th>
                  <th className="border-b border-slate-200 px-4 py-3 text-right text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                    Visitas
                  </th>
                </tr>
              </thead>

              <tbody>
                {topPages.length > 0 ? (
                  topPages.map((item) => (
                    <tr key={item.page}>
                      <td className="border-b border-slate-100 px-4 py-4 text-sm font-medium text-slate-800">
                        {item.page}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-4 text-right text-sm font-bold text-slate-900">
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
      </section>
    </main>
  );
}
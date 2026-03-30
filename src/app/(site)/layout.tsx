"use client";

import { Header } from "@/components/Header";
import { CookieBanner } from "@/components/CookieBanner";
import { AnalyticsLoader } from "@/components/AnalyticsLoader";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("SITE LAYOUT MONTOU");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">{children}</main>
      <AnalyticsLoader />
      <CookieBanner />
    </>
  );
}
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import axios from "@/lib/axios";

export function AnalyticsLoader() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const registerVisit = async () => {
      try {
        console.log("📊 Enviando analytics:", { page: pathname });

        await axios.post("/analytics/track-visit", {
          page: pathname,
        });

        console.log("✅ Analytics enviado");
      } catch (error: any) {
        console.log("❌ Erro analytics:", error?.message);
        console.log("❌ Response:", error?.response?.data);
      }
    };

    registerVisit();
  }, [pathname]);

  return null;
}
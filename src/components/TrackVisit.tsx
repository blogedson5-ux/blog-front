"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import axios from "@/lib/axios";

export function AnalyticsLoader() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/dashboard")) return;

    const registerVisit = async () => {
      try {
        await axios.post("/analytics/track-visit", {
          page: pathname,
        });
      } catch (error) {
        console.log("Erro ao registrar visita:", error);
      }
    };

    registerVisit();
  }, [pathname]);

  return null;
}

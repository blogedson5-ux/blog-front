"use client";

import { useEffect, useState } from "react";
import { parseCookies, setCookie } from "nookies";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    const consent = cookies.cookieConsent;

    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie(null, "cookieConsent", "accepted", {
      maxAge: 60 * 60 * 24 * 180, // 180 dias
      path: "/",
    });

    setIsVisible(false);
  };

  const handleReject = () => {
    setCookie(null, "cookieConsent", "rejected", {
      maxAge: 60 * 60 * 24 * 180, // 180 dias
      path: "/",
    });

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-6 md:right-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-blue-100 bg-white p-4 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Utilizamos cookies
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              Este site utiliza cookies para melhorar sua experiência.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm rounded-full border border-blue-200 text-blue-500 hover:bg-blue-50 transition"
            >
              Recusar
            </button>

            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm rounded-full bg-blue-400 text-white hover:bg-blue-500 transition"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
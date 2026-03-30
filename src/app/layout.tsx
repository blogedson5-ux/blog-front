import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "./providers";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/services/queryClient";
import { AuthProvider } from "@/context/authContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Perfil Edson Ferreira | Notícias",
  description: "Últimas notícias e atualizações",

  icons: {
    icon: "https://res.cloudinary.com/dybjtiyiv/image/upload/v1774805428/ChatGPT_Image_29_de_mar._de_2026_14_24_34_hmvsxp.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Providers>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    borderRadius: "12px",
                    background: "#111",
                    color: "#fff",
                  },
                }}
              />
            </Providers>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

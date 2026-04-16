"use client";

export function Footer() {
  const socialLinks = {
    instagram: "https://www.instagram.com/edson_fherreyra2ct/",
    whatsapp: "https://wa.me/558381686623",
    tiktok:
      "https://www.tiktok.com/@edson_fherreya2ct?_r=1&_t=ZS-93nEcin1nPd&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnpLrcJAtctl0lZRL_GeEIgxIdZCSLVSp2nN8-L_VbolAh3IgahUvl6n56fHk_aem_ELBI1Zbzhb642pbmCuzZtg",
  };

  return (
    <footer className="mt-12 border-t border-slate-200 bg-[#031b4e] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex h-25 w-25 items-center justify-center shadow-sm sm:h-14 sm:w-20">
                <img
                  src="https://res.cloudinary.com/dybjtiyiv/image/upload/q_auto/f_auto/v1774805428/ChatGPT_Image_29_de_mar._de_2026_14_24_34_hmvsxp.png"
                  alt="Logo Portal de Notícias"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Informações */}
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-black uppercase leading-tight tracking-wide text-white sm:text-2xl">
                Portal de Notícias
              </h3>

              <p className="mt-2 max-w-md text-base leading-7 text-slate-300">
                Informação, vídeos e cobertura local em destaque.
              </p>

              <div className="mt-6 flex items-center gap-3 sm:gap-4">
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/5 transition hover:bg-[#1E90FF]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8.88 1.62a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26ZM12 6.5A5.5 5.5 0 1 1 6.5 12 5.5 5.5 0 0 1 12 6.5Zm0 1.5A4 4 0 1 0 16 12a4 4 0 0 0-4-4Z" />
                  </svg>
                </a>

                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/5 transition hover:bg-[#1E90FF]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.54 0 .24 5.3.24 11.82c0 2.08.54 4.11 1.57 5.9L0 24l6.46-1.69a11.8 11.8 0 0 0 5.6 1.43h.01c6.52 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.47-8.44ZM12.07 21.7h-.01a9.83 9.83 0 0 1-5-1.37l-.36-.21-3.83 1 1.02-3.73-.24-.38a9.8 9.8 0 0 1-1.5-5.19c0-5.42 4.41-9.83 9.84-9.83 2.62 0 5.08 1.02 6.93 2.88a9.73 9.73 0 0 1 2.88 6.95c0 5.42-4.42 9.83-9.84 9.83Zm5.4-7.36c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.5-.89-.79-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.91-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.5s1.06 2.9 1.2 3.1c.15.2 2.08 3.17 5.03 4.45.7.3 1.25.48 1.68.61.71.22 1.36.19 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                  </svg>
                </a>

                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/5 transition hover:bg-[#1E90FF]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M14.5 3c.34 1.9 1.46 3.38 3.38 4.1.74.28 1.48.4 2.12.42v2.57a7.3 7.3 0 0 1-3.78-1.07v6.18c0 3.53-2.87 6.4-6.4 6.4S3.42 18.73 3.42 15.2s2.87-6.4 6.4-6.4c.36 0 .72.03 1.06.09v2.67a3.78 3.78 0 0 0-1.06-.15 3.79 3.79 0 1 0 3.79 3.79V3h.89Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs uppercase tracking-[0.14em] text-slate-400">
          © {new Date().getFullYear()} Portal de Notícias. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}

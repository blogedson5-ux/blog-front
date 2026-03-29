"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

export function AnalyticsLoader() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    const consent = cookies.cookieConsent;

    if (consent === "accepted") {
      setCanLoad(true);
    }
  }, []);

  if (!canLoad) return null;

  return (
    <>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `,
        }}
      />
    </>
  );
}
"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";

export default function VideoPreview({ url }: { url: string }) {
  const [thumb, setThumb] = useState<string | null>(null);
  const [type, setType] = useState("");

  useEffect(() => {
    if (!url) return;

    const fetchThumb = async () => {
      try {
        const res = await axios.get("/video-thumbnail", {
          params: { url },
        });

        setType(res.data.provider);
        setThumb(res.data.thumbnail);
      } catch (err) {
        console.log(err);
      }
    };

    fetchThumb();
  }, [url]);

  // INSTAGRAM → iframe
  if (url.includes("instagram.com")) {
    return (
      <iframe
        src={`${url}embed`}
        className="w-full h-[500px] rounded-xl"
        allowFullScreen
      />
    );
  }

  // TIKTOK → imagem clicável
  if (thumb) {
    return (
      <a href={url} target="_blank">
        <img
          src={thumb}
          className="w-full rounded-xl hover:opacity-90 transition"
        />
      </a>
    );
  }

  return null;
}
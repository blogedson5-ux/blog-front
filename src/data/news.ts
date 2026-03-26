import { useQuery } from "@tanstack/react-query";
import { getAd, getPost, getPostById } from "@/hooks/useClient";
import { Ad } from "@/types/ad";

export function usePost() {
  return useQuery<News[]>({
    queryKey: ["post"],
    queryFn: getPost,
  });
}

export function useAd() {
  return useQuery<Ad>({
    queryKey: ["ad"],
    queryFn: getAd,
  });
}

export function usePostById(id: string | null) {
  return useQuery<News>({
    queryKey: ["post", id],
    queryFn: () => getPostById(id as string),
    enabled: typeof id === "string",
  });
}

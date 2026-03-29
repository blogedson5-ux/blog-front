import { useQuery } from "@tanstack/react-query";
import { getAd, getAnalytics, getPost, getPostById } from "@/hooks/useClient";
import { Ad } from "@/types/ad";
import { AnalyticsSummary } from "@/types/analytics";

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

export function useAnalytics() {
  return useQuery<AnalyticsSummary>({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });
}

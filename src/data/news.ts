import { useQuery } from "@tanstack/react-query";
import { getPost, getPostById } from "@/hooks/useClient";
import { News } from "@/types/news";

export function usePost() {
  return useQuery<News[]>({
    queryKey: ["post"],
    queryFn: getPost,
  });
}

export function usePostById(id: string | null) {
  return useQuery<News>({
    queryKey: ["post", id],
    queryFn: () => getPostById(id as string),
    enabled: typeof id === "string",
  });
}

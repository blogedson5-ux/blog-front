import axios from "@/lib/axios";
import { News } from "@/types/news";

export async function getPost() {
  const { data } = await axios.get(`/post/get-posts`);
  return data;
}

export async function getPostById(id: string): Promise<News> {
  const { data } = await axios.get(`/post/get-post/${id}`);
  return data;
}

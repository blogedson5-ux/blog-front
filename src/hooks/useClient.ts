import axios from "@/lib/axios";
import { AnalyticsSummary } from "@/types/analytics";

export async function getPost() {
  console.error("🟡 getPost FOI CHAMADO");

  try {
    const response = await axios.get(`/post/get-posts`, {
      timeout: 5000,
    });
    console.error("🟢 getPost SUCESSO", response.status);
    return response.data;
  } catch (error: any) {
    console.error("🔴 getPost ERRO", error.code, error.message);
    throw error;
  }
}

export async function getAd() {
  try {
    const response = await axios.get(`/ads/get-ad`, {
      timeout: 5000,
    });
    return response.data;
  } catch (error: any) {
    console.error("🔴 getPost ERRO", error.code, error.message);
    throw error;
  }
}

export async function getPostById(id: string): Promise<News> {
  const { data } = await axios.get(`/post/get-post/${id}`);
  return data;
}

export async function getAnalytics(): Promise<AnalyticsSummary> {
  try {
    const response = await axios.get(`/analytics/get-summary`, {
      timeout: 5000,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "🔴 getAnalytics ERRO",
      error.code,
      error.message,
      error.response?.data,
    );
    throw error;
  }
}

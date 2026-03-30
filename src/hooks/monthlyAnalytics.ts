import axios from "@/lib/axios";

export async function getMonthlyReports() {
  const response = await axios.get("/monthly-analytics/get-reports", {
    timeout: 5000,
  });

  return response.data;
}

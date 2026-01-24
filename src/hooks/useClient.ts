import axios from "@/lib/axios";

export const getProduct = async () => {
  try {
    const res = await axios.get(`product/get-all-product`);
    return res.data;
  } catch (error) {
    console.error("Error no servidor:", error);
  }
};

import axios from "axios";

const URL = "https://blog-back-blond.vercel.app/";

/* https://blog-back-blond.vercel.app */

/* localhost:5000 */
export default axios.create({
  baseURL: URL,
});

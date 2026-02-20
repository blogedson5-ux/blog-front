import axios from "axios";

const URL = "http://localhost:5000";

/* https://simoes-back.vercel.app */

/* localhost:5000 */
export default axios.create({
  baseURL: URL,
});

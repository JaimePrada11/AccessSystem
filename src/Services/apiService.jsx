import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8083/api/",
});

export default axiosInstance;

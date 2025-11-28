import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 419) {
      localStorage.removeItem("USER");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
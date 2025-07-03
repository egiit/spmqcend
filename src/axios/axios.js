import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";

const theUrl = window.location.hostname;
// const protocol = window.location.protocol;
const instance = axios.create({
  withCredentials: true,
  // baseURL: `https://api.sumbiri.com`,
  baseURL: `http://${theUrl}:5001`,
});
instance.defaults.headers.common["Content-Type"] = "multipart/form-data";

instance.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = `sumbiri ${localStorage.getItem("token")}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
loadProgressBar(undefined, instance);
export default instance;

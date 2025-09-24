import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000"; // or your backend URL

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // if your backend sets cookiesa
});

export default instance;

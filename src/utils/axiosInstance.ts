import axios from "axios";
import { API_BASE_URL } from "../constants/baseUrl"

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_ACCESS_TOKEN}`
  }
})
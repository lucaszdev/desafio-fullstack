require("dotenv").config();
import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: {
        "Access-Control-Allow-Origin": "*",
    },
});

export default api;

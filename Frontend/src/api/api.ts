import axios from "axios";
import { getToken } from "../features/auth/Auth";

export const api = axios.create({
    baseURL: "http://localhost:5238",
});

api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

import axios from "axios";

export const api = axios.create({
  baseURL: "https://midominio.42web.io/backend/public",
});
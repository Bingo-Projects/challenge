import axios from "axios";

export const backend = "https://justfreshjobs.com/api";
export const api = axios.create({
  baseURL: backend,
  headers: {
    "Content-Type": "application/json"
  }
})

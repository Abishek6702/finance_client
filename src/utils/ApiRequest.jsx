import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${BASE_URL}`,

  headers: {
    "Content-Type": "application/json",
    "Authorization":`Bearer ${localStorage.getItem('token')}`
  }
});

export const ApiRequest = async (endpoint, method = "GET", data = null) => {
  try {
    const response = await api({
      url: endpoint,
      method,
      data
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("API Error");
  }
};
import axios from "axios";
import { Platform } from "react-native";

let baseURL = "http://localhost:3001";
if (Platform.OS === "web" && typeof window !== "undefined") {
  baseURL = `${window.location.protocol}//${window.location.hostname}:3001`;
}

const api = axios.create({
  baseURL,
});

export default api;

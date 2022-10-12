import axios from "axios";

const api = axios.create({
  baseURL: "https://kawahedukasibackend.herokuapp.com",
  timeout: 20000
})

export const imageServer = axios.create({
  baseURL: "https://kelompoktimtam.000webhostapp.com",
  timeout: 20000
})

export default api
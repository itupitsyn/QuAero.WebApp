import axios from "axios";

export const createSuperAdmin = (params: { login: string; password: string }) => {
  return axios.post("/api/superadmin", params);
};

export const signIn = (params: { login: string; password: string }) => {
  return axios.post("/api/auth/signin", params);
};

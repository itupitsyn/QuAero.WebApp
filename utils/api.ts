import { SessionUser } from "@/types/auth";
import axios from "axios";

export const createSuperAdmin = (params: { login: string; password: string }) => {
  return axios.post("/api/superadmin", params);
};

export const signIn = (params: { login: string; password: string }) => {
  return axios.post("/api/auth/signin", params);
};

export const signOut = () => {
  return axios.post("/api/auth/signout");
};

export const getSession = () => {
  return axios.get<SessionUser>("/api/auth/session");
};

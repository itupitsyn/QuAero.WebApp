import { SessionUser } from "@/types/auth";
import { CreateSRTRequest, CreateUserRequest, UpdateUserRequest } from "@/types/models";
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

export const createUser = (params: CreateUserRequest) => {
  return axios.post("/api/users", params);
};

export const deleteUser = (userId: string) => {
  return axios.delete(`/api/users/${userId}`);
};

export const updateUser = (userId: string, params: UpdateUserRequest) => {
  return axios.patch(`/api/users/${userId}`, params);
};

export const resetPassword = (userId: string, password: string) => {
  return axios.patch(`/api/users/${userId}/password`, { password });
};

export const createSRT = (params: CreateSRTRequest) => {
  return axios.post("/api/srts", params);
};

export const deleteSRT = (teamId: string) => {
  return axios.delete(`/api/srts/${teamId}`);
};

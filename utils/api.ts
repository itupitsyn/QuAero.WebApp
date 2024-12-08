import axios from "axios";

export const createSuperAdmin = (params: { login: string; password: string }) => {
  axios.post("/api/superadmin", params);
};

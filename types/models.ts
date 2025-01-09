import { Permission } from "./permissions";

export type UserApiModel = {
  createdAt: Date;
  updatedAt: Date;
  email: string | null;
  id: string;
  login: string;
  name: string | null;
  image: string | null;
  permissions: Record<Permission, boolean>;
};

export type CreateUserRequest = {
  login: string;
  password: string;
  name?: string;
  permissions?: Permission[];
};

export type UpdateUserRequest = {
  login?: string;
  name?: string;
  permissions?: Permission[];
};

export type CreateSRTRequest = {
  name: string;
};

export type UpdateSRTRequest = {
  name: string;
};

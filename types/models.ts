import { Permission } from "./permissions";

export type UserApiPermissions = Partial<Record<Permission, { allowed: boolean; srts: string[] | null }>>;

export type UserApiModel = {
  createdAt: Date;
  updatedAt: Date;
  email: string | null;
  id: string;
  login: string;
  name: string | null;
  image: string | null;
  permissions: UserApiPermissions;
};

export type CreateUserRequest = {
  login: string;
  password: string;
  name?: string;
  permissions?: Permission[];
  srts?: string[];
};

export type UpdateUserRequest = {
  login?: string;
  name?: string;
  permissions?: Permission[];
  srts?: string[];
};

export type CreateSRTRequest = {
  name: string;
};

export type UpdateSRTRequest = {
  name: string;
};

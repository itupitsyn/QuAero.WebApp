import { Permission } from "@/types/permissions";

export type EditUserFormData = {
  name?: string | null;
  login: string;
} & Partial<Record<Permission, boolean>>;

export type AddUserFormData = {
  name?: string | null;
  login: string;
  password: string;
} & Partial<Record<Permission, boolean>>;

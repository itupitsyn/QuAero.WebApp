import { UserApiPermissions } from "@/types/models";

export type EditUserFormData = {
  name?: string | null;
  login: string;
} & UserApiPermissions;

export type AddUserFormData = {
  name?: string | null;
  login: string;
  password: string;
} & UserApiPermissions;

export type SRTOption = {
  name: string;
  id: string;
};

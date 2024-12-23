import { Permission } from "./permissions";

export type SessionUser = {
  id: string;
  name?: string;
  login: string;
  image?: string;
  permissions: Partial<Record<Permission, boolean>>;
};

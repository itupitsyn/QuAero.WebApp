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

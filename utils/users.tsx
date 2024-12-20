import { createHash } from "crypto";

export const calculatePasswordHash = (password: string) => {
  const hash = createHash("sha256").update(password).digest("hex");

  return hash;
};

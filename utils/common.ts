export const isSomeEnum =
  <T extends Record<string, unknown>>(e: T) =>
  (value: unknown): value is T[keyof T] =>
    Object.values(e).includes(value as T[keyof T]);

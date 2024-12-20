export type ArrayItem<T> = T extends Array<infer E> ? E : never;

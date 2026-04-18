export type IObjectValues<T extends Readonly<Record<string, unknown>>> = T[keyof T];

export type IOptional<T extends Record<string, unknown>, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type IRequired<T extends Record<string, unknown>, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

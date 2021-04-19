export interface GenericObject {
  [key: string]: string | number | boolean;
}

export interface Error {
  message: string;
}

export type Orientation = 'horizontal' | 'vertical';

export type Pair<T, U> = [T, U];

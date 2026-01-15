declare const brand: unique symbol;
export type Brand<T, B extends string> = T & { [brand]: B };
export type SampleId = Brand<string, 'SampleId'>;
export type UserId = Brand<string, 'UserId'>;

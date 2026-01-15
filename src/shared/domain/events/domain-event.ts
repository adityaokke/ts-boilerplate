export type DomainEvent<T = unknown> = {
  readonly type: string;
  readonly payload: T;
  readonly occurredAt: Date;
};

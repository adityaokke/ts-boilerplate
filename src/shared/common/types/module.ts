import type { AwilixContainer } from 'awilix';
import type { Router } from 'express';

export interface EventHandlerRegistration {
  event: string;
  handler: (payload: unknown) => Promise<void>;
}

export interface Module {
  name: string;
  register: (container: AwilixContainer) => void;
  routes?: (container: AwilixContainer) => Router;
  resolvers?: (container: AwilixContainer) => Record<string, unknown>;
  eventHandlers?: (container: AwilixContainer) => EventHandlerRegistration[];
}

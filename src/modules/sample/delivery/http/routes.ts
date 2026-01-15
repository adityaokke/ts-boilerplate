import { Router } from 'express';
import type { SampleController } from './controller.js';

export const createSampleRoutes = (controller: SampleController): Router => {
  const router = Router();

  router.post('/samples', controller.create);
  router.get('/samples', controller.list);
  router.get('/samples/:id', controller.getById);

  return router;
};

import type { Request, Response, NextFunction } from 'express';
import type { CreateSample } from '../../domain/interfaces/create-sample.js';
import type { GetSample } from '../../domain/interfaces/get-sample.js';
import type { ListSamples } from '../../domain/interfaces/list-samples.js';

export class SampleController {
  constructor(
    private readonly createSampleUseCase: CreateSample,
    private readonly getSampleUseCase: GetSample,
    private readonly listSamplesUseCase: ListSamples,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.createSampleUseCase.execute(req.body);
      if (!result.ok) throw result.error;
      res.status(201).json(result.value);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.getSampleUseCase.execute({
        id: req.params.id!,
      });
      if (!result.ok) throw result.error;
      res.json(result.value);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.listSamplesUseCase.execute({ page, limit });
      if (!result.ok) throw result.error;
      res.json(result.value);
    } catch (err) {
      next(err);
    }
  };
}

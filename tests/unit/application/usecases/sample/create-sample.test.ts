import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateSampleUseCase } from '@modules/sample/application/usecases/create-sample.js';
import { ValidationError, ConflictError } from '@shared/application/errors/index.js';

describe('CreateSampleUseCase', () => {
  const mockSampleRepository = {
    save: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    count: vi.fn(),
    findByName: vi.fn(),
    updateStatus: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const mockLogger = {
    child: vi.fn().mockReturnThis(),
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  };

  let useCase: CreateSampleUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new CreateSampleUseCase(mockSampleRepository, mockEventPublisher, mockLogger);
  });

  it('should create a sample successfully', async () => {
    mockSampleRepository.findByName.mockResolvedValue(null);
    mockSampleRepository.save.mockResolvedValue(undefined);
    mockEventPublisher.publish.mockResolvedValue(undefined);

    const result = await useCase.execute({
      name: 'Test Sample',
      description: 'A test description',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe('Test Sample');
      expect(result.value.status).toBe('ACTIVE');
      expect(result.value.id).toBeDefined();
    }
    expect(mockSampleRepository.save).toHaveBeenCalled();
    expect(mockEventPublisher.publish).toHaveBeenCalled();
  });

  it('should return validation error for empty name', async () => {
    const result = await useCase.execute({
      name: '',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(ValidationError);
    }
  });

  it('should return conflict error for duplicate name', async () => {
    mockSampleRepository.findByName.mockResolvedValue({
      id: 'existing-id',
      name: 'Test Sample',
    });

    const result = await useCase.execute({
      name: 'Test Sample',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(ConflictError);
    }
  });
});

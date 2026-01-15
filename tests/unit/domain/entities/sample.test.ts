import { describe, it, expect } from 'vitest';
import { Sample, SampleStatus } from '@modules/sample/domain/entities/sample.js';

describe('Sample Entity', () => {
  describe('create', () => {
    it('should create a sample with default status ACTIVE', () => {
      const sample = Sample.create({ name: 'Test Sample' });

      expect(sample.id).toBeDefined();
      expect(sample.name).toBe('Test Sample');
      expect(sample.status).toBe(SampleStatus.ACTIVE);
      expect(sample.createdAt).toBeInstanceOf(Date);
      expect(sample.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a sample with description', () => {
      const sample = Sample.create({
        name: 'Test Sample',
        description: 'A test description',
      });

      expect(sample.description).toBe('A test description');
    });

    it('should create a sample with metadata', () => {
      const metadata = { key: 'value' };
      const sample = Sample.create({
        name: 'Test Sample',
        metadata,
      });

      expect(sample.metadata).toEqual(metadata);
    });
  });

  describe('activate', () => {
    it('should activate an inactive sample', () => {
      const sample = Sample.create({ name: 'Test' });
      const inactive = Sample.deactivate(sample);
      const activated = Sample.activate(inactive);

      expect(activated.status).toBe(SampleStatus.ACTIVE);
    });

    it('should throw when activating an archived sample', () => {
      const sample = Sample.create({ name: 'Test' });
      const archived = Sample.archive(sample);

      expect(() => Sample.activate(archived)).toThrow('Cannot activate archived sample');
    });
  });

  describe('deactivate', () => {
    it('should deactivate an active sample', () => {
      const sample = Sample.create({ name: 'Test' });
      const deactivated = Sample.deactivate(sample);

      expect(deactivated.status).toBe(SampleStatus.INACTIVE);
    });

    it('should throw when deactivating an archived sample', () => {
      const sample = Sample.create({ name: 'Test' });
      const archived = Sample.archive(sample);

      expect(() => Sample.deactivate(archived)).toThrow('Cannot deactivate archived sample');
    });
  });

  describe('archive', () => {
    it('should archive an active sample', () => {
      const sample = Sample.create({ name: 'Test' });
      const archived = Sample.archive(sample);

      expect(archived.status).toBe(SampleStatus.ARCHIVED);
    });

    it('should archive an inactive sample', () => {
      const sample = Sample.create({ name: 'Test' });
      const inactive = Sample.deactivate(sample);
      const archived = Sample.archive(inactive);

      expect(archived.status).toBe(SampleStatus.ARCHIVED);
    });
  });
});

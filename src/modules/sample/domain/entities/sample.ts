import { nanoid } from 'nanoid';

export const SampleStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;
export type SampleStatus = (typeof SampleStatus)[keyof typeof SampleStatus];

export type Sample = {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly status: SampleStatus;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export const Sample = {
  create: (props: { name: string; description?: string; metadata?: Record<string, unknown> }): Sample => ({
    id: nanoid(),
    name: props.name,
    description: props.description,
    status: SampleStatus.ACTIVE,
    metadata: props.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),

  activate: (sample: Sample): Sample => {
    if (sample.status === SampleStatus.ARCHIVED) {
      throw new Error('Cannot activate archived sample');
    }
    return { ...sample, status: SampleStatus.ACTIVE, updatedAt: new Date() };
  },

  deactivate: (sample: Sample): Sample => {
    if (sample.status === SampleStatus.ARCHIVED) {
      throw new Error('Cannot deactivate archived sample');
    }
    return { ...sample, status: SampleStatus.INACTIVE, updatedAt: new Date() };
  },

  archive: (sample: Sample): Sample => ({
    ...sample,
    status: SampleStatus.ARCHIVED,
    updatedAt: new Date(),
  }),
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type Paginated<T> = { data: T[]; meta: PaginationMeta };
export type PaginatedResult<T> = Paginated<T>;

export const paginate = <T>(data: T[], total: number, page = 1, limit = 20): Paginated<T> => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

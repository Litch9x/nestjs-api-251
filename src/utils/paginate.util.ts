// src/common/utils/paginate.util.ts
import { Model } from 'mongoose';
import { PaginationResult } from './pagination-result.interface';

interface PaginateOptions {
  page?: number;
  limit?: number;
  filter?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  populate?: string | string[];
  lean?: boolean;
}

export async function paginate<T>(
  model: Model<T>,
  options: PaginateOptions,
): Promise<PaginationResult<T>> {
  const {
    page = 1,
    limit = 8,
    filter = {},
    sort = { createdAt: -1 },
    populate,
    lean = true,
  } = options;

  const skip = (page - 1) * limit;

  const query = model.find(filter).sort(sort).skip(skip).limit(limit);

  if (populate) {
    query.populate(populate);
  }

  if (lean) {
    query.lean();
  }

  const [data, total] = await Promise.all([
    query.exec(),
    model.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  const next = page + 1;
  const prev = page - 1;

  return {
    data,
    pages: {
      total,
      currentPage: page,
      hasNext,
      hasPrev,
      next,
      prev,
    },
  };
}

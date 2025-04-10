export interface PaginationResult<T> {
  data: T[];
  pages: {
    total: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    next: number;
    prev: number;
  };
}

export interface PageableParams {
  page: number;
  size: number;
  sort: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
}

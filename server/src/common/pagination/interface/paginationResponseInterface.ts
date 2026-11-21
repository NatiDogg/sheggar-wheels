

export interface PaginationMetadata{
      currentPage: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean
}

export interface PaginationResponse<T> {
  success?: boolean;
  message?: string;
  data: T[];
  metaData: PaginationMetadata;
}
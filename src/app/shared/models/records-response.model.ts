export interface RecordsResponse<Model> {
  page?: number;
  perPage?: number;
  totalItems?: number;
  totalPages?: number;
  items?: Model[];
}

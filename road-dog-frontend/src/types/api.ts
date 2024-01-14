export class PaginationQueryParams {
  page: number;
  pageSize: number;

  constructor(page = 0, pageSize = 500) {
    this.page = page;
    this.pageSize = pageSize;
  }
}
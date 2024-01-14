import { Request } from 'express';
import { API_PAGE_SIZE } from '../constants';

export function getDbPaginationFormQueryParams(req: Request) {
  const { page = '0', pageSize = `${API_PAGE_SIZE}` } = req.query;
  const pageNo = parseInt(`${page}`);
  const pageSizeNo = parseInt(`${pageSize}`);
  return {
    skip: pageNo * pageSizeNo,
    take: pageSizeNo
  }
}
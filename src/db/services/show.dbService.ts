import { Show, ShowStatus } from '@prisma/client';
import getPrismaClient from '../client';
import { ApiPagination } from '../../types/api';
import { API_PAGE_SIZE } from '../../constants';

export async function listShowsForBand(
  bandId: string,
  {
    includeUnconfirmedShows = false,
    pagination = {
      skip: 0,
      take: API_PAGE_SIZE
    }
  }: Partial<{
    includeUnconfirmedShows: boolean;
    pagination: ApiPagination;
  }>
) {
  const prisma = await getPrismaClient();
  return prisma.show.findMany({
    where: {
      bandsPlaying: {
        some: {
          band: {
            id: bandId
          }
        }
      },
      ...(!includeUnconfirmedShows && {
        status: {
          not: ShowStatus.PENDING
        }
      })
    },
    orderBy: {
      date: 'desc'
    },
    ...pagination
  })
}

export async function createShow(
  show: Pick<Show, 'createdById' | 'date'> & Partial<Pick<Show, 'doorsOpenAt' | 'eventName' | 'status' | 'venueId'>>
) {
  const prisma = await getPrismaClient();
  return prisma.show.create({
    data: {
      ...show,
      updatedById: show.createdById
    }
  })
}
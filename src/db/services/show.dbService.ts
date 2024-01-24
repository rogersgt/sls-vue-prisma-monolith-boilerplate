import { BandShow, Show, ShowStatus } from '@prisma/client';
import getPrismaClient from '../client';
import { ApiPagination } from '../../types/api';

export async function searchShows(
  {
    bandId,
    includeUnconfirmedShows = false,
    pagination,
    dateRange,
  }: Partial<{
    bandId: string;
    includeUnconfirmedShows: boolean;
    pagination: ApiPagination;
    dateRange: {
      startDate: Date;
      endDate: Date;
    };
  }>
) {
  const prisma = await getPrismaClient();
  return prisma.show.findMany({
    where: {
      ...(bandId && { 
        bandsPlaying: {
          some: {
            band: {
              id: bandId
            }
          }
        }
      }),
      ...(!includeUnconfirmedShows && {
        AND: {
          status: {
            not: ShowStatus.PENDING
          }
        }
      }),
      ...(dateRange && {
        AND: {
          date: {
            gte: dateRange.startDate,
            lte: dateRange.endDate
          }
        }
      })
    },
    include: {
      bandsPlaying: {
        include: {
          band: true
        }
      },
      venue: true,
    },
    orderBy: {
      date: 'desc'
    },
    ...(pagination && { ...pagination })
  })
}

export async function createShow(
  show: Pick<Show, 'createdById' | 'date'> & Partial<Pick<Show, 'doorsOpenAt' | 'eventName' | 'status' | 'venueId'>> & {
    bandsPlaying?: Pick<BandShow, 'bandId' | 'lineupOrder'>[]
  }
) {
  const prisma = await getPrismaClient();
  const { bandsPlaying, ...showData } = show;
  return prisma.show.create({
    data: {
      ...showData,
      updatedById: show.createdById,
      ...(bandsPlaying?.length && { 
        bandsPlaying: {
          createMany: {
            data: bandsPlaying
          }
        }
      })
    },
    include: {
      ...(bandsPlaying?.length && {
        bandsPlaying: {
          include: {
            band: true
          }
        }
      })
    }
  });
}
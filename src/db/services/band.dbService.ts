import { Band, Genre } from '@prisma/client';
import { API_PAGE_SIZE } from '../../constants';
import { ApiPagination } from '../../types/api';
import getPrismaClient from '../client';

export async function getBand(bandId: string) {
  const prisma = await getPrismaClient();
  return prisma.band.findUnique({
    where: {
      id: bandId,
    },
    include: {
      bandMembers: true
    }
  })
}

export async function searchBands(
  query: { name: string; cityId?: string },
  { skip = 0, take = API_PAGE_SIZE }: ApiPagination
) {
  const prisma = await getPrismaClient();

  return prisma.band.findMany({
    where: {
      name: query.name,
      ...(query.cityId && { cityId: query.cityId })
    },
    skip,
    take
  });
}

export async function listBandsByCity(cityId: string, { skip = 0, take = API_PAGE_SIZE }: ApiPagination) {
  const prisma = await getPrismaClient();
  return prisma.band.findMany({
    where: {
      cityId
    },
    skip,
    take 
  });
}

export async function createBand(
  // eslint-disable-next-line max-len
  input: Pick<Band, 'name' | 'cityId'> & Partial<Pick<Band, 'founded' | 'instagramHandle' | 'websiteUrl' | 'spotifyArtistId'> & { genres: Pick<Genre, 'id'>[]}>,
  ownerId?: string
) {
  const { genres, ...band } = input;
  const prisma = await getPrismaClient();
  return prisma.band.create({
    data: {
      ...band,
      ...(genres?.length && {
        genres: {
          connect: genres
        }
      }),
      ...(ownerId && {
        bandMembers: {
          create: {
            role: 'OWNER',
            user: {
              connect: {
                id: ownerId,
              }
            }
          }
        }
      })
    },
    include: {
      bandMembers: !!ownerId
    }
  })
}

export async function listBandsUserIsMemberOf(userId: string) {
  const prisma = await getPrismaClient();
  return prisma.band.findMany({
    where: {
      bandMembers: {
        some: {
          userId
        }
      }
    },
    include: {
      genres: true,
      bandMembers: {
        include: {
          user: true
        }
      },
      city: true
    }
  })
}
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

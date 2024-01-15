import { City } from '@prisma/client';
import { API_PAGE_SIZE } from '../../constants';
import { ApiPagination } from '../../types/api';
import getPrismaClient from '../client';

/**
 * 
 * @param countryId defaults to USA countryId
 */
export async function listStates(countryId?: string) {
  const prisma = await getPrismaClient();
  return prisma.province.findMany({
    where:{
      ...(countryId && { countryId }),
      ...(!countryId && {
        country: {
          abbreviation: 'USA'
        }
      }),
    },
  })
}

export async function listCitiesInProvince(provinceId: string, { skip = 0, take = API_PAGE_SIZE }: ApiPagination) {
  const prisma = await getPrismaClient();
  return prisma.city.findMany({
    where: {
      provinceId
    },
    skip,
    take
  })
}

export async function searchCities(
  {
    nameQuery,
    provinceId
  }: {
    nameQuery: string,
    provinceId?: string
  }, { skip = 0, take = API_PAGE_SIZE }: ApiPagination
) {
  const prisma = await getPrismaClient();
  return prisma.city.findMany({
    where: {
      name: {
        contains: nameQuery,
        mode: 'insensitive'
      },
      ...(provinceId && { provinceId })
    },
    skip,
    take,
    include: {
      province: {
        include: {
          country: true
        }
      }
    }
  })
}

export async function createCity(city: Pick<City, | 'name' | 'provinceId'>) {
  const prisma = await getPrismaClient();
  return prisma.city.upsert({
    where: {
      name_provinceId: {
        provinceId: city.provinceId,
        name: city.name
      }
    },
    create: {
      ...city
    },
    update: {}
  })
}

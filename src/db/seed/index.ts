import logger from '../../logger'
import getPrismaClient from '../client';

import usStates from './data/states.json';
import genres from './data/genres.json';
import cities from './data/cities.json';
import { upperCaseFirstChar } from '../../utils/string';

async function seedDb() {
  const prisma = await getPrismaClient();
  await prisma.$transaction(async (tx) => {
    // states
    const states = await Promise.all(usStates.map(async ({ name, abbreviation }) => tx.province.upsert({
      where: {
        abbreviation
      },
      create: {
        name,
        abbreviation,
        country: {
          connectOrCreate: {
            where: {
              abbreviation: 'USA'
            },
            create: {
              abbreviation: 'USA',
              name: 'United States'
            },
          }
        }
      },
      update: {
        name
      }
    })))

    // genres
    await Promise.all(genres.map(async ({ name }) => {
      await tx.genre.upsert({
        where: {
          name
        },
        create: {
          name
        },
        update: {
          name
        }
      })
    }));

    // cities
    await tx.city.createMany({
      skipDuplicates: true,
      data: Object.keys(cities).map((stateName) => {
        const citiesInState = cities[stateName];
        const shapedCityNames = citiesInState.map(upperCaseFirstChar);
        const state = states.find(({ name }) => name === stateName);
        return shapedCityNames.map((name) => ({
          name,
          provinceId: state?.id ?? '',
        }))
      }).flat()
    })
  }, {
    maxWait: 15000,
    timeout: 15000
  })
}

seedDb().catch((e) => {
  logger.error(e);
  process.exit(1);
})
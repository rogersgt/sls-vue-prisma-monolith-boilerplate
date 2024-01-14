import logger from '../../logger'
import getPrismaClient from '../client';

import usStates from './data/states.json';
import genres from './data/genres.json';

async function seedDb() {
  const prisma = await getPrismaClient();
  await prisma.$transaction(async (tx) => {
    // states
    await Promise.all(usStates.map(async ({ name, abbreviation }) => {
      await tx.province.upsert({
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
      })
    }))

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
    }))
  })
}

seedDb().catch((e) => {
  logger.error(e);
  process.exit(1);
})
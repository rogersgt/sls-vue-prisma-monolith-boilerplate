/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

import config from '../config';

let client: PrismaClient | undefined;

// go ahead and call this during import so DB connection is ready during warm start
getPrismaClient().then(async (client) => {
  await client.$connect();
});

export default async function getPrismaClient() {
  if (!client) {
    const DATABASE_URL = await config.get('DATABASE_URL');
    client = new PrismaClient({
      log:
        process.env.PRISMA_DEBUG?.toLowerCase() === 'true'
          ? ['query', 'error']
          : ['error'],
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });
  }
  return client;
}

import logger from '../../logger'

async function seedDb() {
  // const prisma = await getPrismaClient();
  // await prisma.$transaction(async (tx) => {
  //   // TODO: Add any default data we need for fresh environment
  // }, {
  //   maxWait: 15000,
  //   timeout: 15000
  // })
}

seedDb().catch((e) => {
  logger.error(e);
  process.exit(1);
})
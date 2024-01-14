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

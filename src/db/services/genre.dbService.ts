import getPrismaClient from '../client';

export async function listGenres() {
  const prisma = await getPrismaClient();
  return prisma.genre.findMany();
}

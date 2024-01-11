import { User } from '@prisma/client';
import getPrismaClient from '../client';

export async function upsertUser(u: Pick<User, 'email'> & Partial<Pick<User, 'lastName' | 'firstName'>>) {
  const prisma = await getPrismaClient();
  return prisma.user.upsert({
    where: {
      email: u.email
    },
    create: {
      email: u.email,
      ...(u.firstName && { firstName: u.firstName }),
      ...(u.lastName && { lastName: u.lastName })
    },
    update: {
      firstName: u.firstName,
      ...(u.lastName && { lastName: u.lastName })
    }
  })
}

export async function listUsersInBand(bandId: string) {
  const prisma = await getPrismaClient();
  const resp = await prisma.bandUser.findMany({
    where: {
      bandId
    },
    include: {
      user: true
    }
  });
  return resp.map((bandUser) => {
    const { user, ...assignment } = bandUser;
    return {
      ...user,
      bandMemberships: [assignment]
    }
  });
}

export async function removeUserFromBand(userId: string, bandId: string) {
  const prisma = await getPrismaClient();
  return prisma.bandUser.deleteMany({
    where: {
      bandId,
      userId
    }
  });
}
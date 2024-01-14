import { newEnforcer } from 'casbin';
import type { Enforcer } from 'casbin';
import { join, normalize } from 'path';
import getPrismaClient from '../db/client';

const MODEL = normalize(join(__dirname, 'model.conf'));
const ROLE_POLICIES = normalize(join(__dirname, 'roles.csv'));

let e: Enforcer | undefined;

export default async function getCasbinEnforcer() {
  if (!e) {
    e = await newEnforcer(MODEL, ROLE_POLICIES);
    await e.loadPolicy();
  }
  return e;
}

export async function userHasPermissionInBand(userId: string, bandId: string, object: string, action: 'read' | 'write') {
  const e = await getCasbinEnforcer();
  const prisma = await getPrismaClient();
  const relationships = await prisma.bandUser.findMany({
    where: {
      bandId,
      userId
    }
  });
  const rules = relationships.map(({ role }) => [role, object, action]);
  if (!rules.length) return false;
  return !!(await e.batchEnforce(rules)).find((res) => !!res);
}
import { newEnforcer } from 'casbin';
import type { Enforcer } from 'casbin';
import { join, normalize } from 'path';

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

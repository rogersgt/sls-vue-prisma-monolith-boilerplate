import httpClient from '@/clients/http';
import { User } from '@/types/core';

export async function getUser(id?: string) {
  const { data }: { data: User } = await httpClient.get(id ? `/user/${id}` : '/user');
  return new User(data);
}

import httpClient from '@/clients/http';
import type { User } from '@/types/core';

type TokenResponse = {
  access_token: string;
}

export async function login(code: string) {
  const { data }: { data: { tokens: TokenResponse; user: User } } = await httpClient.post('/login', {
    code
  })

  return data;
}

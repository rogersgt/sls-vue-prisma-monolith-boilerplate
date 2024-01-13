import httpClient from '@/clients/http';
import { User } from '@/types/core';

type TokenResponse = {
  access_token: string;
}

export async function login(code: string) {
  const { data }: { data: { tokens: TokenResponse; user: User } } = await httpClient.post('/auth/login', {
    code
  })

  return {
    ...data,
    user: new User(data.user)
  };
}

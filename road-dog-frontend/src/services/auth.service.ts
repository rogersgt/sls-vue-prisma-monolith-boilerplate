import httpClient from '@/clients/http';

type TokenResponse = {
  access_token: string;
  expiry_date: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: 'Bearer'
}

export async function login(code: string) {
  const { data }: { data: { tokens: TokenResponse } } = await httpClient.post('/login', {
    code
  })

  return data;
}

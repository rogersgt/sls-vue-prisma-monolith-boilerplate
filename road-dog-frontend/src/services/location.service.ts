import httpClient from '@/clients/http';

export async function listStates() {
  const {} = await httpClient.get('/')
}
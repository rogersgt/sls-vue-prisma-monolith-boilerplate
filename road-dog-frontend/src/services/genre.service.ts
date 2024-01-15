import httpClient from '@/clients/http';
import { Genre } from '@/types/core';

export async function listGenres() {
  const { data }: {
    data: Genre[]
  } = await httpClient.get('/genre');
  return data.map((g) => new Genre({ ...g }));
}
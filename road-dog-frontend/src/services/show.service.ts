import httpClient from '@/clients/http';
import { Show } from '@/types/core';

export async function createShow(show: Show) {
  const {
    data
  }: {
    data: Show
  } = await httpClient.post('/show', show);
  return new Show({ ...data });
}

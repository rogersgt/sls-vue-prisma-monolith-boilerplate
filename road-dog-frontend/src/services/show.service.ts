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

export async function searchShowsForBand(bandId: string, startDate: Date, endDate: Date) {
  const {
    data
  }: {
    data: Show[]
  } = await httpClient.post('/show/search', {
    bandId,
    dateRange: {
      startDate,
      endDate
    }
  });
  return data.map((show) => new Show({ ...show }))
}

import httpClient from '@/clients/http';
import { Band } from '@/types/core';

export async function searchBands(nameQuery: string, cityId?: string) {
  const { data = [] }: { data: Band[] } = await httpClient.post('/band/search', {
    name: nameQuery,
    cityId
  });
  return data.map((b) => new Band(b));
}

export async function listBandsByCity(cityId: string) {
  const { data = [] }: { data: Band[] } = await httpClient.get(`/band/discover/${cityId}`);
  return data.map((b) => new Band(b));
}

export async function createBand(band: Pick<Band, 'name' | 'cityId' | 'genres'>) {
  const {
    data
  }: {
    data: Band
  } = await httpClient.post('/band', band);
  return new Band({
    ...data
  })
}

export async function listBandsForLoggedInUser() {
  const {
    data
  }: {
    data: Band[]
  } = await httpClient.get('/band');
  return data.map((b) => new Band({ ...b }));
}

export async function deleteBand(id: string) {
  await httpClient.delete(`/band/${id}`);
}

export async function getBandById(bandId: string) {
  const {
    data
  }: {
    data: Band
  } = await httpClient.get(`/band/${bandId}`);
  return new Band({
    ...data
  })
}

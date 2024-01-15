import httpClient from '@/clients/http';
import { City, Province } from '@/types/core';

export async function listStates(countryId?: string) {
  const {
    data
  }: {
    data: Province[]
  } = await httpClient.get('/location/states' + (countryId ? `?countryId=${countryId}` : ''));

  return data.map((s) => new Province(s));
}

export async function searchCities(nameQuery: string, provinceId?: string) {
  const {
    data
  }: {
    data: City[]
  } = await httpClient.post('/location/cities/search', {
    nameQuery,
    provinceId
  });
  return data.map((c) => new City(c));
}
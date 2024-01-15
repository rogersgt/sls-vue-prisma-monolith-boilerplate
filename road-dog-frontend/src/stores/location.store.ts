import { City, Province } from '@/types/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as locationService from '@/services/location.service';

const useLocationStore = defineStore('LocationStore', () => {
  const statesCache = ref<{
    [provinceId: string]: Province
  }>({});
  const cityCache = ref<{
    [cityId: string]: City
  }>({});

  const receiveStates = (states: Province[]) => {
    const newStates = states.reduce((prev, curr) => {
      const currentCache = statesCache.value[curr.id];
      return {
        ...prev,
        [curr.id]: new Province({
          ...currentCache,
          ...curr
        })
      }
    }, {} as { [provinceId: string]: Province });
    statesCache.value = {
      ...statesCache.value,
      ...newStates
    }
  };

  const receiveCities = (cities: City[]) => {
    const newCities = cities.reduce((prev, curr) => {
      const currentCache = cityCache.value[curr.id];
      return {
        ...prev,
        [curr.id]: new City({
          ...currentCache,
          ...curr
        })
      }
    }, {} as { [cityId: string]: City });
    cityCache.value = {
      ...cityCache.value,
      ...newCities
    };
  };

  const fetchStates = async (countryId?: string) => {
    const states = await locationService.listStates(countryId);
    receiveStates(states);
    return states;
  };
  const listStates = (countryAbbreviation = 'USA') => statesCache.value[countryAbbreviation];

  const searchCities = async (nameQuery: string, provinceId?: string) => {
    const cities = await locationService.searchCities(nameQuery, provinceId);
    receiveCities(cities);
    return cities;
  };

  return {
    receiveCities,
    receiveStates,
    fetchStates,
    listStates,
    searchCities
  };
});

export default useLocationStore;

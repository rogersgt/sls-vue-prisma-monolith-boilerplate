import type { Band } from '@/types/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const useBandStore = defineStore('BandStore', () => {
  const bandCache = ref<{
    [bandId: string]: Band
  }>({});

  const receiveBands = (BandUpdates: Band[]) => {
    const newBands = BandUpdates.reduce((prev, curr) => {
      const existingCache = bandCache.value[curr.id];
      return {
        ...prev,
        [curr.id]: {
          ...existingCache,
          ...curr
        }
      }
    }, {} as { [id: string]: Band});

    bandCache.value = {
      ...bandCache.value,
      ...newBands
    }
  }


  const getBandById = async (bandId: string) => {
    const cachedBand = bandCache.value[bandId];
    if (cachedBand) return cachedBand;
    return null;
  }

  return {
    getBandById,
    receiveBands
  }
});

export default useBandStore;

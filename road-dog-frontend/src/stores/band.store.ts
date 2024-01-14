import type { Band } from '@/types/core';
import { defineStore } from 'pinia';

const useBandStore = defineStore('BandStore', () => {
  let bandCache: {
    [bandId: string]: Band
  } = {};

  const receiveBands = (BandUpdates: Band[]) => {
    const newBands = BandUpdates.reduce((prev, curr) => {
      const existingCache = bandCache[curr.id];
      return {
        ...prev,
        [curr.id]: {
          ...existingCache,
          ...curr
        }
      }
    }, {} as { [id: string]: Band});

    bandCache = {
      ...bandCache,
      ...newBands
    }
  }


  const getBandById = async (bandId: string) => {
    const cachedBand = bandCache[bandId];
    if (cachedBand) return cachedBand;
  }

  return {
    getBandById,
    receiveBands
  }
});

export default useBandStore;

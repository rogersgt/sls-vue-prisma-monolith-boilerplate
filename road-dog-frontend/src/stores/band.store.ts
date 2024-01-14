import type { Band } from '@/types/core';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import useUserStore from './user.store';

const useBandStore = defineStore('BandStore', () => {
  const bandCache = ref<{
    [bandId: string]: Band
  }>({});

  const userStore = useUserStore();
  const { loggedInUser$ } = storeToRefs(userStore);

  const loggedInUserBands$ = computed(() => {
    if (!loggedInUser$.value?.bandMemberships.length) return [];
    return loggedInUser$.value.bandMemberships.reduce((prev, { bandId }) => {
      const band = getBandById(bandId);
      if (!band) return prev;
      return prev.concat([band]);
    }, [] as Band[]);
  })

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


  const getBandById = (bandId: string) => {
    const cachedBand = bandCache.value[bandId];
    if (cachedBand) return cachedBand;
    return null;
  }

  return {
    loggedInUserBands$,
    getBandById,
    receiveBands
  }
});

export default useBandStore;

import { BandMembership, Band, User } from '@/types/core';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import useUserStore from './user.store';
import * as bandService from '@/services/band.service';

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
      const users = curr.bandMemberShips.reduce((prev, curr) => {
        if (curr.user) return prev.concat([curr.user])
        return prev;
      }, [] as User[]);

      userStore.receiveUsers(users);

      const existingCache = bandCache.value[curr.id];
      return {
        ...prev,
        [curr.id]: {
          ...existingCache,
          ...curr,
        }
      }
    }, {} as { [id: string]: Band});

    bandCache.value = {
      ...bandCache.value,
      ...newBands
    }
  };


  const getBandById = (bandId: string) => {
    const cachedBand = bandCache.value[bandId];
    if (cachedBand) return cachedBand;
    return null;
  };

  const createMyBand = async ({ name, cityId, genres = [] }: Band) => {
    const band = await bandService.createBand({
      name,
      cityId,
      genres
    });
    const existingUserBands = (loggedInUser$.value?.bandMemberships ?? []).map((membership) => {
      const cachedBand = bandCache.value[membership.bandId];
      return new BandMembership({
        ...membership,
        band: cachedBand,
      })
    });
    userStore.receiveUsers([new User({
      ...loggedInUser$.value,
      bandMemberships: existingUserBands.concat([new BandMembership({
        bandId: band.id,
        band,
        userId: loggedInUser$.value?.id
      })])
    })])
    receiveBands([band]);
    return band;
  };

  const fetchBandsForLoggedInUser = async () => {
    const bands = await bandService.listBandsForLoggedInUser();
    receiveBands(bands);
    return bands;
  };

  const getBandMembers = (bandId: string) => {
    const cachedBand = bandCache.value[bandId];
    if (!cachedBand) return [];
    return cachedBand.bandMemberShips.map(({ userId, role, id }) => {
      const user = userStore.getUserById(userId);
      return new BandMembership({
        bandId,
        user,
        role,
        id
      })
    })
  };

  return {
    bandCache,
    createMyBand,
    getBandMembers,
    loggedInUserBands$,
    getBandById,
    fetchBandsForLoggedInUser,
    receiveBands
  }
});

export default useBandStore;

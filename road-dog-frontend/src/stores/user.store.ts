import { Band, type User } from '@/types/core';
import { defineStore } from 'pinia';
import * as userService from '@/services/user.service';
import { computed, ref } from 'vue';
import useBandStore from './band.store';

const useUserStore = defineStore('UserStore', () => {
  const userCache = ref<{
    [id: string]: User
  }>({});

  const loggedInUserId = ref('');

  const fetchUserById = async (id: string) => {
    const resp = await userService.getUser(id);
    receiveUsers([resp]);
    return resp;
  };

  const getUserById = (id: string) => {
    const existingUser = userCache.value[id];
    return existingUser as User;
  }

  const receiveUsers = (userUpdates: User[]) => {
    const bandStore = useBandStore();
    const newUsers = userUpdates.reduce((prev, curr) => {
      const { bandMemberships } = curr;
      const bands = bandMemberships.map(({ band, bandId }) => band ?? new Band({ id: bandId }));
      bandStore.receiveBands(bands);
      const existingCache = userCache.value[curr.id];
      return {
        ...prev,
        [curr.id]: {
          ...existingCache,
          ...curr
        }
      }
    }, {} as { [id: string]: User});

    userCache.value = {
      ...userCache.value,
      ...newUsers
    }
  };

  const fetchLoggedInUser = async () => {
    const resp = await userService.getUser();
    receiveUsers([resp]);
    setLoggedInUser(resp.id);
    return resp;
  };

  const setLoggedInUser = (userId: string) => {
    loggedInUserId.value = userId;
  };

  const loggedInUser$ = computed(() => loggedInUserId.value ? userCache.value[loggedInUserId.value] : null);

  return {
    getUserById,
    fetchUserById,
    fetchLoggedInUser,
    loggedInUser$,
    setLoggedInUser,
    receiveUsers
  };
})

export default useUserStore;

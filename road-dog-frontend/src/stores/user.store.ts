import { Band, type User } from '@/types/core';
import { defineStore } from 'pinia';
import * as userService from '@/services/user.service';
import { computed } from 'vue';
import useBandStore from './band.store';

const useUserStore = defineStore('UserStore', () => {
  let userCache: {
    [id: string]: User
  } = {};

  let loggedInUserId: string | undefined;

  const fetchUserById = async (id: string) => {
    const resp = await userService.getUser(id);
    receiveUsers([resp]);
    return resp;
  };

  const getUserById = (id: string) => {
    const existingUser = userCache[id];
    return existingUser as User;
  }

  const receiveUsers = (userUpdates: User[]) => {
    const bandStore = useBandStore();
    const newUsers = userUpdates.reduce((prev, curr) => {
      const { bandMemberships } = curr;
      const bands = bandMemberships.map(({ band, bandId }) => band ?? new Band({ id: bandId }));
      bandStore.receiveBands(bands);
      const existingCache = userCache[curr.id];
      return {
        ...prev,
        [curr.id]: {
          ...existingCache,
          ...curr
        }
      }
    }, {} as { [id: string]: User});

    userCache = {
      ...userCache,
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
    loggedInUserId = userId;
  };

  const loggedInUser$ = computed(() => loggedInUserId ? userCache[loggedInUserId] : null);

  return {
    getUserById,
    fetchUserById,
    getLoggedInUser: fetchLoggedInUser,
    loggedInUser$,
    setLoggedInUser,
    receiveUsers
  };
})

export default useUserStore;

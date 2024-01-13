import type { User } from '@/types/core';
import { defineStore } from 'pinia';
import * as userService from '@/services/user.service';

const useUserStore = defineStore('UserStore', () => {
  let users: {
    [id: string]: User
  } = {};

  let loggedInUserId: string | undefined;

  const getUserById = async (id: string) => {
    const existingUser = users[id];
    if (existingUser) return existingUser;
    const resp = await userService.getUser(id);
    receiveUsers([resp]);
    return resp;
  };

  const receiveUsers = (userUpdates: User[]) => {
    const newUsers = userUpdates.reduce((prev, curr) => {
      const existingCache = users[curr.id];
      return {
        ...prev,
        [curr.id]: {
          ...existingCache,
          ...curr
        }
      }
    }, {} as { [id: string]: User});

    users = {
      ...users,
      ...newUsers
    }
  }

  const getLoggedInUser = async () => {
    const cachedLoggedInUser = loggedInUserId ? users[loggedInUserId] : undefined;
    if (cachedLoggedInUser) return cachedLoggedInUser;
    const resp = await userService.getUser();
    return resp;
  };

  const setLoggedInUser = (userId: string) => {
    loggedInUserId = userId;
  }

  return {
    getUserById,
    getLoggedInUser,
    setLoggedInUser,
    receiveUsers
  };
})

export default useUserStore;

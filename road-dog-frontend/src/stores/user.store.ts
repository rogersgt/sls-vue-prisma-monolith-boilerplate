import type { User } from '@/types/core';
import { defineStore } from 'pinia';

const useUserStore = defineStore('UserStore', () => {
  let users: {
    [id: string]: User
  } = {};

  let loggedInUserId: string | undefined;

  const getUserById = (id: string) => users[id];

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

  const getLoggedInUser = () => loggedInUserId ? users[loggedInUserId] : undefined;

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

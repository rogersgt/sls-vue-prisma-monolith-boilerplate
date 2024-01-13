import { defineStore } from 'pinia';
import * as authService from '@/services/auth.service';
import { User } from '@/types/core';
import useUserStore from './user.store';

const useAuthStore = defineStore('AuthStore', () => {
  const login = async (code: string) => {
    const userStore = useUserStore();
    const resp = await authService.login(code);
    const user = new User(resp.user)
    userStore.receiveUsers([user])
    userStore.setLoggedInUser(user.id)
    return resp.tokens;
  }

  return {
    login
  };
})

export default useAuthStore;

import { defineStore } from 'pinia';
import * as authService from '@/services/auth.service';

const useAuthStore = defineStore('AuthStore', () => {
  const login = async (code: string) => {
    try {
      const resp = await authService.login(code);
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  }
  return {
    login
  };
});

export default useAuthStore;

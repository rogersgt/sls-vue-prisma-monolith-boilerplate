import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

const useNavStore = defineStore('NavStore', () => {
  const goToLogin = () => {
    const router = useRouter();
    router.push({ name: 'login' })
  }

  return {
    goToLogin
  }
})

export default useNavStore
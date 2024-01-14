import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

const useNavStore = defineStore('NavStore', () => {
  let sidePanelOpen = false;

  const toggleSidePanel = () => {
    sidePanelOpen = !sidePanelOpen;
  }

  const goToLogin = () => {
    const router = useRouter();
    router.push({ name: 'login' })
  }

  return {
    sidePanelOpen,
    toggleSidePanel,
    goToLogin
  }
})

export default useNavStore
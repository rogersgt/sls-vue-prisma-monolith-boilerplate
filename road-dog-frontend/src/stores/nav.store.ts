import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const useNavStore = defineStore('NavStore', () => {
  const sidePanelOpen = ref(false);

  const toggleSidePanel = () => {
    sidePanelOpen.value = !sidePanelOpen.value;
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
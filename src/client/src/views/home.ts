import { defineComponent, ref } from 'vue';

export default defineComponent({
  template: `
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
      <button @click="checkStatus">Check Status</button>
      <p v-if="status">Status: {{ status }}</p>
    </div>
  `,
  setup() {
    const status = ref<string>('');
    const checkStatus = async () => {
      console.log('click')
      const resp = await fetch('/api/status');
      const statusData = await resp.json() as { status: string };
      status.value = statusData.status;
    };

    return {
      checkStatus,
      status,
    }
  }
})
import { createApp, onMounted } from 'vue';

const app = createApp({
  template: `
  <div>
    <h1>Test</h1>
  </div>`,
  setup() {
    onMounted(() => {
      console.log('mounted vue');
    })
  }
});

app.mount('#app');

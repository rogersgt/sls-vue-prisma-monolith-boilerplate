import './styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'
import PersistedState from 'pinia-plugin-persistedstate';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
})

const pinia = createPinia()
pinia.use(PersistedState)
app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_APP_ID
})

app.mount('#app')

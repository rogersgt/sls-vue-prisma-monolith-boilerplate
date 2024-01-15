import './styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'
import PersistedState from 'pinia-plugin-persistedstate';

/* -- font awesome -- */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import specific icons
import {
  faG,
  faCircleNotch,
  faSpinner,
  faBars,
  faX,
  faEnvelope,
  faPlus,
  
} from '@fortawesome/free-solid-svg-icons'

/* -- Vuetify -- */
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import colors from 'vuetify/util/colors'

import App from './App.vue'
import router from './router'

const app = createApp(App)

library.add(faG, faCircleNotch, faSpinner, faBars, faX, faEnvelope, faPlus)

const vuetify = createVuetify({
  components,
  directives,
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 340,
      md: 540,
      lg: 800,
      xl: 1280,
    },
  },
  theme: {
    defaultTheme: 'custom',    
    themes: {
      custom: {
        dark: false,
        // colors: {
        //   background: '#FFFFFF',
        //   surface: '#FFFFFF',
        //   primary: '#6200EE',
        //   'primary-darken-1': '#3700B3',
        //   secondary: '#03DAC6',
        //   'secondary-darken-1': '#018786',
        //   error: '#B00020',
        //   info: '#2196F3',
        //   success: '#4CAF50',
        //   warning: '#FB8C00',
        // },
      }
    }
  }
})

const pinia = createPinia()
pinia.use(PersistedState)
app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_APP_ID
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')

import 'v-calendar/style.css';

import './styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'
// import PersistedState from 'pinia-plugin-persistedstate';
// @ts-expect-error cannot find types?
import Colada, { PiniaColadaPlugin } from 'colada-plugin';

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
  faArrowUpRightFromSquare,
  faEllipsisVertical
} from '@fortawesome/free-solid-svg-icons'

/* -- Vuetify -- */
import VCalendar from 'v-calendar';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import colors from 'vuetify/util/colors'

import App from './App.vue'
import router from './router'

const app = createApp(App)

library.add(
  faG,
  faCircleNotch,
  faSpinner,
  faBars,
  faX,
  faEnvelope,
  faPlus,
  faArrowUpRightFromSquare,
  faEllipsisVertical
)

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
        dark: true,
        colors: {
          background: '#cbced1',
          surface: '#FFFFFF',
          primary: '#3b60e4',
          'primary-darken-1': '#3657c9',
          'primary-darken-2': '#304db3',
          'primary-darken-3': '#2c48a8',
          'primary-darken-4': '#243c87',
          secondary: '#c8adc0',
          'secondary-darken-1': 'A994A3',
          error: '#CE3A51',
          info: '#7765E3',
          success: '#A5C783',
          warning: '#D5CB71',
          grey: '#C7C5B5',
          'grey-darken-1': '#7a7d7b',
          'grey-darken-2': '#B0AEA2',
          'grey-darken-3': '#898881',
          'grey-darken-4': '#6A6A65',
          'black': '#080708'
        },
      }
    }
  }
})

const pinia = createPinia()
// pinia.use(PersistedState)
app.use(pinia)
if (import.meta.env.VITE_NODE_ENV !== 'production') {
  pinia.use(PiniaColadaPlugin);
  app.use(Colada);
}
app.use(router)
app.use(vuetify)
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_APP_ID
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(VCalendar, {})
app.mount('#app')

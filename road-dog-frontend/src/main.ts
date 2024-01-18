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
          primary: '#004bb3',
          'primary-darken-1': '#02429c',
          'primary-darken-2': '#003887',
          'primary-darken-3': '#013073',
          'primary-darken-4': '#012457',
          secondary: '#7212e0',
          'secondary-darken-1': '#600dbf',
          error: '#8a0f1d',
          info: '#00aab3',
          success: '#2fad33',
          warning: '#ada52f',
          grey: '#818a84',
          'grey-darken-1': '#7a7d7b',
          'grey-darken-2': '#646665',
          'grey-darken-3': '#4e4f4f',
          'grey-darken-4': '#2d2e2e',
          'black': '#000000'
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
app.mount('#app')

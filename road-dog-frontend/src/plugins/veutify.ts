import { createVuetify } from 'vuetify'

import colors from 'vuetify/util/colors'

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.blue.lighten2,
          secondary: colors.grey.darken4,
          highlight: colors.yellow.accent3,
          grey: colors.grey.lighten1
        }
      },
    },
  },
})
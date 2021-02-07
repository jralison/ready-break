import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import pt from 'vuetify/src/locale/pt'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#ee44aa',
        secondary: '#424242',
        accent: '#82b1ff',
        error: '#ff5252',
        info: '#2196f3',
        success: '#4caf50',
        warning: '#ffc107',
      },
    },
  },
  lang: {
    locales: { pt },
    current: 'pt',
  },
})

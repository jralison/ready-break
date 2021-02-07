<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      dense
    >
      <div class="d-flex align-center">
        <v-img
          alt="Ícone ReadyBreak"
          class="shrink mr-2"
          contain
          :src="logo"
          transition="scale-transition"
          width="32"
        />

        <v-img
          alt="Nome ReadyBreak"
          class="shrink hidden-sm-and-down"
          contain
          max-width="150"
          :src="logoName"
        />
      </div>
    </v-app-bar>

    <v-main>
      <Editor />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Editor from '@/components/Editor.vue'

import Logo from './assets/logo.svg'
import LogoName from './assets/ready-break-name.svg'

@Component({
  components: {
    Editor,
  },
})
export default class App extends Vue {
  logo = Logo
  logoName = LogoName
}
</script>

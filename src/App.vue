<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      dense
      clipped-left
    >
      <div class="d-flex align-center">
        <v-img
          alt="Ícone ReadyBreak"
          class="shrink mr-2"
          contain
          src="./assets/logo.svg"
          transition="scale-transition"
          width="32"
        />

        <v-img
          alt="Nome ReadyBreak"
          class="shrink hidden-sm-and-down"
          contain
          max-width="150"
          src="./assets/ready-break-name.svg"
        />
      </div>
    </v-app-bar>

    <v-main>
      <Editor />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Editor from '@/components/Editor.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    Editor,
  },
})
export default class App extends Vue {
  //
}
</script>

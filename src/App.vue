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

      <v-spacer />

      <v-btn
        href="https://jralison.com/?ref=readybreak"
        target="_blank"
        class="text-none"
        text
      >
        <span class="font-weight-regular text--secondary">criado &lt;3 por</span>
        <span class="font-weight-black ml-1">jralison</span>
        <v-icon right>
          mdi-open-in-new
        </v-icon>
      </v-btn>
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

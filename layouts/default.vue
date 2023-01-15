<template>
  <v-app app dark>
    <v-toolbar app>
      <v-btn icon @click="exit">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>{{ chatTitle }}</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <div style="height: 100%">
        <nuxt/>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["user", "car"]),

    isCarChat() {
      return this.$route.path.includes('car')
    },

    chatTitle() {
      return this.isCarChat ? `Вы подключены к машине с номером ${this.car.car}` : `Пользователь ${this.user.name}`
    }
  },

  methods: {
    ...mapMutations(["clearData"]),

    exit() {
      this.$socket.emit("userLeft");
    }
  },
};
</script>

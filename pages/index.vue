<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8>
      <v-card min-width="400">
        <v-snackbar v-model="snackbar" :timeout="6000" top>
          {{ message }}
          <v-btn color="pink" flat @click="snackbar = false">Закрыть</v-btn>
        </v-snackbar>

        <v-card-title>
          <h1>Каршеринг</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-text-field v-model="userName" label="Ваше имя" required></v-text-field>
            <v-text-field v-model.number="carName" label="Введите номер машины" required></v-text-field>

            <v-btn color="primary" @click="submit">Забронировать</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  layout: "empty",

  sockets: {
    connect: function () {
      console.log("socket connected");
    }
  },

  data() {
    return {
      userName: '',
      carName: '',
      snackbar: false,
      message: ''
    }
  },

  methods: {
    ...mapMutations(["setUser"]),

    submit() {
      const user = {name: this.userName, car: this.carName};

      this.$socket.emit("userJoined", user, (data) => {
        if (typeof data === 'string') {
          this.snackbar = true
          this.message = data
          return
        }

        user.id = data.userId;
        this.setUser(user);
        this.$router.push("/chat");
      });
    }
  }
};
</script>

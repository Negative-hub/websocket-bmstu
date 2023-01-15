<template>
  <v-flex xs12>
    <v-btn @click="$emit('stop')">Поставить на ожидание</v-btn>
    <v-btn @click="$emit('start')">Снять с ожидания</v-btn>
    <v-btn @click="$emit('end')">Завершить поезду</v-btn>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {

    }
  }
};
</script>


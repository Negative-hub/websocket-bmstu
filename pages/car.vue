<template>
  <div class="c-wrap">
    <div class="c-chat" ref="block">
      <Message
        v-for="m in getMessagesCar"
        :key="m.id"
        :text="m.text"
        :time="m.id"
        :owner="serverMessageTypes[m.type]"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Message from "@/components/Message";
import ChatForm from "@/components/ChatForm";

export default {
  components: {Message, ChatForm},

  computed: {
    ...mapGetters(["getMessagesCar"])
  },

  data() {
    return {
      interval: null,
      serverMessageTypes: {
        drive: true,
        stop: true,
        end: true
      }
    }
  },

  sockets: {
    carLeft() {
      setTimeout(() => {
        this.$router.push("/");
      }, 5000)
    }
  },
};
</script>

<style scoped>
.c-wrap {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.c-chat {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 80px;
  padding: 1rem;
  overflow-y: auto;
}
</style>



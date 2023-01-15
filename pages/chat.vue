<template>
  <div class="c-wrap">
    <div class="c-chat" ref="block">
      <Message
        v-for="m in getMessages"
        :key="m.id"
        :text="m.text"
        :time="m.id"
        :owner="serverMessageTypes[m.type]"
      />
    </div>
    <div class="c-form">
      <ChatForm @stop="changeStatusDrive('stop')" @start="changeStatusDrive('drive')" @end="endDrive"/>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from "vuex";
import Message from "@/components/Message";
import ChatForm from "@/components/ChatForm";

export default {
  components: {Message, ChatForm},

  computed: {
    ...mapState(["user"]),
    ...mapGetters(["getMessages"])
  },

  data() {
    return {
      serverMessageTypes: {
        drive: true,
        stop: true,
        end: true
      }
    }
  },

  sockets: {
    userLeft() {
      this.endDrive()
    }
  },

  methods: {
    endDrive() {
      this.$socket.emit('endDrive')

      setTimeout(() => {
        this.$socket.emit("userLeft", {user: this.user.id}, () => {
          this.$router.push("/");
        })
      }, 5000)
    },

    changeStatusDrive(status) {
      this.$socket.emit(status)
    }
  }
};
</script>

<style scoped>
.c-wrap {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.c-form {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  height: 80px;
  background: #212121;
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



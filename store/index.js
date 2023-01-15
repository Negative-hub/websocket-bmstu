export const state = () => ({
  user: {},
  messages: [],
  users: []
})

export const getters = {
  getMessages(state) {
    return state.messages.filter(m => m.user.name === state.user.name)
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },

  clearData(state) {
    state.user = {}
    state.messages = []
  },

  SOCKET_newMessage(state, message) {
    if (message.type === 'drive' || message.type === 'stop') {
      state.messages = state.messages.filter(m => m.type !== message.type)
      state.messages.push(message)
    } else {
      state.messages.push(message)
    }
  },
}

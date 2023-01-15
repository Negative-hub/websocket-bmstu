export const state = () => ({
  user: {},
  messages: [],

  car: {},
  carMessages: [],
})

export const getters = {
  getMessages(state) {
    return state.messages
      .filter(m => m.user.name === state.user.name)
      .sort((a, b) => a.id - b.id)
  },

  getMessagesCar(state) {
    return state.carMessages
      .filter(m => m.user.car === state.car.car)
      .sort((a, b) => a.id - b.id)
  }
}

export const mutations = {
  setUser(state, user) {
    state.user = user
  },

  setCar(state, car) {
    state.car = car
  },

  clearData(state) {
    state.user = {}
    state.messages = []
  },

  SOCKET_newMessage(state, message) {
    state.messages.push(message)
  },

  SOCKET_newMessageCar(state, message) {
    state.carMessages.push(message)
  },
}

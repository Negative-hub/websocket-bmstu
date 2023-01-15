const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users = require('./users')()
const cars = require('./cars')()

const m = (id, user, type, text) => ({id, user, type, text})

io.on('connection', socket => {
  socket.on('userJoined', (data, cb) => {
    users.remove(socket.id)

    if (users.getByCar(data.car)) {
      cb(`Машина с номером ${data.car} уже занята!`)
      return
    }

    console.log('socket connect', socket.id)
    console.log('add user', {
      id: socket.id,
      name: data.name,
      car: data.car
    })

    const user = users.add({
      id: socket.id,
      name: data.name,
      car: data.car,
      timestamp: Date.now() - 1,
    })

    cb({userId: socket.id, name: data.name})

    console.log(`received: ${m('message', `Добро пожаловать ${data.name}. Ваша поездка на машине ${data.car} началась`, users.get(socket.id), Date.now())}`)

    if (cars.get(data.car)) {
      socket.broadcast.emit('newMessageCar',
        m(
          Date.now(),
          user,
          'message',
          `Пользователь ${user.name} начал движение на машине ${user.car} в ${new Date(user.timestamp).toLocaleString()}`,
        )
      )
    }

    socket.emit('newMessage',
      m(
        Date.now(),
        users.get(socket.id),
        'message',
        `Добро пожаловать ${data.name}. Ваша поездка на машине ${data.car} началась`,
      )
    )
  })

  socket.on('carJoined', (data, cb) => {
    const user = users.getByCar(data.car)

    if (!user) {
      cb(`Машина ${data.car} еще не используется!`)
      return
    }

    cars.add({id: socket.id, car: data.car})
    cb({id: socket.id, car: data.car})

    socket.emit('newMessageCar',
      m(
        Date.now(),
        users.getByCar(data.car),
        'message',
        `Пользователь ${user.name} начал движение на машине ${data.car} в ${new Date(user.timestamp).toLocaleString()}`,
      )
    )
  })

  socket.on('drive', () => {
    const user = users.get(socket.id)

    console.log(`received: ${JSON.stringify(m('message', `Вы сняли машину с ожидания`,
      user,
      Date.now()))}`)

    socket.broadcast.emit('newMessageCar',
      m(
        Date.now(),
        user,
        'message',
        `Пользователь ${user.name} снял машину с ожидания`,
      ))

    socket.emit('newMessage',
      m(
        Date.now(),
        user,
        'message',
        `Машина снята с ожидания`,
      ))
  })

  socket.on('stop', () => {
    const user = users.get(socket.id)

    socket.broadcast.emit('newMessageCar',
      m(Date.now(), user, 'message', `Пользователь ${user.name} поставил машину на ожидание`))

    socket.emit('newMessage',
      m(Date.now(), user, 'message', `Вы поставили машину на ожидание`))
  })

  socket.on('endDrive', () => {
    const user = users.get(socket.id)

    const seconds = Math.floor((Date.now() - user.timestamp) / 1000 % 60)
    const minutes = Math.floor((Date.now() - user.timestamp) / 1000 / 60)

    console.log(`received: ${m('end',
      `Вы завершили поездку, ваше общее время ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      user,
      Date.now()
    )}`)

    socket.broadcast.emit('newMessageCar',
      m(
        Date.now(),
        users.get(socket.id),
        'end',
        `Пользователь ${user.name} завершил поездку в ${new Date(user.timestamp).toLocaleString()}, его общее время ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      )
    )
    socket.emit('newMessage',
      m(
        Date.now(),
        user,
        'end',
        `Вы завершили поездку, ваше общее время ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      )
    )
  })

  socket.on('userLeft', (data, cb) => {
    if (data) {
      console.log(`disconnect: ${JSON.stringify(m('dis',
        `disconnect'}`,
        users.get(socket.id),
        Date.now()
      ))}`)

      users.remove(socket.id)
      cb()

      return
    }

    io.emit('carLeft')
    io.emit('userLeft')
  })
})

module.exports = {
  app,
  server
}

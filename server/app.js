const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const users = require('./users')()

const m = (type, text, user, id) => ({type, text, user, id})
const getDrivingTime = (socket, type) => {
  const user = users.get(socket.id)

  const sub = type === 'drive' ? user.timeBeginStopping : user.timeBeginDriving
  const delta = Date.now() - user.timestamp - sub

  const seconds = Math.floor(delta / 1000 % 60)
  const minutes = Math.floor(delta / 1000 / 60)

  return `${type === 'drive' ? 'Ваша поездка длится' : 'Ваша стоянка длится'} ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

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

    users.add({
      id: socket.id,
      name: data.name,
      car: data.car,
      timeBetweenActions: Date.now(),
      timestamp: Date.now() - 1,
      timeBeginDriving: 0,
      timeBeginStopping: 0
    })

    cb({userId: socket.id, name: data.name})

    console.log(`received: ${m('message', `Добро пожаловать ${data.name}. Ваша поездка на машине ${data.car} началась`, users.get(socket.id), Date.now())}`)
    socket.emit('newMessage', m('message', `Добро пожаловать ${data.name}. Ваша поездка на машине ${data.car} началась`, users.get(socket.id), Date.now()))
  })

  socket.on('drive', () => {
    const user = users.get(socket.id)
    user.timeBeginStopping = Date.now() - user.timestamp - user.timeBeginDriving

    console.log(`received: ${JSON.stringify(m('message', `Вы сняли машину с ожидания`,
      user,
      Date.now()))}`)
    socket.emit('newMessage',
      m('message', `Вы сняли машину с ожидания`,
      user,
      Date.now()
    ))
  })

  // 10 0 0 10
  // 20 10 0 10
  // 25 10 5 10
  // 40 25 5 10
  socket.on('stop', () => {
    const user = users.get(socket.id)
    user.timeBeginDriving = Date.now() - user.timestamp - user.timeBeginStopping

    console.log(`received: ${JSON.stringify(m('message', `Вы поставили машину на ожидание`, user, Date.now()))}`)
    socket.emit('newMessage',
      m('message', `Вы поставили машину на ожидание`, user, Date.now()))
  })

  socket.on('endDrive', () => {
    const user = users.get(socket.id)

    const seconds = Math.floor((Date.now() - user.timestamp) / 1000 % 60)
    const minutes = Math.floor((Date.now() - user.timestamp) / 1000 / 60)

    console.log(`received: ${ m('end',
      `Вы завершили поездку, ваше общее время ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      user,
      Date.now()
    )}`)
    socket.emit('newMessage',
      m('end',
        `Вы завершили поездку, ваше общее время ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        user,
        Date.now()
      )
    )
  })

  socket.on('getTime', (data) => {
    // console.log(`received: ${JSON.stringify(m(data.type, getDrivingTime(socket, data.type), users.get(socket.id), Date.now()))}`)
    socket.emit('newMessage',
      m(data.type, getDrivingTime(socket, data.type), users.get(socket.id), Date.now())
    )
  })

  socket.on('userLeft', (data, cb) => {
    if (data) {
      console.log(`disconnect: ${ JSON.stringify(m('dis',
        `disconnect'}`,
        users.get(socket.id),
        Date.now()
      ))}`)

      cb()

      return
    }

    socket.emit('userLeft')
  })
})

module.exports = {
  app,
  server
}

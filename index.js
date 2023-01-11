const io = require("socket.io")(8000, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

let onlineUsers = []
io.on("connection", (socket) => {
  
  socket.on("user-online", (userId) => {
    if (!onlineUsers.some(user => user.userId === userId)) {
      onlineUsers.push({userId, socketId: socket.id})
    }
    io.emit('get-users-online', onlineUsers)
  })
  
  socket.on("disconnect", (userId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
    io.emit('get-users-online', onlineUsers)
  })
  
  socket.on("send-message", (data) => {
    const {receiverId} = data
    const user = onlineUsers.find(user => user.userId === receiverId)
    if (user) {
      io.to(user.socketId).emit('recieve-message', data)
    }
  })
})
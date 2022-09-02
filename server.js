// server implementation
const io = require('socket.io')(3000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// socket connection
io.on('connection', socket => {
  // socket handshake query to get input id or newly created id
  const id = socket.handshake.query.id
  
  // join with input or created id
  socket.join(id)

  // adds sender to message & removes the recipient so that the sender of the message is displayed
  // to the recipient & not the recipient
  socket.on('send-message', ({ recipients, text }) => {

    recipients.forEach(recipient => {
      // swap out recipient name for sender name
      const newRecipients = recipients.filter(recipient => (
        recipient !== recipient))
      newRecipients.push(id)
      // boradcast / send the message 
      socket.broadcast.to(recipient).emit('receive-message', { 
        recipients: newRecipients, sender: id, text
      })
    })
  })
})
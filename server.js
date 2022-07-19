// server implementation
const io = require('socket.io')(7000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// socket connection
io.on('connection', socket => {
  const id = socket.handshake.query.id
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
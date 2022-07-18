const io = require('socket.io')(7000)

io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  // adds sender to message sent & removes the recipients so that the sender of the message is displayed
  // & they will have proper list of recipients
  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(recipient => (
        recipient !== recipient))
      newRecipients.push(id)
      // boradcast to room if message has been sent
      socket.broadcast.to(recipient).emit('receive-message', { 
        recipients: newRecipients, sender: id, text
      })
    })
  })
})
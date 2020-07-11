const path= require('path')
const http= require('http')
const express = require('express')
const socketio= require('socket.io')
const Filter = require('bad-words')
const app= express()
const { generateMessage, generateLocationMessage}= require('./utils/messages')
const server =http.createServer(app)
const io= socketio(server)
const port= process.env.Port || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const { getUsersInRoom, getUser, removeUser, addUser}= require('./utils/users')

app.use(express.static(publicDirectoryPath))
//  let message= 'Welcome!'

 io.on('connection', (socket)=>{
     console.log('new socket connection')

socket.on('join', ({username, room}, callback)=>{
 const  {error, user}=  addUser({id:socket.id, username, room})
  
  if(error){
return callback(error)
  }

socket.join(user.room)

socket.emit('newMessage', generateMessage('Admin', 'Welcome!'))
socket.broadcast.to(user.room).emit('newMessage', generateMessage( 'Admin',`${user.username} has joined`))
io.to(user.room).emit('roomData', {
    room:user.room,
    namelist:getUsersInRoom(user.room)
})
callback()
})

    socket.on('sent',  (newMessage, callback)=>{
        const user= getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(newMessage)){
            return callback('Profanity is not allowed')
        }
        //  message = newMessage 
       io.to(user.room).emit('newMessage', generateMessage(user.username,  newMessage ))
       callback()
    })
    socket.on('sendLocation', ({latitude, longitude}=location, callback)=>{
        const user = getUser(socket.id)
    
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${latitude},${longitude}`))
        callback()
    })
socket.on('disconnect', ()=>{
   const user=  removeUser(socket.id)

   if(user){
    io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.username} has left!`))
    io.to(user.room).emit('roomData', {
        room: user.room,
        namelist:getUsersInRoom(user.room)
    })
   }
 
})
 })











server.listen(port, ()=>{
    console.log('Server is up on port '+ port)
});
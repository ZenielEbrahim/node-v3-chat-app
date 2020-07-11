const socket = io()
const $messageForm = document.querySelector('form')
const $sendButton = document.getElementById('send')
const $inputText =  document.getElementById('message')
const $sendLocationButton = document.getElementById('send-location')
const $messages= document.getElementById('messages')

const messageTemplates =document.getElementById('message-template').innerHTML
const locationURL  = document.getElementById('location-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

const {username, room}=Qs.parse(location.search, {ignoreQueryPrefix:true})

const autoscroll = ()=> {
   // new message element
   const $newMessage = $messages.lastElementChild

//Height of new message
const newMessageStyles= getComputedStyle($newMessage)
const newMessageMargin= parseInt(newMessageStyles.marginBottom)
const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

//visible height
const visibleHeight =$messages.offsetHeight

//Height of messages container
const contentHeight =$messages.scrollHeight

// How far have I scrolled
const scrollOffset =$messages.scrollTop + visibleHeight

if(contentHeight - newMessageHeight  <= scrollOffset){
   $messages.scrollTop =  $messages.scrollHeight
}


}


 socket.on('newMessage',(message)=>{
    console.log('====', message)
const html = Mustache.render(messageTemplates, {
   username:message.username,
   message:message.text,
   createdAt:moment(message.createdAt).format("h:mm a")
})
$messages.insertAdjacentHTML('beforeend', html)
autoscroll()
 })


socket.on('locationMessage', (message)=>{
   console.log('=+=+=0', message)
   const html = Mustache.render(locationURL, {
      username:message.username,
      url:message.url,
      createdAt:moment(message.createdAt).format("h:mm a")
   })
   $messages.insertAdjacentHTML('beforeend', html)
})
socket.on('roomData', ({room, namelist})=>{
   const html= Mustache.render(sidebarTemplate, {
      room,
      namelist
   })
   document.getElementById('sidebar').innerHTML =html
})

 $messageForm.addEventListener('submit', (e)=>{
$sendButton.setAttribute('disabled', 'disabled')
    e.preventDefault()
     socket.emit('sent', $inputText.value, (error)=>{
      $sendButton.removeAttribute('disabled')
      $inputText.value=''
      $inputText.focus()
        if(error){
           return console.log(error)
        }
        console.log('Message delivered!')
     })
   
 })

$sendLocationButton.addEventListener('click', ()=>{
  if(!navigator.geolocation){
     return alert('Geolocation is not supported by your browser.')
  }
  $sendLocationButton.setAttribute('disabled', 'disabled')
  
  navigator.geolocation.getCurrentPosition((position)=>{
socket.emit('sendLocation',{
   latitude:position.coords.latitude,
    longitude:position.coords.longitude
   }, ()=>{
      $sendLocationButton.removeAttribute('disabled')
      console.log('Location sent!')
   })
  })
})

socket.emit('join', {username, room}, (error)=>{
   if(error){
      alert(error)
      location.href = '/'
   }
})

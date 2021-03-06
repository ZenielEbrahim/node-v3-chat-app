const users = []

const addUser= ({id, username, room})=>{
//clean the data
username = username.trim().toLowerCase()
room = room.trim().toLowerCase()

//Validate the data
if(!username || !room){
return {
    error: 'Username and room are required.'
}
}
//check for existing user
const existingUser= users.find((user)=>{
return user.room ===room && user.username=== username
})
// Validate username
if(existingUser){
    return {
        error:'User name already in use.'
    }
}
// Store user
 const user = {id, username, room}
 users.push(user)
 return {user}
}



const removeUser= (id)=>{
    const index = users.findIndex(user=>{
        return user.id === id
    })

    if(index !== -1){
return users.splice(index, 1)[0]
    }
}

const getUser = (id)=>{
const user= users.find(users=>{
  return  users.id === id
})
return user
}
const dan = getUser(78)


const getUsersInRoom = (room)=>{
    const usersInRoom= users.filter(users=>{
        return users.room === room.trim().toLowerCase()
    })
    return usersInRoom
}

module.exports= { getUsersInRoom, getUser, removeUser, addUser}
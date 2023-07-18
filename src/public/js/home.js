const socketClient = io()

const chatbox = document.getElementById('chatbox')
const chat = document.getElementById('messageLogs')


Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Ingresa un nombre de usuario',
    inputValidator: (value) => {
        if (!value) {
            return 'El nombre de usuario es obligatorio'
        }
    },
    allowOutsideClick: false
}).then((result) => {
    user = result.value
    socketClient.emit('authenticated', `usuario ${user} ha inciado sesion`)
})

chatbox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (chatbox.value.trim().length > 0) {//corroboramos que el usuario no envie datos vacios
            socketClient.emit('message', { user: user, message: chatbox.value })
            chatbox.value = ''
        }
    }
})

socketClient.on('messageHistory', (dataServer) => {
    let messageElmts = '';
    dataServer.forEach(element => {
        messageElmts += `${element.user}: ${element.message} <br/>`
    });
    chat.innerHTML = messageElmts
})

socketClient.on('newUser',(data)=>{
    if(user){
        //si ya el usuario esta autenticado, entonces puede recibir notificaciones
        Swal.fire({
            text:data,
            toast:true,
            position:"top-right"
        })
    }
})
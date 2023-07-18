import express from "express";
import { engine } from 'express-handlebars'
import { __dirname } from "./utils.js";
import path from 'path'
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";

const port = process.env.port || 8080;

const app = express()



app.use(express.static(path.join(__dirname, '/public')))

//server express
const httpServer = app.listen(port, () => console.log('server listening on port ', port))


let messages = []
//hbs config
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));
//routes
app.use('/', viewsRouter)

//servidor de websocket
const io = new Server(httpServer)
//socketserver
io.on("connection", (socket) => {
    console.log("nuevo cliente conectado");
    
    socket.on('authenticated', (msg)=>{
        socket.emit('messageHistory', messages)
        socket.broadcast.emit('newUser', msg)
    })

    //recibir mensaje del cliente
    socket.on("message", (data) => {
        console.log("data", data);
        messages.push(data)
        //cada vez que recebimos este mensaje, enviamos todos los mensajes actualizados a todos los clientes
        io.emit('messageHistory', messages)
    })
});
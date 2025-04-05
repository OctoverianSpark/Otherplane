import { WebSocketServer } from 'ws'
import express from 'express'
import router from './routes.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const wss = new WebSocketServer({ port: 6547 })

wss.on('connection', ws => {
  console.log('Cliente conectado. Total clientes: ' + wss.clients.size)

  ws.on('message', message => {
    const decodedMessage = JSON.parse(Buffer.from(message))
    wss.clients.forEach(client => {
      if (client !== ws && client.readyStawte === WebSocket.OPEN) {
        client.send(JSON.stringify(decodedMessage))
      }
    })
  })
})

const app = express(cors({
  origin: ['https://otherplane.asistentevirtualsas.com']
}))

app.set('trust proxy', true)

app.use(express.json())

app.use(router)

app.listen(8647, console.log('Servidor Corriendo en 8647'))

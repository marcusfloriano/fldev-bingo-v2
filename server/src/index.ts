import express from 'express'
import cors from 'cors'

import { createServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'

import {
  initDB, getBalls, getBall, addBall, removeBall,
  getZoom, setZoom,
  clearBalls
} from './db.ts'

const app = express()
const PORT = 3001

const server = createServer(app)
const wss = new WebSocketServer({ server })

// Lista de conexões WebSocket ativas
const clients = new Set<WebSocket>()

wss.on('connection', (ws: WebSocket) => {
  clients.add(ws)
  ws.on('close', () => clients.delete(ws))
})

// Broadcast para todos os clientes conectados
function broadcast(message: any) {
  const data = JSON.stringify(message)
  for (const client of clients) {
    client.send(data)
  }
}

app.use(cors())
app.use(express.json())

app.get('/balls', async (req, res) => {
  const balls = await getBalls()
  res.json(balls)
})

app.post('/balls', async (req, res) => {
  const { number } = req.body

  if (typeof number !== 'number') {
    return res.status(400).json({ error: 'Número inválido' })
  }

  const ball = await getBall(number)

  if (!ball) {
    await addBall(number)
    const balls = await getBalls()
    broadcast({ type: 'added', number })
    return res.json({ action: 'added', balls })
  } else {
    await removeBall(number)
    const balls = await getBalls()
    broadcast({ type: 'removed', number })
    return res.json({ action: 'removed', balls })
  }
})

app.post('/balls/clear', async (req, res) => {
  await clearBalls()
  return res.json({ action: 'cleared' })
})

server.listen(3001, () => {
  console.log('🚀 Backend rodando em http://localhost:3001')
})

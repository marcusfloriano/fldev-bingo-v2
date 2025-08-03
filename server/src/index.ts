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
  res.json({'balls': balls})
})

app.post('/balls', async (req, res) => {
  const { number, sorted } = req.body

  if (typeof number !== 'number') {
    return res.status(400).json({ error: 'Número inválido' })
  }

  const ball = await getBall(number)

  if (!ball) {
    await addBall(number)
    const balls = await getBalls()
    broadcast({ action: 'balls', type: 'added', number, balls: balls, sorted: sorted})
    return res.json({ action: 'added', balls })
  } else {
    await removeBall(number)
    const balls = await getBalls()
    broadcast({ action: 'balls', type: 'removed', number, balls: balls, sorted: sorted })
    return res.json({ action: 'removed', balls })
  }
})

app.post('/balls/clear', async (req, res) => {
  await clearBalls()
  const balls = await getBalls()
  broadcast({ action: 'balls', type: 'cleared', number: 0, balls: balls })
  return res.json({ action: 'cleared' })
})

app.get('/zoom', async (req, res) => {
  const {ctrlZoomPanel, sortedZoomPanel} = await getZoom()
  res.json({ctrlZoomPanel: ctrlZoomPanel, sortedZoomPanel: sortedZoomPanel})
})

app.post('/zoom', async (req, res) => {
  const { ctrlZoomPanel, sortedZoomPanel } = req.body
  if (typeof ctrlZoomPanel !== 'number' || typeof sortedZoomPanel !== 'number') {
    return res.status(400).json({ error: 'Número inválido' })
  }
  await setZoom(ctrlZoomPanel, sortedZoomPanel)
  broadcast({ action: 'zoom', ctrlZoomPanel: ctrlZoomPanel, sortedZoomPanel: sortedZoomPanel })
  return res.json({ action: 'zoom', ctrlZoomPanel: ctrlZoomPanel, sortedZoomPanel: sortedZoomPanel })
})

server.listen(3001, () => {
  console.log('🚀 Backend rodando em http://localhost:3001')
})

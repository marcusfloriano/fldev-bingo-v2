// src/websocketClient.ts
export type MessageHandler = (data: any) => void

let socket: WebSocket | null = null
let isConnected = false
let wsUrl: string | null = null
const channels: Map<string, MessageHandler> = new Map<string, MessageHandler>()
// Callbacks disparados a cada (re)conexão — usados para re-registrar estado no servidor.
const openListeners = new Set<() => void>()

function openSocket(url: string) {
  wsUrl = url
  socket = new WebSocket(url)

  socket.addEventListener('open', () => {
    console.log('WebSocket connected')
    isConnected = true
    openListeners.forEach((cb) => cb())
  })

  socket.addEventListener('close', () => {
    console.log('WebSocket closed, retrying in 3s...')
    isConnected = false
    socket = null
    // Reabre preservando os handlers já registrados em `channels`.
    setTimeout(() => {
      if (!socket && wsUrl) openSocket(wsUrl)
    }, 3000)
  })

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data)
    channels.forEach((handler) => {
      handler(data)
    })
  })
}

export function connectWebSocket(channel: string, url: string, onMessage: MessageHandler) {
  // O handler do canal vive em `channels` e sobrevive a reconexões.
  channels.set(channel, onMessage)

  if (!socket || socket.readyState === WebSocket.CLOSED) {
    openSocket(url)
  }
}

export function disconnectChannel(channel: string) {
  channels.delete(channel)
}

// Registra um callback chamado a cada (re)conexão do socket (e já agora, se conectado).
// Retorna uma função para cancelar o registro.
export function onOpen(cb: () => void): () => void {
  openListeners.add(cb)
  if (isConnected) cb()
  return () => openListeners.delete(cb)
}

export function sendMessage(data: any) {
  if (socket && isConnected) {
    socket.send(JSON.stringify(data))
  }
}

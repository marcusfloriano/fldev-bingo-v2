// src/websocketClient.ts
export type MessageHandler = (data: any) => void

let socket: WebSocket | null = null
let isConnected = false

export function connectWebSocket(url: string, onMessage: MessageHandler) {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(url)

    socket.addEventListener('open', () => {
      console.log('WebSocket connected')
      isConnected = true
    })

    socket.addEventListener('close', () => {
      console.log('WebSocket closed, retrying in 3s...')
      isConnected = false
      setTimeout(() => connectWebSocket(url, () => {}), 3000)
    })

    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    })
  }

}

export function sendMessage(data: any) {
  if (socket && isConnected) {
    socket.send(JSON.stringify(data))
  }
}

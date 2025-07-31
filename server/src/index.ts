import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

let balls: number[] = []

app.get('/balls', (req, res) => {
  res.json(balls)
})

app.post('/balls', (req, res) => {
  const { number } = req.body
  if (typeof number === 'number') {
    balls.push(number)
    return res.json({ ok: true })
  } else {
    return res.status(400).json({ error: 'Número inválido' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`)
})

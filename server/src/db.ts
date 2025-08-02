import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

type Data = {
  balls: number[],
  ctrlZoomPanel: number,
  sortedZoomPanel: number,
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile<Data>(file)
const defaultData: Data = { 
    balls: [],
    ctrlZoomPanel: 73,
    sortedZoomPanel: 73
}
const db = new Low<Data>(adapter, defaultData)

export async function initDB() {
    await db.read()
    if (!db.data) {
        db.data = defaultData
        await db.write()
    }
}

export async function getBalls(): Promise<number[]> {
  await db.read()
  return db.data!.balls
}

export async function addBall(number: number): Promise<void> {
  await db.read()
  const exists = db.data!.balls.includes(number)
  if (!exists) {
    db.data!.balls.push(number)
    await db.write()
  }
}

export async function removeBall(number: number): Promise<void> {
  await db.read()
  db.data!.balls = db.data!.balls.filter(n => n !== number)
  await db.write()
}

export async function getBall(number: number): Promise<number | boolean> {
  await db.read()
  const exists = db.data!.balls.includes(number)
  if(!exists) return false
  return db.data!.balls[0]
}

export async function clearBalls(): Promise<void> {
  await db.read()
  db.data!.balls = []
  await db.write()
}

export async function getZoom(): Promise<{ctrlZoomPanel: number, sortedZoomPanel: number}> {
  await db.read()
  return {ctrlZoomPanel: db.data!.ctrlZoomPanel, sortedZoomPanel: db.data!.sortedZoomPanel}
}

export async function setZoom(ctrlZoomPanel: number, sortedZoomPanel:number): Promise<void> {
  await db.read()
  db.data!.ctrlZoomPanel = ctrlZoomPanel
  db.data!.sortedZoomPanel = sortedZoomPanel
  await db.write()
}
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

export type DisplayPanel = {
  id: string,
  name: string,
  zoom: number,
}

type Data = {
  balls: number[],
  ctrlZoomPanel: number,
  sortedZoomPanel: number,
  panels: Record<string, DisplayPanel>,
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile<Data>(file)
const defaultData: Data = {
    balls: [],
    ctrlZoomPanel: 73,
    sortedZoomPanel: 73,
    panels: {}
}
const db = new Low<Data>(adapter, defaultData)

export async function initDB() {
    await db.read()
    if (!db.data) {
        db.data = defaultData
        await db.write()
    } else if (!db.data.panels) {
        // Migração: db.json antigo não tinha o mapa de painéis.
        db.data.panels = {}
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
  return number
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

// ----- Painéis de exibição (zoom independente por navegador) -----

export async function getPanels(): Promise<DisplayPanel[]> {
  await db.read()
  return Object.values(db.data!.panels ?? {})
}

// Cria o painel se ainda não existir (zoom padrão 73) ou atualiza o nome se informado.
export async function upsertPanel(id: string, name?: string): Promise<DisplayPanel> {
  await db.read()
  if (!db.data!.panels) db.data!.panels = {}
  let panel = db.data!.panels[id]
  if (!panel) {
    const ordem = Object.keys(db.data!.panels).length + 1
    panel = { id, name: name || `Painel ${ordem}`, zoom: 73 }
    db.data!.panels[id] = panel
    await db.write()
  } else if (name && name !== panel.name) {
    panel.name = name
    await db.write()
  }
  return panel
}

export async function setPanelZoom(id: string, zoom: number): Promise<void> {
  await db.read()
  const panel = db.data!.panels?.[id]
  if (panel) {
    panel.zoom = zoom
    await db.write()
  }
}

export async function setPanelName(id: string, name: string): Promise<void> {
  await db.read()
  const panel = db.data!.panels?.[id]
  if (panel) {
    panel.name = name
    await db.write()
  }
}
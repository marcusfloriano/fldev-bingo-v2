
import { useState, useEffect, useMemo } from 'react'

import { Canvas } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'

import { PrincipalScreen } from './components/PrincipalScreen'
import { ControlScreen } from './components/ControlScreen'
import { useGlobalShortcut } from './hooks/useGlobalShortcut'

import { SVGIcon } from './components/base/SVGIcon'

import { connectWebSocket, sendMessage, onOpen } from './websocketClient'
import { getZoom, getPanels, type DisplayPanel } from './api'

import { Settings } from './components/settings/Settings'

import './App.css'

// Identidade fixa deste navegador como painel de exibição (persiste no localStorage).
function getPanelId(): string {
  let id = localStorage.getItem('bingo.panelId')
  if (!id) {
    id = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'p-' + Math.random().toString(36).slice(2)
    localStorage.setItem('bingo.panelId', id)
  }
  return id
}

export function useWebSocket(onData: (data: any) => void) {
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
    connectWebSocket('zoom', wsUrl, onData)
  }, [onData])
}

function App() {

  const panelId = useMemo(getPanelId, [])

  const [showSettings, setSettings] = useState(false)
  const [ctrlZoomPanel, setCtrlZoomPanel] = useState(73)
  const [panels, setPanels] = useState<DisplayPanel[]>([])

  const isDisplay = !showSettings
  const myPanel = panels.find(p => p.id === panelId)
  const myZoom = myPanel?.zoom ?? 73

  useGlobalShortcut(() => {
    setSettings(prev => !prev)
  })

  // Zoom do painel de controle (global) + lista de painéis (para o zoom deste display).
  useWebSocket((data) => {
    if (data.action === 'zoom') {
      setCtrlZoomPanel(data.ctrlZoomPanel)
    } else if (data.action === 'panels') {
      setPanels(data.panels)
    }
  })

  useEffect(() => {
    getZoom().then(data => setCtrlZoomPanel(data.ctrlZoomPanel))
      .catch(err => console.error('Erro ao carregar Zoom:', err))
    getPanels().then(data => setPanels(data.panels))
      .catch(err => console.error('Erro ao carregar painéis:', err))
  }, [])

  // Registra/cancela este navegador como painel de exibição conforme o modo atual,
  // e re-registra a cada (re)conexão do WebSocket.
  useEffect(() => {
    const sync = () => {
      if (isDisplay) sendMessage({ type: 'register-display', id: panelId })
      else sendMessage({ type: 'unregister-display', id: panelId })
    }
    sync()
    return onOpen(sync)
  }, [isDisplay, panelId])

  return (
    <>
      {showSettings && (<Settings />)}
      <Canvas style={{ background: 'transparent' }} gl={{ alpha: true }}>
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <ambientLight intensity={Math.PI / 1.5} />
        <group>
          <SVGIcon url='/svg/gear.svg' position={[8,4.6,0]} scale={0.007}
            onPointerOver={() => {
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
                document.body.style.cursor = 'default'
            }}
            onClick={() => {setSettings(prev => !prev)}}
          />
          {!showSettings && (
            <>
              <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={myZoom} />
              <PrincipalScreen />
            </>
          )}
          {showSettings && (
            <>
              <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={ctrlZoomPanel} />
              <ControlScreen position={[0,0,0]}/>
            </>
          )}
        </group>

      </Canvas>
    </>
  )
}

export default App


import { useState, useEffect } from 'react'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera, Plane } from '@react-three/drei'

import { PrincipalScreen } from './components/PrincipalScreen'
import { SettingsScreen } from './components/SettingsScreen'
import { useGlobalShortcut } from './hooks/useGlobalShortcut'

import { SVGIcon } from './components/base/SVGIcon'

import { connectWebSocket } from './websocketClient'
import { getZoom } from './api'

import './App.css'

export function useWebSocket(onData: (ctrlZoomPanel: number, sortedZoomPanel: number) => void) {
  useEffect(() => {
    connectWebSocket('zoom', 'ws://localhost:3001', (data) => {
        if(data.action == "zoom") {
            onData(data.ctrlZoomPanel, data.sortedZoomPanel)
        }
    })
  }, [onData])
}

function App() {

  const [showSettings, setSettings] = useState(true)
  const [ctrlZoomPanel, setCtrlZoomPanel] = useState(73)
  const [sortedZoomPanel, setSortedZoomPanel] = useState(73)

  useGlobalShortcut(() => {
    setSettings(prev => !prev)
  })

  useWebSocket((ctrlZoomPanel, sortedZoomPanel) => {
    setCtrlZoomPanel(ctrlZoomPanel)
    setSortedZoomPanel(sortedZoomPanel)
  })

    useEffect(() => {
        getZoom().then(data => {
            setCtrlZoomPanel(data.ctrlZoomPanel)
            setSortedZoomPanel(data.sortedZoomPanel)
        })
        .catch(err => console.error('Erro ao carregar Zoom:', err))
    }, [])

  return (
    <Canvas style={{ background: 'transparent' }} gl={{ alpha: true }}>
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <ambientLight intensity={Math.PI / 1.5} />
      <group>
        {showSettings && (
          <>
            <SVGIcon url='/svg/gear.svg' position={[8,4.6,0]} scale={0.007}
              onPointerOver={() => {
                  document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                  document.body.style.cursor = 'default'
              }}
              onClick={() => {setSettings(prev => !prev)}}
            />
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={sortedZoomPanel} />
            <PrincipalScreen />
          </>
        )}
        {!showSettings && (
          <>
            <SVGIcon url='/svg/gear.svg' position={[8,4.6,0]} scale={0.007}
              onPointerOver={() => {
                  document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                  document.body.style.cursor = 'default'
              }}
              onClick={() => {setSettings(prev => !prev)}}
            />
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={ctrlZoomPanel} />
            <SettingsScreen position={[0,0,0]}/>
          </>
        )}
      </group>

    </Canvas>
  )
}

export default App

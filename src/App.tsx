
import { useState, useEffect } from 'react'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera, Plane } from '@react-three/drei'

import { PrincipalScreen } from './components/PrincipalScreen'
import { SettingsScreen } from './components/SettingsScreen'
import { useGlobalShortcut } from './hooks/useGlobalShortcut'

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
    <Canvas>
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <ambientLight intensity={Math.PI / 1.5} />
      
      <group>
        {showSettings && (
          <>
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={sortedZoomPanel} />
            <PrincipalScreen />
          </>
        )}
        {!showSettings && (
          <>
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={ctrlZoomPanel} />
            <SettingsScreen />
          </>
        )}
      </group>
      {/* <Plane
        args={[100, 100]} // cobre toda a tela
        position={[0, 0, 9.9]} // quase na frente da câmera (z = 10)
      >
        <meshStandardMaterial
          color="black"
          transparent
          opacity={0.5} // 0.5 = 50% transparente
        />
      </Plane> */}
      {/* <SortedBall number={79} position={[0, 0, 0]} /> */}

    </Canvas>
  )
}

export default App

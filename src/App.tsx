
import { useState, useEffect } from 'react'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
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
      {/* <ZoomCamera /> */}
      {/* <ambientLight intensity={Math.PI / 2} /> */}
      {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} /> */}
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {/* <SortedBall number={79} position={[0, 0, 0]} /> */}

      <ambientLight intensity={Math.PI / 1.5} />
      
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

      {/* <SortedBall number={79} position={[0, 0, 0]} /> */}

    </Canvas>
  )
}

export default App

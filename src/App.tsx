
import { useEffect, useState } from 'react'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { PrincipalScreen } from './components/PrincipalScreen'
import { SettingsScreen } from './components/SettingsScreen'

import './App.css'

export function useGlobalShortcut(callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCmdOrCtrl = event.ctrlKey || event.metaKey
      const isShift = event.shiftKey
      const isP = event.key.toLowerCase() === 'p'

      if (isCmdOrCtrl && isShift && isP) {
        event.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [callback])
}

function ZoomCamera() {
  const { camera } = useThree()

  useFrame(() => {
    // Faz zoom in progressivo (aumenta zoom)
    if ('zoom' in camera && camera.zoom < 200) {
      camera.zoom += 0.5
      camera.updateProjectionMatrix()
    }
  })

  return null
}

function App() {

  const [showSettings, setSettings] = useState(true)

  useGlobalShortcut(() => {
    setSettings(prev => !prev)
  })

  return (
    <Canvas>
      {/* <ZoomCamera /> */}
      {/* <ambientLight intensity={Math.PI / 2} /> */}
      {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} /> */}
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {/* <SortedBall number={79} position={[0, 0, 0]} /> */}

      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={73} />
      <ambientLight intensity={Math.PI / 1.5} />
      
      {showSettings && <PrincipalScreen />}
      {!showSettings && <SettingsScreen />}

      {/* <SortedBall number={79} position={[0, 0, 0]} /> */}

    </Canvas>
  )
}

export default App

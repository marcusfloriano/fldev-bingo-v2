
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { SortedBall } from './components/SortedBall'
import { Ball } from './components/Ball'
import { OrthographicCamera, Text } from '@react-three/drei'
import { LetterBingo } from './components/LetterBingo'
import { NewsPanel } from './components/NewsPanel'
import { SortedPanel } from './components/SortedPanel'

import './App.css'


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

  const numbers = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15],
    [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    [31,32,33,34,35,36,37,38,39,40,41,42,43,44,45],
    [46,47,48,49,50,51,52,53,54,55,56,57,58,59,60],
    [61,62,63,64,65,66,67,68,69,70,71,72,73,74,75]
  ]

  const spacingX = 1.1
  const spacingY = 1.1

  return (
    <Canvas>
      {/* <ZoomCamera /> */}
      {/* <ambientLight intensity={Math.PI / 2} /> */}
      {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} /> */}
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {/* <SortedBall number={79} position={[0, 0, 0]} /> */}

      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={73} />
      <ambientLight intensity={Math.PI / 1.5} />
      
      <mesh position={[0, 4.35, 0]}>
        <Text
          position={[0, 0, 0]} // 👈 acima da cena
          fontSize={0.7}
          color="#D80100"
          anchorX="center"
          anchorY="middle"
          font="/fonts/impact.ttf"
        >
          PARÓQUIA SÃO JUDAS TADEU
        </Text>
      </mesh>

      <mesh position={[-8.3, 3.50, 0]}>
        <LetterBingo letter='B' position={[0, -0.16, 0]} />
        <LetterBingo letter='I' position={[0, -1.26, 0]} />
        <LetterBingo letter='N' position={[0, -2.36, 0]} />
        <LetterBingo letter='G' position={[0, -3.46, 0]} />
        <LetterBingo letter='O' position={[0, -4.56, 0]} />
      </mesh>

      <mesh position={[0.3, 1.2, 0]}>
        {numbers.map((row, rowIndex) =>
          row.map((number, colIndex) => {
            const x = colIndex * spacingX - ((row.length - 1) * spacingX) / 2
            const y = -rowIndex * spacingY + ((numbers.length - 1) * spacingY) / 2
            return (
              <Ball key={number} number={number} position={[x, y, 0]} />
            )
          })
        )}
      </mesh>

      <mesh position={[0, -3.2, 0]}>
        <SortedPanel />
      </mesh>

      {/* <SortedBall number={79} position={[0, 0, 0]} /> */}

    </Canvas>
  )
}

export default App

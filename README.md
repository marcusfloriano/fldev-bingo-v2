# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


```js
<Html position={[-5.8,0,0]} center className="">
    <div className="card bg-base-200 w-96 card-lg shadow-sm h-57">
        {/* <div className="fixed inset-0 bg-black/50 z-50 rounded-lg" /> */}
        <div className="card-body">
            <h2 className="card-title">Reiniciar o Bingo</h2>
            <p>Todos os números serão apagados e não terá como recuperar, cuidado com essa ação!</p>
            <div className="justify-end card-actions">
            <button className="btn btn-lg btn-warning" onClick={handleBallClear}>Limpar</button>
            </div>
        </div>
    </div>
</Html>
<Html position={[0,0,0]} center className="">
    <div className="card bg-base-200 w-96 card-lg shadow-sm h-57">
        <div className="card-body">
            <h2 className="card-title">Sortear um novo Número</h2>
            <p>Será sortenado um novo número aleatório e apresentado para todos.</p>
            <div className="justify-end card-actions">
            <button className="btn btn-lg btn-primary" onClick={handleRollNumber}>Sortear</button>
            </div>
        </div>
    </div>
</Html>
<Html position={[5.8,0,0]} center className="">
    <div className="card bg-base-200 w-96 card-sm shadow-sm h-25 mb-7">
        <div className="card-body">
            <h2 className="card-title">Zoom do Painel de Controle</h2>
            <div className="justify-end card-actions">
                <input type="range" min={0} max={200} value={ctrlZoomPanel} className="range range-neutrol" onMouseUp={handleReleaseZoom} onTouchEnd={handleReleaseZoom} onChange={(e) => setCtrlZoomPanel(Number(e.target.value))}/>
            </div>
        </div>
    </div>
    <div className="card bg-base-200 w-96 card-sm shadow-sm h-25">
        <div className="card-body">
            <h2 className="card-title">Zoom da Tela de Sorteio</h2>
            <div className="justify-end card-actions">
                <input type="range" min={0} max={200} value={sortedZoomPanel} className="range range-secondary" onMouseUp={handleReleaseZoom} onTouchEnd={handleReleaseZoom} onChange={(e) => setSortedZoomPanel(Number(e.target.value))}/>
            </div>
        </div>
    </div>
</Html>
```
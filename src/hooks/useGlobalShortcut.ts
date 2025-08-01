import { useEffect } from 'react'

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

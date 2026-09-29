import { useApp, useInput, useStdin } from 'ink'
import { store } from './store.js'

const useKeyboard = function (clearPrompt) {
  const { exit } = useApp()
  const { isRawModeSupported } = useStdin()
  useInput(
    (input, key) => {
      if (key.return) {
        store.nextPage()
      }
      if (key.escape) {
        clearPrompt?.()
        exit()
      }
    },
    { isActive: isRawModeSupported }
  )
}

export default useKeyboard

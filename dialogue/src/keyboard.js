import { useApp, useInput, useStdin } from 'ink'
import { store } from './store.js'

const useKeyboard = function () {
  const { exit } = useApp()
  const { isRawModeSupported } = useStdin()
  useInput(
    (input, key) => {
      if (key.return) {
        store.nextPage()
      }
      if (key.escape) {
        exit()
      }
    },
    { isActive: isRawModeSupported }
  )
}

export default useKeyboard

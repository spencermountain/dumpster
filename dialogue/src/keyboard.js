import { useApp, useInput, useStdin } from 'ink'
import { useStore } from './store.js'

const useKeyboard = function (clearPrompt) {
  const { exit } = useApp()
  const { isRawModeSupported } = useStdin()
  const nextPage = useStore((state) => state.nextPage)
  useInput(
    (input, key) => {
      if (key.return) {
        // useAppState.setState((store) => ({ page: store.page + 1 }))
        nextPage()
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

import { useEffect, useRef } from 'react'
import { measureElement, useApp, useInput, useStdin, useStdout } from 'ink'

const users = new WeakMap()

// SGR mouse coordinates are viewport-relative, whereas Ink measures from its
// live region. Query the cursor after a click to locate that region in Page too.
export default function useHeaderClicks(headers, onClick, enabled) {
  const { stdout } = useStdout()
  const { isRawModeSupported } = useStdin()
  const { waitUntilRenderFlush } = useApp()
  const pending = useRef(null)
  const timer = useRef(null)
  const active = enabled && isRawModeSupported && Boolean(stdout.isTTY)

  useEffect(() => {
    if (!active) return undefined
    const count = users.get(stdout) || 0
    users.set(stdout, count + 1)
    if (count === 0) stdout.write('\u001b[?1000h\u001b[?1006h')
    return () => {
      clearTimeout(timer.current)
      pending.current = null
      const remaining = (users.get(stdout) || 1) - 1
      if (remaining === 0) {
        stdout.write('\u001b[?1000l\u001b[?1006l')
        users.delete(stdout)
      } else {
        users.set(stdout, remaining)
      }
    }
  }, [active, stdout])

  useInput((input) => {
    const press = /^\[<0;(\d+);(\d+)M$/.exec(input)
    if (press) {
      const click = { x: Number(press[1]) - 1, y: Number(press[2]) - 1 }
      pending.current = click
      clearTimeout(timer.current)
      timer.current = setTimeout(() => { pending.current = null }, 500)
      void waitUntilRenderFlush().then(() => {
        if (pending.current === click) stdout.write('\u001b[6n')
      }).catch(() => { pending.current = null })
      return
    }
    const cursor = /^\[(\d+);(\d+)R$/.exec(input)
    if (!cursor || !pending.current) return
    const click = pending.current
    pending.current = null
    clearTimeout(timer.current)
    for (const [id, node] of headers.current) {
      if (!node) continue
      let root = node
      while (root.parentNode) root = root.parentNode
      const height = measureElement(root).height
      // Non-fullscreen Ink output includes a trailing newline.
      const origin = Number(cursor[1]) - height - (height < (stdout.rows || 24) ? 1 : 0)
      const box = measureElement(node)
      const y = click.y - origin
      if (click.x >= box.x && click.x < box.x + box.width && y >= box.y && y < box.y + box.height) {
        onClick(id)
        break
      }
    }
  }, { isActive: active })
}

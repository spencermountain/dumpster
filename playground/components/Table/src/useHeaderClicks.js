import { useEffect, useRef } from 'react'
import { measureElement, useApp, useInput, useStdin, useStdout } from 'ink'

// Share terminal mouse mode across tables; disable it after the last unmount.
const users = new WeakMap()
const enableMouse = '\u001b[?1000h\u001b[?1006h'
const disableMouse = '\u001b[?1000l\u001b[?1006l'
const queryCursor = '\u001b[6n'

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
    if (count === 0) stdout.write(enableMouse)
    return () => {
      clearTimeout(timer.current)
      pending.current = null
      const remaining = (users.get(stdout) || 1) - 1
      if (remaining === 0) {
        stdout.write(disableMouse)
        users.delete(stdout)
      } else {
        users.set(stdout, remaining)
      }
    }
  }, [active, stdout])

  useInput((input) => {
    // Ink removes ESC before dispatch. Accept left-button presses only, not
    // release, drag, or wheel events. Terminal coordinates are one-based.
    const press = /^\[<0;(\d+);(\d+)M$/.exec(input)
    if (press) {
      const click = { x: Number(press[1]) - 1, y: Number(press[2]) - 1 }
      pending.current = click
      clearTimeout(timer.current)
      // Terminals without cursor reporting must not leave a stale pending click.
      timer.current = setTimeout(() => { pending.current = null }, 500)
      void waitUntilRenderFlush().then(() => {
        if (pending.current === click) stdout.write(queryCursor)
      }).catch(() => { pending.current = null })
      return
    }
    // The cursor report locates the rendered region even after shell output,
    // terminal scrolling, or a resize. Do not assume the table starts at row 0.
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

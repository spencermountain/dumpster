// Ink's resize fallback clears the screen AND scrollback. Allow screen redraws,
// but remove the erase-scrollback escape so previous commands remain available.
export default function preserveScrollback(stdout) {
  return new Proxy(stdout, {
    get(target, property) {
      if (property === 'write') {
        return (chunk, ...args) => {
          const output = typeof chunk === 'string' ? chunk : chunk.toString()
          return target.write(output.replace(/\u001b\[3J/g, ''), ...args)
        }
      }
      const value = Reflect.get(target, property, target)
      return typeof value === 'function' ? value.bind(target) : value
    }
  })
}

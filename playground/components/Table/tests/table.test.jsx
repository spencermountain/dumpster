import assert from 'node:assert/strict'
import test from 'node:test'
import { PassThrough } from 'node:stream'
import { setTimeout as delay } from 'node:timers/promises'
import { stripVTControlCharacters } from 'node:util'
import React from 'react'
import { measureElement, render, renderToString } from 'ink'
import Table from '../src/Index.jsx'
import Page from '../../Page/Page.jsx'
import Fullscreen, { renderFullscreen } from '../../Page/Fullscreen.jsx'

const cols = [
  { label: 'Name', id: 'name', sortable: true },
  { label: 'Age', id: 'age', sortable: true },
  { label: 'City', id: 'city' }
]
const data = [
  { name: 'Zoe', age: 20, city: 'Toronto' },
  { name: 'Ada', age: 100, city: 'Montreal' },
  { name: 'Bob', age: 9, city: 'Vancouver' },
  { name: 'Unknown', city: 'Ottawa' }
]

async function setup(t, fullscreen = false, columns = cols) {
  const stdout = new PassThrough()
  Object.assign(stdout, { isTTY: true, columns: 80, rows: 24 })
  const stdin = new PassThrough()
  Object.assign(stdin, { isTTY: true, setRawMode() {}, ref() {}, unref() {} })
  const ref = React.createRef()
  let output = ''
  // Pretend two lines of shell output precede Page; Fullscreen starts at row 0.
  let origin = fullscreen ? 0 : 2
  stdout.on('data', (chunk) => {
    const text = chunk.toString()
    output += text
    if (text.includes('\u001b[6n')) {
      let root = ref.current
      while (root.parentNode) root = root.parentNode
      const height = measureElement(root).height
      const cursorRow = origin + height + (height < stdout.rows ? 1 : 0)
      setImmediate(() => stdin.write(`\u001b[${cursorRow};1R`))
    }
  })
  const Component = fullscreen ? Fullscreen : Page
  const mount = fullscreen ? renderFullscreen : render
  const app = mount(
    <Component ref={ref} minHeight={12} navLeft="Nav" footerLeft="Footer">
      <Table data={data} cols={columns} />
    </Component>,
    { stdout, stdin, stderr: stdout, interactive: true, patchConsole: false }
  )
  t.after(async () => {
    app.unmount()
    await app.waitUntilExit()
    app.cleanup()
    assert.ok(output.includes('\u001b[?1000l'), 'mouse tracking cleaned up')
    assert.ok(output.includes('\u001b[?1006l'), 'SGR mouse mode cleaned up')
  })
  await delay(60)
  const send = async (input) => {
    output = ''
    stdin.write(input)
    await delay(80)
    await app.waitUntilRenderFlush()
    return stripVTControlCharacters(output)
  }
  return {
    send,
    raw: () => output,
    click: (x, y) => send(`\u001b[<0;${x};${y}M`),
    resize: async () => {
      stdout.columns = 60
      stdout.rows = 18
      origin = fullscreen ? 0 : 2
      stdout.emit('resize')
      await delay(60)
    }
  }
}

function order(output, names) {
  const rows = output.split('\n').filter((line) => /^\s*(Ada|Bob|Zoe|Unknown)\s/.test(line))
  assert.deepEqual(
    rows.map((line) => line.trim().split(/\s+/)[0]),
    names
  )
}

for (const fullscreen of [false, true]) {
  test(`mouse sorting in ${fullscreen ? 'Fullscreen' : 'Page'} supports toggling and exclusive sorting`, async (t) => {
    const io = await setup(t, fullscreen)
    const y = fullscreen ? 4 : 8
    let output = await io.click(31, y)
    order(output, ['Bob', 'Zoe', 'Ada', 'Unknown'])
    assert.match(output, /Age ▲/)
    assert.ok(!io.raw().includes('\u001b[7m'), 'no inverse background')
    if (io.raw().includes('\u001b[1m')) {
      for (const age of [9, 20, 100]) assert.ok(io.raw().includes(`\u001b[1m${age}\u001b[22m`))
    }
    output = await io.click(31, y)
    order(output, ['Ada', 'Zoe', 'Bob', 'Unknown'])
    assert.match(output, /Age ▼/)
    output = await io.click(3, y)
    order(output, ['Ada', 'Bob', 'Unknown', 'Zoe'])
    assert.match(output, /Name ▲/)
    assert.doesNotMatch(output, /Age [▲▼]/)
    assert.ok(
      !io.raw().includes('\u001b[1m100\u001b[22m'),
      'previous sort column loses automatic bold'
    )
    output = await io.click(60, y)
    assert.ok(!output.includes('Name'), 'non-sortable header does not change rows')
    await io.resize()
    output = await io.click(24, y)
    order(output, ['Bob', 'Zoe', 'Ada', 'Unknown'])
    assert.deepEqual(
      data.map((row) => row.name),
      ['Zoe', 'Ada', 'Bob', 'Unknown'],
      'input is not mutated'
    )
  })
}

test('Tab and Enter provide keyboard sorting; releases and wheel events do not sort', async (t) => {
  const io = await setup(t)
  await io.send('\t')
  const output = await io.send('\r')
  order(output, ['Bob', 'Zoe', 'Ada', 'Unknown'])
  assert.match(output, /Age ▲/)
  assert.equal(await io.send('\u001b[<0;31;7m'), '')
  assert.equal(await io.send('\u001b[<64;31;7M'), '')
})

test('sort: true starts ascending without sortable, and clicking reverses it', async (t) => {
  const columns = cols.map((col) =>
    col.id === 'age' ? { ...col, sortable: false, sort: true } : col
  )
  const io = await setup(t, false, columns)
  order(stripVTControlCharacters(io.raw()), ['Bob', 'Zoe', 'Ada', 'Unknown'])
  assert.ok(!io.raw().includes('\u001b[7m'), 'initial header has no inverse background')
  if (io.raw().includes('\u001b[1m')) {
    assert.match(io.raw(), /\u001b\[1m(?:\u001b\[\d+m)*Age/, 'sorted header is bold')
    assert.match(io.raw(), /\u001b\[4mName/, 'sortable header is underlined')
    assert.match(io.raw(), /\u001b\[4mAge/, 'sorted header is underlined')
    assert.doesNotMatch(io.raw(), /\u001b\[4mCity/, 'non-sortable header is not underlined')
    assert.doesNotMatch(io.raw(), /\u001b\[1m(?:\u001b\[\d+m)*Name/, 'other headers are not bold')
  }
  const output = await io.click(31, 8)
  order(output, ['Ada', 'Zoe', 'Bob', 'Unknown'])
})

test('multiple initial sorts are rejected', () => {
  assert.throws(
    () => renderToString(<Table data={data} cols={cols.map((col) => ({ ...col, sort: true }))} />),
    /only one column with sort: true/
  )
})

test('column basis and minimum width align single-line truncated headers and cells', () => {
  const columns = [
    { id: 'first', label: 'Very long first header', flexBasis: '25%', minWidth: 12 },
    { id: 'second', label: 'Second', flexBasis: '75%' }
  ]
  const rows = [
    {
      first: 'long first value across many words',
      second: 'line one\nline two\tand then more text'
    },
    { first: 'A', second: 'B' }
  ]
  for (const width of [40, 20, 8]) {
    const output = stripVTControlCharacters(
      renderToString(<Table cols={columns} data={rows} />, { columns: width })
    )
    const lines = output.split('\n')
    assert.equal(lines.length, 6, 'two padding lines, one header, one border, one line per row')
    assert.ok(
      lines.every((line) => line.length <= width),
      'does not overflow the terminal'
    )
    if (width >= 20) {
      assert.equal(
        lines[1].indexOf('Sec'),
        13,
        'minimum width overrides the smaller percentage basis'
      )
      assert.equal(lines[4].indexOf('B'), 13, 'body columns align with headings')
      assert.ok(lines[1].includes('…'))
      assert.ok(lines[3].includes('…'))
    }
  }
})

test('numeric basis is supported and embedded newlines never create extra rows', () => {
  const columns = [
    { id: 'a', label: 'First\nheader', flexBasis: 30 },
    { id: 'b', label: 'Second', flexBasis: 10 }
  ]
  const output = stripVTControlCharacters(
    renderToString(<Table cols={columns} data={[{ a: 'one\r\ntwo\u2028three', b: 'x\ny' }]} />, {
      columns: 40
    })
  )
  const lines = output.split('\n')
  assert.equal(lines.length, 5)
  assert.equal(lines[1].indexOf('Second'), 30)
  assert.equal(lines[3].indexOf('x y'), 30)
  assert.ok(lines[3].trimStart().startsWith('one two three'))
})

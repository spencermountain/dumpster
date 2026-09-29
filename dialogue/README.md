# Dialogue

An async terminal dialogue. Requires Node.js 22 or newer.

## Development

From the workspace root, run `pnpm --filter @dumpster/dialogue dev` to try the
dialogue, or `pnpm --filter @dumpster/dialogue watch` to restart it after edits.
Development runs JSX directly using the package's development dependency `tsx`.

Call it from another script without a build or loader flags:

```js
import dialogue from './dialogue/dev.js'

const state = await dialogue()
// { project: 1, lang: 'fr' }
```

## Production

Run `pnpm --filter @dumpster/dialogue build`. Rollup compiles the JSX and bundles
the local source into `builds/app.js`, with a source map. React, Ink, and Valtio
remain runtime dependencies; production does not load `tsx` or Rollup.

```js
import dialogue from './dialogue/builds/app.js'

const state = await dialogue()
```

When consumed as a workspace or installed package, use
`import dialogue from '@dumpster/dialogue'` after building.

`pnpm --filter @dumpster/dialogue start` tries the built version.
`pnpm --filter @dumpster/dialogue build:watch` rebuilds as source files change.
Packing the package runs the build automatically and includes `builds`.

## Behavior

Both entry points export the same async API. Importing them does not open the UI.
Each call starts a fresh dialogue and resolves with an independent plain state
object after the last selection. Escape or Ctrl+C resolves with `undefined`;
errors reject the promise. The terminal's previous screen is restored before
the promise settles. The command-line runners discard the result without printing
anything; a calling script decides what to do with it.

You can supply existing answers to skip completed pages:

```js
const state = await dialogue({ initialState: { project: 1 } })
```

Other options are forwarded to Ink's `render` (for example, custom `stdin` and
`stdout` streams). Alternate-screen mode stays enabled. Calls can be repeated
sequentially; overlapping calls to the same entry point reject.

Run `pnpm --filter @dumpster/dialogue test` to build and test both entry points.

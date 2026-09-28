# Table

Import the default component from `./Index.jsx`. The public API remains
`<Table data={rows} cols={columns} />`.

- `Index.jsx`: composes rows and connects sorting, focus, and mouse input.
- `Row.jsx`: shared column sizing, body styling, and the header divider.
- `Heading.jsx`: header labels, sort indicators, and keyboard input.
- `useSort.js`: initial sort validation, direction changes, and row ordering.
- `useHeaderClicks.js`: terminal mouse mode, coordinate conversion, and cleanup.
- `columns.js`: sortable-column detection and single-line text normalization.

Column options: `id`, `label`, `color`, `dim`, `bold`, `underline`, `flexBasis`,
`minWidth`, `sortable`, and `sort`. One column may use `sort: true` to start in
ascending order. Click a sortable header or focus it with Tab and press Enter
or Space to reverse direction. Missing values stay last; input data is never
mutated. Headers and values truncate instead of wrapping.

Run these commands from the workspace root:

```sh
node --import tsx playground/components/Table/scratch.jsx
node --import tsx --test playground/tests/table.test.jsx
```

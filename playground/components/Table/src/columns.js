// An initial sort also opts the column into mouse and keyboard sorting.
export const isSortable = (col) => Boolean(col.sortable || col.sort === true)

// Truncation alone does not remove explicit line breaks. Normalize them first
// so both headings and values always occupy a single terminal row.
export const singleLine = (value) => String(value ?? '').replace(/\r\n|[\r\n\t\u2028\u2029]/g, ' ')

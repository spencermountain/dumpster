import { tsImport } from 'tsx/esm/api'

try {
  const { default: singleSelect } = await tsImport('./single-select/index.jsx', import.meta.url)
  const id = await singleSelect({
    title: 'Choose an output format',
    description: 'Select the format for your Wikipedia dump.',
    choices: [
      { label: 'Plain text', id: 'text', description: 'Just the article text' },
      { label: 'Markdown', id: 'markdown', description: 'Text with formatting' },
      { label: 'HTML', id: 'html', description: 'Ready for a web page' }
    ]
  })
  console.log('Selected ID:', id)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}

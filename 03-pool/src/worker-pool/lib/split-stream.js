// Use Buffer's byte search to locate the closing page tag.
import { Buffer } from 'node:buffer'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// ingest a stream of bytes and split it into batches
const splitStream = async (stream, gate, cb) => {
  const maxBatchSize = 1024 * 1024 // 1 MiB

  // Keep a partial batch across incoming chunks.
  let currentBatch = null
  let currentSize = 0

  for await (const chunk of stream) {
    // Respect the byte range of Buffer views; also accept plain ArrayBuffers.
    const bytes = new Uint8Array(chunk.buffer || chunk, chunk.byteOffset || 0, chunk.byteLength)
    for (let offset = 0; offset < bytes.length;) {
      // Pause between batches too, since one chunk can contain several.
      await gate.wait()
      if (!currentBatch) {
        currentBatch = new Uint8Array(maxBatchSize)
      }
      // Copy only what fits; a large chunk can fill several batches.
      const length = Math.min(maxBatchSize - currentSize, bytes.length - offset)
      currentBatch.set(bytes.subarray(offset, offset + length), currentSize)
      currentSize += length
      offset += length
      if (currentSize >= maxBatchSize) {
        // Clip after the last closing page tag.
        const end = Buffer.from(currentBatch.buffer).lastIndexOf('</page>') + '</page>'.length
        await cb(currentBatch.buffer.slice(0, end))
        // await wait(50) // FIXME: artificial delay to simulate processing time
        // Move trailing bytes to the start so the next chunk continues this batch.
        currentBatch.copyWithin(0, end, currentSize)
        currentSize -= end
      }
    }
  }
  // Flush the final partial batch
  if (currentSize > 0) {
    await gate.wait()
    await cb(currentBatch.buffer.slice(0, currentSize))
  }
}

export default splitStream

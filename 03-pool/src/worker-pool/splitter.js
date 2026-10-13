const splitStream = async (stream, gate, send) => {
  const maxBatchSize = 1024 * 1024 // 1 MiB

  // Keep a partial batch across incoming chunks.
  let batchArray = null
  let currentSize = 0

  for await (const chunk of stream) {
    // Respect the byte range of Buffer views; also accept plain ArrayBuffers.
    const bytes = new Uint8Array(chunk.buffer || chunk, chunk.byteOffset || 0, chunk.byteLength)
    for (let offset = 0; offset < bytes.length;) {
      // Pause between batches too, since one chunk can contain several.
      await gate.wait()
      if (!batchArray) {
        batchArray = new Uint8Array(maxBatchSize)
      }
      // Copy only what fits; a large chunk can fill several batches.
      const length = Math.min(maxBatchSize - currentSize, bytes.length - offset)
      batchArray.set(bytes.subarray(offset, offset + length), currentSize)
      currentSize += length
      offset += length
      if (currentSize >= maxBatchSize) {
        // Wait for delivery before continuing; send may transfer buffer ownership.
        await send(batchArray.buffer)
        batchArray = null
        currentSize = 0
      }
    }
  }
  // Flush the final partial batch without unused trailing bytes.
  if (currentSize > 0) {
    await gate.wait()
    await send(batchArray.buffer.slice(0, currentSize))
  }
}

export default splitStream

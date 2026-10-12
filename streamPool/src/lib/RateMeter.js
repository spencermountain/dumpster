 class RateMeter {
   constructor(intervalMs = 1000) {
     this.bytes = 0
     this.last = { bytes: 0, time: Date.now() }
     this.rate = 0 // bytes/sec over the last interval
     this.intervalMs = intervalMs
   }

   add(n) {
     this.bytes += n
     const now = Date.now()
     const elapsed = now - this.last.time
     if (elapsed >= this.intervalMs) {
       this.rate = (this.bytes - this.last.bytes) / (elapsed / 1000)
       this.last = { bytes: this.bytes, time: now }
     }
   }

   get mbps() {
     return (this.rate / 1e6).toFixed(1) + ' MB/s'
   }
 }

 export default function () {
   return new RateMeter()
 }

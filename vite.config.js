import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const hideKey = (url) => url.replace(/apikey=[^&]+/, 'apikey=***')

const summarize = (path, data) => {
  if (data.fault || data.errors) return JSON.stringify(data.fault || data.errors).slice(0, 200)
  if (path.includes('/classifications')) {
    const list = data._embedded?.classifications || []
    const names = list.filter((c) => c.segment).map((c) => c.segment.name)
    return `${names.length} categories -> ${names.join(', ')}`
  }
  if (data.page && path.includes('/events.json')) {
    const events = data._embedded?.events || []
    const lines = events.slice(0, 5).map((e) => `      - ${e.name} (${e.dates?.start?.localDate || 'TBA'})`)
    const more = events.length > 5 ? `\n      ... and ${events.length - 5} more` : ''
    return `${events.length} events on page ${data.page.number + 1}/${data.page.totalPages} ` +
      `(total ${data.page.totalElements})\n${lines.join('\n')}${more}`
  }
  if (data.id && data.name) {
    const venue = data._embedded?.venues?.[0]
    return `event "${data.name}" on ${data.dates?.start?.localDate} at ${venue?.name || 'TBA'}`
  }
  return 'response received'
}

const time = () => new Date().toLocaleTimeString()

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tm-api': {
        target: 'https://app.ticketmaster.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tm-api/, '/discovery/v2'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            proxyReq.setHeader('accept-encoding', 'identity')
            req.startTime = Date.now()
            console.log(`\n[${time()}] [API REQUEST]  GET ${hideKey(proxyReq.path)}`)
          })

          proxy.on('proxyRes', (proxyRes, req) => {
            const chunks = []
            proxyRes.on('data', (chunk) => chunks.push(chunk))
            proxyRes.on('end', () => {
              const ms = Date.now() - req.startTime
              const path = req.url.split('?')[0]
              let info = ''
              try {
                info = summarize(path, JSON.parse(Buffer.concat(chunks).toString()))
              } catch {
                info = 'could not read response body'
              }
              console.log(`[${time()}] [API RESPONSE] ${proxyRes.statusCode} ${path} (${ms}ms)`)
              console.log(`    ${info}`)
            })
          })

          proxy.on('error', (err, req) => {
            console.log(`[${time()}] [API ERROR] ${hideKey(req.url)} -> ${err.message}`)
          })
        },
      },
    },
  },
})

import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { fromBuffer } from '@capsizecss/unpack'

const CACHE: Record<string, any> = {}

const app = new Elysia()
  .use(cors())
  .get('/', () => 'Font Metrics Server is Running')
  .get('/metrics', async ({ query }) => {
    const { family } = query
    
    if (!family) {
      return { error: 'Font family is required' }
    }

    // Check cache
    if (CACHE[family]) {
      console.log(`[Cache Hit] ${family}`)
      return CACHE[family]
    }

    try {
      console.log(`[Fetching] ${family}`)
      const familyName = family.replace(/ /g, '+')
      const cssUrl = `https://fonts.googleapis.com/css2?family=${familyName}:wght@400&display=swap`

      // Fetch CSS
      const cssResponse = await fetch(cssUrl)
      if (!cssResponse.ok) {
        return { error: `Failed to fetch CSS for ${family}` }
      }
      const cssText = await cssResponse.text()

      // Extract WOFF2 URL
      const fontUrlMatch = cssText.match(/src:\s*url\((https?:\/\/[^)]+)\)/)
      if (!fontUrlMatch || !fontUrlMatch[1]) {
        return { error: `Could not find font URL for ${family}` }
      }
      const fontUrl = fontUrlMatch[1]

      // Fetch Binary
      const fontResponse = await fetch(fontUrl)
      if (!fontResponse.ok) {
        return { error: `Failed to fetch font file for ${family}` }
      }
      const arrayBuffer = await fontResponse.arrayBuffer()

      // Parse Metrics
      // @capsizecss/unpack expects a Buffer or Uint8Array in Node/Bun
      const metrics = await fromBuffer(Buffer.from(arrayBuffer))

      CACHE[family] = metrics
      return metrics

    } catch (error) {
      console.error(`Error processing ${family}:`, error)
      return { error: `Internal server error: ${error}` }
    }
  }, {
    query: t.Object({
      family: t.String()
    })
  })
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

// import { fromBlob } from '@capsizecss/unpack'

// Cache to store dynamically fetched metrics
const DYNAMIC_METRICS_CACHE: Record<string, any> = {}

export async function fetchDynamicFontMetrics(fontFamily: string): Promise<any | null> {
  // TEMPORARY DISABLE due to build issues with fontkit/clone dependencies.
  // We have covered the top 60+ Google Fonts in the static metrics.ts map.
  // Dynamic fetching for other fonts will be re-enabled once we solve the bundler config.
  return null

  /*
  // 1. Check cache first
  if (DYNAMIC_METRICS_CACHE[fontFamily]) {
    return DYNAMIC_METRICS_CACHE[fontFamily]
  }

  try {
    // 2. Construct Google Fonts URL
    const familyName = fontFamily.replace(/ /g, '+')
    const cssUrl = `https://fonts.googleapis.com/css2?family=${familyName}:wght@400&display=swap`

    // 3. Fetch CSS
    const cssResponse = await fetch(cssUrl)
    if (!cssResponse.ok) {
      console.warn(`[Dynamic Metrics] Failed to fetch CSS for ${fontFamily}`)
      return null
    }
    const cssText = await cssResponse.text()

    // 4. Extract font file URL (woff2) from CSS
    // Look for "src: url(https://...)"
    const fontUrlMatch = cssText.match(/src:\s*url\((https?:\/\/[^)]+)\)/)
    if (!fontUrlMatch || !fontUrlMatch[1]) {
      console.warn(`[Dynamic Metrics] Could not find font URL in CSS for ${fontFamily}`)
      return null
    }
    const fontUrl = fontUrlMatch[1]

    // 5. Fetch binary font file
    const fontResponse = await fetch(fontUrl)
    if (!fontResponse.ok) {
      console.warn(`[Dynamic Metrics] Failed to fetch font file for ${fontFamily}`)
      return null
    }
    const arrayBuffer = await fontResponse.arrayBuffer()

    // 6. Unpack metrics
    // Create a Blob from the buffer for fromBlob
    const blob = new Blob([arrayBuffer])
    const metrics = await fromBlob(blob)
    
    // 7. Store in cache
    if (metrics) {
      console.log(`[Dynamic Metrics] Successfully fetched metrics for ${fontFamily}:`, metrics)
      DYNAMIC_METRICS_CACHE[fontFamily] = metrics
      return metrics
    }

  } catch (error) {
    console.error(`[Dynamic Metrics] Error fetching metrics for ${fontFamily}:`, error)
  }

  return null
  */
}
// Cache to store dynamically fetched metrics
const DYNAMIC_METRICS_CACHE: Record<string, any> = {}

// Configuration for the metrics server
// In production, this should be an environment variable or a deployed URL
const METRICS_SERVER_URL = 'http://localhost:3000/metrics'

export async function fetchDynamicFontMetrics(fontFamily: string): Promise<any | null> {
  // 1. Check cache first
  if (DYNAMIC_METRICS_CACHE[fontFamily]) {
    return DYNAMIC_METRICS_CACHE[fontFamily]
  }

  try {
    const familyName = fontFamily.replace(/ /g, '+')
    const url = `${METRICS_SERVER_URL}?family=${familyName}`

    console.log(`[Dynamic Metrics] Requesting from server: ${url}`)

    const response = await fetch(url)
    
    if (!response.ok) {
      console.warn(`[Dynamic Metrics] Server returned ${response.status} for ${fontFamily}`)
      return null
    }

    const data = await response.json()

    // Check for server-side error
    if (data.error) {
      console.warn(`[Dynamic Metrics] Server error for ${fontFamily}: ${data.error}`)
      return null
    }

    // Validate that we got actual metrics
    if (data.ascent && data.unitsPerEm) {
      console.log(`[Dynamic Metrics] Successfully fetched metrics for ${fontFamily}`, data)
      DYNAMIC_METRICS_CACHE[fontFamily] = data
      return data
    }

  } catch (error) {
    console.error(`[Dynamic Metrics] Network error fetching metrics for ${fontFamily}:`, error)
  }

  return null
}
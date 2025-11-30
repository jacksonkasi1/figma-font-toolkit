export function calculatePerfectLineHeight(
  fontSize: number,
  fontName: string,
  metrics?: any,
  fontCategory?: string
): number {
  // STEP 1: ESTABLISH BASE HEURISTIC (The "Intent" Layer)
  // This defines what we *want* the text to look like stylistically.
  let heuristicMultiplier: number
  let isHeadingOrDisplay = false

  if (fontSize > 32) {
    heuristicMultiplier = 1.15 // Display / Hero
    isHeadingOrDisplay = true
  } else if (fontSize >= 20) {
    heuristicMultiplier = 1.25 // Heading
    isHeadingOrDisplay = true
  } else if (fontSize >= 14) {
    heuristicMultiplier = 1.5 // Body Copy
  } else {
    heuristicMultiplier = 1.35 // Caption / UI
  }

  // Apply Personality Modifiers to Heuristic
  const name = fontName || ''
  if (
    name.includes('Condensed') ||
    name.includes('Compressed') ||
    name.includes('Narrow') ||
    name.includes('Oswald') ||
    name.includes('Bebas')
  ) {
    heuristicMultiplier -= 0.1
  }

  if (!isHeadingOrDisplay) {
    if (
      fontCategory === 'Serif' ||
      name.includes('Merriweather') ||
      name.includes('Lora') ||
      name.includes('Playfair')
    ) {
      heuristicMultiplier += 0.1
    }
  }

  if (
    name.includes('Display') ||
    fontCategory === 'Handwriting'
  ) {
    heuristicMultiplier -= 0.05
  }

  // Calculate the target "Design" height
  const heuristicHeight = fontSize * heuristicMultiplier

  // STEP 2: APPLY METRICS (The "Physics" Layer)
  // Use the provided metrics object (from local map or dynamic fetch)
  let finalHeight: number

  if (metrics) {
    // We have data! Let's calculate the absolute minimum space this font physically needs.
    const { ascent, descent, unitsPerEm } = metrics
    
    // Calculate the physical height of the ink (Ascender to Descender)
    // Note: We add absolute values because descent is often negative in raw data, 
    // or positive in normalized data, but we want the total magnitude.
    // Capsize metrics are usually positive integers for both.
    const contentRatio = (Math.abs(ascent) + Math.abs(descent)) / unitsPerEm
    const physicalMinHeight = fontSize * contentRatio

    // Add "Leading Buffer" (Breathing Room)
    // We revert to 10% (0.1) to ensure large text gets enough space (e.g. 49px -> 74px).
    // We will handle the "tight" small text edge cases via Smart Rounding below.
    const leadingBuffer = fontSize * 0.1
    const targetHeight = physicalMinHeight + leadingBuffer

    if (isHeadingOrDisplay) {
      // For Headings:
      // We take the larger of:
      // 1. The Heuristic (Design Intent - e.g. 1.15x)
      // 2. The Physical Target (Physics + Buffer)
      const safeHeight = Math.max(heuristicHeight, targetHeight)
      
      // Smart Rounding (Integer Grid):
      // Standard Math.ceil would force 35.14px -> 36px (too loose for small text).
      // But we need 73.5px -> 74px (correct for large text).
      
      // Logic: If we are barely over the integer threshold (<= 0.2px), snap DOWN.
      // This ignores negligible buffer overflow for tighter fit on small text.
      const remainder = safeHeight % 1
      if (remainder > 0 && remainder <= 0.2) {
        finalHeight = Math.floor(safeHeight)
      } else {
        finalHeight = Math.ceil(safeHeight)
      }
    } else {
      // For Body: Rhythm is king. 
      // We still prefer 4px grid for body text (vertical rhythm), but ensure we clear the physical target.
      const targetRaw = Math.max(heuristicHeight, targetHeight)
      finalHeight = Math.ceil(targetRaw / 4) * 4
    }
  } else {
    // Fallback: No metrics available. Use the "Smart Guess" logic.
    if (isHeadingOrDisplay) {
      finalHeight = Math.ceil(heuristicHeight)
    } else {
      finalHeight = Math.ceil(heuristicHeight / 4) * 4
    }
  }

  // STEP 3: SAFETY FLOOR
  // Ensure line height is never smaller than the font itself + a safety buffer
  const minSafety = Math.max(fontSize + 4, fontSize * 1.05)
  if (finalHeight < minSafety) {
    finalHeight = Math.ceil(minSafety)
  }

  return finalHeight
}

export function getRecommendedLineHeight(fontSize: number, fontName: string = '', metrics?: any): number {
  return calculatePerfectLineHeight(fontSize, fontName, metrics)
}

export function calculateLineOverlap(fontSize: number, lineHeightPx: number, fontName: string = '', metrics?: any): number {
  const recommendedLineHeight = getRecommendedLineHeight(fontSize, fontName, metrics)
  const difference = Math.abs(recommendedLineHeight - lineHeightPx)
  return Math.round(difference)
}

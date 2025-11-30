export function calculatePerfectLineHeight(
  fontSize: number,
  fontName: string,
  fontCategory?: string
): number {
  let multiplier: number
  let isHeadingOrDisplay = false

  // STEP 1: ESTABLISH BASE ROLE
  if (fontSize > 32) {
    multiplier = 1.1 // Display / Hero
    isHeadingOrDisplay = true
  } else if (fontSize >= 20) {
    multiplier = 1.25 // Heading
    isHeadingOrDisplay = true
  } else if (fontSize >= 14) {
    multiplier = 1.5 // Body Copy
  } else {
    multiplier = 1.35 // Caption / UI
  }

  // STEP 2: DETECT FONT PERSONALITY
  const name = fontName || ''
  
  // Check for Condensed fonts
  if (
    name.includes('Condensed') ||
    name.includes('Compressed') ||
    name.includes('Narrow') ||
    name.includes('Oswald') ||
    name.includes('Bebas')
  ) {
    multiplier -= 0.1
  }

  // Check for "Tall" Serifs
  // For Headings/Display, we SKIP the extra height for Tall Serifs to keep it tight.
  if (!isHeadingOrDisplay) {
    if (
      fontCategory === 'Serif' ||
      name.includes('Merriweather') ||
      name.includes('Lora') ||
      name.includes('Playfair')
    ) {
      multiplier += 0.1
    }
  }

  // Check for "Display"
  if (
    name.includes('Display') ||
    fontCategory === 'Handwriting'
  ) {
    multiplier -= 0.05
  }

  // STEP 3: CALCULATE RAW HEIGHT
  const rawHeight = fontSize * multiplier

  // STEP 4: APPLY GRID OR ROUNDING
  let finalHeight: number

  if (isHeadingOrDisplay) {
    // For Headings/Display, disable 4px grid to ensure tight fit
    // Use floor as per "Tight/Heading Mode" spec
    finalHeight = Math.floor(rawHeight)
  } else {
    // For Body/UI, keep the 4px grid for rhythm
    finalHeight = Math.ceil(rawHeight / 4) * 4
  }

  // STEP 5: SAFETY FLOOR
  if (finalHeight < fontSize + 2) {
    finalHeight = fontSize + 4
  }

  return finalHeight
}

export function getRecommendedLineHeight(fontSize: number, fontName: string = ''): number {
  return calculatePerfectLineHeight(fontSize, fontName)
}

export function calculateLineOverlap(fontSize: number, lineHeightPx: number, fontName: string = ''): number {
  const recommendedLineHeight = getRecommendedLineHeight(fontSize, fontName)
  const difference = Math.abs(recommendedLineHeight - lineHeightPx)
  return Math.round(difference)
}

export function calculatePerfectLineHeight(
  fontSize: number,
  fontName: string,
  fontCategory?: string
): number {
  let multiplier: number
  if (fontSize > 32) {
    multiplier = 1.1
  } else if (fontSize >= 20) {
    multiplier = 1.25
  } else if (fontSize >= 14) {
    multiplier = 1.5
  } else {
    multiplier = 1.35
  }

  const name = fontName || ''
  
  if (
    name.includes('Condensed') ||
    name.includes('Compressed') ||
    name.includes('Narrow') ||
    name.includes('Oswald') ||
    name.includes('Bebas')
  ) {
    multiplier -= 0.1
  }

  if (
    fontCategory === 'Serif' ||
    name.includes('Merriweather') ||
    name.includes('Lora') ||
    name.includes('Playfair')
  ) {
    multiplier += 0.1
  }

  if (
    name.includes('Display') ||
    fontCategory === 'Handwriting'
  ) {
    multiplier -= 0.05
  }

  const rawHeight = fontSize * multiplier
  let finalHeight = Math.ceil(rawHeight / 4) * 4

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

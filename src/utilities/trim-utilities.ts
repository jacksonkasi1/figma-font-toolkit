import { precomputeValues } from '@capsizecss/core'
// Import some common font metrics
import arialMetrics from '@capsizecss/metrics/arial'
import helveticaMetrics from '@capsizecss/metrics/helvetica'
import robotoMetrics from '@capsizecss/metrics/roboto'
import interMetrics from '@capsizecss/metrics/inter'
import openSansMetrics from '@capsizecss/metrics/openSans'
import montserratMetrics from '@capsizecss/metrics/montserrat'
import latoMetrics from '@capsizecss/metrics/lato'
import poppinsMetrics from '@capsizecss/metrics/poppins'
import ralewayMetrics from '@capsizecss/metrics/raleway'
import sourceSans3Metrics from '@capsizecss/metrics/sourceSans3'

// Map of common font families to their metrics
const FONT_METRICS_MAP: Record<string, any> = {
  'Arial': arialMetrics,
  'Helvetica': helveticaMetrics,
  'Helvetica Neue': helveticaMetrics,
  'Roboto': robotoMetrics,
  'Inter': interMetrics,
  'Open Sans': openSansMetrics,
  'Montserrat': montserratMetrics,
  'Lato': latoMetrics,
  'Poppins': poppinsMetrics,
  'Raleway': ralewayMetrics,
  'Source Sans 3': sourceSans3Metrics
}

/**
 * Get font metrics for a given font family
 */
export function getFontMetrics(fontFamily: string): any | null {
  // Try exact match first
  if (FONT_METRICS_MAP[fontFamily]) {
    return FONT_METRICS_MAP[fontFamily]
  }

  // Try case-insensitive match
  const normalizedFamily = fontFamily.toLowerCase()
  for (const [key, value] of Object.entries(FONT_METRICS_MAP)) {
    if (key.toLowerCase() === normalizedFamily) {
      return value
    }
  }

  return null
}

/**
 * Calculate trim values for text
 */
export function calculateTrimValues(
  fontSize: number,
  lineHeightPx: number,
  fontMetrics: any
): { topTrim: number; bottomTrim: number } {
  try {
    // Use Capsize to calculate the trim values
    const capsizeValues = precomputeValues({
      fontSize,
      leading: lineHeightPx,
      fontMetrics
    })

    // Debug: Log what Capsize returned
    console.log('[Capsize Debug] Raw values:', {
      fontSize,
      lineHeightPx,
      capHeightTrim: capsizeValues.capHeightTrim,
      baselineTrim: capsizeValues.baselineTrim,
      fontMetrics: {
        familyName: fontMetrics.familyName,
        capHeight: fontMetrics.capHeight,
        ascent: fontMetrics.ascent,
        descent: fontMetrics.descent,
        unitsPerEm: fontMetrics.unitsPerEm
      }
    })

    // Calculate pixel margins from Capsize values
    const topTrim = Math.round(parseFloat(capsizeValues.capHeightTrim as string) * fontSize)
    const bottomTrim = Math.round(parseFloat(capsizeValues.baselineTrim as string) * fontSize)

    console.log('[Capsize Debug] Calculated:', {
      topTrimRaw: parseFloat(capsizeValues.capHeightTrim as string) * fontSize,
      bottomTrimRaw: parseFloat(capsizeValues.baselineTrim as string) * fontSize,
      topTrimRounded: topTrim,
      bottomTrimRounded: bottomTrim
    })

    return {
      topTrim: Math.abs(topTrim),
      bottomTrim: Math.abs(bottomTrim)
    }
  } catch (error) {
    console.error('Error calculating trim values:', error)
    return { topTrim: 0, bottomTrim: 0 }
  }
}

/**
 * Check if a text node has mixed fonts
 */
export function hasMixedFonts(node: TextNode): boolean {
  if (node.characters.length === 0) return false

  const firstFont = node.getRangeFontName(0, 1)
  if (firstFont === figma.mixed) return true

  for (let i = 1; i < node.characters.length; i++) {
    const currentFont = node.getRangeFontName(i, i + 1)
    if (currentFont === figma.mixed) return true
    if (typeof firstFont !== 'symbol' && typeof currentFont !== 'symbol') {
      if (firstFont.family !== currentFont.family || firstFont.style !== currentFont.style) {
        return true
      }
    }
  }

  return false
}

/**
 * Check if a text node has mixed font sizes
 */
export function hasMixedFontSizes(node: TextNode): boolean {
  if (node.characters.length === 0) return false

  const firstSize = node.getRangeFontSize(0, 1)
  if (firstSize === figma.mixed) return true

  for (let i = 1; i < node.characters.length; i++) {
    const currentSize = node.getRangeFontSize(i, i + 1)
    if (currentSize === figma.mixed) return true
    if (currentSize !== firstSize) return true
  }

  return false
}

/**
 * Check if a text node has mixed line heights
 */
export function hasMixedLineHeights(node: TextNode): boolean {
  if (node.characters.length === 0) return false

  const firstLineHeight = node.getRangeLineHeight(0, 1)
  if (firstLineHeight === figma.mixed) return true

  for (let i = 1; i < node.characters.length; i++) {
    const currentLineHeight = node.getRangeLineHeight(i, i + 1)
    if (currentLineHeight === figma.mixed) return true
    if (typeof firstLineHeight !== 'symbol' && typeof currentLineHeight !== 'symbol') {
      if (firstLineHeight.unit !== currentLineHeight.unit) {
        return true
      }
      // Only compare values if the unit is PIXELS or PERCENT (AUTO doesn't have a value)
      if (firstLineHeight.unit !== 'AUTO' && currentLineHeight.unit !== 'AUTO') {
        if ('value' in firstLineHeight && 'value' in currentLineHeight) {
          if (firstLineHeight.value !== currentLineHeight.value) {
            return true
          }
        }
      }
    }
  }

  return false
}

/**
 * Get the line height in pixels
 */
export function getLineHeightInPixels(node: TextNode): number {
  const lineHeight = node.lineHeight
  const fontSize = typeof node.fontSize === 'number' ? node.fontSize : 16

  if (lineHeight === figma.mixed) {
    console.log('[getLineHeightInPixels] Mixed line height detected, checking first character')
    // Use the first character's line height
    const firstLineHeight = node.getRangeLineHeight(0, 1)
    if (firstLineHeight !== figma.mixed) {
      if (firstLineHeight.unit === 'PIXELS') {
        console.log('[getLineHeightInPixels] First char PIXELS:', firstLineHeight.value)
        return firstLineHeight.value
      } else if (firstLineHeight.unit === 'PERCENT') {
        const calculated = (firstLineHeight.value / 100) * fontSize
        console.log('[getLineHeightInPixels] First char PERCENT:', firstLineHeight.value, '% =', calculated, 'px')
        return calculated
      } else {
        // AUTO
        console.log('[getLineHeightInPixels] First char AUTO, using 120%')
        return fontSize * 1.2 // Default to 120%
      }
    }
  } else {
    if (lineHeight.unit === 'PIXELS') {
      console.log('[getLineHeightInPixels] PIXELS:', lineHeight.value)
      return lineHeight.value
    } else if (lineHeight.unit === 'PERCENT') {
      const calculated = (lineHeight.value / 100) * fontSize
      console.log('[getLineHeightInPixels] PERCENT:', lineHeight.value, '% =', calculated, 'px')
      return calculated
    } else {
      // AUTO
      console.log('[getLineHeightInPixels] AUTO, using 120%')
      return fontSize * 1.2 // Default to 120%
    }
  }

  console.log('[getLineHeightInPixels] Fallback to default')
  return 16 * 1.2 // Fallback
}

/**
 * Calculate universal line height using the golden ratio formula
 * This ensures proper spacing to prevent selection highlight overlap
 */
export function calculateUniversalLineHeight(fontSize: number, fontWeight?: number): number {
  // Base multiplier using standard 1.5 ratio for body text
  let multiplier = 1.5

  // Adjust for font weight if provided
  if (fontWeight) {
    if (fontWeight <= 300) {       // Light
      multiplier = 1.45
    } else if (fontWeight <= 400) { // Regular
      multiplier = 1.5
    } else if (fontWeight <= 600) { // Medium/Semibold
      multiplier = 1.55
    } else {                        // Bold/Black
      multiplier = 1.6
    }
  }

  // Calculate with minimum clearance
  const minClearance = 8 // pixels (minimum spacing to prevent overlap)
  const calculated = fontSize * multiplier

  // Ensure minimum absolute spacing
  return Math.max(calculated, fontSize + minClearance)
}

/**
 * Line height ratio thresholds
 */
const MIN_RATIO = 1.2  // Below this = severe overlap risk (was 1.3)
const MAX_RATIO = 1.7  // Above this = disconnected lines
const OPTIMAL_RATIO = 1.5  // The sweet spot

/**
 * Check line height and return issue type
 * Returns: 'TOO_TIGHT' | 'TOO_LOOSE' | 'OPTIMAL' | null
 */
export function checkLineHeightIssue(fontSize: number, lineHeightPx: number): {
  hasIssue: boolean
  issueType: 'TOO_TIGHT' | 'TOO_LOOSE' | 'OPTIMAL'
  ratio: number
} {
  const ratio = lineHeightPx / fontSize

  if (ratio < MIN_RATIO) {
    return {
      hasIssue: true,
      issueType: 'TOO_TIGHT',
      ratio
    }
  } else if (ratio > MAX_RATIO) {
    return {
      hasIssue: true,
      issueType: 'TOO_LOOSE',
      ratio
    }
  } else {
    return {
      hasIssue: false,
      issueType: 'OPTIMAL',
      ratio
    }
  }
}

/**
 * Check if line height is too tight (causes selection highlight overlap)
 * Returns true if line height needs to be increased
 * @deprecated Use checkLineHeightIssue instead
 */
export function isLineHeightTooTight(fontSize: number, lineHeightPx: number): boolean {
  const ratio = lineHeightPx / fontSize
  return ratio < MIN_RATIO
}

/**
 * Get recommended line height based on font size
 */
export function getRecommendedLineHeight(fontSize: number): number {
  return Math.round(fontSize * OPTIMAL_RATIO)
}

/**
 * Calculate the spacing issue amount
 */
export function calculateLineOverlap(fontSize: number, lineHeightPx: number): number {
  const recommendedLineHeight = getRecommendedLineHeight(fontSize)
  const difference = Math.abs(recommendedLineHeight - lineHeightPx)
  return Math.round(difference)
}

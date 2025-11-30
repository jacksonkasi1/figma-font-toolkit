import { precomputeValues } from '@capsizecss/core'

export function calculateTrimValues(
  fontSize: number,
  lineHeightPx: number,
  fontMetrics: any
): { topTrim: number; bottomTrim: number } {
  try {
    const capsizeValues = precomputeValues({
      fontSize,
      leading: lineHeightPx,
      fontMetrics
    })

    const topTrim = Math.round(parseFloat(capsizeValues.capHeightTrim as string) * fontSize)
    const bottomTrim = Math.round(parseFloat(capsizeValues.baselineTrim as string) * fontSize)

    return {
      topTrim: Math.abs(topTrim),
      bottomTrim: Math.abs(bottomTrim)
    }
  } catch (error) {
    console.error('Error calculating trim values:', error)
    return { topTrim: 0, bottomTrim: 0 }
  }
}

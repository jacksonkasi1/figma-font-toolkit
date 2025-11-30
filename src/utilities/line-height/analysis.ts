import { calculatePerfectLineHeight } from './calculations'

export function checkLineHeightIssue(
  fontSize: number,
  lineHeightPx: number,
  fontName: string = '',
  metrics?: any
): {
  hasIssue: boolean
  issueType: 'TOO_TIGHT' | 'TOO_LOOSE' | 'OPTIMAL'
  ratio: number
  recommended: number
} {
  const recommended = calculatePerfectLineHeight(fontSize, fontName, metrics)
  const ratio = lineHeightPx / fontSize
  const difference = lineHeightPx - recommended
  const TOLERANCE = 0.5 // Allow 0.5px deviation

  if (Math.abs(difference) <= TOLERANCE) {
    return {
      hasIssue: false,
      issueType: 'OPTIMAL',
      ratio,
      recommended
    }
  }
  
  if (difference < 0) {
    return {
      hasIssue: true,
      issueType: 'TOO_TIGHT',
      ratio,
      recommended
    }
  } else {
    return {
      hasIssue: true,
      issueType: 'TOO_LOOSE',
      ratio,
      recommended
    }
  }
}

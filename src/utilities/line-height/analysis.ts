import { calculatePerfectLineHeight } from './calculations'

export function checkLineHeightIssue(
  fontSize: number,
  lineHeightPx: number,
  fontName: string = ''
): {
  hasIssue: boolean
  issueType: 'TOO_TIGHT' | 'TOO_LOOSE' | 'OPTIMAL'
  ratio: number
  recommended: number
} {
  const recommended = calculatePerfectLineHeight(fontSize, fontName)
  const ratio = lineHeightPx / fontSize
  
  if (lineHeightPx < recommended) {
    return {
      hasIssue: true,
      issueType: 'TOO_TIGHT',
      ratio,
      recommended
    }
  } else if (lineHeightPx > recommended) {
    return {
      hasIssue: true,
      issueType: 'TOO_LOOSE',
      ratio,
      recommended
    }
  } else {
    return {
      hasIssue: false,
      issueType: 'OPTIMAL',
      ratio,
      recommended
    }
  }
}

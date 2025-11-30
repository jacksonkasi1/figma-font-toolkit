import { emit } from '@create-figma-plugin/utilities'
import type { LineHeightScanResult, LineHeightScanCompleteHandler } from '../../types'
import { getLineHeightInPixels } from '../../utilities/node/measurements'
import { checkLineHeightIssue } from '../../utilities/line-height/analysis'
import { getRecommendedLineHeight, calculateLineOverlap } from '../../utilities/line-height/calculations'

export const scanLineHeightsHandler = async function () {
  const selection = figma.currentPage.selection

  const result: LineHeightScanResult = {
    totalScanned: 0,
    issuesFound: 0,
    textLayers: []
  }

  if (selection.length === 0) {
    figma.notify('Please select at least one text layer', { error: true })
    emit<LineHeightScanCompleteHandler>('LINE_HEIGHT_SCAN_COMPLETE', result)
    return
  }

  function findAllTextNodes(nodes: readonly SceneNode[]): TextNode[] {
    const textNodes: TextNode[] = []

    for (const node of nodes) {
      if (node.type === 'TEXT') {
        textNodes.push(node as TextNode)
      } else if ('children' in node) {
        textNodes.push(...findAllTextNodes(node.children))
      }
    }

    return textNodes
  }

  const textNodes = findAllTextNodes(selection)

  if (textNodes.length === 0) {
    figma.notify('No text layers found in selection', { error: true })
    emit<LineHeightScanCompleteHandler>('LINE_HEIGHT_SCAN_COMPLETE', result)
    return
  }

  for (const textNode of textNodes) {
    try {
      const fontName = textNode.fontName
      if (fontName === figma.mixed) {
        console.log(`[LH Scan] Skipping ${textNode.name}: mixed fonts`)
        continue
      }

      const fontSize = textNode.fontSize
      if (fontSize === figma.mixed) {
        console.log(`[LH Scan] Skipping ${textNode.name}: mixed font sizes`)
        continue
      }

      const lineHeight = textNode.lineHeight
      if (lineHeight === figma.mixed) {
        console.log(`[LH Scan] WARNING: ${textNode.name} has mixed line heights!`)
        console.log('[LH Scan] Checking all characters to find worst case...')

        const characters = textNode.characters
        let worstRatio = 1.5
        let worstLineHeight = fontSize * 1.5
        let hasIssues = false
        let worstIssueType: 'TOO_TIGHT' | 'TOO_LOOSE' | 'OPTIMAL' = 'OPTIMAL'

        for (let i = 0; i < characters.length; i++) {
          const charLineHeight = textNode.getRangeLineHeight(i, i + 1)
          if (charLineHeight !== figma.mixed && charLineHeight.unit === 'PIXELS') {
            const issue = checkLineHeightIssue(fontSize, charLineHeight.value, fontName.family)

            if (issue.hasIssue) {
              if (!hasIssues) {
                  hasIssues = true
                  worstLineHeight = charLineHeight.value
                  worstRatio = issue.ratio
                  worstIssueType = issue.issueType
              }
            }
          }
        }

        if (hasIssues) {
          console.log(`[LH Scan] Worst case in ${textNode.name}:`, {
            lineHeight: worstLineHeight,
            ratio: worstRatio.toFixed(2),
            issueType: worstIssueType
          })

          const recommendedLineHeight = getRecommendedLineHeight(fontSize, fontName.family)

          result.textLayers.push({
            nodeId: textNode.id,
            nodeName: `${textNode.name} (mixed)`,
            fontFamily: fontName.family,
            fontStyle: fontName.style,
            fontSize,
            lineHeight: worstLineHeight,
            lineHeightRatio: worstRatio,
            hasIssue: true,
            issueType: worstIssueType,
            recommendedLineHeight,
            overlapAmount: Math.abs(recommendedLineHeight - worstLineHeight)
          })

          result.totalScanned++
          result.issuesFound++
        } else {
          console.log(`[LH Scan] ${textNode.name} has mixed line heights but all are optimal`)
        }

        continue
      }

      const lineHeightPx = getLineHeightInPixels(textNode)
      const issue = checkLineHeightIssue(fontSize, lineHeightPx, fontName.family)
      const recommendedLineHeight = issue.recommended
      const overlapAmount = calculateLineOverlap(fontSize, lineHeightPx, fontName.family)

      console.log(`[LH Scan] ${textNode.name}:`, {
        fontSize,
        lineHeight: lineHeightPx,
        ratio: issue.ratio.toFixed(2),
        issueType: issue.issueType,
        hasIssue: issue.hasIssue,
        recommended: recommendedLineHeight
      })

      result.textLayers.push({
        nodeId: textNode.id,
        nodeName: textNode.name,
        fontFamily: fontName.family,
        fontStyle: fontName.style,
        fontSize,
        lineHeight: lineHeightPx,
        lineHeightRatio: issue.ratio,
        hasIssue: issue.hasIssue,
        issueType: issue.issueType,
        recommendedLineHeight: issue.hasIssue ? recommendedLineHeight : undefined,
        overlapAmount: issue.hasIssue ? overlapAmount : undefined
      })

      result.totalScanned++
      if (issue.hasIssue) {
        result.issuesFound++
      }
    } catch (error) {
      console.error(`[LH Scan] Error scanning ${textNode.name}:`, error)
    }
  }

  if (result.issuesFound > 0) {
    figma.notify(`Found ${result.issuesFound} line height issue${result.issuesFound === 1 ? '' : 's'}`)
  } else {
    figma.notify('All line heights are optimal!')
  }

  emit<LineHeightScanCompleteHandler>('LINE_HEIGHT_SCAN_COMPLETE', result)
}

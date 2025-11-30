import { emit } from '@create-figma-plugin/utilities'
import type { ReplacementSpec, ReplacementResult, ReplacementCompleteHandler } from '../../types'

export const applyReplacementHandler = async function (spec: ReplacementSpec) {
  const result: ReplacementResult = {
    success: false,
    affectedNodes: 0,
    affectedRanges: 0,
    errors: []
  }

  try {
    await figma.loadFontAsync({
      family: spec.newFont.family,
      style: spec.newFont.style
    })

    const processedNodes = new Set<string>()

    for (const occurrence of spec.occurrences) {
      try {
        const node = figma.getNodeById(occurrence.nodeId) as TextNode | null

        if (!node || node.type !== 'TEXT') {
          continue
        }

        try {
          await figma.loadFontAsync({
            family: occurrence.font.family,
            style: occurrence.font.style
          })
        } catch (e) {
          // Font might not be available, continue anyway
        }

        node.setRangeFontName(occurrence.rangeStart, occurrence.rangeEnd, {
          family: spec.newFont.family,
          style: spec.newFont.style
        })

        if (spec.newLineHeight) {
          try {
            node.setRangeLineHeight(
              occurrence.rangeStart,
              occurrence.rangeEnd,
              { value: spec.newLineHeight, unit: 'PIXELS' }
            )
          } catch (e) {
            node.lineHeight = { value: spec.newLineHeight, unit: 'PIXELS' }
          }
        }

        if (spec.newFontSize) {
          try {
            node.setRangeFontSize(occurrence.rangeStart, occurrence.rangeEnd, spec.newFontSize)
          } catch (e) {
            node.fontSize = spec.newFontSize
          }
        }

        result.affectedRanges++
        processedNodes.add(node.id)
      } catch (error) {
        result.errors.push(`Error updating node ${occurrence.nodeId}: ${error}`)
      }
    }

    result.affectedNodes = processedNodes.size
    result.success = result.affectedRanges > 0

    if (result.success) {
      figma.notify(`Updated ${result.affectedRanges} text ranges in ${result.affectedNodes} layers`)
    } else {
      figma.notify('Failed to apply changes', { error: true })
    }
  } catch (error) {
    result.errors.push(`Font loading failed: ${error}`)
    figma.notify('Failed to load font', { error: true })
  }

  emit<ReplacementCompleteHandler>('REPLACEMENT_COMPLETE', result)
}

import { emit } from '@create-figma-plugin/utilities'
import type { FixAllLineHeightsSpec, ScanLineHeightsHandler } from '../../types'

export const fixAllLineHeightsHandler = async function (spec: FixAllLineHeightsSpec) {
  let successCount = 0
  const errors: string[] = []

  // We'll process sequentially to avoid overwhelming Figma or hitting limits
  for (const fix of spec.fixes) {
    try {
      const node = figma.getNodeById(fix.nodeId) as TextNode | null

      if (!node || node.type !== 'TEXT') {
        continue
      }

      const fontName = node.fontName
      if (fontName === figma.mixed) {
        errors.push(`Skipped ${node.name}: Mixed fonts`)
        continue
      }

      // Load the font
      await figma.loadFontAsync({
        family: fontName.family,
        style: fontName.style
      })

      // Apply the new line height
      node.lineHeight = {
        value: fix.newLineHeight,
        unit: 'PIXELS'
      }

      successCount++
    } catch (error) {
      errors.push(`Failed to fix ${fix.nodeId}: ${error}`)
    }
  }

  if (successCount > 0) {
    figma.notify(`Fixed ${successCount} line height issue${successCount !== 1 ? 's' : ''}`)
    // Trigger rescan
    emit<ScanLineHeightsHandler>('SCAN_LINE_HEIGHTS')
  } else if (errors.length > 0) {
    figma.notify('Failed to fix some issues', { error: true })
    console.error('Fix all errors:', errors)
  }
}

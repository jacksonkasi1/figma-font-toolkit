import { emit } from '@create-figma-plugin/utilities'
import type { FixLineHeightSpec, ScanLineHeightsHandler } from '../../types'

export const fixLineHeightHandler = async function (spec: FixLineHeightSpec) {
  try {
    const node = figma.getNodeById(spec.nodeId) as TextNode | null

    if (!node || node.type !== 'TEXT') {
      figma.notify('Text layer not found', { error: true })
      return
    }

    const fontName = node.fontName
    if (fontName === figma.mixed) {
      figma.notify('Cannot fix text with mixed fonts', { error: true })
      return
    }

    await figma.loadFontAsync({
      family: fontName.family,
      style: fontName.style
    })

    node.lineHeight = {
      value: spec.newLineHeight,
      unit: 'PIXELS'
    }

    figma.notify(`✓ Updated "${node.name}" line height to ${spec.newLineHeight}px`)

    emit<ScanLineHeightsHandler>('SCAN_LINE_HEIGHTS')
  } catch (error) {
    figma.notify(`Failed to fix line height: ${error}`, { error: true })
  }
}

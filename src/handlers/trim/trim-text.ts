import { emit } from '@create-figma-plugin/utilities'
import type { TrimResult, TrimCompleteHandler } from '../../types'
import { getFontMetrics } from '../../utilities/fonts/metrics'
import { calculateTrimValues } from '../../utilities/trim/calculations'
import { hasMixedFonts, hasMixedFontSizes, hasMixedLineHeights } from '../../utilities/node/validators'
import { getLineHeightInPixels } from '../../utilities/node/measurements'

export const trimTextHandler = async function () {
  const selection = figma.currentPage.selection

  const result: TrimResult = {
    success: false,
    trimmedNodes: 0,
    trimmedTexts: [],
    errors: []
  }

  if (selection.length === 0) {
    result.errors.push('Please select at least one text layer')
    figma.notify('Please select at least one text layer', { error: true })
    emit<TrimCompleteHandler>('TRIM_COMPLETE', result)
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
    result.errors.push('No text layers found in selection')
    figma.notify('No text layers found in selection', { error: true })
    emit<TrimCompleteHandler>('TRIM_COMPLETE', result)
    return
  }

  for (const textNode of textNodes) {
    try {
      if (hasMixedFonts(textNode)) {
        result.errors.push(`${textNode.name}: Text has mixed fonts, cannot trim`)
        continue
      }

      if (hasMixedFontSizes(textNode)) {
        result.errors.push(`${textNode.name}: Text has mixed font sizes, cannot trim`)
        continue
      }

      if (hasMixedLineHeights(textNode)) {
        result.errors.push(`${textNode.name}: Text has mixed line heights, cannot trim`)
        continue
      }

      const fontName = textNode.fontName
      if (fontName === figma.mixed) {
        result.errors.push(`${textNode.name}: Cannot determine font`)
        continue
      }

      const fontSize = textNode.fontSize
      if (fontSize === figma.mixed) {
        result.errors.push(`${textNode.name}: Cannot determine font size`)
        continue
      }

      const lineHeightPx = getLineHeightInPixels(textNode)

      console.log(`[Trim Debug] ${textNode.name}:`, {
        fontSize,
        lineHeightPx,
        fontFamily: fontName.family,
        lineHeightRaw: textNode.lineHeight
      })

      const fontMetrics = getFontMetrics(fontName.family)
      if (!fontMetrics) {
        result.errors.push(
          `${textNode.name}: Font "${fontName.family}" is not currently supported. Try Arial, Roboto, Inter, or other common fonts.`
        )
        continue
      }

      const { topTrim, bottomTrim } = calculateTrimValues(fontSize, lineHeightPx, fontMetrics)

      console.log(`[Trim Debug] Calculated trims:`, {
        topTrim,
        bottomTrim,
        ratio: lineHeightPx / fontSize
      })

      if (topTrim === 0 && bottomTrim === 0) {
        result.errors.push(`${textNode.name}: Could not calculate trim values`)
        continue
      }

      try {
        await figma.loadFontAsync({
          family: fontName.family,
          style: fontName.style
        })
      } catch (error) {
        result.errors.push(`${textNode.name}: Failed to load font "${fontName.family} ${fontName.style}"`)
        continue
      }

      if (textNode.textAutoResize === 'NONE') {
        textNode.textAutoResize = 'HEIGHT'
      }

      const frame = figma.createFrame()
      frame.name = `${textNode.name} (Trimmed)`
      frame.layoutMode = 'VERTICAL'
      frame.primaryAxisSizingMode = 'AUTO'
      frame.counterAxisSizingMode = 'AUTO'
      frame.paddingTop = 0
      frame.paddingBottom = 0
      frame.paddingLeft = 0
      frame.paddingRight = 0
      frame.fills = []
      frame.clipsContent = false

      frame.x = textNode.x - topTrim
      frame.y = textNode.y - topTrim

      const parent = textNode.parent
      let insertIndex = 0
      if (parent && 'children' in parent) {
        insertIndex = parent.children.indexOf(textNode)
      }

      if (parent && 'appendChild' in parent) {
        frame.appendChild(textNode)
      }

      textNode.x = 0
      textNode.y = -topTrim

      const trimmedHeight = lineHeightPx - topTrim - bottomTrim
      frame.resize(textNode.width, trimmedHeight)

      if (parent && 'insertChild' in parent) {
        parent.insertChild(insertIndex, frame)
      }

      result.trimmedTexts.push({
        nodeId: textNode.id,
        nodeName: textNode.name,
        font: {
          family: fontName.family,
          style: fontName.style
        },
        fontSize,
        lineHeight: lineHeightPx,
        topTrim,
        bottomTrim
      })

      result.trimmedNodes++
    } catch (error) {
      result.errors.push(`${textNode.name}: ${error}`)
    }
  }

  result.success = result.trimmedNodes > 0

  if (result.success) {
    figma.notify(
      `Successfully trimmed ${result.trimmedNodes} text layer${result.trimmedNodes !== 1 ? 's' : ''}`
    )
  } else {
    figma.notify('Failed to trim text layers', { error: true })
  }

  emit<TrimCompleteHandler>('TRIM_COMPLETE', result)
}

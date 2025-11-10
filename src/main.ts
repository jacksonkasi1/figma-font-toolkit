import { emit, on, once, showUI } from '@create-figma-plugin/utilities'
import type {
  ScanFontsHandler,
  FontsScannedHandler,
  ApplyReplacementHandler,
  ReplacementCompleteHandler,
  PreviewSelectionHandler,
  RequestAvailableFontsHandler,
  AvailableFontsHandler,
  BulkUpdateHandler,
  TrimTextHandler,
  TrimCompleteHandler,
  ScanLineHeightsHandler,
  LineHeightScanCompleteHandler,
  FixLineHeightHandler,
  SelectNodeHandler,
  ReplacementSpec,
  ReplacementResult,
  BulkUpdateSpec,
  TrimResult,
  TrimmedTextInfo,
  FontOccurrence,
  LineHeightScanResult,
  FixLineHeightSpec,
  SelectNodeSpec
} from './types'
import {
  scanFontOccurrences,
  createFontMetadata,
  createAllGroupings
} from './utilities/font-operations'

export default function () {
  // Handle scan fonts request
  on<ScanFontsHandler>('SCAN_FONTS', async function () {
    const selection = figma.currentPage.selection

    if (selection.length === 0) {
      figma.notify('Please select at least one layer', { error: true })
      // Emit empty result to reset UI scanning state
      emit<FontsScannedHandler>('FONTS_SCANNED', {
        fonts: [],
        groups: {
          lineHeight: [],
          fontSize: [],
          fontWeight: [],
          fontFamily: []
        },
        totalNodes: 0
      })
      return
    }

    const occurrences = scanFontOccurrences(selection)

    if (occurrences.length === 0) {
      figma.notify('No text layers found in selection')
      // Emit empty result to reset UI scanning state
      emit<FontsScannedHandler>('FONTS_SCANNED', {
        fonts: [],
        groups: {
          lineHeight: [],
          fontSize: [],
          fontWeight: [],
          fontFamily: []
        },
        totalNodes: 0
      })
      return
    }

    const fonts = createFontMetadata(occurrences)
    const groups = createAllGroupings(occurrences)
    const nodeIds = new Set(occurrences.map((occ) => occ.nodeId))

    emit<FontsScannedHandler>('FONTS_SCANNED', {
      fonts,
      groups,
      totalNodes: nodeIds.size
    })

    figma.notify(`Found ${fonts.length} fonts in ${nodeIds.size} text layers`)
  })

  // Handle font replacement
  on<ApplyReplacementHandler>('APPLY_REPLACEMENT', async function (spec: ReplacementSpec) {
    const result: ReplacementResult = {
      success: false,
      affectedNodes: 0,
      affectedRanges: 0,
      errors: []
    }

    try {
      // Load target font
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

          // Load current font if needed
          try {
            await figma.loadFontAsync({
              family: occurrence.font.family,
              style: occurrence.font.style
            })
          } catch (e) {
            // Font might not be available, continue anyway
          }

          // Apply font change
          node.setRangeFontName(occurrence.rangeStart, occurrence.rangeEnd, {
            family: spec.newFont.family,
            style: spec.newFont.style
          })

          // Apply line height if specified
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

          // Apply font size if specified
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
  })

  // Handle bulk update
  on<BulkUpdateHandler>('BULK_UPDATE', async function (spec: BulkUpdateSpec) {
    let affectedRanges = 0
    let affectedNodes = 0
    const processedNodes = new Set<string>()
    const errors: string[] = []

    try {
      // Font weight mapping helper
      const findMatchingStyle = async (
        family: string,
        targetWeight: string
      ): Promise<string | null> => {
        const availableFonts = await figma.listAvailableFontsAsync()
        const familyFonts = availableFonts.filter((f) => f.fontName.family === family)

        if (familyFonts.length === 0) return null

        // Weight name mapping
        const weightMap: Record<string, string[]> = {
          '100': ['Thin', 'Hairline', '100', '100 Thin'],
          '200': ['Extra Light', 'ExtraLight', 'Ultra Light', 'UltraLight', '200', '200 Extra Light'],
          '300': ['Light', 'Lt', '300', '300 Light'],
          '400': ['Regular', 'Normal', 'Book', 'Rg', '400', '400 Regular'],
          '500': ['Medium', 'Md', '500', '500 Medium'],
          '600': ['Semi Bold', 'SemiBold', 'Demi Bold', 'DemiBold', '600', '600 Semi Bold'],
          '700': ['Bold', 'Bd', '700', '700 Bold'],
          '800': ['Extra Bold', 'ExtraBold', 'Ultra Bold', 'UltraBold', '800', '800 Extra Bold'],
          '900': ['Black', 'Heavy', 'Bk', '900', '900 Black']
        }

        const candidates = weightMap[targetWeight] || []

        // Try exact match first
        for (const candidate of candidates) {
          const match = familyFonts.find(
            (f) => f.fontName.style.toLowerCase() === candidate.toLowerCase()
          )
          if (match) return match.fontName.style
        }

        // Try partial match
        for (const candidate of candidates) {
          const match = familyFonts.find((f) =>
            f.fontName.style.toLowerCase().includes(candidate.toLowerCase())
          )
          if (match) return match.fontName.style
        }

        // Fallback to Regular
        const regular = familyFonts.find(
          (f) =>
            f.fontName.style.toLowerCase() === 'regular' ||
            f.fontName.style.toLowerCase() === 'normal' ||
            f.fontName.style.toLowerCase() === '400'
        )
        return regular ? regular.fontName.style : familyFonts[0].fontName.style
      }

      // Process each occurrence
      for (const occurrence of spec.occurrences) {
        try {
          const node = figma.getNodeById(occurrence.nodeId) as TextNode | null

          if (!node || node.type !== 'TEXT') {
            continue
          }

          // Load current font
          try {
            await figma.loadFontAsync({
              family: occurrence.font.family,
              style: occurrence.font.style
            })
          } catch (e) {
            errors.push(`Failed to load font ${occurrence.font.family} ${occurrence.font.style}`)
            continue
          }

          // Apply the update based on groupType
          if (spec.groupType === 'fontWeight') {
            const targetWeight = spec.targetValue as string
            const newStyle = await findMatchingStyle(occurrence.font.family, targetWeight)

            if (!newStyle) {
              errors.push(
                `Could not find matching weight ${targetWeight} for ${occurrence.font.family}`
              )
              continue
            }

            // Load the new font variant
            await figma.loadFontAsync({
              family: occurrence.font.family,
              style: newStyle
            })

            // Apply the font change
            node.setRangeFontName(occurrence.rangeStart, occurrence.rangeEnd, {
              family: occurrence.font.family,
              style: newStyle
            })

            affectedRanges++
          } else if (spec.groupType === 'lineHeight') {
            const targetLineHeight = spec.targetValue as number

            try {
              node.setRangeLineHeight(occurrence.rangeStart, occurrence.rangeEnd, {
                value: targetLineHeight,
                unit: 'PIXELS'
              })
            } catch (e) {
              // Fallback to setting entire node line height
              node.lineHeight = { value: targetLineHeight, unit: 'PIXELS' }
            }

            affectedRanges++
          } else if (spec.groupType === 'fontSize') {
            const targetSize = spec.targetValue as number

            try {
              node.setRangeFontSize(occurrence.rangeStart, occurrence.rangeEnd, targetSize)
            } catch (e) {
              // Fallback to setting entire node font size
              node.fontSize = targetSize
            }

            affectedRanges++
          }

          processedNodes.add(node.id)
        } catch (error) {
          errors.push(`Error updating node ${occurrence.nodeId}: ${error}`)
        }
      }

      affectedNodes = processedNodes.size

      if (affectedRanges > 0) {
        figma.notify(
          `Updated ${affectedRanges} range${affectedRanges === 1 ? '' : 's'} in ${affectedNodes} layer${affectedNodes === 1 ? '' : 's'}`
        )

        // Trigger automatic rescan
        emit<FontsScannedHandler>('FONTS_SCANNED', {
          fonts: createFontMetadata(scanFontOccurrences(figma.currentPage.selection)),
          groups: createAllGroupings(scanFontOccurrences(figma.currentPage.selection)),
          totalNodes: processedNodes.size
        })
      } else {
        figma.notify('No changes applied', { error: true })
        if (errors.length > 0) {
          console.error('Bulk update errors:', errors)
        }
      }
    } catch (error) {
      figma.notify(`Bulk update failed: ${error}`, { error: true })
      console.error('Bulk update error:', error)
    }
  })

  // Handle preview selection
  on<PreviewSelectionHandler>('PREVIEW_SELECTION', function (occurrences: FontOccurrence[]) {
    const nodeIds = new Set(occurrences.map((occ) => occ.nodeId))
    const nodes: SceneNode[] = []

    for (const nodeId of Array.from(nodeIds)) {
      const node = figma.getNodeById(nodeId)
      if (node) {
        nodes.push(node as SceneNode)
      }
    }

    if (nodes.length > 0) {
      figma.currentPage.selection = nodes
      figma.viewport.scrollAndZoomIntoView(nodes)
    }
  })

  // Handle available fonts request
  on<RequestAvailableFontsHandler>('REQUEST_AVAILABLE_FONTS', async function () {
    const availableFonts = await figma.listAvailableFontsAsync()
    emit<AvailableFontsHandler>('AVAILABLE_FONTS', availableFonts)
  })

  // Handle trim text request
  on<TrimTextHandler>('TRIM_TEXT', async function () {
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

    // Import trim utilities dynamically to avoid circular dependencies
    const {
      getFontMetrics,
      calculateTrimValues,
      hasMixedFonts,
      hasMixedFontSizes,
      hasMixedLineHeights,
      getLineHeightInPixels
    } = await import('./utilities/trim-utilities')

    // Recursive function to find all text nodes
    function findAllTextNodes(nodes: readonly SceneNode[]): TextNode[] {
      const textNodes: TextNode[] = []

      for (const node of nodes) {
        if (node.type === 'TEXT') {
          textNodes.push(node as TextNode)
        } else if ('children' in node) {
          // Recursively search children
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

    // Process each text node
    for (const textNode of textNodes) {
      try {
        // Validation checks
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

        // Get text properties
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

        // Debug: Log the detected values
        console.log(`[Trim Debug] ${textNode.name}:`, {
          fontSize,
          lineHeightPx,
          fontFamily: fontName.family,
          lineHeightRaw: textNode.lineHeight
        })

        // Get font metrics
        const fontMetrics = getFontMetrics(fontName.family)
        if (!fontMetrics) {
          result.errors.push(
            `${textNode.name}: Font "${fontName.family}" is not currently supported. Try Arial, Roboto, Inter, or other common fonts.`
          )
          continue
        }

        // Calculate trim values
        const { topTrim, bottomTrim } = calculateTrimValues(fontSize, lineHeightPx, fontMetrics)

        // Debug: Log the calculated trim values
        console.log(`[Trim Debug] Calculated trims:`, {
          topTrim,
          bottomTrim,
          ratio: lineHeightPx / fontSize
        })

        if (topTrim === 0 && bottomTrim === 0) {
          result.errors.push(`${textNode.name}: Could not calculate trim values`)
          continue
        }

        // Load the font before making any modifications
        try {
          await figma.loadFontAsync({
            family: fontName.family,
            style: fontName.style
          })
        } catch (error) {
          result.errors.push(`${textNode.name}: Failed to load font "${fontName.family} ${fontName.style}"`)
          continue
        }

        // Enable auto-resize if not already enabled
        if (textNode.textAutoResize === 'NONE') {
          textNode.textAutoResize = 'HEIGHT'
        }

        // Create a frame to wrap the text
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

        // Position frame at text's location
        frame.x = textNode.x - topTrim
        frame.y = textNode.y - topTrim

        // Get text's parent and index
        const parent = textNode.parent
        let insertIndex = 0
        if (parent && 'children' in parent) {
          insertIndex = parent.children.indexOf(textNode)
        }

        // Remove text from its current parent
        if (parent && 'appendChild' in parent) {
          frame.appendChild(textNode)
        }

        // Move text to origin within frame with negative offset
        textNode.x = 0
        textNode.y = -topTrim

        // Calculate and set frame height
        const trimmedHeight = lineHeightPx - topTrim - bottomTrim
        frame.resize(textNode.width, trimmedHeight)

        // Insert frame at the original position
        if (parent && 'insertChild' in parent) {
          parent.insertChild(insertIndex, frame)
        }

        // Store trim info
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
  })

  // Handle line height scan request
  on<ScanLineHeightsHandler>('SCAN_LINE_HEIGHTS', async function () {
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

    // Import trim utilities
    const {
      getLineHeightInPixels,
      isLineHeightTooTight,
      getRecommendedLineHeight,
      calculateLineOverlap
    } = await import('./utilities/trim-utilities')

    // Recursive function to find all text nodes
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

    // Process each text node
    for (const textNode of textNodes) {
      try {
        const fontName = textNode.fontName
        if (fontName === figma.mixed) continue

        const fontSize = textNode.fontSize
        if (fontSize === figma.mixed) continue

        const lineHeightPx = getLineHeightInPixels(textNode)
        const lineHeightRatio = lineHeightPx / fontSize
        const isTooTight = isLineHeightTooTight(fontSize, lineHeightPx)
        const recommendedLineHeight = getRecommendedLineHeight(fontSize)
        const overlapAmount = calculateLineOverlap(fontSize, lineHeightPx)

        result.textLayers.push({
          nodeId: textNode.id,
          nodeName: textNode.name,
          fontFamily: fontName.family,
          fontStyle: fontName.style,
          fontSize,
          lineHeight: lineHeightPx,
          lineHeightRatio,
          hasIssue: isTooTight,
          recommendedLineHeight: isTooTight ? recommendedLineHeight : undefined,
          overlapAmount: isTooTight ? overlapAmount : undefined
        })

        result.totalScanned++
        if (isTooTight) {
          result.issuesFound++
        }
      } catch (error) {
        console.error(`Error scanning ${textNode.name}:`, error)
      }
    }

    if (result.issuesFound > 0) {
      figma.notify(`Found ${result.issuesFound} text layer${result.issuesFound === 1 ? '' : 's'} with tight line height`)
    } else {
      figma.notify('All line heights look good!')
    }

    emit<LineHeightScanCompleteHandler>('LINE_HEIGHT_SCAN_COMPLETE', result)
  })

  // Handle fix line height request
  on<FixLineHeightHandler>('FIX_LINE_HEIGHT', async function (spec: FixLineHeightSpec) {
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

      // Load the font
      await figma.loadFontAsync({
        family: fontName.family,
        style: fontName.style
      })

      // Apply the new line height
      node.lineHeight = {
        value: spec.newLineHeight,
        unit: 'PIXELS'
      }

      figma.notify(`✓ Updated "${node.name}" line height to ${spec.newLineHeight}px`)

      // Trigger rescan
      emit<ScanLineHeightsHandler>('SCAN_LINE_HEIGHTS')
    } catch (error) {
      figma.notify(`Failed to fix line height: ${error}`, { error: true })
    }
  })

  // Handle select node request
  on<SelectNodeHandler>('SELECT_NODE', function (spec: SelectNodeSpec) {
    const node = figma.getNodeById(spec.nodeId)

    if (node) {
      figma.currentPage.selection = [node as SceneNode]
      figma.viewport.scrollAndZoomIntoView([node as SceneNode])
    }
  })

  // Show UI
  once('close', function () {
    figma.closePlugin()
  })

  showUI({
    width: 380,
    height: 480
  })
}

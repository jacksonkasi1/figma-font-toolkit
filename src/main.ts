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
  ReplacementSpec,
  ReplacementResult,
  BulkUpdateSpec,
  FontOccurrence
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
      return
    }

    const occurrences = scanFontOccurrences(selection)

    if (occurrences.length === 0) {
      figma.notify('No text layers found in selection')
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

  // Show UI
  once('close', function () {
    figma.closePlugin()
  })

  showUI({
    width: 380,
    height: 600
  })
}

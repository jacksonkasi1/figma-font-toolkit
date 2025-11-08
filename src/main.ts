import { emit, on, once, showUI } from '@create-figma-plugin/utilities'
import type {
  ScanFontsHandler,
  FontsScannedHandler,
  ApplyReplacementHandler,
  ReplacementCompleteHandler,
  PreviewSelectionHandler,
  RequestAvailableFontsHandler,
  AvailableFontsHandler,
  ReplacementSpec,
  ReplacementResult,
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

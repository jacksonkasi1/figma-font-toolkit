import { emit } from '@create-figma-plugin/utilities'
import { scanFontOccurrences, createFontMetadata, createAllGroupings } from '../../utilities/font-operations'
import type { FontsScannedHandler } from '../../types'

export const scanFontsHandler = async function () {
  const selection = figma.currentPage.selection

  if (selection.length === 0) {
    figma.notify('Please select at least one layer', { error: true })
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
}

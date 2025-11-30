import { emit } from '@create-figma-plugin/utilities'
import { scanFontOccurrences, createFontMetadata, createAllGroupings } from '../../utilities/font-operations'
import type { BulkUpdateSpec, FontsScannedHandler } from '../../types'

export const bulkUpdateHandler = async function (spec: BulkUpdateSpec) {
  let affectedRanges = 0
  let affectedNodes = 0
  const processedNodes = new Set<string>()
  const errors: string[] = []

  try {
    const findMatchingStyle = async (
      family: string,
      targetWeight: string
    ): Promise<string | null> => {
      const availableFonts = await figma.listAvailableFontsAsync()
      const familyFonts = availableFonts.filter((f) => f.fontName.family === family)

      if (familyFonts.length === 0) return null

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

      for (const candidate of candidates) {
        const match = familyFonts.find(
          (f) => f.fontName.style.toLowerCase() === candidate.toLowerCase()
        )
        if (match) return match.fontName.style
      }

      for (const candidate of candidates) {
        const match = familyFonts.find((f) =>
          f.fontName.style.toLowerCase().includes(candidate.toLowerCase())
        )
        if (match) return match.fontName.style
      }

      const regular = familyFonts.find(
        (f) =>
          f.fontName.style.toLowerCase() === 'regular' ||
          f.fontName.style.toLowerCase() === 'normal' ||
          f.fontName.style.toLowerCase() === '400'
      )
      return regular ? regular.fontName.style : familyFonts[0].fontName.style
    }

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
          errors.push(`Failed to load font ${occurrence.font.family} ${occurrence.font.style}`)
          continue
        }

        if (spec.groupType === 'fontWeight') {
          const targetWeight = spec.targetValue as string
          const newStyle = await findMatchingStyle(occurrence.font.family, targetWeight)

          if (!newStyle) {
            errors.push(
              `Could not find matching weight ${targetWeight} for ${occurrence.font.family}`
            )
            continue
          }

          await figma.loadFontAsync({
            family: occurrence.font.family,
            style: newStyle
          })

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
            node.lineHeight = { value: targetLineHeight, unit: 'PIXELS' }
          }

          affectedRanges++
        } else if (spec.groupType === 'fontSize') {
          const targetSize = spec.targetValue as number

          try {
            node.setRangeFontSize(occurrence.rangeStart, occurrence.rangeEnd, targetSize)
          } catch (e) {
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
}

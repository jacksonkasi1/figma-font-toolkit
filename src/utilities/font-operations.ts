import type { FontOccurrence, FoundFont, FontMetadata, OccurrenceGroup, GroupByType } from '../types'

export function areFontsEqual(fontA: FontName, fontB: FontName): boolean {
  return fontA.family === fontB.family && fontA.style === fontB.style
}

export function getFontKey(font: FoundFont): string {
  return `${font.family}||${font.style}`
}

export function parseFontWeight(style: string): string {
  const weightMap: Record<string, string> = {
    'Thin': '100',
    'Extra Light': '200',
    'Light': '300',
    'Regular': '400',
    'Medium': '500',
    'Semi Bold': '600',
    'Bold': '700',
    'Extra Bold': '800',
    'Black': '900'
  }

  const numericMatch = style.match(/\d{3}/)
  if (numericMatch) {
    return numericMatch[0]
  }

  for (const [name, weight] of Object.entries(weightMap)) {
    if (style.includes(name)) {
      return weight
    }
  }

  return style
}

export function resolveLineHeightPx(
  textNode: TextNode,
  rangeStart?: number,
  rangeEnd?: number
): number {
  let lineHeight: LineHeight | typeof figma.mixed

  if (rangeStart !== undefined && rangeEnd !== undefined) {
    lineHeight = textNode.getRangeLineHeight(rangeStart, rangeEnd)
  } else {
    lineHeight = textNode.lineHeight
  }

  if (lineHeight === figma.mixed) {
    lineHeight = textNode.getRangeLineHeight(0, 1)
  }

  const lh = lineHeight as LineHeight

  if (lh.unit === 'PIXELS' && 'value' in lh) {
    return lh.value
  } else if (lh.unit === 'PERCENT' && 'value' in lh) {
    const fontSize = rangeStart !== undefined && rangeEnd !== undefined
      ? textNode.getRangeFontSize(rangeStart, rangeEnd)
      : textNode.fontSize
    const size = fontSize === figma.mixed ? 16 : fontSize
    return (size * lh.value) / 100
  } else {
    const fontSize = rangeStart !== undefined && rangeEnd !== undefined
      ? textNode.getRangeFontSize(rangeStart, rangeEnd)
      : textNode.fontSize
    const size = fontSize === figma.mixed ? 16 : fontSize
    return size * 1.2
  }
}

export function scanFontOccurrences(selection: readonly SceneNode[]): FontOccurrence[] {
  const occurrences: FontOccurrence[] = []

  function processTextNode(textNode: TextNode): void {
    const length = textNode.characters.length
    if (length === 0) return

    try {
      const fontName = textNode.fontName

      if (fontName !== figma.mixed) {
        const font = fontName as FontName
        const fontSize = textNode.fontSize as number

        occurrences.push({
          nodeId: textNode.id,
          nodeName: textNode.name,
          rangeStart: 0,
          rangeEnd: length,
          font: { family: font.family, style: font.style },
          fontSize,
          lineHeightPx: resolveLineHeightPx(textNode),
          fontWeight: parseFontWeight(font.style)
        })
      } else {
        let i = 0
        while (i < length) {
          const rangeFont = textNode.getRangeFontName(i, i + 1) as FontName
          const rangeFontSize = textNode.getRangeFontSize(i, i + 1) as number

          let j = i + 1
          while (j < length) {
            const nextFont = textNode.getRangeFontName(j, j + 1) as FontName
            const nextFontSize = textNode.getRangeFontSize(j, j + 1) as number

            if (!areFontsEqual(rangeFont, nextFont) || rangeFontSize !== nextFontSize) {
              break
            }
            j++
          }

          occurrences.push({
            nodeId: textNode.id,
            nodeName: textNode.name,
            rangeStart: i,
            rangeEnd: j,
            font: { family: rangeFont.family, style: rangeFont.style },
            fontSize: rangeFontSize,
            lineHeightPx: resolveLineHeightPx(textNode, i, j),
            fontWeight: parseFontWeight(rangeFont.style)
          })

          i = j
        }
      }
    } catch (error) {
      console.warn(`Failed to process text node ${textNode.id}:`, error)
    }
  }

  function traverse(node: SceneNode): void {
    if (node.type === 'TEXT') {
      processTextNode(node as TextNode)
    } else if ('children' in node) {
      for (const child of (node as ChildrenMixin).children) {
        traverse(child)
      }
    }
  }

  for (const node of selection) {
    traverse(node)
  }

  return occurrences
}

export function createFontMetadata(occurrences: FontOccurrence[]): FontMetadata[] {
  const fontMap = new Map<string, FontMetadata>()

  for (const occurrence of occurrences) {
    const key = getFontKey(occurrence.font)
    let metadata = fontMap.get(key)

    if (!metadata) {
      const nodeIds = new Set<string>()
      const fontOccurrences: FontOccurrence[] = []
      
      for (const occ of occurrences) {
        if (getFontKey(occ.font) === key) {
          fontOccurrences.push(occ)
          nodeIds.add(occ.nodeId)
        }
      }

      metadata = {
        font: occurrence.font,
        count: fontOccurrences.length,
        nodesCount: nodeIds.size,
        occurrences: fontOccurrences
      }
      fontMap.set(key, metadata)
    }
  }

  return Array.from(fontMap.values()).sort((a, b) => b.count - a.count)
}

export function groupByLineHeight(occurrences: FontOccurrence[]): OccurrenceGroup[] {
  const groups = new Map<string, FontOccurrence[]>()

  for (const occurrence of occurrences) {
    const key = Math.round(occurrence.lineHeightPx).toString()
    const existing = groups.get(key) || []
    existing.push(occurrence)
    groups.set(key, existing)
  }

  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `lineHeight:${key}`,
    label: `Line Height: ${key}px`,
    occurrences: occs,
    count: occs.length
  }))
}

export function groupByFontSize(occurrences: FontOccurrence[]): OccurrenceGroup[] {
  const groups = new Map<string, FontOccurrence[]>()

  for (const occurrence of occurrences) {
    const key = Math.round(occurrence.fontSize).toString()
    const existing = groups.get(key) || []
    existing.push(occurrence)
    groups.set(key, existing)
  }

  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `fontSize:${key}`,
    label: `Font Size: ${key}px`,
    occurrences: occs,
    count: occs.length
  }))
}

export function groupByFontWeight(occurrences: FontOccurrence[]): OccurrenceGroup[] {
  const groups = new Map<string, FontOccurrence[]>()

  for (const occurrence of occurrences) {
    const key = occurrence.fontWeight
    const existing = groups.get(key) || []
    existing.push(occurrence)
    groups.set(key, existing)
  }

  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `fontWeight:${key}`,
    label: `Weight: ${key}`,
    occurrences: occs,
    count: occs.length
  }))
}

export function groupByFontFamily(occurrences: FontOccurrence[]): OccurrenceGroup[] {
  const groups = new Map<string, FontOccurrence[]>()

  for (const occurrence of occurrences) {
    const key = occurrence.font.family
    const existing = groups.get(key) || []
    existing.push(occurrence)
    groups.set(key, existing)
  }

  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `fontFamily:${key}`,
    label: `Family: ${key}`,
    occurrences: occs,
    count: occs.length
  }))
}

export function createAllGroupings(occurrences: FontOccurrence[]): Record<GroupByType, OccurrenceGroup[]> {
  return {
    lineHeight: groupByLineHeight(occurrences),
    fontSize: groupByFontSize(occurrences),
    fontWeight: groupByFontWeight(occurrences),
    fontFamily: groupByFontFamily(occurrences)
  }
}

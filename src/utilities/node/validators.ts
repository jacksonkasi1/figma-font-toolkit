export function hasMixedFonts(node: TextNode): boolean {
  if (node.characters.length === 0) return false

  const firstFont = node.getRangeFontName(0, 1)
  if (firstFont === figma.mixed) return true

  for (let i = 1; i < node.characters.length; i++) {
    const currentFont = node.getRangeFontName(i, i + 1)
    if (currentFont === figma.mixed) return true
    if (typeof firstFont !== 'symbol' && typeof currentFont !== 'symbol') {
      if (firstFont.family !== currentFont.family || firstFont.style !== currentFont.style) {
        return true
      }
    }
  }

  return false
}

export function hasMixedFontSizes(node: TextNode): boolean {
  if (node.characters.length === 0) return false

  const firstSize = node.getRangeFontSize(0, 1)
  if (firstSize === figma.mixed) return true

  for (let i = 1; i < node.characters.length; i++) {
    const currentSize = node.getRangeFontSize(i, i + 1)
    if (currentSize === figma.mixed) return true
    if (currentSize !== firstSize) return true
  }

  return false
}

export function hasMixedLineHeights(node: TextNode): boolean {
  if (node.characters.length === 0) return false

  const firstLineHeight = node.getRangeLineHeight(0, 1)
  if (firstLineHeight === figma.mixed) return true

  for (let i = 1; i < node.characters.length; i++) {
    const currentLineHeight = node.getRangeLineHeight(i, i + 1)
    if (currentLineHeight === figma.mixed) return true
    if (typeof firstLineHeight !== 'symbol' && typeof currentLineHeight !== 'symbol') {
      if (firstLineHeight.unit !== currentLineHeight.unit) {
        return true
      }
      if (firstLineHeight.unit !== 'AUTO' && currentLineHeight.unit !== 'AUTO') {
        if ('value' in firstLineHeight && 'value' in currentLineHeight) {
          if (firstLineHeight.value !== currentLineHeight.value) {
            return true
          }
        }
      }
    }
  }

  return false
}

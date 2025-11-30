export function getLineHeightInPixels(node: TextNode): number {
  const lineHeight = node.lineHeight
  const fontSize = typeof node.fontSize === 'number' ? node.fontSize : 16

  if (lineHeight === figma.mixed) {
    const firstLineHeight = node.getRangeLineHeight(0, 1)
    if (firstLineHeight !== figma.mixed) {
      if (firstLineHeight.unit === 'PIXELS') {
        return firstLineHeight.value
      } else if (firstLineHeight.unit === 'PERCENT') {
        return (firstLineHeight.value / 100) * fontSize
      } else {
        return fontSize * 1.2
      }
    }
  } else {
    if (lineHeight.unit === 'PIXELS') {
      return lineHeight.value
    } else if (lineHeight.unit === 'PERCENT') {
      return (lineHeight.value / 100) * fontSize
    } else {
      return fontSize * 1.2
    }
  }

  return 16 * 1.2
}

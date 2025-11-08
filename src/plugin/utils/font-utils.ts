/**
 * Utility functions for font manipulation
 */

import type { FoundFont, LineHeight } from '../types';

/**
 * Compares two font names for equality
 * @param {FontName} fontA - First font to compare
 * @param {FontName} fontB - Second font to compare
 * @returns {boolean} True if fonts are equal
 */
export function areFontsEqual(fontA: FontName, fontB: FontName): boolean {
  return fontA.family === fontB.family && fontA.style === fontB.style;
}

/**
 * Generates a unique key for a font
 * @param {FoundFont} font - Font to generate key for
 * @returns {string} Unique key string
 */
export function getFontKey(font: FoundFont): string {
  return `${font.family}||${font.style}`;
}

/**
 * Parses font weight from style string
 * @param {string} style - Font style string
 * @returns {string} Parsed weight or style
 */
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
    'Black': '900',
  };

  // Check for numeric weight in style string (e.g., "Bold 700")
  const numericMatch = style.match(/\d{3}/);
  if (numericMatch) {
    return numericMatch[0];
  }

  // Check for known weight names
  for (const [name, weight] of Object.entries(weightMap)) {
    if (style.includes(name)) {
      return weight;
    }
  }

  // Default to style string
  return style;
}

/**
 * Resolves line height to pixels
 * @param {TextNode} textNode - Text node to resolve line height for
 * @param {number} rangeStart - Optional range start
 * @param {number} rangeEnd - Optional range end
 * @returns {number} Line height in pixels
 */
export function resolveLineHeightPx(
  textNode: TextNode,
  rangeStart?: number,
  rangeEnd?: number
): number {
  let lineHeight: LineHeight | typeof figma.mixed;

  if (rangeStart !== undefined && rangeEnd !== undefined) {
    lineHeight = textNode.getRangeLineHeight(rangeStart, rangeEnd);
  } else {
    lineHeight = textNode.lineHeight;
  }

  if (lineHeight === figma.mixed) {
    // For mixed line heights, use the first character's line height
    lineHeight = textNode.getRangeLineHeight(0, 1);
  }

  const lh = lineHeight as LineHeight;

  if (lh.unit === 'PIXELS' && 'value' in lh) {
    return lh.value;
  } else if (lh.unit === 'PERCENT' && 'value' in lh) {
    const fontSize = rangeStart !== undefined && rangeEnd !== undefined
      ? textNode.getRangeFontSize(rangeStart, rangeEnd)
      : textNode.fontSize;
    const size = fontSize === figma.mixed ? 16 : fontSize;
    return (size * lh.value) / 100;
  } else {
    // AUTO - use default (typically 1.2 * fontSize)
    const fontSize = rangeStart !== undefined && rangeEnd !== undefined
      ? textNode.getRangeFontSize(rangeStart, rangeEnd)
      : textNode.fontSize;
    const size = fontSize === figma.mixed ? 16 : fontSize;
    return size * 1.2;
  }
}

/**
 * Formats line height for display
 * @param {number} lineHeightPx - Line height in pixels
 * @returns {string} Formatted line height string
 */
export function formatLineHeight(lineHeightPx: number): string {
  return `${Math.round(lineHeightPx)}px`;
}

/**
 * Formats font size for display
 * @param {number | typeof figma.mixed} fontSize - Font size
 * @returns {string} Formatted font size string
 */
export function formatFontSize(fontSize: number | typeof figma.mixed): string {
  if (fontSize === figma.mixed) {
    return 'Mixed';
  }
  return `${Math.round(fontSize)}px`;
}

/**
 * Font Scanner Service
 * Scans selected nodes and extracts font occurrences
 */

import type { FontOccurrence, FoundFont } from '../types';
import { areFontsEqual, parseFontWeight, resolveLineHeightPx } from '../utils/font-utils';

/**
 * Scans selection and collects all font occurrences
 * @param {readonly SceneNode[]} selection - Nodes to scan
 * @returns {FontOccurrence[]} Array of font occurrences
 */
export function scanFontOccurrences(selection: readonly SceneNode[]): FontOccurrence[] {
  const occurrences: FontOccurrence[] = [];

  /**
   * Processes a single text node
   * @param {TextNode} textNode - Text node to process
   */
  function processTextNode(textNode: TextNode): void {
    const length = textNode.characters.length;

    if (length === 0) {
      return;
    }

    try {
      const fontName = textNode.fontName;

      // Check if the entire node has a single font
      if (fontName !== figma.mixed) {
        const font = fontName as FontName;
        const fontSize = textNode.fontSize as number;
        const lineHeight = textNode.lineHeight;

        occurrences.push({
          nodeId: textNode.id,
          nodeName: textNode.name,
          nodeType: 'TEXT',
          rangeStart: 0,
          rangeEnd: length,
          font: {
            family: font.family,
            style: font.style,
          },
          fontSize,
          lineHeight,
          computedLineHeightPx: resolveLineHeightPx(textNode),
          fontWeight: parseFontWeight(font.style),
        });
      } else {
        // Mixed fonts - scan character by character
        let i = 0;

        while (i < length) {
          const rangeFont = textNode.getRangeFontName(i, i + 1) as FontName;
          const rangeFontSize = textNode.getRangeFontSize(i, i + 1) as number;
          const rangeLineHeight = textNode.getRangeLineHeight(i, i + 1);

          // Find the end of the contiguous range with the same properties
          let j = i + 1;
          while (j < length) {
            const nextFont = textNode.getRangeFontName(j, j + 1) as FontName;
            const nextFontSize = textNode.getRangeFontSize(j, j + 1) as number;

            if (
              !areFontsEqual(rangeFont, nextFont) ||
              rangeFontSize !== nextFontSize
            ) {
              break;
            }

            j++;
          }

          occurrences.push({
            nodeId: textNode.id,
            nodeName: textNode.name,
            nodeType: 'TEXT',
            rangeStart: i,
            rangeEnd: j,
            font: {
              family: rangeFont.family,
              style: rangeFont.style,
            },
            fontSize: rangeFontSize,
            lineHeight: rangeLineHeight,
            computedLineHeightPx: resolveLineHeightPx(textNode, i, j),
            fontWeight: parseFontWeight(rangeFont.style),
          });

          i = j;
        }
      }
    } catch (error) {
      console.warn(`Failed to process text node ${textNode.id}:`, error);
    }
  }

  /**
   * Traverses the node tree recursively
   * @param {SceneNode} node - Node to traverse
   */
  function traverse(node: SceneNode): void {
    if (node.type === 'TEXT') {
      processTextNode(node as TextNode);
    } else if ('children' in node) {
      for (const child of (node as ChildrenMixin).children) {
        traverse(child);
      }
    }
  }

  // Scan all selected nodes
  for (const node of selection) {
    traverse(node);
  }

  return occurrences;
}

/**
 * Extracts unique fonts from occurrences
 * @param {FontOccurrence[]} occurrences - Font occurrences
 * @returns {FoundFont[]} Array of unique fonts
 */
export function extractUniqueFonts(occurrences: FontOccurrence[]): FoundFont[] {
  const fontMap = new Map<string, FoundFont>();

  for (const occurrence of occurrences) {
    const key = `${occurrence.font.family}||${occurrence.font.style}`;
    if (!fontMap.has(key)) {
      fontMap.set(key, occurrence.font);
    }
  }

  return Array.from(fontMap.values());
}

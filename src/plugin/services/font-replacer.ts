/**
 * Font Replacer Service
 * Handles font replacement operations with safe updates
 */

import type { FontOccurrence, ReplacementSpec, ReplacementResult, FoundFont } from '../types';
import { loadFonts } from './font-loader';

/**
 * Applies font replacement to selected occurrences
 * @param {FontOccurrence[]} occurrences - Occurrences to update
 * @param {ReplacementSpec} spec - Replacement specification
 * @returns {Promise<ReplacementResult>} Result of replacement operation
 */
export async function applyFontReplacement(
  occurrences: FontOccurrence[],
  spec: ReplacementSpec
): Promise<ReplacementResult> {
  const result: ReplacementResult = {
    success: false,
    affectedNodes: 0,
    affectedRanges: 0,
    errors: [],
    skipped: 0,
  };

  if (occurrences.length === 0) {
    result.errors.push('No occurrences to update');
    return result;
  }

  // Filter occurrences based on scope
  let targetOccurrences = occurrences;

  if (spec.scope === 'group' && spec.groupKey) {
    // Filtering is done before calling this function
    // This is just a safety check
  }

  if (spec.targetFont && spec.newFont) {
    // Filter occurrences that match the target font
    targetOccurrences = occurrences.filter(
      (occ) =>
        occ.font.family === spec.targetFont!.family &&
        occ.font.style === spec.targetFont!.style
    );
  }

  if (targetOccurrences.length === 0) {
    result.errors.push('No matching occurrences found');
    return result;
  }

  // Collect unique fonts to load
  const fontsToLoad: FoundFont[] = [];

  if (spec.newFont) {
    fontsToLoad.push(spec.newFont);
  }

  // Load fonts
  if (fontsToLoad.length > 0) {
    const loadResult = await loadFonts(fontsToLoad);

    if (loadResult.failed.length > 0) {
      result.errors.push(
        `Failed to load fonts: ${loadResult.failed.map((f) => `${f.family} ${f.style}`).join(', ')}`
      );
      return result;
    }
  }

  // Apply changes
  const processedNodes = new Set<string>();

  for (const occurrence of targetOccurrences) {
    try {
      const node = figma.getNodeById(occurrence.nodeId) as TextNode | null;

      if (!node || node.type !== 'TEXT') {
        result.skipped++;
        continue;
      }

      // Apply font change
      if (spec.newFont) {
        node.setRangeFontName(occurrence.rangeStart, occurrence.rangeEnd, {
          family: spec.newFont.family,
          style: spec.newFont.style,
        });
      }

      // Apply line height change
      if (spec.newLineHeight) {
        try {
          if (spec.newLineHeight.unit === 'PIXELS') {
            node.setRangeLineHeight(
              occurrence.rangeStart,
              occurrence.rangeEnd,
              { value: spec.newLineHeight.value, unit: 'PIXELS' }
            );
          } else if (spec.newLineHeight.unit === 'PERCENT') {
            node.setRangeLineHeight(
              occurrence.rangeStart,
              occurrence.rangeEnd,
              { value: spec.newLineHeight.value, unit: 'PERCENT' }
            );
          } else {
            node.setRangeLineHeight(
              occurrence.rangeStart,
              occurrence.rangeEnd,
              { unit: 'AUTO' }
            );
          }
        } catch (error) {
          // Range line height might not be supported, try node-level
          if (spec.newLineHeight.unit === 'PIXELS') {
            node.lineHeight = { value: spec.newLineHeight.value, unit: 'PIXELS' };
          } else if (spec.newLineHeight.unit === 'PERCENT') {
            node.lineHeight = { value: spec.newLineHeight.value, unit: 'PERCENT' };
          } else {
            node.lineHeight = { unit: 'AUTO' };
          }
        }
      }

      // Apply font size change
      if (spec.newFontSize) {
        try {
          node.setRangeFontSize(occurrence.rangeStart, occurrence.rangeEnd, spec.newFontSize);
        } catch (error) {
          node.fontSize = spec.newFontSize;
        }
      }

      result.affectedRanges++;
      processedNodes.add(node.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      result.errors.push(`Error updating node ${occurrence.nodeId}: ${errorMessage}`);
      result.skipped++;
    }
  }

  result.affectedNodes = processedNodes.size;
  result.success = result.affectedRanges > 0;

  return result;
}

/**
 * Previews selection by highlighting affected nodes
 * @param {FontOccurrence[]} occurrences - Occurrences to preview
 */
export function previewSelection(occurrences: FontOccurrence[]): void {
  const nodeIds = new Set(occurrences.map((occ) => occ.nodeId));
  const nodes: SceneNode[] = [];

  for (const nodeId of nodeIds) {
    const node = figma.getNodeById(nodeId);
    if (node) {
      nodes.push(node as SceneNode);
    }
  }

  if (nodes.length > 0) {
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
}

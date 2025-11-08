/**
 * Grouping Service
 * Groups font occurrences by various attributes
 */

import type { FontOccurrence, OccurrenceGroup, GroupByType, FontMetadata } from '../types';
import { getFontKey, formatLineHeight, formatFontSize } from '../utils/font-utils';

/**
 * Groups occurrences by line height
 * @param {FontOccurrence[]} occurrences - Occurrences to group
 * @returns {OccurrenceGroup[]} Grouped occurrences
 */
export function groupByLineHeight(occurrences: FontOccurrence[]): OccurrenceGroup[] {
  const groups = new Map<string, FontOccurrence[]>();

  for (const occurrence of occurrences) {
    const key = Math.round(occurrence.computedLineHeightPx).toString();
    const existing = groups.get(key) || [];
    existing.push(occurrence);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `lineHeight:${key}`,
    label: `Line Height: ${formatLineHeight(Number(key))}`,
    occurrences: occs,
    count: occs.length,
  }));
}

/**
 * Groups occurrences by font size
 * @param {FontOccurrence[]} occurrences - Occurrences to group
 * @returns {OccurrenceGroup[]} Grouped occurrences
 */
export function groupByFontSize(occurrences: FontOccurrence[]): OccurrenceGroup[] {
  const groups = new Map<string, FontOccurrence[]>();

  for (const occurrence of occurrences) {
    const fontSize = occurrence.fontSize === figma.mixed ? 'mixed' : Math.round(occurrence.fontSize).toString();
    const key = fontSize;
    const existing = groups.get(key) || [];
    existing.push(occurrence);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `fontSize:${key}`,
    label: `Font Size: ${key === 'mixed' ? 'Mixed' : formatFontSize(Number(key))}`,
    occurrences: occs,
    count: occs.length,
  }));
}

/**
 * Groups occurrences by font weight
 * @param {FontOccurrence[]} occurrences - Occurrences to group
 * @returns {OccurrenceGroup[]} Grouped occurrences
 */
export function groupByFontWeight(occurrences: FontOccurrence[]): OccurrenceGroup[] {
  const groups = new Map<string, FontOccurrence[]>();

  for (const occurrence of occurrences) {
    const key = occurrence.fontWeight;
    const existing = groups.get(key) || [];
    existing.push(occurrence);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `fontWeight:${key}`,
    label: `Weight: ${key}`,
    occurrences: occs,
    count: occs.length,
  }));
}

/**
 * Groups occurrences by font family
 * @param {FontOccurrence[]} occurrences - Occurrences to group
 * @returns {OccurrenceGroup[]} Grouped occurrences
 */
export function groupByFontFamily(occurrences: FontOccurrence[]): OccurrenceGroup[] {
  const groups = new Map<string, FontOccurrence[]>();

  for (const occurrence of occurrences) {
    const key = occurrence.font.family;
    const existing = groups.get(key) || [];
    existing.push(occurrence);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `fontFamily:${key}`,
    label: `Family: ${key}`,
    occurrences: occs,
    count: occs.length,
  }));
}

/**
 * Creates all groupings for occurrences
 * @param {FontOccurrence[]} occurrences - Occurrences to group
 * @returns {Record<GroupByType, OccurrenceGroup[]>} All groupings
 */
export function createAllGroupings(
  occurrences: FontOccurrence[]
): Record<GroupByType, OccurrenceGroup[]> {
  return {
    lineHeight: groupByLineHeight(occurrences),
    fontSize: groupByFontSize(occurrences),
    fontWeight: groupByFontWeight(occurrences),
    fontFamily: groupByFontFamily(occurrences),
  };
}

/**
 * Creates font metadata from occurrences
 * @param {FontOccurrence[]} occurrences - Font occurrences
 * @returns {FontMetadata[]} Font metadata with statistics
 */
export function createFontMetadata(occurrences: FontOccurrence[]): FontMetadata[] {
  const fontMap = new Map<string, FontMetadata>();

  for (const occurrence of occurrences) {
    const key = getFontKey(occurrence.font);
    let metadata = fontMap.get(key);

    if (!metadata) {
      metadata = {
        font: occurrence.font,
        occurrences: [],
        count: 0,
        nodes: new Set<string>(),
      };
      fontMap.set(key, metadata);
    }

    metadata.occurrences.push(occurrence);
    metadata.count++;
    metadata.nodes.add(occurrence.nodeId);
  }

  return Array.from(fontMap.values()).sort((a, b) => b.count - a.count);
}

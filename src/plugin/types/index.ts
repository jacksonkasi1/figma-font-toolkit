/**
 * Type definitions for Font Toolkit Plugin
 */

/**
 * Represents a font with family and style
 */
export interface FoundFont {
  family: string;
  style: string;
}

/**
 * Represents a single text occurrence with font and typography details
 */
export interface FontOccurrence {
  nodeId: string;
  nodeName: string;
  nodeType: 'TEXT';
  rangeStart: number;
  rangeEnd: number;
  font: FoundFont;
  fontSize: number | typeof figma.mixed;
  lineHeight: LineHeight | typeof figma.mixed;
  computedLineHeightPx: number;
  fontWeight: string;
}

/**
 * Line height representation
 */
export type LineHeight =
  | { value: number; unit: 'PIXELS' | 'PERCENT' }
  | { unit: 'AUTO' };

/**
 * Group key types for organizing occurrences
 */
export type GroupByType = 'lineHeight' | 'fontSize' | 'fontWeight' | 'fontFamily';

/**
 * Grouped occurrences
 */
export interface OccurrenceGroup {
  key: string;
  label: string;
  occurrences: FontOccurrence[];
  count: number;
}

/**
 * Font metadata with usage statistics
 */
export interface FontMetadata {
  font: FoundFont;
  occurrences: FontOccurrence[];
  count: number;
  nodes: Set<string>;
}

/**
 * Replacement specification
 */
export interface ReplacementSpec {
  targetFont?: FoundFont;
  newFont?: FoundFont;
  newLineHeight?: LineHeight;
  newFontSize?: number;
  scope: 'all' | 'group' | 'selection';
  groupKey?: string;
}

/**
 * Plugin message types
 */
export type PluginMessageType =
  | 'scan-fonts'
  | 'fonts-found'
  | 'apply-replacement'
  | 'preview-selection'
  | 'load-available-fonts'
  | 'available-fonts'
  | 'replacement-complete'
  | 'error'
  | 'progress';

/**
 * Base message structure
 */
export interface PluginMessage<T = any> {
  type: PluginMessageType;
  payload?: T;
}

/**
 * Fonts found message payload
 */
export interface FontsFoundPayload {
  fonts: FontMetadata[];
  occurrences: FontOccurrence[];
  groups: Record<GroupByType, OccurrenceGroup[]>;
  totalNodes: number;
}

/**
 * Progress message payload
 */
export interface ProgressPayload {
  current: number;
  total: number;
  message: string;
}

/**
 * Error message payload
 */
export interface ErrorPayload {
  message: string;
  details?: string;
}

/**
 * Replacement result
 */
export interface ReplacementResult {
  success: boolean;
  affectedNodes: number;
  affectedRanges: number;
  errors: string[];
  skipped: number;
}

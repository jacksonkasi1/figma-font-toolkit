import { EventHandler } from '@create-figma-plugin/utilities'

export interface FoundFont {
  family: string
  style: string
}

export interface FontOccurrence {
  nodeId: string
  nodeName: string
  rangeStart: number
  rangeEnd: number
  font: FoundFont
  fontSize: number
  lineHeightPx: number
  fontWeight: string
}

export interface FontMetadata {
  font: FoundFont
  count: number
  nodesCount: number
  occurrences: FontOccurrence[]
}

export interface OccurrenceGroup {
  key: string
  label: string
  occurrences: FontOccurrence[]
  count: number
}

export type GroupByType = 'lineHeight' | 'fontSize' | 'fontWeight' | 'fontFamily'

export interface ScanResult {
  fonts: FontMetadata[]
  groups: Record<GroupByType, OccurrenceGroup[]>
  totalNodes: number
}

export interface ReplacementSpec {
  targetFont: FoundFont
  newFont: FoundFont
  newLineHeight?: number
  newFontSize?: number
  occurrences: FontOccurrence[]
}

export interface ReplacementResult {
  success: boolean
  affectedNodes: number
  affectedRanges: number
  errors: string[]
}

// Event handlers for plugin-UI communication
export interface ScanFontsHandler extends EventHandler {
  name: 'SCAN_FONTS'
  handler: () => void
}

export interface FontsScannedHandler extends EventHandler {
  name: 'FONTS_SCANNED'
  handler: (result: ScanResult) => void
}

export interface ApplyReplacementHandler extends EventHandler {
  name: 'APPLY_REPLACEMENT'
  handler: (spec: ReplacementSpec) => void
}

export interface ReplacementCompleteHandler extends EventHandler {
  name: 'REPLACEMENT_COMPLETE'
  handler: (result: ReplacementResult) => void
}

export interface PreviewSelectionHandler extends EventHandler {
  name: 'PREVIEW_SELECTION'
  handler: (occurrences: FontOccurrence[]) => void
}

export interface AvailableFontsHandler extends EventHandler {
  name: 'AVAILABLE_FONTS'
  handler: (fonts: Font[]) => void
}

export interface RequestAvailableFontsHandler extends EventHandler {
  name: 'REQUEST_AVAILABLE_FONTS'
  handler: () => void
}

export interface BulkUpdateSpec {
  groupType: GroupByType
  targetValue: number | string
  occurrences: FontOccurrence[]
}

export interface BulkUpdateHandler extends EventHandler {
  name: 'BULK_UPDATE'
  handler: (spec: BulkUpdateSpec) => void
}

// Trim-related types
export interface TrimmedTextInfo {
  nodeId: string
  nodeName: string
  font: FoundFont
  fontSize: number
  lineHeight: number
  topTrim: number
  bottomTrim: number
}

export interface TrimResult {
  success: boolean
  trimmedNodes: number
  trimmedTexts: TrimmedTextInfo[]
  errors: string[]
}

export interface TrimTextHandler extends EventHandler {
  name: 'TRIM_TEXT'
  handler: () => void
}

export interface TrimCompleteHandler extends EventHandler {
  name: 'TRIM_COMPLETE'
  handler: (result: TrimResult) => void
}

// Line Height related types
export interface LineHeightTextLayer {
  nodeId: string
  nodeName: string
  fontFamily: string
  fontStyle: string
  fontSize: number
  lineHeight: number
  lineHeightRatio: number
  hasIssue: boolean
  issueType?: 'TOO_TIGHT' | 'TOO_LOOSE' | 'OPTIMAL'
  recommendedLineHeight?: number
  overlapAmount?: number
}

export interface LineHeightScanResult {
  totalScanned: number
  issuesFound: number
  textLayers: LineHeightTextLayer[]
}

export interface ScanLineHeightsHandler extends EventHandler {
  name: 'SCAN_LINE_HEIGHTS'
  handler: () => void
}

export interface LineHeightScanCompleteHandler extends EventHandler {
  name: 'LINE_HEIGHT_SCAN_COMPLETE'
  handler: (result: LineHeightScanResult) => void
}

export interface FixLineHeightSpec {
  nodeId: string
  newLineHeight: number
}

export interface FixLineHeightHandler extends EventHandler {
  name: 'FIX_LINE_HEIGHT'
  handler: (spec: FixLineHeightSpec) => void
}

export interface SelectNodeSpec {
  nodeId: string
}

export interface SelectNodeHandler extends EventHandler {
  name: 'SELECT_NODE'
  handler: (spec: SelectNodeSpec) => void
}

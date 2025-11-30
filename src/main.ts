import { on, once, showUI } from '@create-figma-plugin/utilities'
import { scanFontsHandler } from './handlers/fonts/scan'
import { applyReplacementHandler } from './handlers/fonts/replace'
import { bulkUpdateHandler } from './handlers/fonts/bulk-update'
import { requestAvailableFontsHandler } from './handlers/fonts/available'
import { previewSelectionHandler } from './handlers/selection/preview'
import { selectNodeHandler } from './handlers/selection/select'
import { trimTextHandler } from './handlers/trim/trim-text'
import { scanLineHeightsHandler } from './handlers/line-height/scan'
import { fixLineHeightHandler } from './handlers/line-height/fix'

import type {
  ScanFontsHandler,
  ApplyReplacementHandler,
  PreviewSelectionHandler,
  RequestAvailableFontsHandler,
  BulkUpdateHandler,
  TrimTextHandler,
  ScanLineHeightsHandler,
  FixLineHeightHandler,
  SelectNodeHandler
} from './types'

export default function () {
  on<ScanFontsHandler>('SCAN_FONTS', scanFontsHandler)
  on<ApplyReplacementHandler>('APPLY_REPLACEMENT', applyReplacementHandler)
  on<BulkUpdateHandler>('BULK_UPDATE', bulkUpdateHandler)
  on<PreviewSelectionHandler>('PREVIEW_SELECTION', previewSelectionHandler)
  on<RequestAvailableFontsHandler>('REQUEST_AVAILABLE_FONTS', requestAvailableFontsHandler)
  on<TrimTextHandler>('TRIM_TEXT', trimTextHandler)
  on<ScanLineHeightsHandler>('SCAN_LINE_HEIGHTS', scanLineHeightsHandler)
  on<FixLineHeightHandler>('FIX_LINE_HEIGHT', fixLineHeightHandler)
  on<SelectNodeHandler>('SELECT_NODE', selectNodeHandler)

  once('close', function () {
    figma.closePlugin()
  })

  showUI({
    width: 380,
    height: 480
  })
}
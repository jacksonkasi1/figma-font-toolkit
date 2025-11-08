import { h } from 'preact'
import type { ScanResult } from '../types'

interface HomeTabProps {
  onScan: () => void
  isScanning: boolean
  scanResult: ScanResult | null
}

export function HomeTab({ onScan, isScanning, scanResult }: HomeTabProps) {
  return (
    <div class="welcome">
      <div class="welcome__icon">
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
          <path
            d="M12 18H52M12 32H52M12 46H38"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <h2 class="welcome__title">Font Toolkit</h2>

      <p class="welcome__description">
        Scan your selection to find all fonts, group them by attributes, and bulk update typography properties.
      </p>

      <button class="btn btn--primary welcome__button" onClick={onScan} disabled={isScanning}>
        {isScanning ? 'Scanning...' : 'Scan Fonts in Selection'}
      </button>

      {scanResult && (
        <div class="status">
          Found {scanResult.fonts.length} fonts in {scanResult.totalNodes} layers
        </div>
      )}

      {!scanResult && !isScanning && (
        <div class="status">
          Select layers and click scan to begin
        </div>
      )}
    </div>
  )
}

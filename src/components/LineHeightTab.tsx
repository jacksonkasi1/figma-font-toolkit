import { h } from 'preact'
import { useState, useCallback, useEffect } from 'preact/hooks'
import { emit, on } from '@create-figma-plugin/utilities'
import type { LineHeightScanResult, ScanLineHeightsHandler, LineHeightScanCompleteHandler, FixLineHeightHandler } from '../types'

export function LineHeightTab() {
  const [scanResult, setScanResult] = useState<LineHeightScanResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [fixingNodeId, setFixingNodeId] = useState<string | null>(null)

  const handleScan = useCallback(() => {
    setIsScanning(true)
    emit<ScanLineHeightsHandler>('SCAN_LINE_HEIGHTS')
  }, [])

  const handleFix = useCallback((nodeId: string, recommendedLineHeight: number) => {
    setFixingNodeId(nodeId)
    emit<FixLineHeightHandler>('FIX_LINE_HEIGHT', { nodeId, newLineHeight: recommendedLineHeight })
  }, [])

  // Set up event listener for scan complete
  useEffect(() => {
    const unsubscribe = on<LineHeightScanCompleteHandler>('LINE_HEIGHT_SCAN_COMPLETE', (result: LineHeightScanResult) => {
      setScanResult(result)
      setIsScanning(false)
      setFixingNodeId(null)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div>
      {/* Header Section */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600 }}>
          Line Height Overlap Detection
        </h3>
        <p style={{ margin: '0', fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
          Detect and fix tight line heights that cause selection highlight overlap (darker blue lines between rows).
        </p>
      </div>

      {/* Action Section */}
      <div style={{ padding: '16px' }}>
        <button
          class="btn btn--primary"
          onClick={handleScan}
          disabled={isScanning}
          style={{ width: '100%' }}
        >
          {isScanning ? 'Scanning...' : 'Scan Line Heights'}
        </button>

        {/* Info Card */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'var(--color-bg-subtle)',
          borderRadius: '4px',
          fontSize: '11px',
          lineHeight: '1.5'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>How it works:</div>
          <ol style={{ margin: '0', paddingLeft: '16px' }}>
            <li>Scans selected text layers for tight line heights</li>
            <li>Detects line height ratios below 1.5 (causes overlap)</li>
            <li>Recommends proper line height to prevent overlap</li>
            <li>Click "Fix" to automatically apply the correction</li>
          </ol>
        </div>
      </div>

      {/* Results Section */}
      {scanResult && (
        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          {scanResult.issuesFound > 0 ? (
            <div>
              {/* Summary */}
              <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-warning-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-warning)', fontWeight: 600 }}>
                  ⚠ Found {scanResult.issuesFound} text layer{scanResult.issuesFound !== 1 ? 's' : ''} with tight line height
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  These may cause selection highlight overlap (darker blue lines between rows)
                </div>
              </div>

              {/* Issues List */}
              {scanResult.textLayers.length > 0 && (
                <div class="card-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {scanResult.textLayers.map((layer) => (
                    <div key={layer.nodeId} class="card-row" style={{
                      backgroundColor: layer.hasIssue ? 'var(--color-bg-warning-subtle)' : 'var(--color-bg-success-subtle)'
                    }}>
                      <div class="card-row__content">
                        <div class="card-row__title" style={{ fontSize: '12px' }}>
                          {layer.hasIssue ? (
                            <span style={{ color: 'var(--color-text-warning)', marginRight: '4px' }}>⚠</span>
                          ) : (
                            <span style={{ color: 'var(--color-text-success)', marginRight: '4px' }}>✓</span>
                          )}
                          {layer.nodeName}
                        </div>
                        <div class="card-row__meta" style={{ fontSize: '10px' }}>
                          {layer.fontFamily} — {layer.fontStyle} · {layer.fontSize}px · LH: {layer.lineHeight.toFixed(1)}px
                          <span style={{
                            color: layer.hasIssue ? 'var(--color-text-warning)' : 'var(--color-text-success)',
                            marginLeft: '4px'
                          }}>
                            (Ratio: {layer.lineHeightRatio.toFixed(2)})
                          </span>
                        </div>

                        {layer.hasIssue && layer.recommendedLineHeight && (
                          <div style={{
                            fontSize: '10px',
                            marginTop: '8px',
                            padding: '8px',
                            backgroundColor: 'var(--color-bg-warning)',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{ color: 'var(--color-text)' }}>
                              <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                                Recommended: {layer.recommendedLineHeight}px
                              </div>
                              <div style={{ fontSize: '9px', color: 'var(--color-text-secondary)' }}>
                                Prevents selection overlap (+{layer.overlapAmount}px needed)
                              </div>
                            </div>
                            <button
                              class="btn btn--secondary"
                              onClick={() => handleFix(layer.nodeId, layer.recommendedLineHeight!)}
                              disabled={fixingNodeId === layer.nodeId}
                              style={{
                                marginLeft: '8px',
                                padding: '4px 8px',
                                fontSize: '10px',
                                minHeight: 'auto'
                              }}
                            >
                              {fixingNodeId === layer.nodeId ? 'Fixing...' : 'Fix'}
                            </button>
                          </div>
                        )}

                        {!layer.hasIssue && (
                          <div style={{
                            fontSize: '10px',
                            marginTop: '4px',
                            color: 'var(--color-text-success)'
                          }}>
                            ✓ Line height is properly spaced
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-success-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-success)', fontWeight: 600, marginBottom: '8px' }}>
                ✓ All line heights look good!
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>
                No tight line heights detected. All text layers have proper spacing to prevent selection highlight overlap.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!scanResult && !isScanning && (
        <div class="empty-state">
          <svg class="empty-state__icon" viewBox="0 0 64 64" fill="none">
            {/* Icon showing lines with spacing */}
            <rect
              x="16" y="16" width="32" height="4"
              fill="currentColor"
              opacity="0.3"
            />
            <rect
              x="16" y="28" width="32" height="4"
              fill="currentColor"
              opacity="0.3"
            />
            <rect
              x="16" y="40" width="32" height="4"
              fill="currentColor"
              opacity="0.3"
            />
            {/* Spacing indicators */}
            <line
              x1="12" y1="20" x2="12" y2="28"
              stroke="currentColor"
              stroke-width="1"
              opacity="0.5"
              stroke-dasharray="2,2"
            />
            <line
              x1="12" y1="32" x2="12" y2="40"
              stroke="currentColor"
              stroke-width="1"
              opacity="0.5"
              stroke-dasharray="2,2"
            />
            <text
              x="10" y="26"
              font-size="8"
              fill="currentColor"
              opacity="0.5"
              text-anchor="end"
            >
              LH
            </text>
          </svg>
          <h3 class="empty-state__title">Ready to scan</h3>
          <p class="empty-state__description">
            Select text layers and click "Scan Line Heights" to detect overlap issues
          </p>
        </div>
      )}
    </div>
  )
}

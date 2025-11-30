import { h } from 'preact'
import { useState, useCallback, useEffect } from 'preact/hooks'
import { emit, on } from '@create-figma-plugin/utilities'
import type { LineHeightScanResult, ScanLineHeightsHandler, LineHeightScanCompleteHandler, FixLineHeightHandler, SelectNodeHandler } from '../types'

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

  const handleSelectNode = useCallback((nodeId: string) => {
    emit<SelectNodeHandler>('SELECT_NODE', { nodeId })
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

  // Filter to only show issues
  const issuesOnly = scanResult?.textLayers.filter(layer => layer.hasIssue) || []

  return (
    <div>
      {/* Header Section */}
      <div style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 600 }}>
          Line Height
        </h3>
        <p style={{ margin: '0', fontSize: '10px', color: 'var(--color-text-secondary)' }}>
          Detect spacing that's too tight or too loose
        </p>
      </div>

      {/* Action Section */}
      <div style={{ padding: '12px' }}>
        <button
          class="btn btn--primary"
          onClick={handleScan}
          disabled={isScanning}
          style={{ width: '100%' }}
        >
          {isScanning ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {/* Results Section */}
      {scanResult && (
        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          {issuesOnly.length > 0 ? (
            <div>
              {/* Summary */}
              <div style={{ padding: '8px 12px', backgroundColor: 'var(--color-bg-warning-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-warning)', fontWeight: 600 }}>
                  ⚠ {issuesOnly.length} issue{issuesOnly.length !== 1 ? 's' : ''} found
                </div>
              </div>

              {/* Issues List */}
              <div class="card-list" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {issuesOnly.map((layer) => {
                  const isTooTight = layer.issueType === 'TOO_TIGHT'
                  const issueText = isTooTight ? 'Too tight (overlap)' : 'Too loose (disconnected)'

                  return (
                    <div
                      key={layer.nodeId}
                      class="card-row"
                      style={{
                        backgroundColor: 'var(--color-bg-warning-subtle)',
                        cursor: 'pointer',
                        padding: '8px'
                      }}
                      onClick={() => handleSelectNode(layer.nodeId)}
                    >
                      <div class="card-row__content">
                        <div class="card-row__title" style={{ fontSize: '11px', fontWeight: 600 }}>
                          {layer.nodeName}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                          {layer.fontSize.toFixed(2)}px · LH: {layer.lineHeight.toFixed(0)}px · {layer.lineHeightRatio.toFixed(2)}× {issueText}
                        </div>

                        <div style={{
                          marginTop: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{ fontSize: '10px', color: 'var(--color-text)' }}>
                            Fix: {layer.recommendedLineHeight}px
                          </div>
                          <button
                            class="btn btn--secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFix(layer.nodeId, layer.recommendedLineHeight!)
                            }}
                            disabled={fixingNodeId === layer.nodeId}
                            style={{
                              padding: '2px 8px',
                              fontSize: '10px',
                              minHeight: 'auto'
                            }}
                          >
                            {fixingNodeId === layer.nodeId ? 'Fixing...' : 'Fix'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={{ padding: '12px', backgroundColor: 'var(--color-bg-success-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-success)', fontWeight: 600 }}>
                ✓ All line heights are optimal
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!scanResult && !isScanning && (
        <div class="empty-state">
          <svg class="empty-state__icon" viewBox="0 0 64 64" fill="none">
            <rect x="16" y="16" width="32" height="4" fill="currentColor" opacity="0.3" />
            <rect x="16" y="28" width="32" height="4" fill="currentColor" opacity="0.3" />
            <rect x="16" y="40" width="32" height="4" fill="currentColor" opacity="0.3" />
            <line x1="12" y1="20" x2="12" y2="28" stroke="currentColor" stroke-width="1" opacity="0.5" stroke-dasharray="2,2" />
            <line x1="12" y1="32" x2="12" y2="40" stroke="currentColor" stroke-width="1" opacity="0.5" stroke-dasharray="2,2" />
          </svg>
          <p class="empty-state__description" style={{ fontSize: '11px' }}>
            Select text layers and click Scan
          </p>
        </div>
      )}
    </div>
  )
}

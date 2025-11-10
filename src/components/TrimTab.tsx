import { h } from 'preact'
import { useState, useCallback, useEffect } from 'preact/hooks'
import { emit, on } from '@create-figma-plugin/utilities'
import type { TrimResult, TrimTextHandler, TrimCompleteHandler } from '../types'

export function TrimTab() {
  const [trimResult, setTrimResult] = useState<TrimResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTrimText = useCallback(() => {
    setIsProcessing(true)
    emit<TrimTextHandler>('TRIM_TEXT')
  }, [])

  // Set up event listener for trim complete
  useEffect(() => {
    const unsubscribe = on<TrimCompleteHandler>('TRIM_COMPLETE', (result: TrimResult) => {
      setTrimResult(result)
      setIsProcessing(false)
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
          Vertical Text Trimming
        </h3>
        <p style={{ margin: '0', fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
          Remove extra whitespace (half-leading) from text layers using font metrics.
          Select text layers and click Trim to fix line height spacing issues.
        </p>
      </div>

      {/* Action Section */}
      <div style={{ padding: '16px' }}>
        <button
          class="btn btn--primary"
          onClick={handleTrimText}
          disabled={isProcessing}
          style={{ width: '100%' }}
        >
          {isProcessing ? 'Trimming...' : 'Trim Selected Text'}
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
            <li>Analyzes font metrics (ascender, descender, cap height)</li>
            <li>Calculates precise top and bottom trim values</li>
            <li>Creates an auto-layout frame around the text</li>
            <li>Applies negative offset to remove extra spacing</li>
          </ol>
        </div>
      </div>

      {/* Results Section */}
      {trimResult && (
        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          {trimResult.success ? (
            <div>
              {/* Summary */}
              <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-success-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-success)', fontWeight: 600 }}>
                  ✓ Successfully trimmed {trimResult.trimmedNodes} text layer{trimResult.trimmedNodes !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Trimmed Text List */}
              {trimResult.trimmedTexts.length > 0 && (
                <div class="card-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {trimResult.trimmedTexts.map((text) => (
                    <div key={text.nodeId} class="card-row">
                      <div class="card-row__content">
                        <div class="card-row__title" style={{ fontSize: '12px' }}>
                          {text.nodeName}
                        </div>
                        <div class="card-row__meta" style={{ fontSize: '10px' }}>
                          {text.font.family} — {text.font.style} · {text.fontSize}px · LH: {text.lineHeight.toFixed(1)}px
                        </div>
                        <div style={{
                          fontSize: '10px',
                          marginTop: '4px',
                          color: 'var(--color-text-secondary)',
                          fontFamily: 'monospace'
                        }}>
                          Top: -{text.topTrim.toFixed(2)}px · Bottom: -{text.bottomTrim.toFixed(2)}px
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '16px', backgroundColor: 'var(--color-bg-danger-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-danger)', fontWeight: 600, marginBottom: '8px' }}>
                ✗ Trimming failed
              </div>
              {trimResult.errors.length > 0 && (
                <ul style={{ margin: '0', paddingLeft: '16px', fontSize: '11px' }}>
                  {trimResult.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!trimResult && !isProcessing && (
        <div class="empty-state">
          <svg class="empty-state__icon" viewBox="0 0 64 64" fill="none">
            <rect
              x="16" y="20" width="32" height="8"
              stroke="currentColor"
              stroke-width="2"
              opacity="0.3"
            />
            <rect
              x="16" y="36" width="32" height="8"
              stroke="currentColor"
              stroke-width="2"
              opacity="0.3"
            />
            <line
              x1="12" y1="24" x2="52" y2="24"
              stroke="currentColor"
              stroke-width="1"
              stroke-dasharray="2,2"
              opacity="0.5"
            />
            <line
              x1="12" y1="40" x2="52" y2="40"
              stroke="currentColor"
              stroke-width="1"
              stroke-dasharray="2,2"
              opacity="0.5"
            />
          </svg>
          <h3 class="empty-state__title">Ready to trim</h3>
          <p class="empty-state__description">
            Select text layers and click "Trim Selected Text" to fix line height spacing
          </p>
        </div>
      )}
    </div>
  )
}

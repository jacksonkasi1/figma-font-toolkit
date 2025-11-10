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
      <div style={{ padding: '12px', borderBottom: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 600 }}>
          Trim
        </h3>
        <p style={{ margin: '0', fontSize: '10px', color: 'var(--color-text-secondary)' }}>
          Remove extra whitespace from text
        </p>
      </div>

      {/* Action Section */}
      <div style={{ padding: '12px' }}>
        <button
          class="btn btn--primary"
          onClick={handleTrimText}
          disabled={isProcessing}
          style={{ width: '100%' }}
        >
          {isProcessing ? 'Trimming...' : 'Trim'}
        </button>
      </div>

      {/* Results Section */}
      {trimResult && (
        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          {trimResult.success ? (
            <div>
              {/* Summary */}
              <div style={{ padding: '8px 12px', backgroundColor: 'var(--color-bg-success-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-success)', fontWeight: 600 }}>
                  ✓ Trimmed {trimResult.trimmedNodes} layer{trimResult.trimmedNodes !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Trimmed Text List */}
              {trimResult.trimmedTexts.length > 0 && (
                <div class="card-list" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {trimResult.trimmedTexts.map((text) => (
                    <div key={text.nodeId} class="card-row" style={{ padding: '8px' }}>
                      <div class="card-row__content">
                        <div class="card-row__title" style={{ fontSize: '11px', fontWeight: 600 }}>
                          {text.nodeName}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                          {text.fontSize}px · Top: -{text.topTrim.toFixed(0)}px · Bottom: -{text.bottomTrim.toFixed(0)}px
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '12px', backgroundColor: 'var(--color-bg-danger-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-danger)', fontWeight: 600 }}>
                ✗ Failed
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!trimResult && !isProcessing && (
        <div class="empty-state">
          <svg class="empty-state__icon" viewBox="0 0 64 64" fill="none">
            <rect x="16" y="20" width="32" height="8" stroke="currentColor" stroke-width="2" opacity="0.3" />
            <rect x="16" y="36" width="32" height="8" stroke="currentColor" stroke-width="2" opacity="0.3" />
            <line x1="12" y1="24" x2="52" y2="24" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2" opacity="0.5" />
            <line x1="12" y1="40" x2="52" y2="40" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2" opacity="0.5" />
          </svg>
          <p class="empty-state__description" style={{ fontSize: '11px' }}>
            Select text layers and click Trim
          </p>
        </div>
      )}
    </div>
  )
}

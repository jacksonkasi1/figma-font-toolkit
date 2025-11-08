import { h } from 'preact'
import { useState, useCallback } from 'preact/hooks'
import type { ScanResult, FontMetadata } from '../types'
import { ReplaceModal } from './ReplaceModal'

interface FontsTabProps {
  scanResult: ScanResult | null
  availableFonts: Font[]
}

export function FontsTab({ scanResult, availableFonts }: FontsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFont, setSelectedFont] = useState<FontMetadata | null>(null)

  const handleReplace = useCallback((font: FontMetadata) => {
    setSelectedFont(font)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedFont(null)
  }, [])

  if (!scanResult || scanResult.fonts.length === 0) {
    return (
      <div class="empty-state">
        <svg class="empty-state__icon" viewBox="0 0 64 64" fill="none">
          <path
            d="M12 18H52M12 32H52M12 46H38"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.3"
          />
        </svg>
        <h3 class="empty-state__title">No fonts found</h3>
        <p class="empty-state__description">
          Select text layers and click Scan to discover fonts
        </p>
      </div>
    )
  }

  const filteredFonts = scanResult.fonts.filter((font) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return `${font.font.family} ${font.font.style}`.toLowerCase().includes(query)
  })

  return (
    <div>
      {/* Search */}
      <div class="search-box">
        <svg class="search-box__icon" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
          <path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <input
          type="text"
          class="search-box__input"
          placeholder="Search fonts..."
          value={searchQuery}
          onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
        />
      </div>

      {/* Font List */}
      {filteredFonts.length === 0 ? (
        <div class="empty-state">
          <p>No fonts found.</p>
        </div>
      ) : (
        <div class="card-list">
          {filteredFonts.map((font) => (
            <div key={`${font.font.family}-${font.font.style}`} class="card-row">
              <div class="card-row__preview">Aa</div>

              <div class="card-row__content">
                <div class="card-row__title">
                  {font.font.family} — {font.font.style}
                </div>
                <div class="card-row__meta">
                  {font.count} ranges · {font.nodesCount} layers
                </div>
              </div>

              <div class="card-row__badge">{font.count}</div>

              <div class="card-row__actions">
                <button
                  class="btn btn--ghost btn--small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReplace(font)
                  }}
                >
                  Replace
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Replace Modal */}
      {selectedFont && (
        <ReplaceModal
          fontMetadata={selectedFont}
          availableFonts={availableFonts}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

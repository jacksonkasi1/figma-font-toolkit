import { h } from 'preact'
import { useState, useCallback } from 'preact/hooks'
import { Text, Muted, Textbox, VerticalSpace } from '@create-figma-plugin/ui'
import type { ScanResult, FontMetadata } from '../types'
import { FontItem } from './FontItem'
import { ReplaceModal } from './ReplaceModal'

interface FontsTabProps {
  scanResult: ScanResult | null
  availableFonts: Font[]
}

export function FontsTab({ scanResult, availableFonts }: FontsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFont, setSelectedFont] = useState<FontMetadata | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleReplace = useCallback((font: FontMetadata) => {
    setSelectedFont(font)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedFont(null)
  }, [])

  if (!scanResult) {
    return (
      <div className="empty-state">
        <Muted>No fonts scanned yet. Go to Home and click "Scan Fonts".</Muted>
      </div>
    )
  }

  const filteredFonts = scanResult.fonts.filter((font) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return `${font.font.family} ${font.font.style}`.toLowerCase().includes(query)
  })

  return (
    <div className="fonts-tab">
      <Textbox
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M11 11L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        }
        placeholder="Search fonts..."
        value={searchQuery}
        onValueInput={setSearchQuery}
      />
      
      <VerticalSpace space="medium" />
      
      {filteredFonts.length === 0 ? (
        <div className="empty-state">
          <Muted>No fonts found.</Muted>
        </div>
      ) : (
        <div className="font-list">
          {filteredFonts.map((font) => (
            <FontItem
              key={`${font.font.family}-${font.font.style}`}
              fontMetadata={font}
              onReplace={() => handleReplace(font)}
            />
          ))}
        </div>
      )}
      
      {isModalOpen && selectedFont && (
        <ReplaceModal
          fontMetadata={selectedFont}
          availableFonts={availableFonts}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

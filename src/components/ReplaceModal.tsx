import { h } from 'preact'
import { useState, useCallback, useMemo } from 'preact/hooks'
import { emit } from '@create-figma-plugin/utilities'
import type { FontMetadata, ReplacementSpec, ApplyReplacementHandler, RequestAvailableFontsHandler } from '../types'
import { Combobox } from './Combobox'

interface ReplaceModalProps {
  fontMetadata: FontMetadata
  availableFonts: Font[]
  onClose: () => void
}

export function ReplaceModal({ fontMetadata, availableFonts, onClose }: ReplaceModalProps) {
  const [newFontFamily, setNewFontFamily] = useState('')
  const [newFontStyle, setNewFontStyle] = useState('')
  const [updateLineHeight, setUpdateLineHeight] = useState(false)
  const [newLineHeight, setNewLineHeight] = useState('')
  const [updateFontSize, setUpdateFontSize] = useState(false)
  const [newFontSize, setNewFontSize] = useState('')

  // Request available fonts on mount
  useMemo(() => {
    emit<RequestAvailableFontsHandler>('REQUEST_AVAILABLE_FONTS')
  }, [])

  // Get unique font families
  const fontFamilies = useMemo(() => {
    const families = new Set(availableFonts.map((font) => font.fontName.family))
    return Array.from(families).sort()
  }, [availableFonts])

  // Get styles for selected family
  const fontStyles = useMemo(() => {
    if (!newFontFamily) return []
    return availableFonts
      .filter((font) => font.fontName.family === newFontFamily)
      .map((font) => font.fontName.style)
      .sort()
  }, [newFontFamily, availableFonts])

  const handleFamilyChange = useCallback((value: string) => {
    setNewFontFamily(value)
    setNewFontStyle('')
  }, [])

  const handleStyleChange = useCallback((value: string) => {
    setNewFontStyle(value)
  }, [])

  const handleLineHeightChange = useCallback((event: Event) => {
    const value = (event.currentTarget as HTMLInputElement).value
    setNewLineHeight(value)
  }, [])

  const handleFontSizeChange = useCallback((event: Event) => {
    const value = (event.currentTarget as HTMLInputElement).value
    setNewFontSize(value)
  }, [])

  const handleApply = useCallback(() => {
    if (!newFontFamily || !newFontStyle) {
      return
    }

    const spec: ReplacementSpec = {
      targetFont: fontMetadata.font,
      newFont: {
        family: newFontFamily,
        style: newFontStyle
      },
      occurrences: fontMetadata.occurrences
    }

    if (updateLineHeight && newLineHeight) {
      spec.newLineHeight = parseFloat(newLineHeight)
    }

    if (updateFontSize && newFontSize) {
      spec.newFontSize = parseFloat(newFontSize)
    }

    emit<ApplyReplacementHandler>('APPLY_REPLACEMENT', spec)
    onClose()
  }, [fontMetadata, newFontFamily, newFontStyle, updateLineHeight, newLineHeight, updateFontSize, newFontSize, onClose])

  return (
    <div class="modal-overlay">
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">Replace Font</h3>
          <p class="modal__subtitle">
            {fontMetadata.font.family} — {fontMetadata.font.style} · {fontMetadata.count} ranges in {fontMetadata.nodesCount} layers
          </p>
        </div>

        <div class="modal__body">
          {/* Current Font Preview */}
          <div class="form-group">
            <label class="form-label">Current Font</label>
            <div class="card-row">
              <div class="card-row__preview">Aa</div>
              <div class="card-row__content">
                <div class="card-row__title">
                  {fontMetadata.font.family} — {fontMetadata.font.style}
                </div>
              </div>
            </div>
          </div>

          {/* New Font Family */}
          <div class="form-group">
            <label class="form-label">New Font Family</label>
            <Combobox
              options={fontFamilies}
              value={newFontFamily}
              placeholder="Search or select font family..."
              onChange={handleFamilyChange}
            />
          </div>

          {/* Font Style */}
          <div class="form-group">
            <label class="form-label">Font Style</label>
            <Combobox
              options={fontStyles}
              value={newFontStyle}
              placeholder={newFontFamily ? 'Search or select style...' : 'Select a family first'}
              onChange={handleStyleChange}
              disabled={!newFontFamily}
            />
          </div>

          {/* Update Line Height Toggle */}
          <div class="form-group">
            <label class="form-checkbox">
              <input
                type="checkbox"
                checked={updateLineHeight}
                onChange={(e) => setUpdateLineHeight((e.target as HTMLInputElement).checked)}
              />
              <span class="form-checkbox__label">Update Line Height</span>
            </label>

            {updateLineHeight && (
              <input
                type="number"
                class="form-input"
                placeholder="Line height (px)"
                value={newLineHeight}
                onInput={handleLineHeightChange}
              />
            )}
          </div>

          {/* Update Font Size Toggle */}
          <div class="form-group">
            <label class="form-checkbox">
              <input
                type="checkbox"
                checked={updateFontSize}
                onChange={(e) => setUpdateFontSize((e.target as HTMLInputElement).checked)}
              />
              <span class="form-checkbox__label">Update Font Size</span>
            </label>

            {updateFontSize && (
              <input
                type="number"
                class="form-input"
                placeholder="Font size (px)"
                value={newFontSize}
                onInput={handleFontSizeChange}
              />
            )}
          </div>
        </div>

        <div class="modal__footer">
          <button class="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            class="btn btn--primary"
            onClick={handleApply}
            disabled={!newFontFamily || !newFontStyle}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

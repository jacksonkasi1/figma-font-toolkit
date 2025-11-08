import { h, Fragment } from 'preact'
import { useState, useCallback, useMemo } from 'preact/hooks'
import {
  Modal,
  Button,
  Text,
  Muted,
  Textbox,
  TextboxNumeric,
  Dropdown,
  DropdownOption,
  Toggle,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import type { FontMetadata, ReplacementSpec, ApplyReplacementHandler, RequestAvailableFontsHandler } from '../types'

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

  const handleFamilyChange = useCallback((event: Event) => {
    const value = (event.currentTarget as HTMLInputElement).value
    setNewFontFamily(value)
    setNewFontStyle('')
  }, [])

  const handleStyleChange = useCallback((event: Event) => {
    const value = (event.currentTarget as HTMLSelectElement).value
    setNewFontStyle(value)
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

  const familyOptions: DropdownOption[] = [
    { value: '', text: 'Select font family...' },
    ...fontFamilies.map((family) => ({ value: family, text: family }))
  ]

  const styleOptions: DropdownOption[] = [
    { value: '', text: newFontFamily ? 'Select style...' : 'Select a family first' },
    ...fontStyles.map((style) => ({ value: style, text: style }))
  ]

  return (
    <Modal open title="Replace Font" onCloseButtonClick={onClose}>
      <div className="modal-content">
        <Text>
          <strong>Current Font</strong>
        </Text>
        <VerticalSpace space="small" />
        <div className="current-font-card">
          <div className="font-preview">Aa</div>
          <Text>{fontMetadata.font.family} — {fontMetadata.font.style}</Text>
        </div>

        <VerticalSpace space="large" />

        <Text>
          <strong>New Font Family</strong>
        </Text>
        <VerticalSpace space="small" />
        <Dropdown
          options={familyOptions}
          value={newFontFamily}
          onChange={handleFamilyChange}
        />

        <VerticalSpace space="medium" />

        <Text>
          <strong>Font Style</strong>
        </Text>
        <VerticalSpace space="small" />
        <Dropdown
          options={styleOptions}
          value={newFontStyle}
          onChange={handleStyleChange}
          disabled={!newFontFamily}
        />

        <VerticalSpace space="large" />

        <Toggle value={updateLineHeight} onValueChange={setUpdateLineHeight}>
          <Text>Update Line Height</Text>
        </Toggle>
        {updateLineHeight && (
          <div>
            <VerticalSpace space="small" />
            <TextboxNumeric
              placeholder="Line height (px)"
              value={newLineHeight}
              onValueInput={setNewLineHeight}
            />
          </div>
        )}

        <VerticalSpace space="medium" />

        <Toggle value={updateFontSize} onValueChange={setUpdateFontSize}>
          <Text>Update Font Size</Text>
        </Toggle>
        {updateFontSize && (
          <div>
            <VerticalSpace space="small" />
            <TextboxNumeric
              placeholder="Font size (px)"
              value={newFontSize}
              onValueInput={setNewFontSize}
            />
          </div>
        )}

        <VerticalSpace space="extraLarge" />

        <div className="modal-actions">
          <Button onClick={onClose} secondary fullWidth>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!newFontFamily || !newFontStyle} fullWidth>
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  )
}

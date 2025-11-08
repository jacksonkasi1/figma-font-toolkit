import { h } from 'preact'
import { useState, useCallback, useRef, useEffect } from 'preact/hooks'

interface ComboboxProps {
  options: string[]
  value: string
  placeholder?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function Combobox({ options, value, placeholder, onChange, disabled, className }: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle input focus
  const handleFocus = useCallback(() => {
    if (!disabled) {
      setIsOpen(true)
      setHighlightedIndex(-1)
    }
  }, [disabled])

  // Handle input blur
  const handleBlur = useCallback((e: FocusEvent) => {
    // Don't close if clicking inside dropdown
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget as Node)) {
      return
    }
    setIsOpen(false)
    setSearchQuery('')
  }, [])

  // Handle option selection
  const handleSelect = useCallback((option: string) => {
    onChange(option)
    setIsOpen(false)
    setSearchQuery('')
    inputRef.current?.blur()
  }, [onChange])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchQuery('')
        inputRef.current?.blur()
        break
    }
  }, [isOpen, filteredOptions, highlightedIndex, handleSelect])

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex])

  // Display value: show selected value when not searching, search query when searching
  const displayValue = isOpen ? searchQuery : value || ''

  return (
    <div class={`combobox ${className || ''}`}>
      <div class="combobox__input-wrapper">
        <input
          ref={inputRef}
          type="text"
          class="combobox__input"
          value={displayValue}
          placeholder={placeholder || 'Select...'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autocomplete="off"
        />
      </div>

      {isOpen && (
        <div ref={dropdownRef} class="combobox__dropdown">
          {filteredOptions.length === 0 ? (
            <div class="combobox__empty">No options found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option}
                class={`combobox__option ${
                  option === value ? 'combobox__option--selected' : ''
                } ${index === highlightedIndex ? 'combobox__option--highlighted' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelect(option)
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

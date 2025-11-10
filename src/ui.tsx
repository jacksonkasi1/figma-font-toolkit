import { h, render, Fragment } from 'preact'
import { useState, useCallback, useEffect } from 'preact/hooks'
import { emit, on } from '@create-figma-plugin/utilities'
import type {
  ScanFontsHandler,
  FontsScannedHandler,
  ScanResult,
  ReplacementCompleteHandler,
  AvailableFontsHandler,
  TrimCompleteHandler
} from './types'
import { HomeTab } from './components/HomeTab'
import { FontsTab } from './components/FontsTab'
import { GroupsTab } from './components/GroupsTab'
import { TrimTab } from './components/TrimTab'

import '!./styles.css'

function Plugin() {
  const [activeTab, setActiveTab] = useState<string>('fonts')
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [availableFonts, setAvailableFonts] = useState<Font[]>([])
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = useCallback(() => {
    setIsScanning(true)
    emit<ScanFontsHandler>('SCAN_FONTS')
  }, [])

  useEffect(() => {
    // Register event handlers
    const unsubscribeScanned = on<FontsScannedHandler>('FONTS_SCANNED', (result: ScanResult) => {
      setScanResult(result)
      setIsScanning(false)
      // Only switch to fonts tab if fonts were found
      if (result.fonts.length > 0) {
        setActiveTab('fonts')
      }
    })

    const unsubscribeFonts = on<AvailableFontsHandler>('AVAILABLE_FONTS', (fonts: Font[]) => {
      setAvailableFonts(fonts)
    })

    const unsubscribeComplete = on<ReplacementCompleteHandler>('REPLACEMENT_COMPLETE', () => {
      emit<ScanFontsHandler>('SCAN_FONTS')
    })

    // Cleanup on unmount
    return () => {
      unsubscribeScanned()
      unsubscribeFonts()
      unsubscribeComplete()
    }
  }, [])

  return (
    <div class="container">
      {/* Header */}
      <header class="header">
        <div class="header__title">
          <svg class="header__icon" viewBox="0 0 20 20" fill="none">
            <path d="M3 5H17M3 10H17M3 15H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Font Toolkit
        </div>
        <button
          class={isScanning ? 'header__scan-btn header__scan-btn--scanning' : 'header__scan-btn'}
          onClick={handleScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <Fragment>
              <svg class="header__scan-icon header__scan-icon--spinning" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" stroke-dasharray="30 8" />
              </svg>
              Scanning...
            </Fragment>
          ) : (
            <Fragment>
              <svg class="header__scan-icon" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L8 14M2 8L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Scan
            </Fragment>
          )}
        </button>
      </header>

      {/* Tabs */}
      <nav class="tabs">
        <button
          class={activeTab === 'fonts' ? 'tab tab--active' : 'tab'}
          onClick={() => setActiveTab('fonts')}
        >
          Fonts
        </button>
        <button
          class={activeTab === 'groups' ? 'tab tab--active' : 'tab'}
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </button>
        <button
          class={activeTab === 'trim' ? 'tab tab--active' : 'tab'}
          onClick={() => setActiveTab('trim')}
        >
          Trim
        </button>
      </nav>

      {/* Content */}
      <main class="content">
        {activeTab === 'fonts' && (
          <FontsTab scanResult={scanResult} availableFonts={availableFonts} />
        )}

        {activeTab === 'groups' && (
          <GroupsTab scanResult={scanResult} />
        )}

        {activeTab === 'trim' && (
          <TrimTab />
        )}
      </main>
    </div>
  )
}

export default function () {
  const rootElement = document.getElementById('root')

  if (!rootElement) {
    const newRoot = document.createElement('div')
    newRoot.id = 'root'
    document.body.appendChild(newRoot)
    render(<Plugin />, newRoot)
  } else {
    render(<Plugin />, rootElement)
  }
}

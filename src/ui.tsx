import { h, render } from 'preact'
import { useState, useCallback, useEffect } from 'preact/hooks'
import { emit, on } from '@create-figma-plugin/utilities'
import type {
  ScanFontsHandler,
  FontsScannedHandler,
  ScanResult,
  ReplacementCompleteHandler,
  AvailableFontsHandler
} from './types'
import { HomeTab } from './components/HomeTab'
import { FontsTab } from './components/FontsTab'
import { GroupsTab } from './components/GroupsTab'

import '!./styles.css'

function Plugin() {
  const [activeTab, setActiveTab] = useState<string>('home')
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
      </header>

      {/* Tabs */}
      <nav class="tabs">
        <button
          class={activeTab === 'home' ? 'tab tab--active' : 'tab'}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
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
      </nav>

      {/* Content */}
      <main class="content">
        {activeTab === 'home' && (
          <HomeTab onScan={handleScan} isScanning={isScanning} scanResult={scanResult} />
        )}

        {activeTab === 'fonts' && (
          <FontsTab scanResult={scanResult} availableFonts={availableFonts} />
        )}

        {activeTab === 'groups' && (
          <GroupsTab scanResult={scanResult} />
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

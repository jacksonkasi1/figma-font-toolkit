import { render, Container, VerticalSpace, Tabs, TabsOption } from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useState, useCallback } from 'preact/hooks'
import type {
  ScanFontsHandler,
  FontsScannedHandler,
  ScanResult,
  FontMetadata,
  OccurrenceGroup,
  GroupByType,
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

  // Handle scan fonts
  const handleScan = useCallback(() => {
    setIsScanning(true)
    emit<ScanFontsHandler>('SCAN_FONTS')
  }, [])

  // Listen for scan results
  on<FontsScannedHandler>('FONTS_SCANNED', (result: ScanResult) => {
    setScanResult(result)
    setIsScanning(false)
    setActiveTab('fonts')
  })

  // Listen for available fonts
  on<AvailableFontsHandler>('AVAILABLE_FONTS', (fonts: Font[]) => {
    setAvailableFonts(fonts)
  })

  // Listen for replacement complete
  on<ReplacementCompleteHandler>('REPLACEMENT_COMPLETE', () => {
    // Rescan after replacement
    emit<ScanFontsHandler>('SCAN_FONTS')
  })

  const tabsOptions: TabsOption[] = [
    { value: 'home', children: <span>Home</span> },
    { value: 'fonts', children: <span>Fonts</span> },
    { value: 'groups', children: <span>Groups</span> }
  ]

  return (
    <Container space="medium">
      <Tabs
        options={tabsOptions}
        value={activeTab}
        onValueChange={setActiveTab}
      />
      <VerticalSpace space="medium" />
      
      {activeTab === 'home' && (
        <HomeTab onScan={handleScan} isScanning={isScanning} scanResult={scanResult} />
      )}
      
      {activeTab === 'fonts' && (
        <FontsTab scanResult={scanResult} availableFonts={availableFonts} />
      )}
      
      {activeTab === 'groups' && (
        <GroupsTab scanResult={scanResult} />
      )}
    </Container>
  )
}

export default render(Plugin)

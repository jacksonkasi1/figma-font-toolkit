import { h } from 'preact'
import { Button, Text, VerticalSpace, Muted } from '@create-figma-plugin/ui'
import type { ScanResult } from '../types'

interface HomeTabProps {
  onScan: () => void
  isScanning: boolean
  scanResult: ScanResult | null
}

export function HomeTab({ onScan, isScanning, scanResult }: HomeTabProps) {
  return (
    <div className="home-tab">
      <div className="welcome-card">
        <div className="welcome-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path 
              d="M8 12H40M8 24H40M8 36H28" 
              stroke="currentColor" 
              stroke-width="3" 
              stroke-linecap="round"
            />
          </svg>
        </div>
        
        <VerticalSpace space="large" />
        
        <Text>
          <strong>Welcome to Font Toolkit</strong>
        </Text>
        
        <VerticalSpace space="small" />
        
        <Muted>
          Scan your selection to find all fonts, group them by attributes, and replace them easily.
        </Muted>
        
        <VerticalSpace space="extraLarge" />
        
        <Button fullWidth onClick={onScan} disabled={isScanning}>
          {isScanning ? 'Scanning...' : 'Scan Fonts in Selection'}
        </Button>
        
        <VerticalSpace space="medium" />
        
        {scanResult && (
          <div className="status-card">
            <Muted>
              Found {scanResult.fonts.length} fonts in {scanResult.totalNodes} layers
            </Muted>
          </div>
        )}
        
        {!scanResult && (
          <div className="status-card">
            <Muted>Select layers and click scan to begin</Muted>
          </div>
        )}
      </div>
    </div>
  )
}

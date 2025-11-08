import { h } from 'preact'
import { Button, Text, Muted } from '@create-figma-plugin/ui'
import type { FontMetadata } from '../types'

interface FontItemProps {
  fontMetadata: FontMetadata
  onReplace: () => void
}

export function FontItem({ fontMetadata, onReplace }: FontItemProps) {
  return (
    <div className="font-item">
      <div className="font-preview">Aa</div>
      
      <div className="font-info">
        <Text>
          <strong>{fontMetadata.font.family} — {fontMetadata.font.style}</strong>
        </Text>
        <Muted>
          {fontMetadata.count} ranges · {fontMetadata.nodesCount} layers
        </Muted>
      </div>
      
      <div className="font-count">{fontMetadata.count}</div>
      
      <Button onClick={onReplace} secondary>
        Replace
      </Button>
    </div>
  )
}

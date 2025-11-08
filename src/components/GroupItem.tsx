import { h } from 'preact'
import { useState } from 'preact/hooks'
import { Button, Text, Muted } from '@create-figma-plugin/ui'
import type { OccurrenceGroup } from '../types'

interface GroupItemProps {
  group: OccurrenceGroup
  onSelect: () => void
}

export function GroupItem({ group, onSelect }: GroupItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={isExpanded ? 'group-item expanded' : 'group-item'}>
      <div className="group-header" onClick={() => setIsExpanded(!isExpanded)}>
        <Text>
          <strong>{group.label}</strong>
        </Text>

        <div className="group-actions">
          <div className="font-count">{group.count}</div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            secondary
          >
            Select
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="group-content">
          {group.occurrences.slice(0, 5).map((occ, index) => (
            <div key={`${occ.nodeId}-${index}`} className="group-occurrence">
              <Text>
                <strong>{occ.font.family} {occ.font.style}</strong>
              </Text>
              <Muted>{occ.nodeName}</Muted>
            </div>
          ))}
          {group.count > 5 && (
            <Muted>+{group.count - 5} more</Muted>
          )}
        </div>
      )}
    </div>
  )
}

import { h } from 'preact'
import { useState } from 'preact/hooks'
import { Dropdown, DropdownOption, Text, Muted, VerticalSpace } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import type { ScanResult, GroupByType, PreviewSelectionHandler } from '../types'
import { GroupItem } from './GroupItem'

interface GroupsTabProps {
  scanResult: ScanResult | null
}

export function GroupsTab({ scanResult }: GroupsTabProps) {
  const [groupBy, setGroupBy] = useState<GroupByType>('lineHeight')

  if (!scanResult) {
    return (
      <div className="empty-state">
        <Muted>No groups available. Scan fonts first.</Muted>
      </div>
    )
  }

  const groups = scanResult.groups[groupBy] || []

  const groupByOptions: DropdownOption[] = [
    { value: 'lineHeight', text: 'Line Height' },
    { value: 'fontSize', text: 'Font Size' },
    { value: 'fontWeight', text: 'Font Weight' },
    { value: 'fontFamily', text: 'Font Family' }
  ]

  const handleSelectGroup = (groupKey: string) => {
    const group = groups.find((g) => g.key === groupKey)
    if (group) {
      emit<PreviewSelectionHandler>('PREVIEW_SELECTION', group.occurrences)
    }
  }

  return (
    <div className="groups-tab">
      <div className="group-controls-card">
        <Text>
          <strong>Group by:</strong>
        </Text>
        
        <VerticalSpace space="small" />
        
        <Dropdown
          options={groupByOptions}
          value={groupBy}
          onChange={(event) => setGroupBy(event.currentTarget.value as GroupByType)}
        />
      </div>
      
      <VerticalSpace space="medium" />
      
      {groups.length === 0 ? (
        <div className="empty-state">
          <Muted>No groups available.</Muted>
        </div>
      ) : (
        <div className="group-list">
          {groups.map((group) => (
            <GroupItem
              key={group.key}
              group={group}
              onSelect={() => handleSelectGroup(group.key)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

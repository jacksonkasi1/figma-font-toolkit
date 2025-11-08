import { h } from 'preact'
import { useState, useCallback } from 'preact/hooks'
import { emit } from '@create-figma-plugin/utilities'
import type { ScanResult, GroupByType, OccurrenceGroup, PreviewSelectionHandler } from '../types'
import { BulkUpdateModal } from './BulkUpdateModal'

interface GroupsTabProps {
  scanResult: ScanResult | null
}

export function GroupsTab({ scanResult }: GroupsTabProps) {
  const [groupBy, setGroupBy] = useState<GroupByType>('lineHeight')
  const [selectedGroup, setSelectedGroup] = useState<{
    group: OccurrenceGroup
    type: GroupByType
  } | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const handleSelectGroup = useCallback((group: OccurrenceGroup) => {
    emit<PreviewSelectionHandler>('PREVIEW_SELECTION', group.occurrences)
  }, [])

  const handleUpdateGroup = useCallback((group: OccurrenceGroup, type: GroupByType) => {
    setSelectedGroup({ group, type })
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedGroup(null)
  }, [])

  const toggleExpand = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupKey)) {
        next.delete(groupKey)
      } else {
        next.add(groupKey)
      }
      return next
    })
  }, [])

  if (!scanResult) {
    return (
      <div class="empty-state">
        <p>No groups available. Scan fonts first.</p>
      </div>
    )
  }

  const groups = scanResult.groups[groupBy] || []

  return (
    <div>
      {/* Group Controls */}
      <div class="group-controls">
        <label class="group-controls__label">Group by</label>
        <select
          class="group-controls__select"
          value={groupBy}
          onChange={(e) => setGroupBy((e.target as HTMLSelectElement).value as GroupByType)}
        >
          <option value="lineHeight">Line Height</option>
          <option value="fontSize">Font Size</option>
          <option value="fontWeight">Font Weight</option>
        </select>
      </div>

      {/* Group List */}
      {groups.length === 0 ? (
        <div class="empty-state">
          <p>No groups available.</p>
        </div>
      ) : (
        <div>
          {groups.map((group) => {
            const isExpanded = expandedGroups.has(group.key)
            return (
              <div key={group.key} class={isExpanded ? 'group-item group-item--expanded' : 'group-item'}>
                <div class="group-item__header" onClick={() => toggleExpand(group.key)}>
                  <div class="group-item__title">{group.label}</div>

                  <div class="group-item__actions">
                    <div class="card-row__badge">{group.count}</div>
                    <button
                      class="btn btn--ghost btn--small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectGroup(group)
                      }}
                    >
                      Select
                    </button>
                    <button
                      class="btn btn--ghost btn--small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUpdateGroup(group, groupBy)
                      }}
                    >
                      Update
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div class="group-item__content">
                    {group.occurrences.slice(0, 5).map((occ, index) => (
                      <div key={`${occ.nodeId}-${index}`} class="group-occurrence">
                        <div class="group-occurrence__title">
                          {occ.font.family} {occ.font.style}
                        </div>
                        <div class="group-occurrence__meta">{occ.nodeName}</div>
                      </div>
                    ))}
                    {group.count > 5 && (
                      <div class="group-occurrence__meta mt-2">
                        +{group.count - 5} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Bulk Update Modal */}
      {selectedGroup && (
        <BulkUpdateModal
          group={selectedGroup.group}
          groupType={selectedGroup.type}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

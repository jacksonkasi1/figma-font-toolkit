import { h } from 'preact'
import { useState, useCallback } from 'preact/hooks'
import { emit } from '@create-figma-plugin/utilities'
import type { ScanResult, GroupByType, OccurrenceGroup, PreviewSelectionHandler, BulkUpdateHandler } from '../types'

interface GroupsTabProps {
  scanResult: ScanResult | null
}

export function GroupsTab({ scanResult }: GroupsTabProps) {
  const [groupBy, setGroupBy] = useState<GroupByType>('lineHeight')
  const [activeUpdateGroup, setActiveUpdateGroup] = useState<string | null>(null)
  const [updateValue, setUpdateValue] = useState<string>('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const handleSelectGroup = useCallback((group: OccurrenceGroup) => {
    emit<PreviewSelectionHandler>('PREVIEW_SELECTION', group.occurrences)
  }, [])

  const handleUpdateGroup = useCallback((groupKey: string) => {
    if (activeUpdateGroup === groupKey) {
      setActiveUpdateGroup(null)
      setUpdateValue('')
    } else {
      setActiveUpdateGroup(groupKey)
      setUpdateValue('')
    }
  }, [activeUpdateGroup])

  const handleApplyUpdate = useCallback((group: OccurrenceGroup, type: GroupByType) => {
    if (!updateValue) return

    const parsedValue = type === 'fontWeight' ? updateValue : parseFloat(updateValue)

    emit<BulkUpdateHandler>('BULK_UPDATE', {
      groupType: type,
      targetValue: parsedValue,
      occurrences: group.occurrences
    })

    setActiveUpdateGroup(null)
    setUpdateValue('')
  }, [updateValue])

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

  if (!scanResult || scanResult.fonts.length === 0) {
    return (
      <div class="empty-state">
        <svg class="empty-state__icon" viewBox="0 0 64 64" fill="none">
          <rect x="16" y="16" width="32" height="32" rx="4" stroke="currentColor" stroke-width="3" opacity="0.3" />
          <path d="M28 28H36M28 36H40" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3" />
        </svg>
        <h3 class="empty-state__title">No groups available</h3>
        <p class="empty-state__description">
          Scan fonts first to see grouped typography
        </p>
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
            const isUpdating = activeUpdateGroup === group.key
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
                      class={isUpdating ? 'btn btn--primary btn--small' : 'btn btn--ghost btn--small'}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUpdateGroup(group.key)
                      }}
                    >
                      {isUpdating ? 'Cancel' : 'Update'}
                    </button>
                  </div>
                </div>

                {/* Inline Update Controls */}
                {isUpdating && (
                  <div class="group-item__update">
                    <div class="inline-update">
                      <label class="inline-update__label">
                        {groupBy === 'fontWeight' && 'New weight'}
                        {groupBy === 'fontSize' && 'New size (px)'}
                        {groupBy === 'lineHeight' && 'New line height (px)'}
                      </label>
                      {groupBy === 'fontWeight' ? (
                        <select
                          class="inline-update__select"
                          value={updateValue}
                          onChange={(e) => setUpdateValue((e.target as HTMLSelectElement).value)}
                        >
                          <option value="">Select weight...</option>
                          <option value="100">100 - Thin</option>
                          <option value="200">200 - Extra Light</option>
                          <option value="300">300 - Light</option>
                          <option value="400">400 - Regular</option>
                          <option value="500">500 - Medium</option>
                          <option value="600">600 - Semi Bold</option>
                          <option value="700">700 - Bold</option>
                          <option value="800">800 - Extra Bold</option>
                          <option value="900">900 - Black</option>
                        </select>
                      ) : (
                        <input
                          type="number"
                          class="inline-update__input"
                          placeholder={groupBy === 'fontSize' ? 'e.g. 16' : 'e.g. 24'}
                          value={updateValue}
                          onInput={(e) => setUpdateValue((e.target as HTMLInputElement).value)}
                        />
                      )}
                      <button
                        class="btn btn--primary btn--small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApplyUpdate(group, groupBy)
                        }}
                        disabled={!updateValue}
                      >
                        Apply to {group.count} range{group.count === 1 ? '' : 's'}
                      </button>
                    </div>
                  </div>
                )}

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
    </div>
  )
}

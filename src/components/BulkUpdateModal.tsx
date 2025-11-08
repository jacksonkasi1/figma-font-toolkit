import { h } from 'preact'
import { useState, useCallback } from 'preact/hooks'
import { emit } from '@create-figma-plugin/utilities'
import type {
  OccurrenceGroup,
  GroupByType,
  BulkUpdateHandler
} from '../types'

interface BulkUpdateModalProps {
  group: OccurrenceGroup
  groupType: GroupByType
  onClose: () => void
}

const WEIGHT_OPTIONS = [
  { value: '100', label: '100 - Thin' },
  { value: '200', label: '200 - Extra Light' },
  { value: '300', label: '300 - Light' },
  { value: '400', label: '400 - Regular' },
  { value: '500', label: '500 - Medium' },
  { value: '600', label: '600 - Semi Bold' },
  { value: '700', label: '700 - Bold' },
  { value: '800', label: '800 - Extra Bold' },
  { value: '900', label: '900 - Black' }
]

export function BulkUpdateModal({ group, groupType, onClose }: BulkUpdateModalProps) {
  const [targetValue, setTargetValue] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [progress, setProgress] = useState(0)

  const getTitle = () => {
    switch (groupType) {
      case 'fontWeight':
        return 'Bulk update font weight'
      case 'lineHeight':
        return 'Bulk update line height'
      case 'fontSize':
        return 'Bulk update font size'
      default:
        return 'Bulk update'
    }
  }

  const getDescription = () => {
    const nodeCount = new Set(group.occurrences.map((occ) => occ.nodeId)).size
    return `Affects ${group.count} ranges in ${nodeCount} layers`
  }

  const getPreviewText = () => {
    if (!targetValue) return ''

    const currentValue = group.label.split(': ')[1]
    const targetLabel = groupType === 'fontWeight'
      ? WEIGHT_OPTIONS.find((opt) => opt.value === targetValue)?.label || targetValue
      : `${targetValue}px`

    return `Change ${currentValue} → ${targetLabel} across ${group.count} ranges`
  }

  const handleApply = useCallback(() => {
    if (!targetValue) return

    setIsApplying(true)
    setProgress(0)

    let updateValue: number | string = targetValue

    if (groupType === 'lineHeight' || groupType === 'fontSize') {
      updateValue = parseFloat(targetValue)
    }

    emit<BulkUpdateHandler>('BULK_UPDATE', {
      groupType,
      targetValue: updateValue,
      occurrences: group.occurrences
    })

    // Simulate progress (actual progress will come from plugin)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    // Close after a short delay (actual close will be triggered by plugin response)
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => {
        onClose()
      }, 300)
    }, 1500)
  }, [targetValue, groupType, group, onClose])

  return (
    <div class="modal-overlay">
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">{getTitle()}</h3>
          <p class="modal__subtitle">{getDescription()}</p>
        </div>

        <div class="modal__body">
          {/* Target Control */}
          <div class="form-group">
            <label class="form-label">
              {groupType === 'fontWeight' ? 'Target Weight' : `Target ${groupType === 'lineHeight' ? 'Line Height' : 'Font Size'} (px)`}
            </label>

            {groupType === 'fontWeight' ? (
              <select
                class="form-select"
                value={targetValue}
                onChange={(e) => setTargetValue((e.target as HTMLSelectElement).value)}
              >
                <option value="">Select weight...</option>
                {WEIGHT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                class="form-input"
                placeholder={groupType === 'lineHeight' ? 'e.g. 24' : 'e.g. 16'}
                value={targetValue}
                onInput={(e) => setTargetValue((e.target as HTMLInputElement).value)}
              />
            )}
          </div>

          {/* Preview */}
          {targetValue && (
            <div class="form-info">
              <svg class="form-info__icon" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
                <path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
              <div class="form-info__text">{getPreviewText()}</div>
            </div>
          )}

          {/* Progress */}
          {isApplying && (
            <div>
              <div class="progress-bar">
                <div class="progress-bar__fill" style={{ width: `${progress}%` }} />
              </div>
              <p class="progress-text">
                {progress < 100 ? `Applying changes... ${progress}%` : 'Complete! Rescanning...'}
              </p>
            </div>
          )}
        </div>

        <div class="modal__footer">
          <button class="btn btn--ghost" onClick={onClose} disabled={isApplying}>
            Cancel
          </button>
          <button
            class="btn btn--primary"
            onClick={handleApply}
            disabled={!targetValue || isApplying}
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  )
}

import { emit } from '@create-figma-plugin/utilities'
import type { AvailableFontsHandler } from '../../types'

export const requestAvailableFontsHandler = async function () {
  const availableFonts = await figma.listAvailableFontsAsync()
  emit<AvailableFontsHandler>('AVAILABLE_FONTS', availableFonts)
}

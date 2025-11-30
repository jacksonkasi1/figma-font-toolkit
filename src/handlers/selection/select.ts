import type { SelectNodeSpec } from '../../types'

export const selectNodeHandler = function (spec: SelectNodeSpec) {
  const node = figma.getNodeById(spec.nodeId)

  if (node) {
    figma.currentPage.selection = [node as SceneNode]
    figma.viewport.scrollAndZoomIntoView([node as SceneNode])
  }
}

import type { FontOccurrence } from '../../types'

export const previewSelectionHandler = function (occurrences: FontOccurrence[]) {
  const nodeIds = new Set(occurrences.map((occ) => occ.nodeId))
  const nodes: SceneNode[] = []

  for (const nodeId of Array.from(nodeIds)) {
    const node = figma.getNodeById(nodeId)
    if (node) {
      nodes.push(node as SceneNode)
    }
  }

  if (nodes.length > 0) {
    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
  }
}

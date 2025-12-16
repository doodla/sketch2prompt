import { nanoid } from 'nanoid'

export function createNodeId(): string {
  return `node_${nanoid(10)}`
}

export function createEdgeId(): string {
  return `edge_${nanoid(10)}`
}

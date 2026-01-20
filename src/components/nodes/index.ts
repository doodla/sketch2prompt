import { FrontendNode } from './FrontendNode'
import { BackendNode } from './BackendNode'
import { StorageNode } from './StorageNode'
import { AuthNode } from './AuthNode'
import { ExternalNode } from './ExternalNode'
import { BackgroundNode } from './BackgroundNode'
import { MindMapNode } from './MindMapNode'

export const nodeTypes = {
  frontend: FrontendNode,
  backend: BackendNode,
  storage: StorageNode,
  auth: AuthNode,
  external: ExternalNode,
  background: BackgroundNode,
  mindmap: MindMapNode,
} as const

export {
  FrontendNode,
  BackendNode,
  StorageNode,
  AuthNode,
  ExternalNode,
  BackgroundNode,
  MindMapNode,
}

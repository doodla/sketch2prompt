import type { NodeProps } from '@xyflow/react'
import type { DiagramNode } from '../../core/types'
import { ComponentCard } from './ComponentCard'

export function BackendNode(props: NodeProps<DiagramNode>) {
  return <ComponentCard {...props} />
}

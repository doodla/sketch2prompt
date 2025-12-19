import type { NodeProps } from '@xyflow/react'
import type { DiagramNode } from '../../core/types'
import { ComponentCard } from './ComponentCard'

export function ExternalNode(props: NodeProps<DiagramNode>) {
  return <ComponentCard {...props} />
}

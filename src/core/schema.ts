import { z } from 'zod'
import { NODE_TYPES } from './types'

const nodeTypeValues = Object.values(NODE_TYPES) as [string, ...string[]]

export const nodeTypeSchema = z.enum(nodeTypeValues)

export const nodeMetaSchema = z.object({
  description: z.string().optional(),
})

export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
})

export const diagramNodeDataSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  type: nodeTypeSchema,
  meta: nodeMetaSchema,
})

export const serializedNodeSchema = z.object({
  id: z.string().min(1),
  type: nodeTypeSchema,
  position: positionSchema,
  data: diagramNodeDataSchema,
})

export const diagramEdgeDataSchema = z.object({
  label: z.string().optional(),
})

export const serializedEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().nullish(),
  targetHandle: z.string().nullish(),
  data: diagramEdgeDataSchema.optional(),
})

export const serializedDiagramSchema = z.object({
  version: z.literal('1.0'),
  createdAt: z.iso.datetime(),
  nodes: z.array(serializedNodeSchema),
  edges: z.array(serializedEdgeSchema),
})

export type ValidatedDiagram = z.infer<typeof serializedDiagramSchema>

export function validateDiagram(data: unknown): ValidatedDiagram {
  return serializedDiagramSchema.parse(data)
}

export function safeParseDiagram(data: unknown) {
  return serializedDiagramSchema.safeParse(data)
}

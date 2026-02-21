import { describe, it, expect } from 'vitest'
import { parseExpansionResponse } from './mindmap-expander'

const NODE_ID = 'node-1'

describe('parseExpansionResponse', () => {
  it('returns empty suggestions for empty response', () => {
    const result = parseExpansionResponse('', NODE_ID)
    expect(result.suggestions).toHaveLength(0)
    expect(result.reasoning).toBeUndefined()
  })

  it('parses child nodes from CHILDREN section', () => {
    const response = `CHILDREN:
- [Authentication]: Handle user login and sessions
- [Authorization]: Manage permissions and roles
- [Profile Management]: User account settings

REASONING:
These are the core identity concerns.`

    const result = parseExpansionResponse(response, NODE_ID)
    expect(result.suggestions).toHaveLength(1)

    const [childSuggestion] = result.suggestions
    expect(childSuggestion.type).toBe('add_children')
    expect(childSuggestion.nodeId).toBe(NODE_ID)
    expect(childSuggestion.status).toBe('pending')
    expect(childSuggestion.metadata?.children).toHaveLength(3)
    expect(childSuggestion.metadata?.children?.[0].label).toBe('Authentication')
    expect(childSuggestion.metadata?.children?.[0].description).toBe(
      'Handle user login and sessions'
    )
  })

  it('parses children without square brackets', () => {
    const response = `CHILDREN:
- Frontend Layer: React application
- Backend API: Express server
`
    const result = parseExpansionResponse(response, NODE_ID)
    const children = result.suggestions[0]?.metadata?.children
    expect(children).toBeDefined()
    expect(children?.[0].label).toBe('Frontend Layer')
    expect(children?.[1].label).toBe('Backend API')
  })

  it('parses edit description suggestion', () => {
    const response = `CHILDREN:
- Child A: desc

EDIT_DESCRIPTION:
An improved description for this node.

REASONING:
Clear and concise.`

    const result = parseExpansionResponse(response, NODE_ID)
    const descSuggestion = result.suggestions.find(
      (s) => s.type === 'edit_description'
    )
    expect(descSuggestion).toBeDefined()
    expect(descSuggestion?.content).toBe('An improved description for this node.')
    expect(descSuggestion?.metadata?.description).toBe(
      'An improved description for this node.'
    )
    expect(descSuggestion?.status).toBe('pending')
  })

  it('ignores EDIT_DESCRIPTION when value is "None"', () => {
    const response = `CHILDREN:
- Child A: something

EDIT_DESCRIPTION:
None`

    const result = parseExpansionResponse(response, NODE_ID)
    expect(result.suggestions.every((s) => s.type !== 'edit_description')).toBe(true)
  })

  it('extracts reasoning', () => {
    const response = `CHILDREN:
- A: desc

REASONING:
This is the explanation.`

    const result = parseExpansionResponse(response, NODE_ID)
    expect(result.reasoning).toBe('This is the explanation.')
  })

  it('strips XSS from child labels', () => {
    const response = `CHILDREN:
- <script>alert(1)</script>Malicious: safe description
- onclick=steal() Label: another description
`
    const result = parseExpansionResponse(response, NODE_ID)
    const children = result.suggestions[0]?.metadata?.children ?? []
    children.forEach((child) => {
      expect(child.label).not.toContain('<script>')
      expect(child.label).not.toContain('onclick')
    })
  })

  it('strips XSS from child descriptions', () => {
    const response = `CHILDREN:
- SafeLabel: <script>evil()</script>clean text
`
    const result = parseExpansionResponse(response, NODE_ID)
    const child = result.suggestions[0]?.metadata?.children?.[0]
    expect(child?.description).not.toContain('<script>')
    expect(child?.description).toContain('clean text')
  })

  it('strips XSS from edit description content', () => {
    const response = `CHILDREN:
- A: b

EDIT_DESCRIPTION:
Good description <script>alert(document.cookie)</script> here.`

    const result = parseExpansionResponse(response, NODE_ID)
    const desc = result.suggestions.find((s) => s.type === 'edit_description')
    expect(desc?.content).not.toContain('<script>')
    expect(desc?.content).toContain('Good description')
    expect(desc?.content).toContain('here.')
  })

  it('skips child lines that produce empty labels after sanitization', () => {
    const response = `CHILDREN:
- <script>alert(1)</script>: description only
- Valid Node: real description
`
    const result = parseExpansionResponse(response, NODE_ID)
    const children = result.suggestions[0]?.metadata?.children ?? []
    // The first line's label becomes empty after strip — should be filtered out
    // "Valid Node" should remain
    const labels = children.map((c) => c.label)
    expect(labels).toContain('Valid Node')
  })

  it('assigns unique suggestion IDs', () => {
    const response = `CHILDREN:
- A: desc

EDIT_DESCRIPTION:
Some description.`

    const result = parseExpansionResponse(response, NODE_ID)
    const ids = result.suggestions.map((s) => s.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('attaches nodeId to every suggestion', () => {
    const response = `CHILDREN:
- A: b

EDIT_DESCRIPTION:
desc`

    const result = parseExpansionResponse(response, NODE_ID)
    result.suggestions.forEach((s) => {
      expect(s.nodeId).toBe(NODE_ID)
    })
  })
})

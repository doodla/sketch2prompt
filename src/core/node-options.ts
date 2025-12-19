import { Monitor, Server, Database, ShieldCheck, Cloud, Cog } from 'lucide-react'
import type { NodeType } from './types'

export interface NodeOption {
  type: NodeType
  label: string
  icon: React.ComponentType<{ className?: string }>
  shortcut: string
  description: string
}

export const NODE_OPTIONS: NodeOption[] = [
  { type: 'frontend', label: 'Frontend', icon: Monitor, shortcut: '1', description: 'User interface layer' },
  { type: 'backend', label: 'Backend', icon: Server, shortcut: '2', description: 'Server-side logic' },
  { type: 'storage', label: 'Storage', icon: Database, shortcut: '3', description: 'Data persistence' },
  { type: 'auth', label: 'Auth', icon: ShieldCheck, shortcut: '4', description: 'Authentication & authorization' },
  { type: 'external', label: 'External', icon: Cloud, shortcut: '5', description: 'Third-party services' },
  { type: 'background', label: 'Background', icon: Cog, shortcut: '6', description: 'Background processing' },
]

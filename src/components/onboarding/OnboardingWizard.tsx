import { useState, useCallback, useMemo } from 'react'
import {
  Monitor, Server, Database, ShieldCheck, Cloud, Cog, CreditCard,
  Bell, FileUp, Zap, Search, BarChart3, MessageSquare, Globe,
  Smartphone, Store, Newspaper, Wrench, MoreHorizontal,
  ChevronLeft, ChevronRight, Check, Sparkles,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { NodeType, DiagramNode } from '../../core/types'
import { createNodeId } from '../../core/id'
import {
  type Archetype, type Platform, ARCHETYPE_CONFIGS,
  CATEGORY_CONFIGS, ALL_COMPONENTS, getArchetypeConfig,
  type ComponentDefinition,
} from '../../core/archetype-defaults'

// ============================================================================
// TYPES
// ============================================================================

type ComponentSelection = {
  id: string
  type: NodeType
  label: string
  enabled: boolean
  techStack: string
  techAlternatives: string[]
}

type WizardData = {
  archetype: Archetype | null
  archetypeOther: string
  projectTitle: string
  platform: Platform
  components: ComponentSelection[]
}

export interface OnboardingWizardProps {
  onComplete: (nodes: DiagramNode[], projectTitle: string) => void
  onSkip: () => void
}

// ============================================================================
// ICONS
// ============================================================================

const ARCHETYPE_ICONS: Record<Archetype, React.ReactNode> = {
  saas: <Globe className="size-6" />,
  marketplace: <Store className="size-6" />,
  content: <Newspaper className="size-6" />,
  devtool: <Wrench className="size-6" />,
  mobile: <Smartphone className="size-6" />,
  custom: <MoreHorizontal className="size-6" />,
}

const COMPONENT_ICONS: Record<string, React.ReactNode> = {
  database: <Database className="size-4" />,
  'file-storage': <FileUp className="size-4" />,
  cache: <Zap className="size-4" />,
  search: <Search className="size-4" />,
  auth: <ShieldCheck className="size-4" />,
  payments: <CreditCard className="size-4" />,
  email: <MessageSquare className="size-4" />,
  'push-notifications': <Bell className="size-4" />,
  webhooks: <Zap className="size-4" />,
  api: <Server className="size-4" />,
  frontend: <Monitor className="size-4" />,
  'background-jobs': <Cog className="size-4" />,
  analytics: <BarChart3 className="size-4" />,
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  data: <Database className="size-4" />,
  auth: <ShieldCheck className="size-4" />,
  integration: <Cloud className="size-4" />,
  infra: <Server className="size-4" />,
}

// ============================================================================
// HELPERS
// ============================================================================

function componentDefToSelection(def: ComponentDefinition, enabled = true): ComponentSelection {
  return {
    id: def.id,
    type: def.type,
    label: def.label,
    enabled,
    techStack: def.defaultTech,
    techAlternatives: def.techAlternatives,
  }
}

function buildInitialComponents(archetype: Archetype): ComponentSelection[] {
  const config = getArchetypeConfig(archetype)
  if (!config) return []

  const enabledIds = new Set(config.components.map((c) => c.id))
  const selections: ComponentSelection[] = config.components.map((c) =>
    componentDefToSelection(c, true)
  )

  ALL_COMPONENTS.forEach((c) => {
    if (!enabledIds.has(c.id)) {
      selections.push(componentDefToSelection(c, false))
    }
  })

  return selections
}

// ============================================================================
// MAIN WIZARD COMPONENT
// ============================================================================

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>({
    archetype: null,
    archetypeOther: '',
    projectTitle: '',
    platform: 'web',
    components: [],
  })

  const handleArchetypeSelect = useCallback((archetype: Archetype) => {
    const config = getArchetypeConfig(archetype)
    setData((prev) => ({
      ...prev,
      archetype,
      platform: config?.platform ?? 'web',
      components: buildInitialComponents(archetype),
    }))
  }, [])

  const toggleComponent = useCallback((componentId: string) => {
    setData((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === componentId ? { ...c, enabled: !c.enabled } : c
      ),
    }))
  }, [])

  const updateTechStack = useCallback((componentId: string, tech: string) => {
    setData((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === componentId ? { ...c, techStack: tech } : c
      ),
    }))
  }, [])

  const enabledComponents = useMemo(
    () => data.components.filter((c) => c.enabled),
    [data.components]
  )

  const generateNodes = useCallback((): DiagramNode[] => {
    const nodes: DiagramNode[] = []
    const groups: Record<NodeType, ComponentSelection[]> = {
      frontend: [], backend: [], storage: [], auth: [], external: [], background: [],
    }

    enabledComponents.forEach((c) => {
      groups[c.type].push(c)
    })

    const rowConfig: { types: NodeType[]; y: number }[] = [
      { types: ['frontend'], y: 100 },
      { types: ['backend', 'auth'], y: 300 },
      { types: ['storage', 'external'], y: 500 },
      { types: ['background'], y: 700 },
    ]

    const startX = 150
    const spacing = 280

    rowConfig.forEach((row) => {
      let xOffset = 0
      row.types.forEach((nodeType) => {
        const typeComponents = groups[nodeType]
        if (typeComponents) {
          typeComponents.forEach((comp, idx) => {
            nodes.push({
              id: createNodeId(),
              type: comp.type,
              position: { x: startX + xOffset + idx * spacing, y: row.y },
              data: {
                label: comp.label,
                type: comp.type,
                meta: { techStack: [comp.techStack] },
              },
            })
          })
          xOffset += typeComponents.length * spacing + (typeComponents.length > 0 ? 100 : 0)
        }
      })
    })

    return nodes
  }, [enabledComponents])

  const handleComplete = useCallback(() => {
    const nodes = generateNodes()
    onComplete(nodes, data.projectTitle)
  }, [generateNodes, onComplete, data.projectTitle])

  const canProceed = useMemo(() => {
    if (step === 1) {
      return data.archetype !== null &&
        (data.archetype !== 'custom' || data.archetypeOther.trim().length > 0)
    }
    if (step === 2) return enabledComponents.length > 0
    if (step === 3) return data.projectTitle.trim().length > 0
    return true
  }, [step, data.archetype, data.archetypeOther, enabledComponents.length, data.projectTitle])

  const stepInfo = {
    1: { title: 'What are you building?', desc: 'Choose a starting template for your system' },
    2: { title: 'Configure your stack', desc: 'Toggle components and select technologies' },
    3: { title: 'Name your project', desc: 'Review your configuration and launch' },
  }[step]!

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'var(--color-blueprint-bg)' }}
    >
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-[var(--color-blueprint-accent)]/20 px-6 py-5 sm:px-10">
        <div>
          <h1
            className="font-mono text-xl font-medium tracking-tight sm:text-2xl"
            style={{ color: 'var(--color-blueprint-accent)' }}
          >
            sketch2prompt
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            System Architecture Designer
          </p>
        </div>
        <button
          onClick={onSkip}
          className="text-sm text-slate-500 transition-colors hover:text-slate-300"
        >
          Skip setup →
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Step header */}
        <div className="border-b border-slate-800 px-6 py-6 sm:px-10">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Step {step} of 3
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                  {stepInfo.title}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {stepInfo.desc}
                </p>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex size-8 items-center justify-center rounded-full font-mono text-sm font-semibold transition-all duration-300',
                        s === step
                          ? 'bg-[var(--color-blueprint-accent)] text-slate-900'
                          : s < step
                            ? 'bg-[var(--color-blueprint-accent)]/20 text-[var(--color-blueprint-accent)]'
                            : 'bg-slate-800 text-slate-500'
                      )}
                      style={s === step ? { boxShadow: 'var(--shadow-glow-sm-cyan)' } : undefined}
                    >
                      {s < step ? <Check className="size-4" /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={cn(
                          'h-px w-6 transition-colors',
                          s < step ? 'bg-[var(--color-blueprint-accent)]/50' : 'bg-slate-700'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
          <div className="mx-auto max-w-2xl">

            {/* Step 1: Archetype Selection */}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {ARCHETYPE_CONFIGS.map((config) => {
                  const isSelected = data.archetype === config.id
                  return (
                    <button
                      key={config.id}
                      onClick={() => handleArchetypeSelect(config.id)}
                      className={cn(
                        'group relative flex flex-col items-start rounded-lg border p-5 text-left transition-all duration-200',
                        isSelected
                          ? 'border-[var(--color-blueprint-accent)] bg-[var(--color-blueprint-accent)]/5'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                      )}
                      style={isSelected ? { boxShadow: 'var(--shadow-glow-sm-cyan)' } : undefined}
                    >
                      {/* Badge */}
                      {config.badge && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                          <Sparkles className="size-3" />
                          {config.badge}
                        </span>
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          'flex size-11 items-center justify-center rounded-lg transition-colors',
                          isSelected
                            ? 'bg-[var(--color-blueprint-accent)] text-slate-900'
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                        )}
                      >
                        {ARCHETYPE_ICONS[config.id]}
                      </div>

                      {/* Content */}
                      <h3 className={cn(
                        'mt-4 text-base font-semibold transition-colors',
                        isSelected ? 'text-white' : 'text-slate-200'
                      )}>
                        {config.label}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                        {config.description}
                      </p>

                      {/* Selected indicator */}
                      {isSelected && (
                        <div
                          className="absolute bottom-3 right-3 flex size-6 items-center justify-center rounded-full"
                          style={{ backgroundColor: 'var(--color-blueprint-accent)' }}
                        >
                          <Check className="size-4 text-slate-900" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  )
                })}

                {/* Custom input */}
                {data.archetype === 'custom' && (
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={data.archetypeOther}
                      onChange={(e) => setData((d) => ({ ...d, archetypeOther: e.target.value }))}
                      placeholder="Describe what you're building..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-[var(--color-blueprint-accent)] focus:ring-1 focus:ring-[var(--color-blueprint-accent)]/50"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Component Configuration */}
            {step === 2 && (
              <div className="space-y-8">
                {CATEGORY_CONFIGS.map((category) => {
                  const comps = data.components.filter((c) =>
                    category.componentIds.includes(c.id)
                  )
                  if (comps.length === 0) return null

                  return (
                    <div key={category.id}>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-[var(--color-blueprint-accent)]">
                          {CATEGORY_ICONS[category.id]}
                        </span>
                        <span className="text-sm font-medium text-slate-300">
                          {category.label}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {comps.map((comp) => (
                          <div
                            key={comp.id}
                            className={cn(
                              'flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors',
                              comp.enabled
                                ? 'border-[var(--color-blueprint-accent)]/30 bg-[var(--color-blueprint-accent)]/5'
                                : 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/50'
                            )}
                          >
                            <Checkbox
                              id={comp.id}
                              checked={comp.enabled}
                              onCheckedChange={() => toggleComponent(comp.id)}
                              className="border-slate-600 data-[state=checked]:border-[var(--color-blueprint-accent)] data-[state=checked]:bg-[var(--color-blueprint-accent)] data-[state=checked]:text-slate-900"
                            />
                            <label
                              htmlFor={comp.id}
                              className={cn(
                                'flex flex-1 cursor-pointer items-center gap-3',
                                comp.enabled ? 'text-white' : 'text-slate-400'
                              )}
                            >
                              <span className={comp.enabled ? 'text-[var(--color-blueprint-accent)]' : ''}>
                                {COMPONENT_ICONS[comp.id]}
                              </span>
                              <span className="text-sm font-medium">{comp.label}</span>
                            </label>
                            {comp.enabled && (
                              <Select
                                value={comp.techStack}
                                onValueChange={(v) => updateTechStack(comp.id, v)}
                              >
                                <SelectTrigger className="h-8 w-32 border-slate-700 bg-slate-800 text-xs text-slate-300">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-slate-700 bg-slate-800">
                                  {[comp.techStack, ...comp.techAlternatives.filter(t => t !== comp.techStack)].map((tech) => (
                                    <SelectItem
                                      key={tech}
                                      value={tech}
                                      className="text-xs text-slate-300 focus:bg-slate-700 focus:text-white"
                                    >
                                      {tech}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Step 3: Review & Launch */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Project name
                  </label>
                  <input
                    type="text"
                    value={data.projectTitle}
                    onChange={(e) => setData((d) => ({ ...d, projectTitle: e.target.value }))}
                    placeholder="My Awesome Project"
                    autoFocus
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-lg font-medium text-white placeholder-slate-600 outline-none transition-colors focus:border-[var(--color-blueprint-accent)] focus:ring-1 focus:ring-[var(--color-blueprint-accent)]/50"
                  />
                </div>

                {/* Summary */}
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
                  <h3 className="text-sm font-medium text-slate-400">Configuration Summary</h3>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Template</span>
                      <div className="flex items-center gap-2">
                        {data.archetype && (
                          <span className="text-[var(--color-blueprint-accent)]">
                            {ARCHETYPE_ICONS[data.archetype]}
                          </span>
                        )}
                        <span className="text-sm font-medium text-white">
                          {getArchetypeConfig(data.archetype ?? 'custom')?.label ?? 'Custom'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Components</span>
                      <span className="text-sm font-medium text-white">
                        {enabledComponents.length} selected
                      </span>
                    </div>
                  </div>
                </div>

                {/* Component chips */}
                {enabledComponents.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {enabledComponents.map((comp) => (
                      <span
                        key={comp.id}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs"
                      >
                        <span className="text-[var(--color-blueprint-accent)]">
                          {COMPONENT_ICONS[comp.id]}
                        </span>
                        <span className="font-medium text-slate-300">{comp.label}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-500">{comp.techStack}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-slate-800 px-6 py-4 sm:px-10">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 1}
              className={cn(
                'flex items-center gap-1 text-sm font-medium transition-colors',
                step === 1
                  ? 'cursor-not-allowed text-slate-700'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <ChevronLeft className="size-4" />
              Back
            </button>
            <button
              onClick={() => step < 3 ? setStep((s) => s + 1) : handleComplete()}
              disabled={!canProceed}
              className={cn(
                'flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all',
                canProceed
                  ? 'text-slate-900 hover:opacity-90'
                  : 'cursor-not-allowed bg-slate-800 text-slate-600'
              )}
              style={canProceed ? {
                backgroundColor: 'var(--color-blueprint-accent)',
                boxShadow: 'var(--shadow-glow-cyan)'
              } : undefined}
            >
              {step === 3 ? 'Generate Canvas' : 'Continue'}
              <ChevronRight className="size-4" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}

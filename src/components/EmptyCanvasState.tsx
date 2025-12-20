import { useState, useEffect } from 'react'
import { Layers, Plus, ChevronUp, Sparkles } from 'lucide-react'

export function EmptyCanvasState() {
  const [showHint, setShowHint] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setShowHint(true), 1500)
    const fadeTimer = setTimeout(() => setFadeOut(true), 7000)
    const hideTimer = setTimeout(() => setShowHint(false), 8000)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="p-4 rounded-full bg-[var(--color-workshop-elevated)] border border-[var(--color-workshop-border)] animate-in fade-in duration-500">
          <Layers className="h-8 w-8 text-[var(--color-workshop-text-muted)]" />
        </div>

        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
          <h3 className="text-lg font-semibold text-[var(--color-workshop-text)]">
            No components yet
          </h3>
          <p className="text-sm text-[var(--color-workshop-text-muted)] leading-relaxed">
            Start defining your system architecture by adding components.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--color-workshop-text-muted)] bg-[var(--color-workshop-elevated)]/50 px-3 py-2 rounded-md animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
          <Plus className="h-3.5 w-3.5" />
          <span>Click the</span>
          <kbd className="px-1.5 py-0.5 bg-[var(--color-workshop-bg)] rounded border border-[var(--color-workshop-border)] font-mono text-[10px]">+</kbd>
          <span>button or press</span>
          <kbd className="px-1.5 py-0.5 bg-[var(--color-workshop-bg)] rounded border border-[var(--color-workshop-border)] font-mono text-[10px]">1-6</kbd>
        </div>

        {showHint && (
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-wizard-accent)]/10 border border-[var(--color-wizard-accent)]/30 text-[var(--color-wizard-accent)] shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all duration-500 animate-in fade-in slide-in-from-bottom-3 ${fadeOut ? 'opacity-0 translate-y-2' : 'opacity-100'}`}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">New here?</span>
            <span className="text-sm text-[var(--color-wizard-accent)]/80">Try</span>
            <span className="text-sm font-semibold">Quick Start</span>
            <ChevronUp className="h-4 w-4 animate-bounce" />
          </div>
        )}
      </div>
    </div>
  )
}

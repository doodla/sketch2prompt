export function App() {
  return (
    <div className="flex h-screen flex-col bg-bg">
      <header className="flex h-12 items-center border-b border-border px-4">
        <h1 className="text-lg font-semibold text-text">sketch2prompt</h1>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-14 border-r border-border bg-bg-secondary">
          {/* Toolbar placeholder */}
        </aside>

        <div className="flex-1 bg-bg-tertiary">
          {/* Canvas placeholder */}
          <div className="flex h-full items-center justify-center">
            <p className="text-text-muted">Canvas will render here</p>
          </div>
        </div>

        <aside className="w-72 border-l border-border bg-bg-secondary">
          {/* Inspector placeholder */}
          <div className="p-4">
            <p className="text-sm text-text-muted">Inspector panel</p>
          </div>
        </aside>
      </main>
    </div>
  )
}

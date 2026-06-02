export function PathLensPreloader() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading PathLens workspace"
      className="grid min-h-screen place-items-center bg-(--app-bg) px-4 text-(--app-text)"
    >
      <section className="animate-panel-in w-full max-w-md border-2 border-(--app-border) bg-(--app-surface) px-6 py-10 text-center shadow-[6px_6px_0_var(--app-border)] sm:px-10">
        <h1 className="text-4xl font-bold italic tracking-tight sm:text-5xl">
          PathLens
        </h1>

        <p className="mt-3 font-(--font-mono) text-xs uppercase tracking-[0.18em] text-(--app-text-muted)">
          Preparing workspace
        </p>

        <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
          <span className="h-2 w-12 bg-(--app-accent) animate-[pulse_1.8s_ease-in-out_infinite] [animation-delay:0ms]" />
          <span className="h-2 w-12 bg-(--app-accent) animate-[pulse_1.8s_ease-in-out_infinite] [animation-delay:300ms]" />
          <span className="h-2 w-12 bg-(--app-accent) animate-[pulse_1.8s_ease-in-out_infinite] [animation-delay:600ms]" />
        </div>

        <span className="sr-only">Loading PathLens workspace...</span>
      </section>
    </main>
  )
}

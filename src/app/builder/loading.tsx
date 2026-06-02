export default function BuilderLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-(--app-bg) text-(--app-text)">
      <div className="border-2 border-(--app-border) bg-(--app-surface) p-10 text-center">
        <h1 className="text-5xl font-bold italic">PathLens</h1>
        <p className="mt-3 font-(--font-mono) text-xs uppercase tracking-[0.18em] text-(--app-text-muted)">
          Preparing workspace
        </p>
        <div className="mt-8 flex justify-center gap-2">
          <span
            className="h-2 w-12 bg-(--app-accent)"
            style={{
              animation: "pulse 1.8s ease-in-out infinite",
              animationDelay: "0ms",
            }}
          />
          <span
            className="h-2 w-12 bg-(--app-accent)"
            style={{
              animation: "pulse 1.8s ease-in-out infinite",
              animationDelay: "300ms",
            }}
          />
          <span
            className="h-2 w-12 bg-(--app-accent)"
            style={{
              animation: "pulse 1.8s ease-in-out infinite",
              animationDelay: "600ms",
            }}
          />
        </div>
      </div>
    </main>
  )
}

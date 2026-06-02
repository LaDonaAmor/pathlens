export function LoadingState() {
  return (
    <div className="grid place-items-center rounded-md border border-(--app-border) p-8 text-center">
      <div className="space-y-3">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-(--app-border) border-t-(--app-accent)" />
        <p className="text-sm font-medium text-(--app-text-muted)">
          Running query...
        </p>
      </div>
    </div>
  )
}

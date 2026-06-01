export function LoadingState() {
  return (
    <div className="grid place-items-center rounded-md border border-slate-200 p-8 text-center">
      <div className="space-y-3">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-teal-500" />
        <p className="text-sm font-medium text-slate-600">Running query...</p>
      </div>
    </div>
  )
}

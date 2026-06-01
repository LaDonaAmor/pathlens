import { SearchX } from "lucide-react"

export function EmptyState() {
  return (
    <div className="grid place-items-center rounded-md border border-dashed border-slate-300 p-8 text-center">
      <div className="space-y-2">
        <SearchX className="mx-auto text-slate-400" size={28} />
        <p className="text-sm font-medium text-slate-700">No matching rows</p>
        <p className="text-xs text-slate-500">
          Adjust the active rules or switch the group logic.
        </p>
      </div>
    </div>
  )
}

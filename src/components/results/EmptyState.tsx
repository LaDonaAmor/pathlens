import { SearchX } from "lucide-react"

export function EmptyState() {
  return (
    <div className="grid place-items-center rounded-md border border-dashed border-(--app-border) p-8 text-center">
      <div className="space-y-2">
        <SearchX className="mx-auto text-(--app-text-muted)" size={28} />{" "}
        <p className="text-sm font-medium text-(--app-text-muted)">
          No matching rows
        </p>{" "}
        <p className="text-xs text-(--syntax-text)">
          Adjust the active rules or switch the group logic.
        </p>
      </div>
    </div>
  )
}

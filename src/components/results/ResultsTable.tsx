import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import type { DataRecord, SortState } from "@/types/results"
import { Button } from "../ui/button"

export function ResultsTable({
  rows,
  sort,
  onSortChange,
}: {
  rows: DataRecord[]
  sort: SortState | null
  onSortChange: (sort: SortState) => void
}) {
  const columns = Object.keys(rows[0] ?? {})

  function toggleSort(field: string) {
    onSortChange({
      field,
      direction:
        sort?.field === field && sort.direction === "asc" ? "desc" : "asc",
    })
  }

  return (
    <div className="overflow-auto border-2 border-(--app-border)">
      <table className="min-w-full border-collapse text-center font-(--font-mono) text-sm leading-6">
        <thead className="bg-(--app-surface-raised) text-xs uppercase tracking-[0.12em] text-(--app-text)">
          <tr>
            {columns.map((column) => {
              const isActive = sort?.field === column
              return (
                <th
                  key={column}
                  className="border-b-2 border-(--app-border) px-4 py-3 align-middle"
                >
                  <Button
                    type="button"
                    onClick={() => toggleSort(column)}
                    title={`Sort by ${column}`}
                    className="flex items-center gap-1.5 font-semibold uppercase tracking-[0.12em]"
                  >
                    {column}
                    {isActive ? (
                      sort.direction === "asc" ? (
                        <ArrowUp size={13} className="text-(--app-accent)" />
                      ) : (
                        <ArrowDown size={13} className="text-(--app-accent)" />
                      )
                    ) : (
                      <ArrowUpDown
                        size={13}
                        className="opacity-30 group-hover:opacity-60"
                      />
                    )}
                  </Button>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={String(row.id ?? index)}
              className="odd:bg-(--app-surface) even:bg-(--app-surface-muted)"
            >
              {columns.map((column) => (
                <td
                  key={column}
                  className="border-b border-(--app-border-muted) px-4 py-3 align-middle text-(--app-text)"
                >
                  {String(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

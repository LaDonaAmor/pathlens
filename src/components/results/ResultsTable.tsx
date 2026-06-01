import type { DataRecord, SortState } from "@/types/results"

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
    <div className="overflow-auto rounded-md border border-slate-200">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column} className="border-b border-slate-200 px-3 py-2">
                <button
                  type="button"
                  onClick={() => toggleSort(column)}
                  className="font-semibold uppercase tracking-wide"
                >
                  {column}
                  {sort?.field === column ? ` ${sort.direction}` : ""}
                </button>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={String(row.id ?? index)}
              className="odd:bg-white even:bg-slate-50"
            >
              {columns.map((column) => (
                <td
                  key={column}
                  className="border-b border-slate-100 px-3 py-2"
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

import { formatMs } from "@/lib/utils"

export function ResultsCount({
  total,
  executionTimeMs,
}: {
  total: number
  executionTimeMs: number
}) {
  return (
    <p className="text-sm text-slate-600">
      Showing {total} matching results in {formatMs(executionTimeMs)}
    </p>
  )
}

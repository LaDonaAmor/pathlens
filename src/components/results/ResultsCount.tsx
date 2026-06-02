import { formatMs } from "@/lib/utils"

export function ResultsCount({
  total,
  executionTimeMs,
}: {
  total: number
  executionTimeMs: number
}) {
  return (
    <p className="text-sm text-(--app-text-muted)">
      Showing {total} matching results in {formatMs(executionTimeMs)}
    </p>
  )
}

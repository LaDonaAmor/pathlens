import { format } from "sql-formatter"

export function SqlPreview({
  value,
  mode,
}: {
  value: string
  mode: "sql" | "json"
}) {
  let formattedValue = value

  if (mode === "sql") {
    try {
      formattedValue = format(value)
    } catch {
      formattedValue = value
    }
  }

  return (
    <pre className="max-h-[42vh] overflow-auto whitespace-pre-wrap wrap-break-word bg-(--syntax-bg) p-4 font-(--font-mono) text-sm leading-6 text-(--syntax-text)">
      {formattedValue}
    </pre>
  )
}

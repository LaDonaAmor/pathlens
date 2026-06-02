export function MongoPreview({ value }: { value: unknown }) {
  return (
    <pre className="max-h-105 overflow-auto rounded-md bg-(--syntax-bg) p-4 text-sm leading-6 text-(--syntax-text)">
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}

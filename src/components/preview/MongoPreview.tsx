export function MongoPreview({ value }: { value: unknown }) {
  return (
    <pre className="max-h-[55vh] overflow-auto bg-(--syntax-bg) p-4 font-(--font-mono) text-sm leading-6 text-(--syntax-text)">
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}

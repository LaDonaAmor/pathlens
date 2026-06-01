export function MongoPreview({ value }: { value: unknown }) {
  return (
    <pre className="max-h-105 overflow-auto rounded-md bg-slate-950 p-4 text-sm leading-6 text-slate-50">
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}

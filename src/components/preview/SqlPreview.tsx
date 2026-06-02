export function SqlPreview({ value }: { value: string }) {
  return (
    <pre className="max-h-[55vh] overflow-auto bg-(--syntax-bg) p-4 font-(--font-mono) text-sm leading-6 text-(--syntax-text)">
      {value}
    </pre>
  )
}

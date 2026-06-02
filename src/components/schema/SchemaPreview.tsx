import { Plus } from "lucide-react"
import type { DataSchema } from "@/types/schema"

export function SchemaPreview({
  schema,
  onAddRule,
}: {
  schema: DataSchema
  onAddRule: (fieldKey: string) => void
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-(--app-text)">
          {schema.label}
        </h2>
        <p className="text-sm text-(--app-text-muted)">{schema.description}</p>
      </div>

      <div className="space-y-1">
        {schema.fields.map((field) => (
          <button
            key={field.key}
            onClick={() => onAddRule(field.key)}
            className="flex w-full items-center justify-between gap-3 rounded-md border border-(--app-border-muted) bg-(--app-surface) px-3 py-2.5 text-left text-sm transition hover:bg-(--app-surface-muted) hover:shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium text-(--app-text)">
                {field.label}
              </span>
              <span className="ml-2 font-(--font-mono) text-[10px] uppercase tracking-wider text-(--app-text-muted)">
                {field.type}
              </span>
              {field.options?.length ? (
                <span className="ml-2 text-[10px] text-(--app-text-muted)">
                  ({field.options.join(", ")})
                </span>
              ) : null}
            </div>
            <Plus
              size={14}
              className="shrink-0 text-(--app-text-muted) transition group-hover:text-(--app-accent)"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

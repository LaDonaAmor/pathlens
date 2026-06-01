import { Badge } from "@/components/ui/badge"
import type { DataSchema } from "@/types/schema"

export function SchemaPreview({ schema }: { schema: DataSchema }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">{schema.label}</h2>
        <p className="text-sm text-slate-600">{schema.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {schema.fields.map((field) => (
          <Badge key={field.key}>
            {field.label}: {field.type}
          </Badge>
        ))}
      </div>
    </section>
  )
}

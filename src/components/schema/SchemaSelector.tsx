"use client"

import { Select } from "@/components/ui/select"
import { schemas } from "@/data/schema"

export function SchemaSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor="schema-select" className="sr-only">
        Data source
      </label>

      <Select
        id="schema-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {schemas.map((schema) => (
          <option key={schema.id} value={schema.id}>
            {schema.label}
          </option>
        ))}
      </Select>
    </div>
  )
}

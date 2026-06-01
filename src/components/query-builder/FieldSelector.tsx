"use client"

import { Select } from "@/components/ui/select"
import type { SchemaField } from "@/types/schema"

export function FieldSelector({
  fields,
  value,
  onChange,
}: {
  fields: SchemaField[]
  value: string
  onChange: (value: string) => void
}) {
  const id = "field-select"

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        Select field
      </label>

      <Select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {fields.map((field) => (
          <option key={field.key} value={field.key}>
            {field.label}
          </option>
        ))}
      </Select>
    </div>
  )
}

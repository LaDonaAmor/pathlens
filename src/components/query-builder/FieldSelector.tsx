"use client"

import { Select } from "@/components/ui/select"
import type { SchemaField } from "@/types/schema"

export function FieldSelector({
  fields,
  value,
  onChange,
  id,
}: {
  fields: SchemaField[]
  value: string
  onChange: (value: string) => void
  id: string
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        Select field
      </label>
      <Select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {fields.map((field) => (
          <option key={field.key} value={field.key}>
            {field.label}
          </option>
        ))}
      </Select>
    </div>
  )
}

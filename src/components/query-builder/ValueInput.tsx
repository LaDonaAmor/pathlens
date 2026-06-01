"use client"

import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { getOperatorDefinition, type Operator } from "@/types/operators"
import type { QueryValue } from "@/types/query"
import type { SchemaField } from "@/types/schema"

export function ValueInput({
  field,
  operator,
  value,
  onChange,
}: {
  field: SchemaField
  operator: Operator
  value: QueryValue
  onChange: (value: QueryValue) => void
}) {
  const definition = getOperatorDefinition(operator)

  if (!definition?.requiresValue) {
    return (
      <div className="flex h-9 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
        No value needed
      </div>
    )
  }

  if (operator === "between") {
    const values = Array.isArray(value) ? value : ["", ""]
    const inputType = field.type === "date" ? "date" : "number"

    return (
      <div className="grid grid-cols-2 gap-2">
        <Input
          type={inputType}
          value={String(values[0] ?? "")}
          onChange={(event) => onChange([event.target.value, values[1] ?? ""])}
        />
        <Input
          type={inputType}
          value={String(values[1] ?? "")}
          onChange={(event) => onChange([values[0] ?? "", event.target.value])}
        />
      </div>
    )
  }

  // ARRAY
  if (field.type === "array") {
    const id = `array-value-${field.key}`

    return (
      <div>
        <label htmlFor={id} className="sr-only">
          Select value for {field.label}
        </label>

        <Select
          id={id}
          value={
            Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "")
          }
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select value</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>
    )
  }

  // ENUM
  if (field.type === "enum") {
    const id = `enum-value-${field.key}`

    return (
      <div>
        <label htmlFor={id} className="sr-only">
          Select value for {field.label}
        </label>

        <Select
          id={id}
          value={String(value ?? field.options?.[0] ?? "")}
          onChange={(event) => onChange(event.target.value)}
        >
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </div>
    )
  }

  // BOOLEAN
  if (field.type === "boolean") {
    const id = `boolean-value-${field.key}`

    return (
      <div>
        <label htmlFor={id} className="sr-only">
          Select boolean value for {field.label}
        </label>

        <Select
          id={id}
          value={String(value)}
          onChange={(event) => onChange(event.target.value === "true")}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </Select>
      </div>
    )
  }

  // DEFAULT INPUT
  return (
    <Input
      type={
        field.type === "number"
          ? "number"
          : field.type === "date"
            ? "date"
            : "text"
      }
      value={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
      placeholder={operator === "in" ? "Comma separated values" : "Value"}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

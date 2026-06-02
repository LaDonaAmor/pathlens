"use client"

import { Select } from "@/components/ui/select"
import { getOperatorsForType, type Operator } from "@/types/operators"
import type { FieldType } from "@/types/schema"

export function OperatorSelector({
  fieldType,
  value,
  onChange,
  id,
}: {
  fieldType: FieldType
  value: Operator
  onChange: (value: Operator) => void
  id: string
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        Operator
      </label>

      <Select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as Operator)}
      >
        {getOperatorsForType(fieldType).map((operator) => (
          <option key={operator.id} value={operator.id}>
            {operator.label}
          </option>
        ))}
      </Select>
    </div>
  )
}

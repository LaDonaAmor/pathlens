"use client"

import { GripVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Operator } from "@/types/operators"
import type { QueryRule, QueryValue } from "@/types/query"
import type { SchemaField } from "@/types/schema"
import { FieldSelector } from "./FieldSelector"
import { OperatorSelector } from "./OperatorSelector"
import { ValueInput } from "./ValueInput"
import { Badge } from "@/components/ui/badge"

function getTintIndex(id: string) {
  return [...id].reduce((total, char) => total + char.charCodeAt(0), 0) % 5
}

export function Rule({
  rule,
  fields,
  issue,
  onFieldChange,
  onOperatorChange,
  onValueChange,
  onRemove,
}: {
  rule: QueryRule
  fields: SchemaField[]
  issue?: string
  depth?: number
  onFieldChange: (field: string) => void
  onOperatorChange: (operator: Operator) => void
  onValueChange: (value: QueryValue) => void
  onRemove: () => void
}) {
  const field = fields.find((item) => item.key === rule.field) ?? fields[0]

  const ruleTints = [
    "bg-(--rule-tint-1)",
    "bg-(--rule-tint-2)",
    "bg-(--rule-tint-3)",
    "bg-(--rule-tint-4)",
    "bg-(--rule-tint-5)",
  ]

  const ruleTint = ruleTints[getTintIndex(rule.id)]

  return (
    <div
      className={`rounded-md border border-(--app-border-muted) p-4 max-lg:p-3 shadow-sm ${ruleTint}`}
    >
      <div className="grid gap-2 md:grid-cols-[24px_minmax(120px,1fr)_minmax(120px,1fr)_minmax(180px,1.4fr)_40px]">
        <div className="hidden items-center text-(--app-text-muted) md:flex">
          <GripVertical size={16} />
        </div>

        <FieldSelector
          fields={fields}
          value={rule.field}
          onChange={onFieldChange}
        />

        <OperatorSelector
          fieldType={field.type}
          value={rule.operator}
          onChange={onOperatorChange}
        />

        <ValueInput
          field={field}
          operator={rule.operator}
          value={rule.value}
          onChange={onValueChange}
        />

        <Button
          onClick={onRemove}
          className="h-9 w-9 px-0 text-(--error)"
          aria-label="Remove rule"
        >
          <Trash2 size={16} />
        </Button>
      </div>
      {issue ? (
        <div className="mt-3">
          <Badge variant="invalid">{issue}</Badge>
        </div>
      ) : null}
    </div>
  )
}

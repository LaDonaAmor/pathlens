"use client"

import { GripVertical, Trash2 } from "lucide-react"
import { getRuleTint } from "@/lib/tints"
import { Button } from "@/components/ui/button"
import type { Operator } from "@/types/operators"
import { memo } from "react"
import type { QueryRule, QueryValue } from "@/types/query"
import type { SchemaField } from "@/types/schema"
import { FieldSelector } from "./FieldSelector"
import { OperatorSelector } from "./OperatorSelector"
import { ValueInput } from "./ValueInput"
import { Badge } from "@/components/ui/badge"

export const Rule = memo(function Rule({
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
  const ruleTint = getRuleTint(rule.id)

  return (
    <div
      className={`rounded-md border border-(--app-border-muted) p-3 max-lg:p-3 shadow-sm md:flex-nowrap ${ruleTint}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="hidden shrink-0 items-center text-(--app-text-muted) md:flex">
          <GripVertical size={16} />
        </div>

        <div className="min-w-20 flex-1">
          <FieldSelector
            id={`${rule.id}-field`}
            fields={fields}
            value={rule.field}
            onChange={onFieldChange}
          />
        </div>

        <div className="min-w-20 flex-1">
          <OperatorSelector
            id={`${rule.id}-operator`}
            fieldType={field.type}
            value={rule.operator}
            onChange={onOperatorChange}
          />
        </div>

        <div className="min-w-10 flex-[1.4]">
          <ValueInput
            field={field}
            operator={rule.operator}
            value={rule.value}
            onChange={onValueChange}
          />
        </div>

        <Button
          onClick={onRemove}
          className="h-9 w-9 shrink-0 px-0 text-(--error)"
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
})

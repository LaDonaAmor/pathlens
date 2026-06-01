"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDragAndDrop } from "@/hooks/useDragAndDrop"
import type { ValidationIssue } from "@/lib/validator"
import type { Operator } from "@/types/operators"
import type {
  LogicOperator,
  QueryGroup as QueryGroupType,
  QueryValue,
} from "@/types/query"
import type { SchemaField } from "@/types/schema"
import { AddGroupButton } from "./AddGroupButton"
import { AddRuleButton } from "./AddRuleButton"
import { CollapseToggle } from "./CollapseToggle"
import { GroupLogicToggle } from "./GroupLogicToggle"
import { Rule } from "./Rule"

export function RuleGroup({
  group,
  fields,
  issues,
  depth = 0,
  isRoot = false,
  onAddRule,
  onAddGroup,
  onRemove,
  onToggle,
  onLogicChange,
  onFieldChange,
  onOperatorChange,
  onValueChange,
  onReorder,
}: {
  group: QueryGroupType
  fields: SchemaField[]
  issues: ValidationIssue[]
  depth?: number
  isRoot?: boolean
  onAddRule: (groupId: string) => void
  onAddGroup: (groupId: string) => void
  onRemove: (nodeId: string) => void
  onToggle: (groupId: string) => void
  onLogicChange: (groupId: string, logic: LogicOperator) => void
  onFieldChange: (ruleId: string, field: string) => void
  onOperatorChange: (ruleId: string, operator: Operator) => void
  onValueChange: (ruleId: string, value: QueryValue) => void
  onReorder: (groupId: string, fromIndex: number, toIndex: number) => void
}) {
  const dnd = useDragAndDrop((fromIndex, toIndex) =>
    onReorder(group.id, fromIndex, toIndex)
  )

  const groupIssue = issues.find((issue) => issue.nodeId === group.id)?.message

  return (
    <section
      className={`rounded-lg border border-slate-300 bg-slate-50 p-3 ${
        depth ? "ml-4" : ""
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CollapseToggle
          collapsed={group.collapsed}
          onClick={() => onToggle(group.id)}
        />

        <GroupLogicToggle
          value={group.logic}
          onChange={(logic) => onLogicChange(group.id, logic)}
        />

        <AddRuleButton onClick={() => onAddRule(group.id)} />
        <AddGroupButton onClick={() => onAddGroup(group.id)} />

        {!isRoot ? (
          <Button
            onClick={() => onRemove(group.id)}
            className="ml-auto h-9 w-9 px-0 text-red-600"
            aria-label="Remove group"
          >
            <Trash2 size={16} />
          </Button>
        ) : null}
      </div>

      {groupIssue ? (
        <p className="mb-3 text-xs font-medium text-red-600">{groupIssue}</p>
      ) : null}

      {!group.collapsed ? (
        <div className="space-y-3">
          {group.children.map((child, index) => (
            <div
              key={child.id}
              {...dnd.getDragProps(index)}
              className={dnd.dragIndex === index ? "opacity-50" : ""}
            >
              {child.type === "rule" ? (
                <Rule
                  rule={child}
                  fields={fields}
                  issue={
                    issues.find((issue) => issue.nodeId === child.id)?.message
                  }
                  onFieldChange={(field) => onFieldChange(child.id, field)}
                  onOperatorChange={(operator) =>
                    onOperatorChange(child.id, operator)
                  }
                  onValueChange={(value) => onValueChange(child.id, value)}
                  onRemove={() => onRemove(child.id)}
                />
              ) : (
                <RuleGroup
                  group={child}
                  fields={fields}
                  issues={issues}
                  depth={depth + 1}
                  onAddRule={onAddRule}
                  onAddGroup={onAddGroup}
                  onRemove={onRemove}
                  onToggle={onToggle}
                  onLogicChange={onLogicChange}
                  onFieldChange={onFieldChange}
                  onOperatorChange={onOperatorChange}
                  onValueChange={onValueChange}
                  onReorder={onReorder}
                />
              )}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}

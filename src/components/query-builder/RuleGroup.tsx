"use client"

import { Trash2 } from "lucide-react"
import { getGroupTint } from "@/lib/tints"
import { Button } from "@/components/ui/button"
import { useDragAndDrop } from "@/hooks/useDragAndDrop"
import type { ValidationIssue } from "@/lib/validator"
import type { Operator } from "@/types/operators"
import { memo } from "react"
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

export const RuleGroup = memo(function RuleGroup({
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

  const groupTint = getGroupTint(group.id)

  return (
    <section
      className={`relative border-2 border-(--app-border) p-4 max-lg:p-3 min-w-0 ${groupTint} ${
        depth ? "ml-4 max-lg:ml-2 border-l-4 max-lg:border-l-2" : ""
      }`}
    >
      <div className="absolute bottom-4 left-3 top-4 w-px bg-(--app-border-muted)" />
      <div className="absolute left-2.25 top-6 size-2 border border-(--app-border) bg-(--app-accent)" />

      <div className="relative pl-5 max-lg:pl-3">
        <div className="mb-5 flex flex-wrap items-center gap-3">
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
              className="ml-auto h-9 w-9 px-0 text-(--error)"
              aria-label="Remove group"
            >
              <Trash2 size={16} />
            </Button>
          ) : null}
        </div>

        {groupIssue ? (
          <p className="mb-3 text-xs font-medium text-(--error)">
            {groupIssue}
          </p>
        ) : null}

        {!group.collapsed ? (
          <div className="space-y-5 max-lg:space-y-3 animate-group-expand min-w-0 w-full">
            {group.children.map((child, index) => (
              <div
                key={child.id}
                className={`relative cursor-pointer pl-5 min-w-0 w-full animate-rule-enter ${
                  dnd.dragIndex === index
                    ? "opacity-50 animate-dnd-highlight"
                    : ""
                }`}
                {...dnd.getDragProps(index)}
              >
                <span className="absolute left-0 top-6 h-px w-4 bg-(--app-border-muted)" />
                {child.type === "rule" ? (
                  <Rule
                    depth={depth}
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
      </div>
    </section>
  )
})

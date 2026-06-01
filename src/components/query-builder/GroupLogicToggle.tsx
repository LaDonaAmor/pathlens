"use client"

import type { LogicOperator } from "@/types/query"

export function GroupLogicToggle({
  value,
  onChange,
}: {
  value: LogicOperator
  onChange: (value: LogicOperator) => void
}) {
  return (
    <div className="inline-grid grid-cols-2 rounded-md border border-(--app-border) bg-(--app-surface-muted) p-1">
      {(["AND", "OR"] as LogicOperator[]).map((logic) => (
        <button
          key={logic}
          type="button"
          onClick={() => onChange(logic)}
          className={
            value === logic
              ? logic === "AND"
                ? "rounded bg-(--logic-and-bg) cursor-pointer px-3 py-1 text-xs font-bold text-(--logic-and-text)"
                : "rounded bg-(--logic-or-bg) cursor-pointer px-3 py-1 text-xs font-bold text-(--logic-or-text)"
              : "rounded px-3 py-1 text-xs cursor-pointer font-bold text-(--app-text-muted) hover:bg-(--app-surface)"
          }
        >
          {logic}
        </button>
      ))}
    </div>
  )
}

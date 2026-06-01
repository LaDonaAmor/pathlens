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
    <div className="inline-grid grid-cols-2 rounded-md border border-slate-300 bg-slate-100 p-1">
      {(["AND", "OR"] as LogicOperator[]).map((logic) => (
        <button
          key={logic}
          type="button"
          onClick={() => onChange(logic)}
          className={
            value === logic
              ? "rounded bg-slate-950 px-3 py-1 text-xs font-bold text-white"
              : "rounded px-3 py-1 text-xs font-bold text-slate-600 hover:bg-white"
          }
        >
          {logic}
        </button>
      ))}
    </div>
  )
}

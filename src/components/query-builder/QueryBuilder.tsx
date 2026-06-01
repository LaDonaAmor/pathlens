"use client"

import { QueryPreview } from "@/components/preview/QueryPreview"
import { ResultsPanel } from "@/components/results/ResultsPanel"
import { RuleGroup } from "@/components/query-builder/RuleGroup"
import { useQueryBuilder } from "@/hooks/useQueryBuilder"
import { Button } from "../ui/button"

export function QueryBuilder() {
  const builder = useQueryBuilder()

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">PathLens</h1>
            <p className="text-sm text-slate-600">
              Build nested database filters visually with recursive condition
              groups.
            </p>
          </div>

          <Button
            type="button"
            onClick={builder.reset}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium hover:bg-slate-100"
          >
            Reset
          </Button>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Query Rules</h2>
            <p className="text-sm text-slate-600">
              Add rules, nest groups, collapse sections, and drag items to
              reorder them.
            </p>
          </div>

          <RuleGroup
            group={builder.tree}
            fields={builder.schema.fields}
            isRoot
            onAddRule={builder.addRule}
            onAddGroup={builder.addGroup}
            onRemove={builder.removeNode}
            onToggle={builder.toggleGroup}
            onLogicChange={builder.setGroupLogic}
            onFieldChange={builder.setRuleField}
            onOperatorChange={builder.setRuleOperator}
            onValueChange={(ruleId, value) =>
              builder.updateRule(ruleId, { value })
            }
            onReorder={builder.reorderChild}
          />
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <QueryPreview
              sqlQuery={builder.sqlQuery}
              mongoQuery={builder.mongoQuery}
              jsonQuery={builder.jsonQuery}
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <ResultsPanel data={builder.dataset} tree={builder.tree} />
          </div>
        </div>
      </div>
    </main>
  )
}

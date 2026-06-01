"use client"

import { useState } from "react"
import { QueryHistory } from "@/components/history/QueryHistory"
import { SavedPresets } from "@/components/history/SavedPresets"
import { QueryPreview } from "@/components/preview/QueryPreview"
import { ResultsPanel } from "@/components/results/ResultsPanel"
import { LoadingState } from "@/components/results/LoadingState"
import { Toolbar } from "@/components/toolbar/Toolbar"
import { RuleGroup } from "@/components/query-builder/RuleGroup"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useQueryBuilder } from "@/hooks/useQueryBuilder"
import { useHistoryStore } from "@/store/historyStore"
import { usePresetsStore } from "@/store/presetsStore"

export function QueryBuilder() {
  const [running, setRunning] = useState(false)
  const builder = useQueryBuilder()

  const addHistory = useHistoryStore((state) => state.addHistory)
  const savePreset = usePresetsStore((state) => state.savePreset)

  function runQuery() {
    setRunning(true)
    window.setTimeout(() => setRunning(false), 350)
  }

  function saveCurrentQuery() {
    savePreset(builder.tree, builder.schemaId)
  }

  useKeyboardShortcuts({
    onRun: () => {
      addHistory(builder.tree, builder.schemaId)
      runQuery()
    },
    onReset: builder.reset,
    onSave: saveCurrentQuery,
  })

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

          <Toolbar
            tree={builder.tree}
            schemaId={builder.schemaId}
            onRun={runQuery}
            onReset={builder.reset}
            onImport={builder.setTree}
          />
        </header>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-5 rounded-lg border border-slate-200 bg-white p-4">
            <QueryHistory />
            <SavedPresets />
          </aside>

          <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
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
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <QueryPreview
                  sqlQuery={builder.sqlQuery}
                  mongoQuery={builder.mongoQuery}
                  jsonQuery={builder.jsonQuery}
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                {running ? (
                  <LoadingState />
                ) : (
                  <ResultsPanel data={builder.dataset} tree={builder.tree} />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

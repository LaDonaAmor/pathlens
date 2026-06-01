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

  const isValid = builder.validationIssues.length === 0

  function runQuery() {
    if (!isValid) return

    setRunning(true)
    window.setTimeout(() => setRunning(false), 350)
  }

  function saveCurrentQuery() {
    savePreset(builder.sanitizedTree, builder.schemaId)
  }

  useKeyboardShortcuts({
    onRun: () => {
      if (!isValid) return
      addHistory(builder.sanitizedTree, builder.schemaId)
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
            tree={builder.sanitizedTree}
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
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">Query Rules</h2>
                  <p className="text-sm text-slate-600">
                    Add rules, nest groups, collapse sections, and drag items to
                    reorder them.
                  </p>
                </div>

                <span
                  className={
                    isValid
                      ? "text-sm font-medium text-emerald-700"
                      : "text-sm font-medium text-red-600"
                  }
                >
                  {isValid
                    ? "Valid query"
                    : `${builder.validationIssues.length} issue(s)`}
                </span>
              </div>

              <RuleGroup
                group={builder.tree}
                fields={builder.schema.fields}
                issues={builder.validationIssues}
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
                  <ResultsPanel
                    data={builder.dataset}
                    tree={builder.sanitizedTree}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { QueryHistory } from "@/components/history/QueryHistory"
import { SavedPresets } from "@/components/history/SavedPresets"
import { QueryPreview } from "@/components/preview/QueryPreview"
import { ResultsPanel } from "@/components/results/ResultsPanel"
import { LoadingState } from "@/components/results/LoadingState"
import { SchemaPreview } from "@/components/schema/SchemaPreview"
import { SchemaSelector } from "@/components/schema/SchemaSelector"
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
    <main className="min-h-screen bg-(--app-bg) text-(--app-text)">
      <header className="grid border-b-2 border-(--app-border) bg-(--app-surface) px-4 py-3 lg:grid-cols-[320px_1fr_480px]">
        <div className="font-(--font-serif) text-5xl italic">
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="PathLens logo"
              width={40}
              height={40}
            />
            PathLens
          </div>
          <p className="mt-1 max-w-2xl text-sm text-(--app-text-muted)">
            Build nested database filters visually with recursive condition
            groups.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Toolbar
            tree={builder.sanitizedTree}
            schemaId={builder.schemaId}
            onRun={runQuery}
            onReset={builder.reset}
            onImport={builder.setTree}
          />
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-76px)] lg:grid-cols-[320px_minmax(0,1fr)_480px]">
        <aside className="border-r-2 border-(--app-border) bg-(--app-surface-muted)">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-(--app-text)">
              Data Source
            </h2>
            <SchemaSelector
              value={builder.schemaId}
              onChange={builder.setSchema}
            />
          </div>
          <SchemaPreview schema={builder.schema} />
          <QueryHistory />
          <SavedPresets />
        </aside>

        <section className="min-w-0 border-r-2 border-(--app-border)">
          <div className="border-b-2 border-(--app-border) p-8">
            <h1>Active Composition</h1>
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

          <div className="p-6">
            <h2>Filtered Ledger</h2>
            {running ? (
              <LoadingState />
            ) : (
              <ResultsPanel
                data={builder.dataset}
                tree={builder.sanitizedTree}
              />
            )}
          </div>
        </section>

        <aside className="bg-(--app-surface-muted) p-6">
          <h2>The PathLens Ledger</h2>
          <QueryPreview
            sqlQuery={builder.sqlQuery}
            mongoQuery={builder.mongoQuery}
            jsonQuery={builder.jsonQuery}
          />
        </aside>
      </div>
    </main>
  )
}

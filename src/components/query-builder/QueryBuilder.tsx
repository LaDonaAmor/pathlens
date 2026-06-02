"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import Image from "next/image"
import { Folder, Bookmark, History, Plus, X } from "lucide-react"
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
import { useUiStore, type NavItem } from "@/store/uiStore"

export function QueryBuilder() {
  const [running, setRunning] = useState(false)
  const builder = useQueryBuilder()
  const activeNavItem = useUiStore((state) => state.activeNavItem)
  const setActiveNavItem = useUiStore((state) => state.setActiveNavItem)
  const schemaOverlayOpen = useUiStore((state) => state.schemaOverlayOpen)
  const setSchemaOverlayOpen = useUiStore((state) => state.setSchemaOverlayOpen)

  const addHistory = useHistoryStore((state) => state.addHistory)
  const savePreset = usePresetsStore((state) => state.savePreset)

  const [executionStampKey, setExecutionStampKey] = useState(0)

  const isValid = builder.validationIssues.length === 0

  function runQuery() {
    if (!isValid) return
    setExecutionStampKey((key) => key + 1)
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

  function handleNavClick(item: NavItem) {
    const nextItem = activeNavItem === item ? null : item
    setActiveNavItem(nextItem)

    if (item === "schema" && nextItem === "schema") {
      setSchemaOverlayOpen(true)
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-(--app-bg) text-(--app-text)">
      {/* HEADER */}
      <header className="h-19 shrink-0 sticky top-0 z-30 flex items-center justify-between border-b-2 border-(--app-border) bg-(--app-surface) px-6 py-14 shadow-[0_2px_0_var(--app-accent)]">
        <div>
          <h1 className="flex items-center gap-2 text-5xl font-bold italic tracking-tight">
            <Image
              src="/favicon.ico"
              alt="PathLens logo"
              width={50}
              height={50}
            />
            PathLens
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-(--app-text-muted)">
            Build complex queries through a clearer lens.
          </p>
        </div>

        <Toolbar
          tree={builder.sanitizedTree}
          schemaId={builder.schemaId}
          sqlQuery={builder.sqlQuery}
          mongoQuery={builder.mongoQuery}
          jsonQuery={builder.jsonQuery}
          onRun={runQuery}
          onReset={builder.reset}
          onImport={builder.setTree}
        />
      </header>

      {/* APP SHELL */}
      <div className="flex h-[calc(100vh-76px)] overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-70 shrink-0 h-full flex flex-col border-r-2 border-(--app-border) bg-(--app-surface-muted) px-4 py-10">
          <Button
            onClick={builder.reset}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-md border border-(--app-border-muted) bg-(--app-accent)/5 px-4 py-3 text-sm font-medium text-(--app-text) transition hover:bg-(--app-accent)/10"
          >
            <Plus size={18} />
            NEW QUERY
          </Button>

          <nav className="flex flex-col gap-3">
            <Button
              onClick={() => handleNavClick("schema")}
              className={
                activeNavItem === "schema"
                  ? "flex items-center gap-3 border-2 border-(--app-accent) bg-(--app-accent) px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-on-accent) hover:bg-(--app-accent)"
                  : "flex items-center gap-3 border-2 border-transparent px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-text-muted) hover:border-(--app-border-muted)"
              }
            >
              <Folder size={16} />
              SCHEMA EXPLORER
            </Button>

            <Button
              onClick={() => handleNavClick("presets")}
              className={
                activeNavItem === "presets"
                  ? "flex items-center gap-3 border-2 border-(--app-accent) bg-(--app-accent) px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-on-accent) hover:bg-(--app-accent)"
                  : "flex items-center gap-3 border-2 border-transparent px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-text-muted) hover:border-(--app-border-muted)"
              }
            >
              <Bookmark size={16} />
              PRESETS
            </Button>

            <Button
              onClick={() => handleNavClick("history")}
              className={
                activeNavItem === "history"
                  ? "flex items-center gap-3 border-2 border-(--app-accent) bg-(--app-accent) px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-on-accent) hover:bg-(--app-accent)"
                  : "flex items-center gap-3 border-2 border-transparent px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-text-muted) hover:border-(--app-border-muted)"
              }
            >
              <History size={16} />
              HISTORY
            </Button>
          </nav>

          <div className="mt-6 space-y-4 overflow-auto">
            {activeNavItem === "presets" && <SavedPresets />}
            {activeNavItem === "history" && <QueryHistory />}
          </div>
        </aside>

        {/* CENTER (ONLY SCROLL AREA) */}
        <section className="flex-1 min-w-0 flex flex-col overflow-y-auto border-r-2 border-(--app-border)">
          <div className="border-b-2 border-(--app-border) p-6">
            <h2 className="text-2xl font-bold mb-4">Active Composition</h2>

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

          <div className="flex-1 p-6">
            <h2 className="mb-4 text-2xl font-bold">Filtered Ledger</h2>

            {running ? (
              <LoadingState />
            ) : (
              <ResultsPanel
                data={builder.dataset}
                tree={builder.sanitizedTree}
                stampKey={executionStampKey}
              />
            )}
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="w-90 shrink-0 h-full flex flex-col overflow-y-auto bg-(--app-surface-muted) px-6 py-6 border-l-2 border-(--app-border)">
          <h2 className="mb-2 text-2xl font-bold">The PathLens Ledger</h2>

          <QueryPreview
            sqlQuery={builder.sqlQuery}
            mongoQuery={builder.mongoQuery}
            jsonQuery={builder.jsonQuery}
          />

          <div className="mt-6 border-t-2 border-(--app-border-muted) pt-5 font-(--font-mono)">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]">
              Keyboard Shortcuts
            </h3>

            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt>Run</dt>
                <dd>Ctrl + Enter</dd>
              </div>

              <div className="flex justify-between">
                <dt>Reset</dt>
                <dd>Ctrl + Backspace</dd>
              </div>

              <div className="flex justify-between">
                <dt>Save</dt>
                <dd>Ctrl + K</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {/* OVERLAY */}
      {schemaOverlayOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setSchemaOverlayOpen(false)}
          />

          <aside className="absolute left-70 top-0 h-full w-95 flex flex-col bg-(--app-surface) p-6 border-r-2 border-(--app-border)">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Schema Explorer</h3>
              <Button onClick={() => setSchemaOverlayOpen(false)}>
                <X size={20} />
              </Button>
            </div>

            <SchemaSelector
              value={builder.schemaId}
              onChange={builder.setSchema}
            />

            <SchemaPreview schema={builder.schema} />
          </aside>
        </div>
      )}
    </main>
  )
}

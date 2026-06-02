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

  function handleNavClick(item: NavItem) {
    const nextItem = activeNavItem === item ? null : item

    setActiveNavItem(nextItem)

    if (item === "schema" && nextItem === "schema") {
      setSchemaOverlayOpen(true)
    }
  }

  return (
    <main className="min-h-screen bg-(--app-bg) text-(--app-text)">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b-2 border-(--app-border) bg-(--app-surface) px-6 py-4">
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
          onRun={runQuery}
          onReset={builder.reset}
          onImport={builder.setTree}
        />
      </header>

      {/* MAIN 3-COLUMN LAYOUT */}
      <div className="grid min-h-[calc(100vh-76px)] lg:grid-cols-[280px_1fr_420px]">
        {/* LEFT NAV */}
        <aside className="flex flex-col border-r-2 border-(--app-border) bg-(--app-surface-muted) px-4 py-10">
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
                  : "flex items-center gap-3 border-2 border-transparent px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-text-muted) transition hover:border-(--app-border-muted) hover:bg-(--app-surface-raised)"
              }
            >
              <Folder size={16} />
              SCHEMA EXPLORER
            </Button>
            <Button
              onClick={() => setActiveNavItem("presets")}
              className={
                activeNavItem === "presets"
                  ? "flex items-center gap-3 border-2 border-(--app-accent) bg-(--app-accent) px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-on-accent) hover:bg-(--app-accent)"
                  : "flex items-center gap-3 border-2 border-transparent px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-text-muted) transition hover:border-(--app-border-muted) hover:bg-(--app-surface-raised)"
              }
            >
              <Bookmark size={16} />
              PRESETS
            </Button>
            <Button
              onClick={() => setActiveNavItem("history")}
              className={
                activeNavItem === "history"
                  ? "flex items-center gap-3 border-2 border-(--app-accent) bg-(--app-accent) px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-on-accent) hover:bg-(--app-accent)"
                  : "flex items-center gap-3 border-2 border-transparent px-4 py-4 text-left font-(--font-mono) text-xs uppercase tracking-wider text-(--app-text-muted) transition hover:border-(--app-border-muted) hover:bg-(--app-surface-raised)"
              }
            >
              <History size={16} />
              HISTORY
            </Button>
          </nav>

          {/* Content sections below nav */}
          <div className="mt-6 space-y-4 overflow-auto">
            {activeNavItem === "presets" && <SavedPresets />}
            {activeNavItem === "history" && <QueryHistory />}
          </div>
        </aside>

        {/* CENTER CONTENT */}
        <section className="flex min-w-0 flex-col border-r-2 border-(--app-border)">
          <div className="border-b-2 border-(--app-border) p-6">
            <h2 className="mb-4 text-2xl font-bold">Active Composition</h2>
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
              />
            )}
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside className="flex flex-col bg-(--app-surface-muted) p-6">
          <h2 className="mb-4  text-2xl font-bold">The PathLens Ledger</h2>
          <div className="flex flex-1 flex-col">
            <QueryPreview
              sqlQuery={builder.sqlQuery}
              mongoQuery={builder.mongoQuery}
              jsonQuery={builder.jsonQuery}
            />
          </div>
        </aside>
      </div>

      {/* SCHEMA OVERLAY */}
      {schemaOverlayOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setSchemaOverlayOpen(false)}
          />
          <aside className="absolute left-70 top-0 flex h-full w-95 flex-col border-r-2 border-(--app-border) bg-(--app-surface) p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className=" text-xl font-bold">Schema Explorer</h3>
              <Button
                onClick={() => setSchemaOverlayOpen(false)}
                className="rounded-md p-2 text-(--app-text-muted) transition hover:bg-(--app-surface-muted)"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-(--app-text-muted)">
                Data Source
              </label>
              <SchemaSelector
                value={builder.schemaId}
                onChange={builder.setSchema}
              />
            </div>

            <SchemaPreview schema={builder.schema} />
          </aside>
        </div>
      )}
    </main>
  )
}

"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import Image from "next/image"
import { Folder, Bookmark, History, Plus, X } from "lucide-react"
import { useQueryStore } from "@/store/queryStore"
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
  const [executionStampKey, setExecutionStampKey] = useState(0)

  const builder = useQueryBuilder()

  const activeNavItem = useUiStore((state) => state.activeNavItem)
  const setActiveNavItem = useUiStore((state) => state.setActiveNavItem)
  const schemaOverlayOpen = useUiStore((state) => state.schemaOverlayOpen)
  const setSchemaOverlayOpen = useUiStore((state) => state.setSchemaOverlayOpen)

  const addHistory = useHistoryStore((state) => state.addHistory)
  const savePreset = usePresetsStore((state) => state.savePreset)

  const addRuleWithField = useQueryStore((state) => state.addRuleWithField)

  const isValid = builder.validationIssues.length === 0

  function runQuery() {
    if (!isValid) return
    setExecutionStampKey((k) => k + 1)
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
    if (item === "schema") {
      if (schemaOverlayOpen) {
        setActiveNavItem(null)
        setSchemaOverlayOpen(false)
      } else {
        setActiveNavItem(item)
        setSchemaOverlayOpen(true)
      }
    } else {
      setActiveNavItem(activeNavItem === item ? null : item)
    }
  }

  function closeSchemaOverlay() {
    setActiveNavItem(null)
    setSchemaOverlayOpen(false)
  }

  return (
    <main className="h-screen overflow-hidden max-xl:overflow-auto max-xl:min-h-screen bg-(--app-bg) text-(--app-text)">
      {/* HEADER */}
      <header className="h-19 max-xl:h-auto shrink-0 sticky top-0 z-30 flex items-center justify-between max-xl:flex-col max-xl:gap-3 border-b-2 border-(--app-border) bg-(--app-surface) px-6 max-xl:px-4 py-14 max-xl:py-4 shadow-[0_2px_0_var(--app-accent)]">
        <div>
          <h1 className="flex items-center gap-2 text-5xl max-xl:text-2xl font-bold italic tracking-tight">
            <Image
              src="/favicon.ico"
              alt="PathLens logo"
              width={50}
              height={50}
            />
            PathLens
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-(--app-text-muted) max-xl:hidden">
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
      <div className="flex h-[calc(100vh-76px)] overflow-hidden max-xl:flex-col max-xl:h-auto">
        {/* LEFT */}
        <aside className="w-70 shrink-0 h-full flex flex-col border-r-2 border-(--app-border) bg-(--app-surface-muted) px-4 py-10">
          <Button
            onClick={builder.reset}
            className="mb-6 flex w-full items-center gap-2"
          >
            <Plus size={18} />
            NEW QUERY
          </Button>

          <nav className="flex flex-col gap-3">
            <Button
              onClick={() => handleNavClick("schema")}
              className={`flex items-center gap-3 border-2 px-4 py-4 text-xs uppercase tracking-wider ${
                activeNavItem === "schema"
                  ? "border-(--app-accent) bg-(--app-accent) text-(--app-on-accent)"
                  : "border-transparent text-(--app-text-muted)"
              }`}
            >
              <Folder size={16} />
              SCHEMA EXPLORER
            </Button>

            <Button
              onClick={() => handleNavClick("presets")}
              className={`flex items-center gap-3 border-2 px-4 py-4 text-xs uppercase tracking-wider ${
                activeNavItem === "presets"
                  ? "border-(--app-accent) bg-(--app-accent) text-(--app-on-accent)"
                  : "border-transparent text-(--app-text-muted)"
              }`}
            >
              <Bookmark size={16} />
              PRESETS
            </Button>

            <Button
              onClick={() => handleNavClick("history")}
              className={`flex items-center gap-3 border-2 px-4 py-4 text-xs uppercase tracking-wider ${
                activeNavItem === "history"
                  ? "border-(--app-accent) bg-(--app-accent) text-(--app-on-accent)"
                  : "border-transparent text-(--app-text-muted)"
              }`}
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

        {/* CENTER */}
        <section className="flex-1 flex flex-col overflow-y-auto border-r-2 border-(--app-border)">
          <div className="border-b-2 p-6">
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

        {/* RIGHT */}
        <aside className="w-90 flex flex-col overflow-y-auto bg-(--app-surface-muted) px-6 py-6 border-l-2">
          <h2 className="mb-2 text-2xl font-bold">The PathLens Ledger</h2>

          <QueryPreview
            sqlQuery={builder.sqlQuery}
            mongoQuery={builder.mongoQuery}
            jsonQuery={builder.jsonQuery}
          />
        </aside>
      </div>

      {/* OVERLAY */}
      {schemaOverlayOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={closeSchemaOverlay}
          />

          <aside className="absolute left-70 top-0 h-full w-95 bg-(--app-surface) p-6">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Schema Explorer</h3>
              <Button onClick={closeSchemaOverlay}>
                <X size={20} />
              </Button>
            </div>

            <SchemaSelector
              value={builder.schemaId}
              onChange={builder.setSchema}
            />

            <SchemaPreview
              schema={builder.schema}
              onAddRule={(fieldKey) => {
                addRuleWithField(builder.tree.id, fieldKey)
                setSchemaOverlayOpen(false)
              }}
            />
          </aside>
        </div>
      )}
    </main>
  )
}

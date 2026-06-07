"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  const builder = useQueryBuilder()
  const activeNavItem = useUiStore((state) => state.activeNavItem)
  const setActiveNavItem = useUiStore((state) => state.setActiveNavItem)
  const schemaOverlayOpen = useUiStore((state) => state.schemaOverlayOpen)
  const setSchemaOverlayOpen = useUiStore((state) => state.setSchemaOverlayOpen)

  const addHistory = useHistoryStore((state) => state.addHistory)
  const savePreset = usePresetsStore((state) => state.savePreset)

  const [executionStampKey, setExecutionStampKey] = useState(0)

  const addRuleWithField = useQueryStore((state) => state.addRuleWithField)

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
    <main className="h-screen lg:flex lg:flex-col overflow-hidden max-lg:overflow-auto max-lg:min-h-screen bg-(--app-bg) text-(--app-text)">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b-2 border-(--app-border) bg-(--app-surface) px-6 py-6 shadow-[0_2px_0_var(--app-accent)]">
        <div>
          <h1 className="flex items-center gap-2 text-5xl max-lg:text-2xl font-bold italic tracking-tight">
            <Image
              src="/favicon.ico"
              alt="PathLens logo"
              width={50}
              height={50}
              className="max-lg:w-8 max-lg:h-8"
            />
            PathLens
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-(--app-text-muted) max-lg:hidden">
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

      {/* APP SHELL */}
      <div className="flex lg:flex-1 min-h-0 overflow-hidden max-lg:flex-col max-lg:h-auto">
        {/* LEFT SIDEBAR */}
        <aside
          aria-label="Navigation sidebar"
          className="w-70 shrink-0 h-full flex flex-col overflow-y-auto min-h-0 border-r-2 max-lg:border-r-0 border-(--app-border) bg-(--app-surface-muted) px-4 max-lg:px-3 py-10 max-lg:py-4 max-lg:w-full max-lg:max-h-[50vh] max-lg:h-auto max-lg:border-b-2"
        >
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
          <AnimatePresence mode="wait">
            {activeNavItem === "presets" && (
              <motion.div
                key="presets"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <SavedPresets />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeNavItem === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <QueryHistory />
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* CENTER (ONLY SCROLL AREA) */}
        <section className="flex-1 min-w-0 flex flex-col overflow-y-auto border-r-2 border-(--app-border)">
          <div className="border-b-2 border-(--app-border) p-6 max-lg:p-3">
            <h2 className="text-2xl max-lg:text-xl font-bold mb-4">
              Active Composition
            </h2>

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

          <div className="flex-1 p-6 max-lg:p-3">
            <h2 className="mb-4 text-2xl max-lg:text-xl font-bold">
              Filtered Ledger
            </h2>

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
        <aside
          aria-label="Query preview sidebar"
          className="w-90 shrink-0 h-full flex flex-col overflow-y-auto bg-(--app-surface-muted) px-6 max-lg:px-4 py-6 max-lg:py-4 border-l-2 max-lg:border-l-0 border-(--app-border) max-lg:w-full max-lg:h-auto max-lg:border-t-2"
        >
          <h2 className="mb-2 text-2xl max-lg:text-xl font-bold">
            The PathLens Ledger
          </h2>

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

      <AnimatePresence>
        {schemaOverlayOpen && (
          <motion.div
            key="schema-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
          >
            <div
              className="absolute inset-0 bg-black/20"
              onClick={closeSchemaOverlay}
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "tween",
                ease: [0.32, 0, 0.67, 0],
                duration: 0.22,
              }}
              aria-label="Schema explorer overlay"
              className="absolute left-70 max-md:left-0 top-0 z-40 flex h-full w-95 max-md:w-full flex-col overflow-y-auto border-r-2 max-md:border-r-0 border-(--app-border) bg-(--app-surface) p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold">Schema Explorer</h3>
                <Button
                  onClick={closeSchemaOverlay}
                  className="rounded-md p-2 text-(--app-text-muted) transition hover:bg-(--app-surface-muted)"
                >
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
                  closeSchemaOverlay()
                }}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

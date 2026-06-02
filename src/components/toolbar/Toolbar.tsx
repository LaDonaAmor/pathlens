"use client"

import { Play, RotateCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHistoryStore } from "@/store/historyStore"
import { usePresetsStore } from "@/store/presetsStore"
import type { QueryTree } from "@/types/query"
import { ExportButton } from "./ExportButton"
import { ImportButton } from "./ImportButton"
import { ThemeToggle } from "./ThemeToggle"

export const toolbarBtn =
  "inline-flex h-10 cursor-pointer items-center justify-center gap-2 border-2 border-(--app-border) bg-(--app-surface) px-4 font-(--font-mono) text-xs uppercase tracking-widest text-(--app-text) transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-(--app-accent) hover:text-(--app-on-accent) active:translate-x-0 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"

export function Toolbar({
  tree,
  schemaId,
  onRun,
  onReset,
  onImport,
}: {
  tree: QueryTree
  schemaId: string
  onRun: () => void
  onReset: () => void
  onImport: (tree: QueryTree) => void
}) {
  const addHistory = useHistoryStore((state) => state.addHistory)
  const savePreset = usePresetsStore((state) => state.savePreset)

  function handleRun() {
    addHistory(tree, schemaId)
    onRun()
  }

  function handleSave() {
    savePreset(tree, schemaId)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={handleRun} className={toolbarBtn}>
        <Play size={16} />
        Run
      </Button>

      <Button onClick={handleSave} className={toolbarBtn}>
        <Save size={16} />
        Save
      </Button>

      <ExportButton tree={tree} />
      <ImportButton onImport={onImport} />

      <Button onClick={onReset} className={toolbarBtn}>
        <RotateCcw size={16} />
        Clear
      </Button>

      <ThemeToggle />
    </div>
  )
}

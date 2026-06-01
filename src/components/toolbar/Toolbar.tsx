"use client"

import { Play, RotateCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHistoryStore } from "@/store/historyStore"
import { usePresetsStore } from "@/store/presetsStore"
import type { QueryTree } from "@/types/query"
import { ExportButton } from "./ExportButton"
import { ImportButton } from "./ImportButton"
import { ThemeToggle } from "./ThemeToggle"

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
      <Button
        onClick={handleRun}
        className="border-(--app-accent) bg-(--app-accent) text-white hover:bg-(--app-accent-hover)"
      >
        <Play size={16} />
        Run
      </Button>

      <Button onClick={handleSave}>
        <Save size={16} />
        Save
      </Button>

      <ExportButton tree={tree} />
      <ImportButton onImport={onImport} />

      <Button onClick={onReset}>
        <RotateCcw size={16} />
        Clear
      </Button>

      <ThemeToggle />
    </div>
  )
}

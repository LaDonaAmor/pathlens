"use client"

import { Play, RotateCcw, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHistoryStore } from "@/store/historyStore"
import { usePresetsStore } from "@/store/presetsStore"
import type { QueryTree } from "@/types/query"
import { ExportButton } from "./ExportButton"
import { ImportButton } from "./ImportButton"
import { ThemeToggle } from "./ThemeToggle"
import { getQueryName } from "@/lib/queryName"
import { toast } from "sonner"

export const toolbarBtn =
  "inline-flex h-10 max-lg:h-8 cursor-pointer items-center justify-center gap-2 max-lg:gap-1 border-2 border-(--app-border) bg-(--app-surface) px-4 max-lg:px-2 font-(--font-mono) text-xs uppercase tracking-widest text-(--app-text) transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-(--app-accent) hover:text-(--app-on-accent) active:translate-x-0 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"

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

  const queryName = getQueryName(tree)

  function handleRun() {
    addHistory(tree, schemaId)
    onRun()
    toast.success("Query executed", {
      description: "The query has been run against the dataset.",
    })
  }

  function handleSave() {
    savePreset(tree, schemaId)
    toast.success("Query saved", {
      description: "Added to presets.",
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="min-w-48 border border-(--app-border-muted) px-3 py-2 font-(--font-mono) text-[10px] uppercase tracking-[0.12em] text-(--app-text-muted) max-lg:hidden">
        Will save as:
        <span className="ml-1 text-(--app-text)">{queryName}</span>
      </div>
      <Button onClick={handleRun} className={toolbarBtn}>
        <Play size={16} />
        <span className="max-lg:sr-only">Run</span>
      </Button>
      <Button onClick={handleSave} className={toolbarBtn}>
        <Save size={16} />
        <span className="max-lg:sr-only">Save</span>
      </Button>
      <ExportButton tree={tree} />
      <ImportButton onImport={onImport} />
      <Button onClick={onReset} className={toolbarBtn}>
        <RotateCcw size={16} />
        <span className="max-lg:sr-only">Clear</span>
      </Button>
      <ThemeToggle />
    </div>
  )
}

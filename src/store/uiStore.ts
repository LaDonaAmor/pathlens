"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThemeMode = "light" | "dark"
export type PreviewMode =
  | "sql"
  | "mongo"
  | "json"
  | "graphql"
  | "cypher"
  | "promql"
  | "kql"
  | "spl"
export type NavItem = "schema" | "presets" | "history"
export type CenterTab = "builder" | "ledger"

type UiState = {
  theme: ThemeMode
  previewMode: PreviewMode
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  activeNavItem: NavItem | null
  schemaOverlayOpen: boolean
  centerTab: CenterTab
  setCenterTab: (tab: CenterTab) => void
  setPreviewMode: (mode: PreviewMode) => void
  toggleTheme: () => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  setActiveNavItem: (item: NavItem | null) => void
  setSchemaOverlayOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "light",
      previewMode: "sql",
      leftPanelOpen: true,
      rightPanelOpen: true,
      activeNavItem: null,
      schemaOverlayOpen: false,

      centerTab: "builder" as CenterTab,

      setCenterTab: (centerTab) => set({ centerTab }),

      setPreviewMode: (previewMode) => set({ previewMode }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      toggleLeftPanel: () =>
        set((state) => ({
          leftPanelOpen: !state.leftPanelOpen,
        })),

      toggleRightPanel: () =>
        set((state) => ({
          rightPanelOpen: !state.rightPanelOpen,
        })),

      setActiveNavItem: (activeNavItem) => set({ activeNavItem }),

      setSchemaOverlayOpen: (schemaOverlayOpen) => set({ schemaOverlayOpen }),
    }),
    {
      name: "pathlens-ui",
    }
  )
)

"use client"

import { create } from "zustand"

export type ThemeMode = "light" | "dark"
export type PreviewMode = "sql" | "mongo" | "json"
export type NavItem = "schema" | "presets" | "history"

type UiState = {
  theme: ThemeMode
  previewMode: PreviewMode
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  activeNavItem: NavItem | null
  schemaOverlayOpen: boolean
  setPreviewMode: (mode: PreviewMode) => void
  toggleTheme: () => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  setActiveNavItem: (item: NavItem | null) => void
  setSchemaOverlayOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  theme: "light",
  previewMode: "sql",
  leftPanelOpen: true,
  rightPanelOpen: true,
  activeNavItem: null,
  schemaOverlayOpen: false,

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
}))

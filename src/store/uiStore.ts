"use client"

import { create } from "zustand"

export type ThemeMode = "light" | "dark"

export type PreviewMode = "sql" | "mongo" | "json"

type UiState = {
  theme: ThemeMode
  previewMode: PreviewMode
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  setPreviewMode: (mode: PreviewMode) => void
  toggleTheme: () => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
}

export const useUiStore = create<UiState>((set) => ({
  theme: "light",
  previewMode: "sql",
  leftPanelOpen: true,
  rightPanelOpen: true,

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
}))

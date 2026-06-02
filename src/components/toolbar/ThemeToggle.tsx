"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUiStore } from "@/store/uiStore"
import { toolbarBtn } from "./Toolbar"

export function ThemeToggle() {
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)
  const Icon = theme === "dark" ? Sun : Moon

  return (
    <Button onClick={toggleTheme} className={toolbarBtn}>
      <Icon size={16} />
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  )
}

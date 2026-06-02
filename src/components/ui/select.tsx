import type { SelectHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-md border border-(--app-border) bg-(--app-surface) px-3 text-sm text-(--app-text) outline-none transition focus:border-(--app-accent)",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

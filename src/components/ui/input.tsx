import type { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-8 w-full rounded-md border border-(--app-border) bg-(--app-surface-muted) p-3 text-xs text-(--app-text) outline-none transition placeholder:text-(--app-text-muted) focus:border-(--app-accent)",
        className
      )}
      {...props}
    />
  )
}

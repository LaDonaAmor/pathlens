import type { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border-2 border-(--app-border) bg-(--app-surface-muted) p-4 text-sm text-(--app-text) outline-none transition placeholder:text-(--app-text-muted) focus:border-(--app-accent)",
        className
      )}
      {...props}
    />
  )
}

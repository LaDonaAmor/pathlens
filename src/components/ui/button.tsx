"use client"

import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Button({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-9 items-center cursor-pointer justify-center gap-2 rounded-md border font-medium  shadow-sm transition hover:bg-(--app-surface-muted) active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 border-(--app-border) bg-(--app-surface) px-3 text-sm text-(--app-text) outline-none placeholder:text-(--app-text-muted) focus:border-(--app-accent)",
        className
      )}
      {...props}
    />
  )
}

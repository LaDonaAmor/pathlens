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
        "h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

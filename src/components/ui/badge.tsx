import { cn } from "@/lib/utils"

const variants = {
  default:
    "border-(--app-border) bg-(--app-surface-muted) text-(--app-text-muted)",
  invalid:
    "border-transparent bg-[color-mix(in_srgb,var(--error)_10%,white)] text-[var(--error)]",
}

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode
  className?: string
  variant?: keyof typeof variants
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

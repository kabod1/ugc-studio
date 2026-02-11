import { cn } from "@/lib/utils"

interface StatusConfig {
  label: string
  color: string
}

interface StatusBadgeProps {
  status: string
  statusMap: Record<string, StatusConfig>
}

export function StatusBadge({ status, statusMap }: StatusBadgeProps) {
  const config = statusMap[status]

  if (!config) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        {status}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.color
      )}
    >
      {config.label}
    </span>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, Clock, AlertTriangle, Circle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ObligationStatus } from "@/lib/data"

const STATUS_CONFIG: Record<
  ObligationStatus,
  { icon: React.ElementType; className: string }
> = {
  Completed: {
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  },
  "In Progress": {
    icon: Clock,
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  },
  "At Risk": {
    icon: AlertTriangle,
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  },
  "Not Started": {
    icon: Circle,
    className: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-50",
  },
}

interface StatusBadgeProps {
  status: ObligationStatus
  atRiskReason?: string
  className?: string
}

export function StatusBadge({ status, atRiskReason, className }: StatusBadgeProps) {
  const { icon: Icon, className: badgeClass } = STATUS_CONFIG[status]

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium py-0.5 px-2 cursor-default select-none",
        badgeClass,
        className
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      <span>{status}</span>
      {status === "At Risk" && (
        <Info className="size-3 shrink-0 ml-0.5 opacity-70" aria-hidden />
      )}
    </Badge>
  )

  if (status === "At Risk" && atRiskReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent side="top" className="max-w-56">
            <p className="font-semibold text-xs mb-0.5">Why At Risk?</p>
            <p className="text-xs font-normal leading-relaxed">{atRiskReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badge
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  FolderOpen,
  BookOpen,
  BarChart2,
  Settings,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/obligations", label: "Obligations", icon: ClipboardList },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
  { href: "/reports", label: "Reports", icon: BarChart2, placeholder: true },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-60 shrink-0 flex flex-col h-full border-r border-border bg-sidebar"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border shrink-0">
        <div className="flex items-center justify-center size-7 rounded bg-primary">
          <ShieldCheck className="size-4 text-primary-foreground" aria-hidden />
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold text-foreground tracking-tight">Compliance Desk</p>
          <p className="text-[10px] text-muted-foreground font-normal">Luxembourg Edition</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto" aria-label="Side navigation">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon, placeholder }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={placeholder ? "#" : href}
                  aria-current={isActive ? "page" : undefined}
                  aria-disabled={placeholder}
                  tabIndex={placeholder ? -1 : 0}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    placeholder && "opacity-40 pointer-events-none"
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {label}
                  {placeholder && (
                    <span className="ml-auto text-[10px] font-normal bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Company label */}
      <div className="px-4 py-4 border-t border-border shrink-0">
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide mb-1">Company</p>
        <p className="text-xs font-semibold text-foreground truncate">ABC Consulting SARL</p>
      </div>
    </aside>
  )
}

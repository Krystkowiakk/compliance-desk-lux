"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Bell, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OBLIGATIONS, KB_ARTICLES, ALL_DOCUMENTS } from "@/lib/data"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SearchResult {
  type: "Obligation" | "Document" | "Article"
  label: string
  href: string
}

function getSearchResults(query: string): SearchResult[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const results: SearchResult[] = []
  OBLIGATIONS.filter((o) => o.name.toLowerCase().includes(q)).forEach((o) =>
    results.push({ type: "Obligation", label: o.name, href: `/obligations/${o.id}` })
  )
  ALL_DOCUMENTS.filter((d) => d.name.toLowerCase().includes(q)).forEach((d) =>
    results.push({ type: "Document", label: d.name, href: "/documents" })
  )
  KB_ARTICLES.filter((a) => a.title.toLowerCase().includes(q)).forEach((a) =>
    results.push({ type: "Article", label: a.title, href: `/knowledge` })
  )
  return results.slice(0, 8)
}

export function AppHeader() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const results = getSearchResults(query)

  useEffect(() => {
    if (query.trim()) setOpen(true)
    else setOpen(false)
  }, [query])

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <label htmlFor="global-search" className="sr-only">Search obligations, documents, articles</label>
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" aria-hidden />
        <input
          id="global-search"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => query && setOpen(true)}
          placeholder="Search obligations, documents, articles…"
          className="w-full h-8 pl-8 pr-3 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
        {open && results.length > 0 && (
          <div
            role="listbox"
            aria-label="Search results"
            className="absolute top-full mt-1 left-0 w-80 bg-popover border border-border rounded shadow-lg z-50 overflow-hidden"
          >
            {(["Obligation", "Document", "Article"] as const).map((type) => {
              const group = results.filter((r) => r.type === type)
              if (!group.length) return null
              return (
                <div key={type}>
                  <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border bg-muted">
                    {type}s
                  </p>
                  {group.map((r) => (
                    <Link
                      key={r.href + r.label}
                      href={r.href}
                      role="option"
                      onClick={() => { setQuery(""); setOpen(false) }}
                      className="block px-3 py-2 text-sm text-foreground hover:bg-accent focus:bg-accent focus:outline-none"
                    >
                      {r.label}
                    </Link>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative size-8" aria-label="Notifications (2 unread)">
          <Bell className="size-4" aria-hidden />
          <Badge className="absolute -top-0.5 -right-0.5 size-4 text-[9px] p-0 flex items-center justify-center bg-primary text-primary-foreground rounded-full border-2 border-card">
            2
          </Badge>
        </Button>

        {/* Company switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8 px-3 font-medium">
              <span className="hidden sm:inline text-muted-foreground">ABC Consulting SARL</span>
              <ChevronDown className="size-3 text-muted-foreground" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Active company</DropdownMenuLabel>
            <DropdownMenuItem className="font-medium text-sm">ABC Consulting SARL</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              + Add company (demo)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold"
              aria-label="User menu"
            >
              MK
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold">Marie K.</p>
              <p className="text-xs text-muted-foreground font-normal">CFO</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground text-xs" disabled>
              Sign out (demo)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

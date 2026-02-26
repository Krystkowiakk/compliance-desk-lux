"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import {
  BookOpen,
  ChevronRight,
  X,
  FileText,
  Link2,
  Search,
  Tag,
  BadgeCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { KB_ARTICLES, OBLIGATIONS, type KBArticle, type KBCategory } from "@/lib/data"
import Link from "next/link"
import { cn } from "@/lib/utils"

const CATEGORIES: { label: string; value: KBCategory | "All" }[] = [
  { label: "All topics", value: "All" },
  { label: "Corporate", value: "Corporate" },
  { label: "Tax", value: "Tax" },
  { label: "VAT", value: "VAT" },
  { label: "UBO", value: "UBO" },
  { label: "Accounting", value: "Accounting" },
]

const CATEGORY_COLORS: Record<KBCategory, string> = {
  Corporate: "bg-blue-50 text-blue-700 border-blue-200",
  Tax: "bg-amber-50 text-amber-700 border-amber-200",
  VAT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UBO: "bg-violet-50 text-violet-700 border-violet-200",
  Accounting: "bg-slate-50 text-slate-700 border-slate-200",
}

function formatDate(date: string) {
  return format(parseISO(date), "d MMM yyyy")
}

export default function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState<KBCategory | "All">("All")
  const [search, setSearch] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null)

  const filtered = KB_ARTICLES.filter((a) => {
    if (activeCategory !== "All" && a.category !== activeCategory) return false
    if (
      search &&
      !a.title.toLowerCase().includes(search.toLowerCase()) &&
      !a.summary.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  const categoryCounts = CATEGORIES.map((c) => ({
    ...c,
    count:
      c.value === "All"
        ? KB_ARTICLES.length
        : KB_ARTICLES.filter((a) => a.category === c.value).length,
  }))

  return (
    <div className="px-8 py-7 max-w-screen-xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Guidance notes, checklists, and templates for Luxembourg compliance obligations
        </p>
      </div>

      <div className="flex gap-6">
        {/* Category sidebar */}
        <nav className="w-44 shrink-0" aria-label="Article categories">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-2">
            Topics
          </p>
          <ul className="space-y-0.5">
            {categoryCounts.map(({ label, value, count }) => (
              <li key={value}>
                <button
                  onClick={() => {
                    setActiveCategory(value)
                    setSelectedArticle(null)
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-3 py-2 rounded text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    activeCategory === value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  aria-current={activeCategory === value ? "true" : undefined}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="size-3.5 shrink-0" aria-hidden />
                    {label}
                  </span>
                  <span className="text-[11px] bg-muted border border-border text-muted-foreground rounded px-1.5 py-0.5 tabular-nums">
                    {count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-xs">
              <label htmlFor="kb-search" className="sr-only">
                Search articles
              </label>
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none"
                aria-hidden
              />
              <input
                id="kb-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="h-8 pl-8 pr-3 w-full text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Article list + reader pane */}
          <div className="flex gap-4">
            {/* Article list */}
            <div
              className={cn(
                "flex flex-col gap-2",
                selectedArticle ? "w-72 shrink-0" : "w-full"
              )}
            >
              {filtered.length === 0 ? (
                <div className="border border-border rounded bg-card py-16 text-center">
                  <BookOpen className="size-8 text-muted-foreground mx-auto mb-2" aria-hidden />
                  <p className="text-sm text-muted-foreground">No articles found.</p>
                </div>
              ) : (
                filtered.map((article) => (
                  <button
                    key={article.id}
                    onClick={() =>
                      setSelectedArticle(
                        selectedArticle?.id === article.id ? null : article
                      )
                    }
                    className={cn(
                      "text-left border border-border rounded bg-card p-4 hover:bg-accent/40 transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                      selectedArticle?.id === article.id &&
                        "border-primary/40 bg-primary/5"
                    )}
                    aria-pressed={selectedArticle?.id === article.id}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p
                        className={cn(
                          "text-sm font-semibold text-foreground leading-snug",
                          selectedArticle && "text-xs"
                        )}
                      >
                        {article.title}
                      </p>
                      <ChevronRight
                        className={cn(
                          "size-3.5 text-muted-foreground shrink-0 mt-0.5 transition-transform",
                          selectedArticle?.id === article.id && "rotate-90"
                        )}
                        aria-hidden
                      />
                    </div>
                    <p
                      className={cn(
                        "text-muted-foreground leading-relaxed mb-2",
                        selectedArticle ? "text-[11px] line-clamp-2" : "text-xs line-clamp-2"
                      )}
                    >
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex text-[10px] font-medium border rounded px-1.5 py-0.5",
                          CATEGORY_COLORS[article.category]
                        )}
                      >
                        {article.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Reviewed {formatDate(article.lastReviewed)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Article reader pane */}
            {selectedArticle && (
              <article
                className="flex-1 min-w-0 border border-border rounded bg-card overflow-hidden"
                aria-label={`Article: ${selectedArticle.title}`}
              >
                {/* Pane header */}
                <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "inline-flex text-[10px] font-semibold border rounded px-1.5 py-0.5",
                          CATEGORY_COLORS[selectedArticle.category]
                        )}
                      >
                        {selectedArticle.category}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Last reviewed {formatDate(selectedArticle.lastReviewed)}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold text-foreground text-balance">
                      {selectedArticle.title}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <BadgeCheck className="size-3.5 text-primary shrink-0" aria-hidden />
                      <span className="text-xs font-medium text-primary">Reviewed by Stéphane Leloup</span>
                      <span className="text-muted-foreground text-xs">·</span>
                      <span className="text-[11px] text-muted-foreground">
                        For operational tracking purposes only. Does not constitute legal advice.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-muted-foreground hover:text-foreground mt-0.5 focus-visible:outline-2 focus-visible:outline-ring"
                    aria-label="Close article"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>

                <div className="px-6 py-5 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">
                  {/* Summary */}
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded">
                    <p className="text-sm text-foreground leading-relaxed">{selectedArticle.summary}</p>
                  </div>

                  {/* Content */}
                  <section>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Guidance
                    </h3>
                    <div className="space-y-3">
                      {selectedArticle.content.map((paragraph, i) => (
                        <p key={i} className="text-sm text-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>

                  {/* Templates */}
                  {selectedArticle.templates.length > 0 && (
                    <section>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Templates
                      </h3>
                      <div className="space-y-1.5">
                        {selectedArticle.templates.map((t) => (
                          <div
                            key={t}
                            className="flex items-center justify-between p-3 border border-border rounded bg-background"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="size-4 text-muted-foreground shrink-0" aria-hidden />
                              <span className="text-sm text-foreground">{t}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => {}}
                              disabled
                              aria-label={`Download ${t} (demo)`}
                            >
                              Download (demo)
                            </Button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Related obligations */}
                  {selectedArticle.relatedObligations.length > 0 && (
                    <section>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Related obligations
                      </h3>
                      <div className="space-y-1.5">
                        {selectedArticle.relatedObligations.map((oblId) => {
                          const obl = OBLIGATIONS.find((o) => o.id === oblId)
                          if (!obl) return null
                          return (
                            <Link
                              key={oblId}
                              href={`/obligations/${oblId}`}
                              className="flex items-center justify-between p-3 border border-border rounded bg-background hover:bg-accent/40 transition-colors focus-visible:outline-2 focus-visible:outline-ring"
                            >
                              <div className="flex items-center gap-2">
                                <Link2
                                  className="size-4 text-muted-foreground shrink-0"
                                  aria-hidden
                                />
                                <span className="text-sm text-foreground">{obl.name}</span>
                              </div>
                              <ChevronRight
                                className="size-3.5 text-muted-foreground shrink-0"
                                aria-hidden
                              />
                            </Link>
                          )
                        })}
                      </div>
                    </section>
                  )}
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
